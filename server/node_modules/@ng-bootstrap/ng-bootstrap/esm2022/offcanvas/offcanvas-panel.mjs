import { afterNextRender, AfterRenderPhase, Component, ElementRef, EventEmitter, inject, Injector, Input, NgZone, Output, ViewEncapsulation, } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { getFocusableBoundaryElements } from '../util/focus-trap';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
export class NgbOffcanvasPanel {
    constructor() {
        this._document = inject(DOCUMENT);
        this._elRef = inject((ElementRef));
        this._zone = inject(NgZone);
        this._injector = inject(Injector);
        this._closed$ = new Subject();
        this._elWithFocus = null; // element that is focused prior to offcanvas opening
        this.keyboard = true;
        this.position = 'start';
        this.dismissEvent = new EventEmitter();
        this.shown = new Subject();
        this.hidden = new Subject();
    }
    dismiss(reason) {
        this.dismissEvent.emit(reason);
    }
    ngOnInit() {
        this._elWithFocus = this._document.activeElement;
        afterNextRender(() => this._show(), { injector: this._injector, phase: AfterRenderPhase.MixedReadWrite });
    }
    ngOnDestroy() {
        this._disableEventHandling();
    }
    hide() {
        const context = { animation: this.animation, runningTransition: 'stop' };
        const offcanvasTransition$ = ngbRunTransition(this._zone, this._elRef.nativeElement, (element) => {
            element.classList.remove('showing');
            element.classList.add('hiding');
            return () => element.classList.remove('show', 'hiding');
        }, context);
        offcanvasTransition$.subscribe(() => {
            this.hidden.next();
            this.hidden.complete();
        });
        this._disableEventHandling();
        this._restoreFocus();
        return offcanvasTransition$;
    }
    _show() {
        const context = { animation: this.animation, runningTransition: 'continue' };
        const offcanvasTransition$ = ngbRunTransition(this._zone, this._elRef.nativeElement, (element, animation) => {
            if (animation) {
                reflow(element);
            }
            element.classList.add('show', 'showing');
            return () => element.classList.remove('showing');
        }, context);
        offcanvasTransition$.subscribe(() => {
            this.shown.next();
            this.shown.complete();
        });
        this._enableEventHandling();
        this._setFocus();
    }
    _enableEventHandling() {
        const { nativeElement } = this._elRef;
        this._zone.runOutsideAngular(() => {
            fromEvent(nativeElement, 'keydown')
                .pipe(takeUntil(this._closed$), filter((e) => e.key === 'Escape'))
                .subscribe((event) => {
                if (this.keyboard) {
                    requestAnimationFrame(() => {
                        if (!event.defaultPrevented) {
                            this._zone.run(() => this.dismiss(OffcanvasDismissReasons.ESC));
                        }
                    });
                }
            });
        });
    }
    _disableEventHandling() {
        this._closed$.next();
    }
    _setFocus() {
        const { nativeElement } = this._elRef;
        if (!nativeElement.contains(document.activeElement)) {
            const autoFocusable = nativeElement.querySelector(`[ngbAutofocus]`);
            const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];
            const elementToFocus = autoFocusable || firstFocusable || nativeElement;
            elementToFocus.focus();
        }
    }
    _restoreFocus() {
        const body = this._document.body;
        const elWithFocus = this._elWithFocus;
        let elementToFocus;
        if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
            elementToFocus = elWithFocus;
        }
        else {
            elementToFocus = body;
        }
        this._zone.runOutsideAngular(() => {
            setTimeout(() => elementToFocus.focus());
            this._elWithFocus = null;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbOffcanvasPanel, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.2", type: NgbOffcanvasPanel, isStandalone: true, selector: "ngb-offcanvas-panel", inputs: { animation: "animation", ariaLabelledBy: "ariaLabelledBy", ariaDescribedBy: "ariaDescribedBy", keyboard: "keyboard", panelClass: "panelClass", position: "position" }, outputs: { dismissEvent: "dismiss" }, host: { attributes: { "role": "dialog", "tabindex": "-1" }, properties: { "class": "\"offcanvas offcanvas-\" + position  + (panelClass ? \" \" + panelClass : \"\")", "attr.aria-modal": "true", "attr.aria-labelledby": "ariaLabelledBy", "attr.aria-describedby": "ariaDescribedBy" } }, ngImport: i0, template: '<ng-content />', isInline: true, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbOffcanvasPanel, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-offcanvas-panel',
                    standalone: true,
                    template: '<ng-content />',
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class]': '"offcanvas offcanvas-" + position  + (panelClass ? " " + panelClass : "")',
                        role: 'dialog',
                        tabindex: '-1',
                        '[attr.aria-modal]': 'true',
                        '[attr.aria-labelledby]': 'ariaLabelledBy',
                        '[attr.aria-describedby]': 'ariaDescribedBy',
                    },
                }]
        }], propDecorators: { animation: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], ariaDescribedBy: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], panelClass: [{
                type: Input
            }], position: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL29mZmNhbnZhcy9vZmZjYW52YXMtcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNOLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUdOLE1BQU0sRUFDTixpQkFBaUIsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFNBQVMsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQXdCLE1BQU0sa0NBQWtDLENBQUM7QUFDMUYsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBZ0IzQyxNQUFNLE9BQU8saUJBQWlCO0lBZDlCO1FBZVMsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QixXQUFNLEdBQUcsTUFBTSxDQUFDLENBQUEsVUFBdUIsQ0FBQSxDQUFDLENBQUM7UUFDekMsVUFBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixjQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdCLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQy9CLGlCQUFZLEdBQW1CLElBQUksQ0FBQyxDQUFDLHFEQUFxRDtRQUt6RixhQUFR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QkFBd0IsRUFBRSxnQkFBZ0I7d0JBQzFDLHlCQUF5QixFQUFFLGlCQUFpQjtxQkFDNUM7aUJBQ0Q7OEJBVVMsU0FBUztzQkFBakIsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLO2dCQUNHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBRWEsWUFBWTtzQkFBOUIsTUFBTTt1QkFBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0YWZ0ZXJOZXh0UmVuZGVyLFxuXHRBZnRlclJlbmRlclBoYXNlLFxuXHRDb21wb25lbnQsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0aW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25EZXN0cm95LFxuXHRPbkluaXQsXG5cdE91dHB1dCxcblx0Vmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBmcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBnZXRGb2N1c2FibGVCb3VuZGFyeUVsZW1lbnRzIH0gZnJvbSAnLi4vdXRpbC9mb2N1cy10cmFwJztcbmltcG9ydCB7IE9mZmNhbnZhc0Rpc21pc3NSZWFzb25zIH0gZnJvbSAnLi9vZmZjYW52YXMtZGlzbWlzcy1yZWFzb25zJztcbmltcG9ydCB7IG5nYlJ1blRyYW5zaXRpb24sIE5nYlRyYW5zaXRpb25PcHRpb25zIH0gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHsgcmVmbG93IH0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLW9mZmNhbnZhcy1wYW5lbCcsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQgLz4nLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRob3N0OiB7XG5cdFx0J1tjbGFzc10nOiAnXCJvZmZjYW52YXMgb2ZmY2FudmFzLVwiICsgcG9zaXRpb24gICsgKHBhbmVsQ2xhc3MgPyBcIiBcIiArIHBhbmVsQ2xhc3MgOiBcIlwiKScsXG5cdFx0cm9sZTogJ2RpYWxvZycsXG5cdFx0dGFiaW5kZXg6ICctMScsXG5cdFx0J1thdHRyLmFyaWEtbW9kYWxdJzogJ3RydWUnLFxuXHRcdCdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ2FyaWFMYWJlbGxlZEJ5Jyxcblx0XHQnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnYXJpYURlc2NyaWJlZEJ5Jyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiT2ZmY2FudmFzUGFuZWwgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cdHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcblx0cHJpdmF0ZSBfZWxSZWYgPSBpbmplY3QoRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pO1xuXHRwcml2YXRlIF96b25lID0gaW5qZWN0KE5nWm9uZSk7XG5cdHByaXZhdGUgX2luamVjdG9yID0gaW5qZWN0KEluamVjdG9yKTtcblxuXHRwcml2YXRlIF9jbG9zZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblx0cHJpdmF0ZSBfZWxXaXRoRm9jdXM6IEVsZW1lbnQgfCBudWxsID0gbnVsbDsgLy8gZWxlbWVudCB0aGF0IGlzIGZvY3VzZWQgcHJpb3IgdG8gb2ZmY2FudmFzIG9wZW5pbmdcblxuXHRASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG5cdEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5Pzogc3RyaW5nO1xuXHRASW5wdXQoKSBhcmlhRGVzY3JpYmVkQnk/OiBzdHJpbmc7XG5cdEBJbnB1dCgpIGtleWJvYXJkID0gdHJ1ZTtcblx0QElucHV0KCkgcGFuZWxDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKSBwb3NpdGlvbjogJ3N0YXJ0JyB8ICdlbmQnIHwgJ3RvcCcgfCAnYm90dG9tJyA9ICdzdGFydCc7XG5cblx0QE91dHB1dCgnZGlzbWlzcycpIGRpc21pc3NFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRzaG93biA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cdGhpZGRlbiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cblx0ZGlzbWlzcyhyZWFzb24pOiB2b2lkIHtcblx0XHR0aGlzLmRpc21pc3NFdmVudC5lbWl0KHJlYXNvbik7XG5cdH1cblxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLl9lbFdpdGhGb2N1cyA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cdFx0YWZ0ZXJOZXh0UmVuZGVyKCgpID0+IHRoaXMuX3Nob3coKSwgeyBpbmplY3RvcjogdGhpcy5faW5qZWN0b3IsIHBoYXNlOiBBZnRlclJlbmRlclBoYXNlLk1peGVkUmVhZFdyaXRlIH0pO1xuXHR9XG5cblx0bmdPbkRlc3Ryb3koKSB7XG5cdFx0dGhpcy5fZGlzYWJsZUV2ZW50SGFuZGxpbmcoKTtcblx0fVxuXG5cdGhpZGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHRjb25zdCBjb250ZXh0OiBOZ2JUcmFuc2l0aW9uT3B0aW9uczxhbnk+ID0geyBhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLCBydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnIH07XG5cblx0XHRjb25zdCBvZmZjYW52YXNUcmFuc2l0aW9uJCA9IG5nYlJ1blRyYW5zaXRpb24oXG5cdFx0XHR0aGlzLl96b25lLFxuXHRcdFx0dGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudCxcblx0XHRcdChlbGVtZW50KSA9PiB7XG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvd2luZycpO1xuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGluZycpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JywgJ2hpZGluZycpO1xuXHRcdFx0fSxcblx0XHRcdGNvbnRleHQsXG5cdFx0KTtcblxuXHRcdG9mZmNhbnZhc1RyYW5zaXRpb24kLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHR0aGlzLmhpZGRlbi5uZXh0KCk7XG5cdFx0XHR0aGlzLmhpZGRlbi5jb21wbGV0ZSgpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGlzYWJsZUV2ZW50SGFuZGxpbmcoKTtcblx0XHR0aGlzLl9yZXN0b3JlRm9jdXMoKTtcblxuXHRcdHJldHVybiBvZmZjYW52YXNUcmFuc2l0aW9uJDtcblx0fVxuXG5cdHByaXZhdGUgX3Nob3coKSB7XG5cdFx0Y29uc3QgY29udGV4dDogTmdiVHJhbnNpdGlvbk9wdGlvbnM8YW55PiA9IHsgYW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZScgfTtcblxuXHRcdGNvbnN0IG9mZmNhbnZhc1RyYW5zaXRpb24kID0gbmdiUnVuVHJhbnNpdGlvbihcblx0XHRcdHRoaXMuX3pvbmUsXG5cdFx0XHR0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBhbmltYXRpb246IGJvb2xlYW4pID0+IHtcblx0XHRcdFx0aWYgKGFuaW1hdGlvbikge1xuXHRcdFx0XHRcdHJlZmxvdyhlbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnLCAnc2hvd2luZycpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93aW5nJyk7XG5cdFx0XHR9LFxuXHRcdFx0Y29udGV4dCxcblx0XHQpO1xuXG5cdFx0b2ZmY2FudmFzVHJhbnNpdGlvbiQuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuc2hvd24ubmV4dCgpO1xuXHRcdFx0dGhpcy5zaG93bi5jb21wbGV0ZSgpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZW5hYmxlRXZlbnRIYW5kbGluZygpO1xuXHRcdHRoaXMuX3NldEZvY3VzKCk7XG5cdH1cblxuXHRwcml2YXRlIF9lbmFibGVFdmVudEhhbmRsaW5nKCkge1xuXHRcdGNvbnN0IHsgbmF0aXZlRWxlbWVudCB9ID0gdGhpcy5fZWxSZWY7XG5cdFx0dGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRmcm9tRXZlbnQ8S2V5Ym9hcmRFdmVudD4obmF0aXZlRWxlbWVudCwgJ2tleWRvd24nKVxuXHRcdFx0XHQucGlwZShcblx0XHRcdFx0XHR0YWtlVW50aWwodGhpcy5fY2xvc2VkJCksXG5cdFx0XHRcdFx0ZmlsdGVyKChlKSA9PiBlLmtleSA9PT0gJ0VzY2FwZScpLFxuXHRcdFx0XHQpXG5cdFx0XHRcdC5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMua2V5Ym9hcmQpIHtcblx0XHRcdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmICghZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3pvbmUucnVuKCgpID0+IHRoaXMuZGlzbWlzcyhPZmZjYW52YXNEaXNtaXNzUmVhc29ucy5FU0MpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX2Rpc2FibGVFdmVudEhhbmRsaW5nKCkge1xuXHRcdHRoaXMuX2Nsb3NlZCQubmV4dCgpO1xuXHR9XG5cblx0cHJpdmF0ZSBfc2V0Rm9jdXMoKSB7XG5cdFx0Y29uc3QgeyBuYXRpdmVFbGVtZW50IH0gPSB0aGlzLl9lbFJlZjtcblx0XHRpZiAoIW5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcblx0XHRcdGNvbnN0IGF1dG9Gb2N1c2FibGUgPSBuYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYFtuZ2JBdXRvZm9jdXNdYCkgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0XHRjb25zdCBmaXJzdEZvY3VzYWJsZSA9IGdldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHMobmF0aXZlRWxlbWVudClbMF07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRUb0ZvY3VzID0gYXV0b0ZvY3VzYWJsZSB8fCBmaXJzdEZvY3VzYWJsZSB8fCBuYXRpdmVFbGVtZW50O1xuXHRcdFx0ZWxlbWVudFRvRm9jdXMuZm9jdXMoKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG5cdFx0Y29uc3QgYm9keSA9IHRoaXMuX2RvY3VtZW50LmJvZHk7XG5cdFx0Y29uc3QgZWxXaXRoRm9jdXMgPSB0aGlzLl9lbFdpdGhGb2N1cztcblxuXHRcdGxldCBlbGVtZW50VG9Gb2N1cztcblx0XHRpZiAoZWxXaXRoRm9jdXMgJiYgZWxXaXRoRm9jdXNbJ2ZvY3VzJ10gJiYgYm9keS5jb250YWlucyhlbFdpdGhGb2N1cykpIHtcblx0XHRcdGVsZW1lbnRUb0ZvY3VzID0gZWxXaXRoRm9jdXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW1lbnRUb0ZvY3VzID0gYm9keTtcblx0XHR9XG5cdFx0dGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IGVsZW1lbnRUb0ZvY3VzLmZvY3VzKCkpO1xuXHRcdFx0dGhpcy5fZWxXaXRoRm9jdXMgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG59XG4iXX0=