import { DOCUMENT } from '@angular/common';
import { ApplicationRef, createComponent, EnvironmentInjector, EventEmitter, inject, Injectable, Injector, NgZone, TemplateRef, } from '@angular/core';
import { Subject } from 'rxjs';
import { ngbFocusTrap } from '../util/focus-trap';
import { ContentRef } from '../util/popup';
import { ScrollBar } from '../util/scrollbar';
import { isDefined, isString } from '../util/util';
import { NgbModalBackdrop } from './modal-backdrop';
import { NgbActiveModal, NgbModalRef } from './modal-ref';
import { NgbModalWindow } from './modal-window';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
export class NgbModalStack {
    constructor() {
        this._applicationRef = inject(ApplicationRef);
        this._injector = inject(Injector);
        this._environmentInjector = inject(EnvironmentInjector);
        this._document = inject(DOCUMENT);
        this._scrollBar = inject(ScrollBar);
        this._activeWindowCmptHasChanged = new Subject();
        this._ariaHiddenValues = new Map();
        this._scrollBarRestoreFn = null;
        this._modalRefs = [];
        this._windowCmpts = [];
        this._activeInstances = new EventEmitter();
        const ngZone = inject(NgZone);
        // Trap focus on active WindowCmpt
        this._activeWindowCmptHasChanged.subscribe(() => {
            if (this._windowCmpts.length) {
                const activeWindowCmpt = this._windowCmpts[this._windowCmpts.length - 1];
                ngbFocusTrap(ngZone, activeWindowCmpt.location.nativeElement, this._activeWindowCmptHasChanged);
                this._revertAriaHidden();
                this._setAriaHidden(activeWindowCmpt.location.nativeElement);
            }
        });
    }
    _restoreScrollBar() {
        const scrollBarRestoreFn = this._scrollBarRestoreFn;
        if (scrollBarRestoreFn) {
            this._scrollBarRestoreFn = null;
            scrollBarRestoreFn();
        }
    }
    _hideScrollBar() {
        if (!this._scrollBarRestoreFn) {
            this._scrollBarRestoreFn = this._scrollBar.hide();
        }
    }
    open(contentInjector, content, options) {
        const containerEl = options.container instanceof HTMLElement
            ? options.container
            : isDefined(options.container)
                ? this._document.querySelector(options.container)
                : this._document.body;
        if (!containerEl) {
            throw new Error(`The specified modal container "${options.container || 'body'}" was not found in the DOM.`);
        }
        this._hideScrollBar();
        const activeModal = new NgbActiveModal();
        contentInjector = options.injector || contentInjector;
        const environmentInjector = contentInjector.get(EnvironmentInjector, null) || this._environmentInjector;
        const contentRef = this._getContentRef(contentInjector, environmentInjector, content, activeModal, options);
        let backdropCmptRef = options.backdrop !== false ? this._attachBackdrop(containerEl) : undefined;
        let windowCmptRef = this._attachWindowComponent(containerEl, contentRef.nodes);
        let ngbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);
        this._registerModalRef(ngbModalRef);
        this._registerWindowCmpt(windowCmptRef);
        // We have to cleanup DOM after the last modal when BOTH 'hidden' was emitted and 'result' promise was resolved:
        // - with animations OFF, 'hidden' emits synchronously, then 'result' is resolved asynchronously
        // - with animations ON, 'result' is resolved asynchronously, then 'hidden' emits asynchronously
        ngbModalRef.hidden.pipe(take(1)).subscribe(() => Promise.resolve(true).then(() => {
            if (!this._modalRefs.length) {
                this._document.body.classList.remove('modal-open');
                this._restoreScrollBar();
                this._revertAriaHidden();
            }
        }));
        activeModal.close = (result) => {
            ngbModalRef.close(result);
        };
        activeModal.dismiss = (reason) => {
            ngbModalRef.dismiss(reason);
        };
        activeModal.update = (options) => {
            ngbModalRef.update(options);
        };
        ngbModalRef.update(options);
        if (this._modalRefs.length === 1) {
            this._document.body.classList.add('modal-open');
        }
        if (backdropCmptRef && backdropCmptRef.instance) {
            backdropCmptRef.changeDetectorRef.detectChanges();
        }
        windowCmptRef.changeDetectorRef.detectChanges();
        return ngbModalRef;
    }
    get activeInstances() {
        return this._activeInstances;
    }
    dismissAll(reason) {
        this._modalRefs.forEach((ngbModalRef) => ngbModalRef.dismiss(reason));
    }
    hasOpenModals() {
        return this._modalRefs.length > 0;
    }
    _attachBackdrop(containerEl) {
        let backdropCmptRef = createComponent(NgbModalBackdrop, {
            environmentInjector: this._applicationRef.injector,
            elementInjector: this._injector,
        });
        this._applicationRef.attachView(backdropCmptRef.hostView);
        containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    }
    _attachWindowComponent(containerEl, projectableNodes) {
        let windowCmptRef = createComponent(NgbModalWindow, {
            environmentInjector: this._applicationRef.injector,
            elementInjector: this._injector,
            projectableNodes,
        });
        this._applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        return windowCmptRef;
    }
    _getContentRef(contentInjector, environmentInjector, content, activeModal, options) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            return this._createFromTemplateRef(content, activeModal);
        }
        else if (isString(content)) {
            return this._createFromString(content);
        }
        else {
            return this._createFromComponent(contentInjector, environmentInjector, content, activeModal, options);
        }
    }
    _createFromTemplateRef(templateRef, activeModal) {
        const context = {
            $implicit: activeModal,
            close(result) {
                activeModal.close(result);
            },
            dismiss(reason) {
                activeModal.dismiss(reason);
            },
        };
        const viewRef = templateRef.createEmbeddedView(context);
        this._applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }
    _createFromString(content) {
        const component = this._document.createTextNode(`${content}`);
        return new ContentRef([[component]]);
    }
    _createFromComponent(contentInjector, environmentInjector, componentType, context, options) {
        const elementInjector = Injector.create({
            providers: [{ provide: NgbActiveModal, useValue: context }],
            parent: contentInjector,
        });
        const componentRef = createComponent(componentType, {
            environmentInjector,
            elementInjector,
        });
        const componentNativeEl = componentRef.location.nativeElement;
        if (options.scrollable) {
            componentNativeEl.classList.add('component-host-scrollable');
        }
        this._applicationRef.attachView(componentRef.hostView);
        // FIXME: we should here get rid of the component nativeElement
        // and use `[Array.from(componentNativeEl.childNodes)]` instead and remove the above CSS class.
        return new ContentRef([[componentNativeEl]], componentRef.hostView, componentRef);
    }
    _setAriaHidden(element) {
        const parent = element.parentElement;
        if (parent && element !== this._document.body) {
            Array.from(parent.children).forEach((sibling) => {
                if (sibling !== element && sibling.nodeName !== 'SCRIPT') {
                    this._ariaHiddenValues.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            });
            this._setAriaHidden(parent);
        }
    }
    _revertAriaHidden() {
        this._ariaHiddenValues.forEach((value, element) => {
            if (value) {
                element.setAttribute('aria-hidden', value);
            }
            else {
                element.removeAttribute('aria-hidden');
            }
        });
        this._ariaHiddenValues.clear();
    }
    _registerModalRef(ngbModalRef) {
        const unregisterModalRef = () => {
            const index = this._modalRefs.indexOf(ngbModalRef);
            if (index > -1) {
                this._modalRefs.splice(index, 1);
                this._activeInstances.emit(this._modalRefs);
            }
        };
        this._modalRefs.push(ngbModalRef);
        this._activeInstances.emit(this._modalRefs);
        ngbModalRef.result.then(unregisterModalRef, unregisterModalRef);
    }
    _registerWindowCmpt(ngbWindowCmpt) {
        this._windowCmpts.push(ngbWindowCmpt);
        this._activeWindowCmptHasChanged.next();
        ngbWindowCmpt.onDestroy(() => {
            const index = this._windowCmpts.indexOf(ngbWindowCmpt);
            if (index > -1) {
                this._windowCmpts.splice(index, 1);
                this._activeWindowCmptHasChanged.next();
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbModalStack, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbModalStack, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbModalStack, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kYWwvbW9kYWwtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTixjQUFjLEVBRWQsZUFBZSxFQUNmLG1CQUFtQixFQUNuQixZQUFZLEVBQ1osTUFBTSxFQUNOLFVBQVUsRUFDVixRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsR0FFWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRS9CLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVwRCxPQUFPLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUd0QyxNQUFNLE9BQU8sYUFBYTtJQWN6QjtRQWJRLG9CQUFlLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pDLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0IseUJBQW9CLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDbkQsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QixlQUFV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RXhDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQzVCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3ZELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pDLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7OEdBM1BXLGFBQWE7a0hBQWIsYUFBYSxjQURBLE1BQU07OzJGQUNuQixhQUFhO2tCQUR6QixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG5cdEFwcGxpY2F0aW9uUmVmLFxuXHRDb21wb25lbnRSZWYsXG5cdGNyZWF0ZUNvbXBvbmVudCxcblx0RW52aXJvbm1lbnRJbmplY3Rvcixcblx0RXZlbnRFbWl0dGVyLFxuXHRpbmplY3QsXG5cdEluamVjdGFibGUsXG5cdEluamVjdG9yLFxuXHROZ1pvbmUsXG5cdFRlbXBsYXRlUmVmLFxuXHRUeXBlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgbmdiRm9jdXNUcmFwIH0gZnJvbSAnLi4vdXRpbC9mb2N1cy10cmFwJztcbmltcG9ydCB7IENvbnRlbnRSZWYgfSBmcm9tICcuLi91dGlsL3BvcHVwJztcbmltcG9ydCB7IFNjcm9sbEJhciB9IGZyb20gJy4uL3V0aWwvc2Nyb2xsYmFyJztcbmltcG9ydCB7IGlzRGVmaW5lZCwgaXNTdHJpbmcgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgTmdiTW9kYWxCYWNrZHJvcCB9IGZyb20gJy4vbW9kYWwtYmFja2Ryb3AnO1xuaW1wb3J0IHsgTmdiTW9kYWxPcHRpb25zLCBOZ2JNb2RhbFVwZGF0YWJsZU9wdGlvbnMgfSBmcm9tICcuL21vZGFsLWNvbmZpZyc7XG5pbXBvcnQgeyBOZ2JBY3RpdmVNb2RhbCwgTmdiTW9kYWxSZWYgfSBmcm9tICcuL21vZGFsLXJlZic7XG5pbXBvcnQgeyBOZ2JNb2RhbFdpbmRvdyB9IGZyb20gJy4vbW9kYWwtd2luZG93JztcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgTmdiTW9kYWxTdGFjayB7XG5cdHByaXZhdGUgX2FwcGxpY2F0aW9uUmVmID0gaW5qZWN0KEFwcGxpY2F0aW9uUmVmKTtcblx0cHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXHRwcml2YXRlIF9lbnZpcm9ubWVudEluamVjdG9yID0gaW5qZWN0KEVudmlyb25tZW50SW5qZWN0b3IpO1xuXHRwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG5cdHByaXZhdGUgX3Njcm9sbEJhciA9IGluamVjdChTY3JvbGxCYXIpO1xuXG5cdHByaXZhdGUgX2FjdGl2ZVdpbmRvd0NtcHRIYXNDaGFuZ2VkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblx0cHJpdmF0ZSBfYXJpYUhpZGRlblZhbHVlczogTWFwPEVsZW1lbnQsIHN0cmluZyB8IG51bGw+ID0gbmV3IE1hcCgpO1xuXHRwcml2YXRlIF9zY3JvbGxCYXJSZXN0b3JlRm46IG51bGwgfCAoKCkgPT4gdm9pZCkgPSBudWxsO1xuXHRwcml2YXRlIF9tb2RhbFJlZnM6IE5nYk1vZGFsUmVmW10gPSBbXTtcblx0cHJpdmF0ZSBfd2luZG93Q21wdHM6IENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz5bXSA9IFtdO1xuXHRwcml2YXRlIF9hY3RpdmVJbnN0YW5jZXM6IEV2ZW50RW1pdHRlcjxOZ2JNb2RhbFJlZltdPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRjb25zdCBuZ1pvbmUgPSBpbmplY3QoTmdab25lKTtcblxuXHRcdC8vIFRyYXAgZm9jdXMgb24gYWN0aXZlIFdpbmRvd0NtcHRcblx0XHR0aGlzLl9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZC5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuX3dpbmRvd0NtcHRzLmxlbmd0aCkge1xuXHRcdFx0XHRjb25zdCBhY3RpdmVXaW5kb3dDbXB0ID0gdGhpcy5fd2luZG93Q21wdHNbdGhpcy5fd2luZG93Q21wdHMubGVuZ3RoIC0gMV07XG5cdFx0XHRcdG5nYkZvY3VzVHJhcChuZ1pvbmUsIGFjdGl2ZVdpbmRvd0NtcHQubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5fYWN0aXZlV2luZG93Q21wdEhhc0NoYW5nZWQpO1xuXHRcdFx0XHR0aGlzLl9yZXZlcnRBcmlhSGlkZGVuKCk7XG5cdFx0XHRcdHRoaXMuX3NldEFyaWFIaWRkZW4oYWN0aXZlV2luZG93Q21wdC5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX3Jlc3RvcmVTY3JvbGxCYXIoKSB7XG5cdFx0Y29uc3Qgc2Nyb2xsQmFyUmVzdG9yZUZuID0gdGhpcy5fc2Nyb2xsQmFyUmVzdG9yZUZuO1xuXHRcdGlmIChzY3JvbGxCYXJSZXN0b3JlRm4pIHtcblx0XHRcdHRoaXMuX3Njcm9sbEJhclJlc3RvcmVGbiA9IG51bGw7XG5cdFx0XHRzY3JvbGxCYXJSZXN0b3JlRm4oKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9oaWRlU2Nyb2xsQmFyKCkge1xuXHRcdGlmICghdGhpcy5fc2Nyb2xsQmFyUmVzdG9yZUZuKSB7XG5cdFx0XHR0aGlzLl9zY3JvbGxCYXJSZXN0b3JlRm4gPSB0aGlzLl9zY3JvbGxCYXIuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdG9wZW4oY29udGVudEluamVjdG9yOiBJbmplY3RvciwgY29udGVudDogYW55LCBvcHRpb25zOiBOZ2JNb2RhbE9wdGlvbnMpOiBOZ2JNb2RhbFJlZiB7XG5cdFx0Y29uc3QgY29udGFpbmVyRWwgPVxuXHRcdFx0b3B0aW9ucy5jb250YWluZXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuXHRcdFx0XHQ/IG9wdGlvbnMuY29udGFpbmVyXG5cdFx0XHRcdDogaXNEZWZpbmVkKG9wdGlvbnMuY29udGFpbmVyKVxuXHRcdFx0XHQgID8gdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLmNvbnRhaW5lciEpXG5cdFx0XHRcdCAgOiB0aGlzLl9kb2N1bWVudC5ib2R5O1xuXG5cdFx0aWYgKCFjb250YWluZXJFbCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUaGUgc3BlY2lmaWVkIG1vZGFsIGNvbnRhaW5lciBcIiR7b3B0aW9ucy5jb250YWluZXIgfHwgJ2JvZHknfVwiIHdhcyBub3QgZm91bmQgaW4gdGhlIERPTS5gKTtcblx0XHR9XG5cblx0XHR0aGlzLl9oaWRlU2Nyb2xsQmFyKCk7XG5cblx0XHRjb25zdCBhY3RpdmVNb2RhbCA9IG5ldyBOZ2JBY3RpdmVNb2RhbCgpO1xuXG5cdFx0Y29udGVudEluamVjdG9yID0gb3B0aW9ucy5pbmplY3RvciB8fCBjb250ZW50SW5qZWN0b3I7XG5cdFx0Y29uc3QgZW52aXJvbm1lbnRJbmplY3RvciA9IGNvbnRlbnRJbmplY3Rvci5nZXQoRW52aXJvbm1lbnRJbmplY3RvciwgbnVsbCkgfHwgdGhpcy5fZW52aXJvbm1lbnRJbmplY3Rvcjtcblx0XHRjb25zdCBjb250ZW50UmVmID0gdGhpcy5fZ2V0Q29udGVudFJlZihjb250ZW50SW5qZWN0b3IsIGVudmlyb25tZW50SW5qZWN0b3IsIGNvbnRlbnQsIGFjdGl2ZU1vZGFsLCBvcHRpb25zKTtcblxuXHRcdGxldCBiYWNrZHJvcENtcHRSZWY6IENvbXBvbmVudFJlZjxOZ2JNb2RhbEJhY2tkcm9wPiB8IHVuZGVmaW5lZCA9XG5cdFx0XHRvcHRpb25zLmJhY2tkcm9wICE9PSBmYWxzZSA/IHRoaXMuX2F0dGFjaEJhY2tkcm9wKGNvbnRhaW5lckVsKSA6IHVuZGVmaW5lZDtcblx0XHRsZXQgd2luZG93Q21wdFJlZjogQ29tcG9uZW50UmVmPE5nYk1vZGFsV2luZG93PiA9IHRoaXMuX2F0dGFjaFdpbmRvd0NvbXBvbmVudChjb250YWluZXJFbCwgY29udGVudFJlZi5ub2Rlcyk7XG5cdFx0bGV0IG5nYk1vZGFsUmVmOiBOZ2JNb2RhbFJlZiA9IG5ldyBOZ2JNb2RhbFJlZih3aW5kb3dDbXB0UmVmLCBjb250ZW50UmVmLCBiYWNrZHJvcENtcHRSZWYsIG9wdGlvbnMuYmVmb3JlRGlzbWlzcyk7XG5cblx0XHR0aGlzLl9yZWdpc3Rlck1vZGFsUmVmKG5nYk1vZGFsUmVmKTtcblx0XHR0aGlzLl9yZWdpc3RlcldpbmRvd0NtcHQod2luZG93Q21wdFJlZik7XG5cblx0XHQvLyBXZSBoYXZlIHRvIGNsZWFudXAgRE9NIGFmdGVyIHRoZSBsYXN0IG1vZGFsIHdoZW4gQk9USCAnaGlkZGVuJyB3YXMgZW1pdHRlZCBhbmQgJ3Jlc3VsdCcgcHJvbWlzZSB3YXMgcmVzb2x2ZWQ6XG5cdFx0Ly8gLSB3aXRoIGFuaW1hdGlvbnMgT0ZGLCAnaGlkZGVuJyBlbWl0cyBzeW5jaHJvbm91c2x5LCB0aGVuICdyZXN1bHQnIGlzIHJlc29sdmVkIGFzeW5jaHJvbm91c2x5XG5cdFx0Ly8gLSB3aXRoIGFuaW1hdGlvbnMgT04sICdyZXN1bHQnIGlzIHJlc29sdmVkIGFzeW5jaHJvbm91c2x5LCB0aGVuICdoaWRkZW4nIGVtaXRzIGFzeW5jaHJvbm91c2x5XG5cdFx0bmdiTW9kYWxSZWYuaGlkZGVuLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+XG5cdFx0XHRQcm9taXNlLnJlc29sdmUodHJ1ZSkudGhlbigoKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpcy5fbW9kYWxSZWZzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHRoaXMuX2RvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xuXHRcdFx0XHRcdHRoaXMuX3Jlc3RvcmVTY3JvbGxCYXIoKTtcblx0XHRcdFx0XHR0aGlzLl9yZXZlcnRBcmlhSGlkZGVuKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pLFxuXHRcdCk7XG5cblx0XHRhY3RpdmVNb2RhbC5jbG9zZSA9IChyZXN1bHQ6IGFueSkgPT4ge1xuXHRcdFx0bmdiTW9kYWxSZWYuY2xvc2UocmVzdWx0KTtcblx0XHR9O1xuXHRcdGFjdGl2ZU1vZGFsLmRpc21pc3MgPSAocmVhc29uOiBhbnkpID0+IHtcblx0XHRcdG5nYk1vZGFsUmVmLmRpc21pc3MocmVhc29uKTtcblx0XHR9O1xuXG5cdFx0YWN0aXZlTW9kYWwudXBkYXRlID0gKG9wdGlvbnM6IE5nYk1vZGFsVXBkYXRhYmxlT3B0aW9ucykgPT4ge1xuXHRcdFx0bmdiTW9kYWxSZWYudXBkYXRlKG9wdGlvbnMpO1xuXHRcdH07XG5cblx0XHRuZ2JNb2RhbFJlZi51cGRhdGUob3B0aW9ucyk7XG5cdFx0aWYgKHRoaXMuX21vZGFsUmVmcy5sZW5ndGggPT09IDEpIHtcblx0XHRcdHRoaXMuX2RvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpO1xuXHRcdH1cblxuXHRcdGlmIChiYWNrZHJvcENtcHRSZWYgJiYgYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlKSB7XG5cdFx0XHRiYWNrZHJvcENtcHRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXHRcdH1cblx0XHR3aW5kb3dDbXB0UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblx0XHRyZXR1cm4gbmdiTW9kYWxSZWY7XG5cdH1cblxuXHRnZXQgYWN0aXZlSW5zdGFuY2VzKCkge1xuXHRcdHJldHVybiB0aGlzLl9hY3RpdmVJbnN0YW5jZXM7XG5cdH1cblxuXHRkaXNtaXNzQWxsKHJlYXNvbj86IGFueSkge1xuXHRcdHRoaXMuX21vZGFsUmVmcy5mb3JFYWNoKChuZ2JNb2RhbFJlZikgPT4gbmdiTW9kYWxSZWYuZGlzbWlzcyhyZWFzb24pKTtcblx0fVxuXG5cdGhhc09wZW5Nb2RhbHMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX21vZGFsUmVmcy5sZW5ndGggPiAwO1xuXHR9XG5cblx0cHJpdmF0ZSBfYXR0YWNoQmFja2Ryb3AoY29udGFpbmVyRWw6IEVsZW1lbnQpOiBDb21wb25lbnRSZWY8TmdiTW9kYWxCYWNrZHJvcD4ge1xuXHRcdGxldCBiYWNrZHJvcENtcHRSZWYgPSBjcmVhdGVDb21wb25lbnQoTmdiTW9kYWxCYWNrZHJvcCwge1xuXHRcdFx0ZW52aXJvbm1lbnRJbmplY3RvcjogdGhpcy5fYXBwbGljYXRpb25SZWYuaW5qZWN0b3IsXG5cdFx0XHRlbGVtZW50SW5qZWN0b3I6IHRoaXMuX2luamVjdG9yLFxuXHRcdH0pO1xuXHRcdHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcoYmFja2Ryb3BDbXB0UmVmLmhvc3RWaWV3KTtcblx0XHRjb250YWluZXJFbC5hcHBlbmRDaGlsZChiYWNrZHJvcENtcHRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG5cdFx0cmV0dXJuIGJhY2tkcm9wQ21wdFJlZjtcblx0fVxuXG5cdHByaXZhdGUgX2F0dGFjaFdpbmRvd0NvbXBvbmVudChjb250YWluZXJFbDogRWxlbWVudCwgcHJvamVjdGFibGVOb2RlczogTm9kZVtdW10pOiBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+IHtcblx0XHRsZXQgd2luZG93Q21wdFJlZiA9IGNyZWF0ZUNvbXBvbmVudChOZ2JNb2RhbFdpbmRvdywge1xuXHRcdFx0ZW52aXJvbm1lbnRJbmplY3RvcjogdGhpcy5fYXBwbGljYXRpb25SZWYuaW5qZWN0b3IsXG5cdFx0XHRlbGVtZW50SW5qZWN0b3I6IHRoaXMuX2luamVjdG9yLFxuXHRcdFx0cHJvamVjdGFibGVOb2Rlcyxcblx0XHR9KTtcblx0XHR0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KHdpbmRvd0NtcHRSZWYuaG9zdFZpZXcpO1xuXHRcdGNvbnRhaW5lckVsLmFwcGVuZENoaWxkKHdpbmRvd0NtcHRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG5cdFx0cmV0dXJuIHdpbmRvd0NtcHRSZWY7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRDb250ZW50UmVmKFxuXHRcdGNvbnRlbnRJbmplY3RvcjogSW5qZWN0b3IsXG5cdFx0ZW52aXJvbm1lbnRJbmplY3RvcjogRW52aXJvbm1lbnRJbmplY3Rvcixcblx0XHRjb250ZW50OiBUeXBlPGFueT4gfCBUZW1wbGF0ZVJlZjxhbnk+IHwgc3RyaW5nLFxuXHRcdGFjdGl2ZU1vZGFsOiBOZ2JBY3RpdmVNb2RhbCxcblx0XHRvcHRpb25zOiBOZ2JNb2RhbE9wdGlvbnMsXG5cdCk6IENvbnRlbnRSZWYge1xuXHRcdGlmICghY29udGVudCkge1xuXHRcdFx0cmV0dXJuIG5ldyBDb250ZW50UmVmKFtdKTtcblx0XHR9IGVsc2UgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZUZyb21UZW1wbGF0ZVJlZihjb250ZW50LCBhY3RpdmVNb2RhbCk7XG5cdFx0fSBlbHNlIGlmIChpc1N0cmluZyhjb250ZW50KSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZUZyb21TdHJpbmcoY29udGVudCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVGcm9tQ29tcG9uZW50KGNvbnRlbnRJbmplY3RvciwgZW52aXJvbm1lbnRJbmplY3RvciwgY29udGVudCwgYWN0aXZlTW9kYWwsIG9wdGlvbnMpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2NyZWF0ZUZyb21UZW1wbGF0ZVJlZih0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PiwgYWN0aXZlTW9kYWw6IE5nYkFjdGl2ZU1vZGFsKTogQ29udGVudFJlZiB7XG5cdFx0Y29uc3QgY29udGV4dCA9IHtcblx0XHRcdCRpbXBsaWNpdDogYWN0aXZlTW9kYWwsXG5cdFx0XHRjbG9zZShyZXN1bHQpIHtcblx0XHRcdFx0YWN0aXZlTW9kYWwuY2xvc2UocmVzdWx0KTtcblx0XHRcdH0sXG5cdFx0XHRkaXNtaXNzKHJlYXNvbikge1xuXHRcdFx0XHRhY3RpdmVNb2RhbC5kaXNtaXNzKHJlYXNvbik7XG5cdFx0XHR9LFxuXHRcdH07XG5cdFx0Y29uc3Qgdmlld1JlZiA9IHRlbXBsYXRlUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyhjb250ZXh0KTtcblx0XHR0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KHZpZXdSZWYpO1xuXHRcdHJldHVybiBuZXcgQ29udGVudFJlZihbdmlld1JlZi5yb290Tm9kZXNdLCB2aWV3UmVmKTtcblx0fVxuXG5cdHByaXZhdGUgX2NyZWF0ZUZyb21TdHJpbmcoY29udGVudDogc3RyaW5nKTogQ29udGVudFJlZiB7XG5cdFx0Y29uc3QgY29tcG9uZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7Y29udGVudH1gKTtcblx0XHRyZXR1cm4gbmV3IENvbnRlbnRSZWYoW1tjb21wb25lbnRdXSk7XG5cdH1cblxuXHRwcml2YXRlIF9jcmVhdGVGcm9tQ29tcG9uZW50KFxuXHRcdGNvbnRlbnRJbmplY3RvcjogSW5qZWN0b3IsXG5cdFx0ZW52aXJvbm1lbnRJbmplY3RvcjogRW52aXJvbm1lbnRJbmplY3Rvcixcblx0XHRjb21wb25lbnRUeXBlOiBUeXBlPGFueT4sXG5cdFx0Y29udGV4dDogTmdiQWN0aXZlTW9kYWwsXG5cdFx0b3B0aW9uczogTmdiTW9kYWxPcHRpb25zLFxuXHQpOiBDb250ZW50UmVmIHtcblx0XHRjb25zdCBlbGVtZW50SW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuXHRcdFx0cHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOZ2JBY3RpdmVNb2RhbCwgdXNlVmFsdWU6IGNvbnRleHQgfV0sXG5cdFx0XHRwYXJlbnQ6IGNvbnRlbnRJbmplY3Rvcixcblx0XHR9KTtcblx0XHRjb25zdCBjb21wb25lbnRSZWYgPSBjcmVhdGVDb21wb25lbnQoY29tcG9uZW50VHlwZSwge1xuXHRcdFx0ZW52aXJvbm1lbnRJbmplY3Rvcixcblx0XHRcdGVsZW1lbnRJbmplY3Rvcixcblx0XHR9KTtcblx0XHRjb25zdCBjb21wb25lbnROYXRpdmVFbCA9IGNvbXBvbmVudFJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50O1xuXHRcdGlmIChvcHRpb25zLnNjcm9sbGFibGUpIHtcblx0XHRcdChjb21wb25lbnROYXRpdmVFbCBhcyBIVE1MRWxlbWVudCkuY2xhc3NMaXN0LmFkZCgnY29tcG9uZW50LWhvc3Qtc2Nyb2xsYWJsZScpO1xuXHRcdH1cblx0XHR0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KGNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG5cdFx0Ly8gRklYTUU6IHdlIHNob3VsZCBoZXJlIGdldCByaWQgb2YgdGhlIGNvbXBvbmVudCBuYXRpdmVFbGVtZW50XG5cdFx0Ly8gYW5kIHVzZSBgW0FycmF5LmZyb20oY29tcG9uZW50TmF0aXZlRWwuY2hpbGROb2RlcyldYCBpbnN0ZWFkIGFuZCByZW1vdmUgdGhlIGFib3ZlIENTUyBjbGFzcy5cblx0XHRyZXR1cm4gbmV3IENvbnRlbnRSZWYoW1tjb21wb25lbnROYXRpdmVFbF1dLCBjb21wb25lbnRSZWYuaG9zdFZpZXcsIGNvbXBvbmVudFJlZik7XG5cdH1cblxuXHRwcml2YXRlIF9zZXRBcmlhSGlkZGVuKGVsZW1lbnQ6IEVsZW1lbnQpIHtcblx0XHRjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0aWYgKHBhcmVudCAmJiBlbGVtZW50ICE9PSB0aGlzLl9kb2N1bWVudC5ib2R5KSB7XG5cdFx0XHRBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZm9yRWFjaCgoc2libGluZykgPT4ge1xuXHRcdFx0XHRpZiAoc2libGluZyAhPT0gZWxlbWVudCAmJiBzaWJsaW5nLm5vZGVOYW1lICE9PSAnU0NSSVBUJykge1xuXHRcdFx0XHRcdHRoaXMuX2FyaWFIaWRkZW5WYWx1ZXMuc2V0KHNpYmxpbmcsIHNpYmxpbmcuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKTtcblx0XHRcdFx0XHRzaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5fc2V0QXJpYUhpZGRlbihwYXJlbnQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3JldmVydEFyaWFIaWRkZW4oKSB7XG5cdFx0dGhpcy5fYXJpYUhpZGRlblZhbHVlcy5mb3JFYWNoKCh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHZhbHVlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMuX2FyaWFIaWRkZW5WYWx1ZXMuY2xlYXIoKTtcblx0fVxuXG5cdHByaXZhdGUgX3JlZ2lzdGVyTW9kYWxSZWYobmdiTW9kYWxSZWY6IE5nYk1vZGFsUmVmKSB7XG5cdFx0Y29uc3QgdW5yZWdpc3Rlck1vZGFsUmVmID0gKCkgPT4ge1xuXHRcdFx0Y29uc3QgaW5kZXggPSB0aGlzLl9tb2RhbFJlZnMuaW5kZXhPZihuZ2JNb2RhbFJlZik7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHR0aGlzLl9tb2RhbFJlZnMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0dGhpcy5fYWN0aXZlSW5zdGFuY2VzLmVtaXQodGhpcy5fbW9kYWxSZWZzKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHRoaXMuX21vZGFsUmVmcy5wdXNoKG5nYk1vZGFsUmVmKTtcblx0XHR0aGlzLl9hY3RpdmVJbnN0YW5jZXMuZW1pdCh0aGlzLl9tb2RhbFJlZnMpO1xuXHRcdG5nYk1vZGFsUmVmLnJlc3VsdC50aGVuKHVucmVnaXN0ZXJNb2RhbFJlZiwgdW5yZWdpc3Rlck1vZGFsUmVmKTtcblx0fVxuXG5cdHByaXZhdGUgX3JlZ2lzdGVyV2luZG93Q21wdChuZ2JXaW5kb3dDbXB0OiBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+KSB7XG5cdFx0dGhpcy5fd2luZG93Q21wdHMucHVzaChuZ2JXaW5kb3dDbXB0KTtcblx0XHR0aGlzLl9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZC5uZXh0KCk7XG5cblx0XHRuZ2JXaW5kb3dDbXB0Lm9uRGVzdHJveSgoKSA9PiB7XG5cdFx0XHRjb25zdCBpbmRleCA9IHRoaXMuX3dpbmRvd0NtcHRzLmluZGV4T2YobmdiV2luZG93Q21wdCk7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkge1xuXHRcdFx0XHR0aGlzLl93aW5kb3dDbXB0cy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHR0aGlzLl9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZC5uZXh0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==