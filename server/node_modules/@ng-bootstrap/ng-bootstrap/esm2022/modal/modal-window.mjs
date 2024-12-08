import { DOCUMENT } from '@angular/common';
import { afterNextRender, AfterRenderPhase, Component, ElementRef, EventEmitter, inject, Injector, Input, NgZone, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { fromEvent, Subject, zip } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { getFocusableBoundaryElements } from '../util/focus-trap';
import { ModalDismissReasons } from './modal-dismiss-reasons';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { isString, reflow } from '../util/util';
import * as i0 from "@angular/core";
export class NgbModalWindow {
    constructor() {
        this._document = inject(DOCUMENT);
        this._elRef = inject((ElementRef));
        this._zone = inject(NgZone);
        this._injector = inject(Injector);
        this._closed$ = new Subject();
        this._elWithFocus = null; // element that is focused prior to modal opening
        this.backdrop = true;
        this.keyboard = true;
        this.dismissEvent = new EventEmitter();
        this.shown = new Subject();
        this.hidden = new Subject();
    }
    get fullscreenClass() {
        return this.fullscreen === true
            ? ' modal-fullscreen'
            : isString(this.fullscreen)
                ? ` modal-fullscreen-${this.fullscreen}-down`
                : '';
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
        const { nativeElement } = this._elRef;
        const context = { animation: this.animation, runningTransition: 'stop' };
        const windowTransition$ = ngbRunTransition(this._zone, nativeElement, () => nativeElement.classList.remove('show'), context);
        const dialogTransition$ = ngbRunTransition(this._zone, this._dialogEl.nativeElement, () => { }, context);
        const transitions$ = zip(windowTransition$, dialogTransition$);
        transitions$.subscribe(() => {
            this.hidden.next();
            this.hidden.complete();
        });
        this._disableEventHandling();
        this._restoreFocus();
        return transitions$;
    }
    _show() {
        const context = { animation: this.animation, runningTransition: 'continue' };
        const windowTransition$ = ngbRunTransition(this._zone, this._elRef.nativeElement, (element, animation) => {
            if (animation) {
                reflow(element);
            }
            element.classList.add('show');
        }, context);
        const dialogTransition$ = ngbRunTransition(this._zone, this._dialogEl.nativeElement, () => { }, context);
        zip(windowTransition$, dialogTransition$).subscribe(() => {
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
                            this._zone.run(() => this.dismiss(ModalDismissReasons.ESC));
                        }
                    });
                }
                else if (this.backdrop === 'static') {
                    this._bumpBackdrop();
                }
            });
            // We're listening to 'mousedown' and 'mouseup' to prevent modal from closing when pressing the mouse
            // inside the modal dialog and releasing it outside
            let preventClose = false;
            fromEvent(this._dialogEl.nativeElement, 'mousedown')
                .pipe(takeUntil(this._closed$), tap(() => (preventClose = false)), switchMap(() => fromEvent(nativeElement, 'mouseup').pipe(takeUntil(this._closed$), take(1))), filter(({ target }) => nativeElement === target))
                .subscribe(() => {
                preventClose = true;
            });
            // We're listening to 'click' to dismiss modal on modal window click, except when:
            // 1. clicking on modal dialog itself
            // 2. closing was prevented by mousedown/up handlers
            // 3. clicking on scrollbar when the viewport is too small and modal doesn't fit (click is not triggered at all)
            fromEvent(nativeElement, 'click')
                .pipe(takeUntil(this._closed$))
                .subscribe(({ target }) => {
                if (nativeElement === target) {
                    if (this.backdrop === 'static') {
                        this._bumpBackdrop();
                    }
                    else if (this.backdrop === true && !preventClose) {
                        this._zone.run(() => this.dismiss(ModalDismissReasons.BACKDROP_CLICK));
                    }
                }
                preventClose = false;
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
    _bumpBackdrop() {
        if (this.backdrop === 'static') {
            ngbRunTransition(this._zone, this._elRef.nativeElement, ({ classList }) => {
                classList.add('modal-static');
                return () => classList.remove('modal-static');
            }, { animation: this.animation, runningTransition: 'continue' });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbModalWindow, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.2", type: NgbModalWindow, isStandalone: true, selector: "ngb-modal-window", inputs: { animation: "animation", ariaLabelledBy: "ariaLabelledBy", ariaDescribedBy: "ariaDescribedBy", backdrop: "backdrop", centered: "centered", fullscreen: "fullscreen", keyboard: "keyboard", scrollable: "scrollable", size: "size", windowClass: "windowClass", modalDialogClass: "modalDialogClass" }, outputs: { dismissEvent: "dismiss" }, host: { attributes: { "role": "dialog", "tabindex": "-1" }, properties: { "class": "\"modal d-block\" + (windowClass ? \" \" + windowClass : \"\")", "class.fade": "animation", "attr.aria-modal": "true", "attr.aria-labelledby": "ariaLabelledBy", "attr.aria-describedby": "ariaDescribedBy" } }, viewQueries: [{ propertyName: "_dialogEl", first: true, predicate: ["dialog"], descendants: true, static: true }], ngImport: i0, template: `
		<div
			#dialog
			[class]="
				'modal-dialog' +
				(size ? ' modal-' + size : '') +
				(centered ? ' modal-dialog-centered' : '') +
				fullscreenClass +
				(scrollable ? ' modal-dialog-scrollable' : '') +
				(modalDialogClass ? ' ' + modalDialogClass : '')
			"
			role="document"
		>
			<div class="modal-content"><ng-content /></div>
		</div>
	`, isInline: true, styles: ["ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}\n"], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbModalWindow, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-modal-window', standalone: true, host: {
                        '[class]': '"modal d-block" + (windowClass ? " " + windowClass : "")',
                        '[class.fade]': 'animation',
                        role: 'dialog',
                        tabindex: '-1',
                        '[attr.aria-modal]': 'true',
                        '[attr.aria-labelledby]': 'ariaLabelledBy',
                        '[attr.aria-describedby]': 'ariaDescribedBy',
                    }, template: `
		<div
			#dialog
			[class]="
				'modal-dialog' +
				(size ? ' modal-' + size : '') +
				(centered ? ' modal-dialog-centered' : '') +
				fullscreenClass +
				(scrollable ? ' modal-dialog-scrollable' : '') +
				(modalDialogClass ? ' ' + modalDialogClass : '')
			"
			role="document"
		>
			<div class="modal-content"><ng-content /></div>
		</div>
	`, encapsulation: ViewEncapsulation.None, styles: ["ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}\n"] }]
        }], propDecorators: { _dialogEl: [{
                type: ViewChild,
                args: ['dialog', { static: true }]
            }], animation: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], ariaDescribedBy: [{
                type: Input
            }], backdrop: [{
                type: Input
            }], centered: [{
                type: Input
            }], fullscreen: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], scrollable: [{
                type: Input
            }], size: [{
                type: Input
            }], windowClass: [{
                type: Input
            }], modalDialogClass: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtd2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZGFsL21vZGFsLXdpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUNOLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUdOLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxTQUFTLEVBQWMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzRCxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXpFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBd0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQzs7QUFpQ2hELE1BQU0sT0FBTyxjQUFjO0lBL0IzQjtRQWdDUyxjQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLFdBQU0sR0FBRyxNQUFNLENBQUMsQ0FBQSxVQUF1QixDQUFBLENBQUMsQ0FBQztRQUN6QyxVQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFN0IsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7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QixFQUFFLE1BQU07d0JBQzNCLHdCQUF3QixFQUFFLGdCQUFnQjt3QkFDMUMseUJBQXlCLEVBQUUsaUJBQWlCO3FCQUM1QyxZQUNTOzs7Ozs7Ozs7Ozs7Ozs7RUFlVCxpQkFDYyxpQkFBaUIsQ0FBQyxJQUFJOzhCQVlVLFNBQVM7c0JBQXZELFNBQVM7dUJBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFFNUIsU0FBUztzQkFBakIsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLO2dCQUNHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFFYSxZQUFZO3NCQUE5QixNQUFNO3VCQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuXHRhZnRlck5leHRSZW5kZXIsXG5cdEFmdGVyUmVuZGVyUGhhc2UsXG5cdENvbXBvbmVudCxcblx0RWxlbWVudFJlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRpbmplY3QsXG5cdEluamVjdG9yLFxuXHRJbnB1dCxcblx0Tmdab25lLFxuXHRPbkRlc3Ryb3ksXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRWaWV3Q2hpbGQsXG5cdFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJqZWN0LCB6aXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgc3dpdGNoTWFwLCB0YWtlLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgZ2V0Rm9jdXNhYmxlQm91bmRhcnlFbGVtZW50cyB9IGZyb20gJy4uL3V0aWwvZm9jdXMtdHJhcCc7XG5pbXBvcnQgeyBNb2RhbERpc21pc3NSZWFzb25zIH0gZnJvbSAnLi9tb2RhbC1kaXNtaXNzLXJlYXNvbnMnO1xuaW1wb3J0IHsgbmdiUnVuVHJhbnNpdGlvbiwgTmdiVHJhbnNpdGlvbk9wdGlvbnMgfSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQgeyBpc1N0cmluZywgcmVmbG93IH0gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLW1vZGFsLXdpbmRvdycsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHQnW2NsYXNzXSc6ICdcIm1vZGFsIGQtYmxvY2tcIiArICh3aW5kb3dDbGFzcyA/IFwiIFwiICsgd2luZG93Q2xhc3MgOiBcIlwiKScsXG5cdFx0J1tjbGFzcy5mYWRlXSc6ICdhbmltYXRpb24nLFxuXHRcdHJvbGU6ICdkaWFsb2cnLFxuXHRcdHRhYmluZGV4OiAnLTEnLFxuXHRcdCdbYXR0ci5hcmlhLW1vZGFsXSc6ICd0cnVlJyxcblx0XHQnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdhcmlhTGFiZWxsZWRCeScsXG5cdFx0J1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ2FyaWFEZXNjcmliZWRCeScsXG5cdH0sXG5cdHRlbXBsYXRlOiBgXG5cdFx0PGRpdlxuXHRcdFx0I2RpYWxvZ1xuXHRcdFx0W2NsYXNzXT1cIlxuXHRcdFx0XHQnbW9kYWwtZGlhbG9nJyArXG5cdFx0XHRcdChzaXplID8gJyBtb2RhbC0nICsgc2l6ZSA6ICcnKSArXG5cdFx0XHRcdChjZW50ZXJlZCA/ICcgbW9kYWwtZGlhbG9nLWNlbnRlcmVkJyA6ICcnKSArXG5cdFx0XHRcdGZ1bGxzY3JlZW5DbGFzcyArXG5cdFx0XHRcdChzY3JvbGxhYmxlID8gJyBtb2RhbC1kaWFsb2ctc2Nyb2xsYWJsZScgOiAnJykgK1xuXHRcdFx0XHQobW9kYWxEaWFsb2dDbGFzcyA/ICcgJyArIG1vZGFsRGlhbG9nQ2xhc3MgOiAnJylcblx0XHRcdFwiXG5cdFx0XHRyb2xlPVwiZG9jdW1lbnRcIlxuXHRcdD5cblx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+PG5nLWNvbnRlbnQgLz48L2Rpdj5cblx0XHQ8L2Rpdj5cblx0YCxcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcblx0c3R5bGVVcmw6ICcuL21vZGFsLnNjc3MnLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbFdpbmRvdyBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblx0cHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuXHRwcml2YXRlIF9lbFJlZiA9IGluamVjdChFbGVtZW50UmVmPEhUTUxFbGVtZW50Pik7XG5cdHByaXZhdGUgX3pvbmUgPSBpbmplY3QoTmdab25lKTtcblx0cHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXG5cdHByaXZhdGUgX2Nsb3NlZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXHRwcml2YXRlIF9lbFdpdGhGb2N1czogRWxlbWVudCB8IG51bGwgPSBudWxsOyAvLyBlbGVtZW50IHRoYXQgaXMgZm9jdXNlZCBwcmlvciB0byBtb2RhbCBvcGVuaW5nXG5cblx0QFZpZXdDaGlsZCgnZGlhbG9nJywgeyBzdGF0aWM6IHRydWUgfSkgcHJpdmF0ZSBfZGlhbG9nRWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG5cdEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcblx0QElucHV0KCkgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcblx0QElucHV0KCkgYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG5cdEBJbnB1dCgpIGJhY2tkcm9wOiBib29sZWFuIHwgc3RyaW5nID0gdHJ1ZTtcblx0QElucHV0KCkgY2VudGVyZWQ6IHN0cmluZztcblx0QElucHV0KCkgZnVsbHNjcmVlbjogc3RyaW5nIHwgYm9vbGVhbjtcblx0QElucHV0KCkga2V5Ym9hcmQgPSB0cnVlO1xuXHRASW5wdXQoKSBzY3JvbGxhYmxlOiBzdHJpbmc7XG5cdEBJbnB1dCgpIHNpemU6IHN0cmluZztcblx0QElucHV0KCkgd2luZG93Q2xhc3M6IHN0cmluZztcblx0QElucHV0KCkgbW9kYWxEaWFsb2dDbGFzczogc3RyaW5nO1xuXG5cdEBPdXRwdXQoJ2Rpc21pc3MnKSBkaXNtaXNzRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0c2hvd24gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXHRoaWRkZW4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG5cdGdldCBmdWxsc2NyZWVuQ2xhc3MoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5mdWxsc2NyZWVuID09PSB0cnVlXG5cdFx0XHQ/ICcgbW9kYWwtZnVsbHNjcmVlbidcblx0XHRcdDogaXNTdHJpbmcodGhpcy5mdWxsc2NyZWVuKVxuXHRcdFx0ICA/IGAgbW9kYWwtZnVsbHNjcmVlbi0ke3RoaXMuZnVsbHNjcmVlbn0tZG93bmBcblx0XHRcdCAgOiAnJztcblx0fVxuXG5cdGRpc21pc3MocmVhc29uKTogdm9pZCB7XG5cdFx0dGhpcy5kaXNtaXNzRXZlbnQuZW1pdChyZWFzb24pO1xuXHR9XG5cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5fZWxXaXRoRm9jdXMgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdGFmdGVyTmV4dFJlbmRlcigoKSA9PiB0aGlzLl9zaG93KCksIHsgaW5qZWN0b3I6IHRoaXMuX2luamVjdG9yLCBwaGFzZTogQWZ0ZXJSZW5kZXJQaGFzZS5NaXhlZFJlYWRXcml0ZSB9KTtcblx0fVxuXG5cdG5nT25EZXN0cm95KCkge1xuXHRcdHRoaXMuX2Rpc2FibGVFdmVudEhhbmRsaW5nKCk7XG5cdH1cblxuXHRoaWRlKCk6IE9ic2VydmFibGU8YW55PiB7XG5cdFx0Y29uc3QgeyBuYXRpdmVFbGVtZW50IH0gPSB0aGlzLl9lbFJlZjtcblx0XHRjb25zdCBjb250ZXh0OiBOZ2JUcmFuc2l0aW9uT3B0aW9uczxhbnk+ID0geyBhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLCBydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnIH07XG5cblx0XHRjb25zdCB3aW5kb3dUcmFuc2l0aW9uJCA9IG5nYlJ1blRyYW5zaXRpb24oXG5cdFx0XHR0aGlzLl96b25lLFxuXHRcdFx0bmF0aXZlRWxlbWVudCxcblx0XHRcdCgpID0+IG5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLFxuXHRcdFx0Y29udGV4dCxcblx0XHQpO1xuXHRcdGNvbnN0IGRpYWxvZ1RyYW5zaXRpb24kID0gbmdiUnVuVHJhbnNpdGlvbih0aGlzLl96b25lLCB0aGlzLl9kaWFsb2dFbC5uYXRpdmVFbGVtZW50LCAoKSA9PiB7fSwgY29udGV4dCk7XG5cblx0XHRjb25zdCB0cmFuc2l0aW9ucyQgPSB6aXAod2luZG93VHJhbnNpdGlvbiQsIGRpYWxvZ1RyYW5zaXRpb24kKTtcblx0XHR0cmFuc2l0aW9ucyQuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuaGlkZGVuLm5leHQoKTtcblx0XHRcdHRoaXMuaGlkZGVuLmNvbXBsZXRlKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kaXNhYmxlRXZlbnRIYW5kbGluZygpO1xuXHRcdHRoaXMuX3Jlc3RvcmVGb2N1cygpO1xuXG5cdFx0cmV0dXJuIHRyYW5zaXRpb25zJDtcblx0fVxuXG5cdHByaXZhdGUgX3Nob3coKSB7XG5cdFx0Y29uc3QgY29udGV4dDogTmdiVHJhbnNpdGlvbk9wdGlvbnM8YW55PiA9IHsgYW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZScgfTtcblxuXHRcdGNvbnN0IHdpbmRvd1RyYW5zaXRpb24kID0gbmdiUnVuVHJhbnNpdGlvbihcblx0XHRcdHRoaXMuX3pvbmUsXG5cdFx0XHR0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBhbmltYXRpb246IGJvb2xlYW4pID0+IHtcblx0XHRcdFx0aWYgKGFuaW1hdGlvbikge1xuXHRcdFx0XHRcdHJlZmxvdyhlbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdH0sXG5cdFx0XHRjb250ZXh0LFxuXHRcdCk7XG5cdFx0Y29uc3QgZGlhbG9nVHJhbnNpdGlvbiQgPSBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2RpYWxvZ0VsLm5hdGl2ZUVsZW1lbnQsICgpID0+IHt9LCBjb250ZXh0KTtcblxuXHRcdHppcCh3aW5kb3dUcmFuc2l0aW9uJCwgZGlhbG9nVHJhbnNpdGlvbiQpLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHR0aGlzLnNob3duLm5leHQoKTtcblx0XHRcdHRoaXMuc2hvd24uY29tcGxldGUoKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuX2VuYWJsZUV2ZW50SGFuZGxpbmcoKTtcblx0XHR0aGlzLl9zZXRGb2N1cygpO1xuXHR9XG5cblx0cHJpdmF0ZSBfZW5hYmxlRXZlbnRIYW5kbGluZygpIHtcblx0XHRjb25zdCB7IG5hdGl2ZUVsZW1lbnQgfSA9IHRoaXMuX2VsUmVmO1xuXHRcdHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXHRcdFx0ZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KG5hdGl2ZUVsZW1lbnQsICdrZXlkb3duJylcblx0XHRcdFx0LnBpcGUoXG5cdFx0XHRcdFx0dGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpLFxuXHRcdFx0XHRcdGZpbHRlcigoZSkgPT4gZS5rZXkgPT09ICdFc2NhcGUnKSxcblx0XHRcdFx0KVxuXHRcdFx0XHQuc3Vic2NyaWJlKChldmVudCkgPT4ge1xuXHRcdFx0XHRcdGlmICh0aGlzLmtleWJvYXJkKSB7XG5cdFx0XHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl96b25lLnJ1bigoKSA9PiB0aGlzLmRpc21pc3MoTW9kYWxEaXNtaXNzUmVhc29ucy5FU0MpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLmJhY2tkcm9wID09PSAnc3RhdGljJykge1xuXHRcdFx0XHRcdFx0dGhpcy5fYnVtcEJhY2tkcm9wKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gV2UncmUgbGlzdGVuaW5nIHRvICdtb3VzZWRvd24nIGFuZCAnbW91c2V1cCcgdG8gcHJldmVudCBtb2RhbCBmcm9tIGNsb3Npbmcgd2hlbiBwcmVzc2luZyB0aGUgbW91c2Vcblx0XHRcdC8vIGluc2lkZSB0aGUgbW9kYWwgZGlhbG9nIGFuZCByZWxlYXNpbmcgaXQgb3V0c2lkZVxuXHRcdFx0bGV0IHByZXZlbnRDbG9zZSA9IGZhbHNlO1xuXHRcdFx0ZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KHRoaXMuX2RpYWxvZ0VsLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nKVxuXHRcdFx0XHQucGlwZShcblx0XHRcdFx0XHR0YWtlVW50aWwodGhpcy5fY2xvc2VkJCksXG5cdFx0XHRcdFx0dGFwKCgpID0+IChwcmV2ZW50Q2xvc2UgPSBmYWxzZSkpLFxuXHRcdFx0XHRcdHN3aXRjaE1hcCgoKSA9PiBmcm9tRXZlbnQ8TW91c2VFdmVudD4obmF0aXZlRWxlbWVudCwgJ21vdXNldXAnKS5waXBlKHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSwgdGFrZSgxKSkpLFxuXHRcdFx0XHRcdGZpbHRlcigoeyB0YXJnZXQgfSkgPT4gbmF0aXZlRWxlbWVudCA9PT0gdGFyZ2V0KSxcblx0XHRcdFx0KVxuXHRcdFx0XHQuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdFx0XHRwcmV2ZW50Q2xvc2UgPSB0cnVlO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gV2UncmUgbGlzdGVuaW5nIHRvICdjbGljaycgdG8gZGlzbWlzcyBtb2RhbCBvbiBtb2RhbCB3aW5kb3cgY2xpY2ssIGV4Y2VwdCB3aGVuOlxuXHRcdFx0Ly8gMS4gY2xpY2tpbmcgb24gbW9kYWwgZGlhbG9nIGl0c2VsZlxuXHRcdFx0Ly8gMi4gY2xvc2luZyB3YXMgcHJldmVudGVkIGJ5IG1vdXNlZG93bi91cCBoYW5kbGVyc1xuXHRcdFx0Ly8gMy4gY2xpY2tpbmcgb24gc2Nyb2xsYmFyIHdoZW4gdGhlIHZpZXdwb3J0IGlzIHRvbyBzbWFsbCBhbmQgbW9kYWwgZG9lc24ndCBmaXQgKGNsaWNrIGlzIG5vdCB0cmlnZ2VyZWQgYXQgYWxsKVxuXHRcdFx0ZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KG5hdGl2ZUVsZW1lbnQsICdjbGljaycpXG5cdFx0XHRcdC5waXBlKHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSlcblx0XHRcdFx0LnN1YnNjcmliZSgoeyB0YXJnZXQgfSkgPT4ge1xuXHRcdFx0XHRcdGlmIChuYXRpdmVFbGVtZW50ID09PSB0YXJnZXQpIHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmJhY2tkcm9wID09PSAnc3RhdGljJykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9idW1wQmFja2Ryb3AoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5iYWNrZHJvcCA9PT0gdHJ1ZSAmJiAhcHJldmVudENsb3NlKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3pvbmUucnVuKCgpID0+IHRoaXMuZGlzbWlzcyhNb2RhbERpc21pc3NSZWFzb25zLkJBQ0tEUk9QX0NMSUNLKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cHJldmVudENsb3NlID0gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfZGlzYWJsZUV2ZW50SGFuZGxpbmcoKSB7XG5cdFx0dGhpcy5fY2xvc2VkJC5uZXh0KCk7XG5cdH1cblxuXHRwcml2YXRlIF9zZXRGb2N1cygpIHtcblx0XHRjb25zdCB7IG5hdGl2ZUVsZW1lbnQgfSA9IHRoaXMuX2VsUmVmO1xuXHRcdGlmICghbmF0aXZlRWxlbWVudC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuXHRcdFx0Y29uc3QgYXV0b0ZvY3VzYWJsZSA9IG5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihgW25nYkF1dG9mb2N1c11gKSBhcyBIVE1MRWxlbWVudDtcblx0XHRcdGNvbnN0IGZpcnN0Rm9jdXNhYmxlID0gZ2V0Rm9jdXNhYmxlQm91bmRhcnlFbGVtZW50cyhuYXRpdmVFbGVtZW50KVswXTtcblxuXHRcdFx0Y29uc3QgZWxlbWVudFRvRm9jdXMgPSBhdXRvRm9jdXNhYmxlIHx8IGZpcnN0Rm9jdXNhYmxlIHx8IG5hdGl2ZUVsZW1lbnQ7XG5cdFx0XHRlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3Jlc3RvcmVGb2N1cygpIHtcblx0XHRjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcblx0XHRjb25zdCBlbFdpdGhGb2N1cyA9IHRoaXMuX2VsV2l0aEZvY3VzO1xuXG5cdFx0bGV0IGVsZW1lbnRUb0ZvY3VzO1xuXHRcdGlmIChlbFdpdGhGb2N1cyAmJiBlbFdpdGhGb2N1c1snZm9jdXMnXSAmJiBib2R5LmNvbnRhaW5zKGVsV2l0aEZvY3VzKSkge1xuXHRcdFx0ZWxlbWVudFRvRm9jdXMgPSBlbFdpdGhGb2N1cztcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZWxlbWVudFRvRm9jdXMgPSBib2R5O1xuXHRcdH1cblx0XHR0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4gZWxlbWVudFRvRm9jdXMuZm9jdXMoKSk7XG5cdFx0XHR0aGlzLl9lbFdpdGhGb2N1cyA9IG51bGw7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF9idW1wQmFja2Ryb3AoKSB7XG5cdFx0aWYgKHRoaXMuYmFja2Ryb3AgPT09ICdzdGF0aWMnKSB7XG5cdFx0XHRuZ2JSdW5UcmFuc2l0aW9uKFxuXHRcdFx0XHR0aGlzLl96b25lLFxuXHRcdFx0XHR0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XHQoeyBjbGFzc0xpc3QgfSkgPT4ge1xuXHRcdFx0XHRcdGNsYXNzTGlzdC5hZGQoJ21vZGFsLXN0YXRpYycpO1xuXHRcdFx0XHRcdHJldHVybiAoKSA9PiBjbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1zdGF0aWMnKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0eyBhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLCBydW5uaW5nVHJhbnNpdGlvbjogJ2NvbnRpbnVlJyB9LFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==