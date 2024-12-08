import { afterRender, AfterRenderPhase, ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, inject, Injector, Input, NgZone, Output, ViewEncapsulation, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { listenToTriggers } from '../util/triggers';
import { ngbAutoClose } from '../util/autoclose';
import { ngbPositioning } from '../util/positioning';
import { PopupService } from '../util/popup';
import { isString } from '../util/util';
import { NgbTooltipConfig } from './tooltip-config';
import { addPopperOffset } from '../util/positioning-util';
import * as i0 from "@angular/core";
let nextId = 0;
export class NgbTooltipWindow {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTooltipWindow, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.2", type: NgbTooltipWindow, isStandalone: true, selector: "ngb-tooltip-window", inputs: { animation: "animation", id: "id", tooltipClass: "tooltipClass" }, host: { attributes: { "role": "tooltip" }, properties: { "class": "\"tooltip\" + (tooltipClass ? \" \" + tooltipClass : \"\")", "class.fade": "animation", "id": "id" } }, ngImport: i0, template: `
		<div class="tooltip-arrow" data-popper-arrow></div>
		<div class="tooltip-inner">
			<ng-content />
		</div>
	`, isInline: true, styles: ["ngb-tooltip-window{pointer-events:none;position:absolute}ngb-tooltip-window .tooltip-inner{pointer-events:auto}ngb-tooltip-window.bs-tooltip-top,ngb-tooltip-window.bs-tooltip-bottom{padding-left:0;padding-right:0}ngb-tooltip-window.bs-tooltip-start,ngb-tooltip-window.bs-tooltip-end{padding-top:0;padding-bottom:0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTooltipWindow, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-tooltip-window', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        '[class]': '"tooltip" + (tooltipClass ? " " + tooltipClass : "")',
                        '[class.fade]': 'animation',
                        role: 'tooltip',
                        '[id]': 'id',
                    }, template: `
		<div class="tooltip-arrow" data-popper-arrow></div>
		<div class="tooltip-inner">
			<ng-content />
		</div>
	`, styles: ["ngb-tooltip-window{pointer-events:none;position:absolute}ngb-tooltip-window .tooltip-inner{pointer-events:auto}ngb-tooltip-window.bs-tooltip-top,ngb-tooltip-window.bs-tooltip-bottom{padding-left:0;padding-right:0}ngb-tooltip-window.bs-tooltip-start,ngb-tooltip-window.bs-tooltip-end{padding-top:0;padding-bottom:0}\n"] }]
        }], propDecorators: { animation: [{
                type: Input
            }], id: [{
                type: Input
            }], tooltipClass: [{
                type: Input
            }] } });
/**
 * A lightweight and extensible directive for fancy tooltip creation.
 */
export class NgbTooltip {
    constructor() {
        this._config = inject(NgbTooltipConfig);
        /**
         * If `true`, tooltip opening and closing will be animated.
         *
         * @since 8.0.0
         */
        this.animation = this._config.animation;
        /**
         * Indicates whether the tooltip should be closed on `Escape` key and inside/outside clicks:
         *
         * * `true` - closes on both outside and inside clicks as well as `Escape` presses
         * * `false` - disables the autoClose feature (NB: triggers still apply)
         * * `"inside"` - closes on inside clicks as well as Escape presses
         * * `"outside"` - closes on outside clicks (sometimes also achievable through triggers)
         * as well as `Escape` presses
         *
         * @since 3.0.0
         */
        this.autoClose = this._config.autoClose;
        /**
         * The preferred placement of the tooltip, among the [possible values](#/guides/positioning#api).
         *
         * The default order of preference is `"auto"`.
         *
         * Please see the [positioning overview](#/positioning) for more details.
         */
        this.placement = this._config.placement;
        /**
         * Allows to change default Popper options when positioning the tooltip.
         * Receives current popper options and returns modified ones.
         *
         * @since 13.1.0
         */
        this.popperOptions = this._config.popperOptions;
        /**
         * Specifies events that should trigger the tooltip.
         *
         * Supports a space separated list of event names.
         * For more details see the [triggers demo](#/components/tooltip/examples#triggers).
         */
        this.triggers = this._config.triggers;
        /**
         * A selector specifying the element the tooltip should be appended to.
         *
         * Currently only supports `"body"`.
         */
        this.container = this._config.container;
        /**
         * If `true`, tooltip is disabled and won't be displayed.
         *
         * @since 1.1.0
         */
        this.disableTooltip = this._config.disableTooltip;
        /**
         * An optional class applied to the tooltip window element.
         *
         * @since 3.2.0
         */
        this.tooltipClass = this._config.tooltipClass;
        /**
         * The opening delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
         *
         * @since 4.1.0
         */
        this.openDelay = this._config.openDelay;
        /**
         * The closing delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
         *
         * @since 4.1.0
         */
        this.closeDelay = this._config.closeDelay;
        /**
         * An event emitted when the tooltip opening animation has finished. Contains no payload.
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the tooltip closing animation has finished. Contains no payload.
         */
        this.hidden = new EventEmitter();
        this._nativeElement = inject(ElementRef).nativeElement;
        this._ngZone = inject(NgZone);
        this._document = inject(DOCUMENT);
        this._changeDetector = inject(ChangeDetectorRef);
        this._injector = inject(Injector);
        this._ngbTooltipWindowId = `ngb-tooltip-${nextId++}`;
        this._popupService = new PopupService(NgbTooltipWindow);
        this._windowRef = null;
        this._positioning = ngbPositioning();
    }
    /**
     * The string content or a `TemplateRef` for the content to be displayed in the tooltip.
     *
     * If the content if falsy, the tooltip won't open.
     */
    set ngbTooltip(value) {
        this._ngbTooltip = value;
        if (!value && this._windowRef) {
            this.close();
        }
    }
    get ngbTooltip() {
        return this._ngbTooltip;
    }
    /**
     * Opens the tooltip.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the tooltip template when it is created.
     */
    open(context) {
        if (!this._windowRef && this._ngbTooltip && !this.disableTooltip) {
            const { windowRef, transition$ } = this._popupService.open(this._ngbTooltip, context ?? this.tooltipContext, this.animation);
            this._windowRef = windowRef;
            this._windowRef.setInput('animation', this.animation);
            this._windowRef.setInput('tooltipClass', this.tooltipClass);
            this._windowRef.setInput('id', this._ngbTooltipWindowId);
            this._getPositionTargetElement().setAttribute('aria-describedby', this._ngbTooltipWindowId);
            if (this.container === 'body') {
                this._document.body.appendChild(this._windowRef.location.nativeElement);
            }
            // We need to detect changes, because we don't know where .open() might be called from.
            // Ex. opening tooltip from one of lifecycle hooks that run after the CD
            // (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
            this._windowRef.changeDetectorRef.detectChanges();
            // We need to mark for check, because tooltip won't work inside the OnPush component.
            // Ex. when we use expression like `{{ tooltip.isOpen() : 'opened' : 'closed' }}`
            // inside the template of an OnPush component and we change the tooltip from
            // open -> closed, the expression in question won't be updated unless we explicitly
            // mark the parent component to be checked.
            this._windowRef.changeDetectorRef.markForCheck();
            // Setting up popper and scheduling updates when zone is stable
            this._ngZone.runOutsideAngular(() => {
                this._positioning.createPopper({
                    hostElement: this._getPositionTargetElement(),
                    targetElement: this._windowRef.location.nativeElement,
                    placement: this.placement,
                    baseClass: 'bs-tooltip',
                    updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 6])(options)),
                });
                Promise.resolve().then(() => {
                    // This update is required for correct arrow placement
                    this._positioning.update();
                });
                this._afterRenderRef = afterRender(() => {
                    this._positioning.update();
                }, { phase: AfterRenderPhase.MixedReadWrite, injector: this._injector });
            });
            ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden, [this._windowRef.location.nativeElement], [this._nativeElement]);
            transition$.subscribe(() => this.shown.emit());
        }
    }
    /**
     * Closes the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    close(animation = this.animation) {
        if (this._windowRef != null) {
            this._getPositionTargetElement().removeAttribute('aria-describedby');
            this._popupService.close(animation).subscribe(() => {
                this._windowRef = null;
                this._positioning.destroy();
                this._afterRenderRef?.destroy();
                this.hidden.emit();
                this._changeDetector.markForCheck();
            });
        }
    }
    /**
     * Toggles the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns `true`, if the popover is currently shown.
     */
    isOpen() {
        return this._windowRef != null;
    }
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._nativeElement, this.triggers, this.isOpen.bind(this), this.open.bind(this), this.close.bind(this), +this.openDelay, +this.closeDelay);
    }
    ngOnChanges({ tooltipClass }) {
        if (tooltipClass && this.isOpen()) {
            this._windowRef.setInput('tooltipClass', tooltipClass.currentValue);
        }
    }
    ngOnDestroy() {
        this.close(false);
        // This check is necessary because it's possible that ngOnDestroy could be invoked before ngOnInit.
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        this._unregisterListenersFn?.();
    }
    _getPositionTargetElement() {
        return ((isString(this.positionTarget) ? this._document.querySelector(this.positionTarget) : this.positionTarget) ||
            this._nativeElement);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTooltip, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbTooltip, isStandalone: true, selector: "[ngbTooltip]", inputs: { animation: "animation", autoClose: "autoClose", placement: "placement", popperOptions: "popperOptions", triggers: "triggers", positionTarget: "positionTarget", container: "container", disableTooltip: "disableTooltip", tooltipClass: "tooltipClass", tooltipContext: "tooltipContext", openDelay: "openDelay", closeDelay: "closeDelay", ngbTooltip: "ngbTooltip" }, outputs: { shown: "shown", hidden: "hidden" }, exportAs: ["ngbTooltip"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTooltip, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbTooltip]', standalone: true, exportAs: 'ngbTooltip' }]
        }], propDecorators: { animation: [{
                type: Input
            }], autoClose: [{
                type: Input
            }], placement: [{
                type: Input
            }], popperOptions: [{
                type: Input
            }], triggers: [{
                type: Input
            }], positionTarget: [{
                type: Input
            }], container: [{
                type: Input
            }], disableTooltip: [{
                type: Input
            }], tooltipClass: [{
                type: Input
            }], tooltipContext: [{
                type: Input
            }], openDelay: [{
                type: Input
            }], closeDelay: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], ngbTooltip: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNOLFdBQVcsRUFDWCxnQkFBZ0IsRUFFaEIsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBRVQsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUlOLE1BQU0sRUFHTixpQkFBaUIsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXhDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7QUFFM0QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBcUJmLE1BQU0sT0FBTyxnQkFBZ0I7OEdBQWhCLGdCQUFnQjtrR0FBaEIsZ0JBQWdCLHFVQVBsQjs7Ozs7RUFLVDs7MkZBRVcsZ0JBQWdCO2tCQW5CNUIsU0FBUzsrQkFDQyxvQkFBb0IsY0FDbEIsSUFBSSxtQkFDQyx1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBQy9CO3dCQUNMLFNBQVMsRUFBRSxzREFBc0Q7d0JBQ2pFLGNBQWMsRUFBRSxXQUFXO3dCQUMz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QVU7c0JBQWxCLEtBQUs7Z0JBS0ksS0FBSztzQkFBZCxNQUFNO2dCQUtHLE1BQU07c0JBQWYsTUFBTTtnQkFzQkgsVUFBVTtzQkFEYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0YWZ0ZXJSZW5kZXIsXG5cdEFmdGVyUmVuZGVyUGhhc2UsXG5cdEFmdGVyUmVuZGVyUmVmLFxuXHRDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbXBvbmVudCxcblx0Q29tcG9uZW50UmVmLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0aW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25DaGFuZ2VzLFxuXHRPbkRlc3Ryb3ksXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRUZW1wbGF0ZVJlZixcblx0Vmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBsaXN0ZW5Ub1RyaWdnZXJzIH0gZnJvbSAnLi4vdXRpbC90cmlnZ2Vycyc7XG5pbXBvcnQgeyBuZ2JBdXRvQ2xvc2UgfSBmcm9tICcuLi91dGlsL2F1dG9jbG9zZSc7XG5pbXBvcnQgeyBuZ2JQb3NpdGlvbmluZyB9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHsgUG9wdXBTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7IE5nYlRvb2x0aXBDb25maWcgfSBmcm9tICcuL3Rvb2x0aXAtY29uZmlnJztcbmltcG9ydCB7IGFkZFBvcHBlck9mZnNldCB9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmctdXRpbCc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICduZ2ItdG9vbHRpcC13aW5kb3cnLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcblx0aG9zdDoge1xuXHRcdCdbY2xhc3NdJzogJ1widG9vbHRpcFwiICsgKHRvb2x0aXBDbGFzcyA/IFwiIFwiICsgdG9vbHRpcENsYXNzIDogXCJcIiknLFxuXHRcdCdbY2xhc3MuZmFkZV0nOiAnYW5pbWF0aW9uJyxcblx0XHRyb2xlOiAndG9vbHRpcCcsXG5cdFx0J1tpZF0nOiAnaWQnLFxuXHR9LFxuXHRzdHlsZVVybDogJy4vdG9vbHRpcC5zY3NzJyxcblx0dGVtcGxhdGU6IGBcblx0XHQ8ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiIGRhdGEtcG9wcGVyLWFycm93PjwvZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+XG5cdFx0XHQ8bmctY29udGVudCAvPlxuXHRcdDwvZGl2PlxuXHRgLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JUb29sdGlwV2luZG93IHtcblx0QElucHV0KCkgYW5pbWF0aW9uOiBib29sZWFuO1xuXHRASW5wdXQoKSBpZDogc3RyaW5nO1xuXHRASW5wdXQoKSB0b29sdGlwQ2xhc3M6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0IGFuZCBleHRlbnNpYmxlIGRpcmVjdGl2ZSBmb3IgZmFuY3kgdG9vbHRpcCBjcmVhdGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25nYlRvb2x0aXBdJywgc3RhbmRhbG9uZTogdHJ1ZSwgZXhwb3J0QXM6ICduZ2JUb29sdGlwJyB9KVxuZXhwb3J0IGNsYXNzIE5nYlRvb2x0aXAgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9DbG9zZTogYm9vbGVhbiB8IHN0cmluZztcblxuXHRwcml2YXRlIF9jb25maWcgPSBpbmplY3QoTmdiVG9vbHRpcENvbmZpZyk7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgdG9vbHRpcCBvcGVuaW5nIGFuZCBjbG9zaW5nIHdpbGwgYmUgYW5pbWF0ZWQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QElucHV0KCkgYW5pbWF0aW9uID0gdGhpcy5fY29uZmlnLmFuaW1hdGlvbjtcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRvb2x0aXAgc2hvdWxkIGJlIGNsb3NlZCBvbiBgRXNjYXBlYCBrZXkgYW5kIGluc2lkZS9vdXRzaWRlIGNsaWNrczpcblx0ICpcblx0ICogKiBgdHJ1ZWAgLSBjbG9zZXMgb24gYm90aCBvdXRzaWRlIGFuZCBpbnNpZGUgY2xpY2tzIGFzIHdlbGwgYXMgYEVzY2FwZWAgcHJlc3Nlc1xuXHQgKiAqIGBmYWxzZWAgLSBkaXNhYmxlcyB0aGUgYXV0b0Nsb3NlIGZlYXR1cmUgKE5COiB0cmlnZ2VycyBzdGlsbCBhcHBseSlcblx0ICogKiBgXCJpbnNpZGVcImAgLSBjbG9zZXMgb24gaW5zaWRlIGNsaWNrcyBhcyB3ZWxsIGFzIEVzY2FwZSBwcmVzc2VzXG5cdCAqICogYFwib3V0c2lkZVwiYCAtIGNsb3NlcyBvbiBvdXRzaWRlIGNsaWNrcyAoc29tZXRpbWVzIGFsc28gYWNoaWV2YWJsZSB0aHJvdWdoIHRyaWdnZXJzKVxuXHQgKiBhcyB3ZWxsIGFzIGBFc2NhcGVgIHByZXNzZXNcblx0ICpcblx0ICogQHNpbmNlIDMuMC4wXG5cdCAqL1xuXHRASW5wdXQoKSBhdXRvQ2xvc2UgPSB0aGlzLl9jb25maWcuYXV0b0Nsb3NlO1xuXG5cdC8qKlxuXHQgKiBUaGUgcHJlZmVycmVkIHBsYWNlbWVudCBvZiB0aGUgdG9vbHRpcCwgYW1vbmcgdGhlIFtwb3NzaWJsZSB2YWx1ZXNdKCMvZ3VpZGVzL3Bvc2l0aW9uaW5nI2FwaSkuXG5cdCAqXG5cdCAqIFRoZSBkZWZhdWx0IG9yZGVyIG9mIHByZWZlcmVuY2UgaXMgYFwiYXV0b1wiYC5cblx0ICpcblx0ICogUGxlYXNlIHNlZSB0aGUgW3Bvc2l0aW9uaW5nIG92ZXJ2aWV3XSgjL3Bvc2l0aW9uaW5nKSBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgKi9cblx0QElucHV0KCkgcGxhY2VtZW50ID0gdGhpcy5fY29uZmlnLnBsYWNlbWVudDtcblxuXHQvKipcblx0ICogQWxsb3dzIHRvIGNoYW5nZSBkZWZhdWx0IFBvcHBlciBvcHRpb25zIHdoZW4gcG9zaXRpb25pbmcgdGhlIHRvb2x0aXAuXG5cdCAqIFJlY2VpdmVzIGN1cnJlbnQgcG9wcGVyIG9wdGlvbnMgYW5kIHJldHVybnMgbW9kaWZpZWQgb25lcy5cblx0ICpcblx0ICogQHNpbmNlIDEzLjEuMFxuXHQgKi9cblx0QElucHV0KCkgcG9wcGVyT3B0aW9ucyA9IHRoaXMuX2NvbmZpZy5wb3BwZXJPcHRpb25zO1xuXG5cdC8qKlxuXHQgKiBTcGVjaWZpZXMgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIgdGhlIHRvb2x0aXAuXG5cdCAqXG5cdCAqIFN1cHBvcnRzIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgZXZlbnQgbmFtZXMuXG5cdCAqIEZvciBtb3JlIGRldGFpbHMgc2VlIHRoZSBbdHJpZ2dlcnMgZGVtb10oIy9jb21wb25lbnRzL3Rvb2x0aXAvZXhhbXBsZXMjdHJpZ2dlcnMpLlxuXHQgKi9cblx0QElucHV0KCkgdHJpZ2dlcnMgPSB0aGlzLl9jb25maWcudHJpZ2dlcnM7XG5cblx0LyoqXG5cdCAqIEEgY3NzIHNlbGVjdG9yIG9yIGh0bWwgZWxlbWVudCBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSB0b29sdGlwIHNob3VsZCBiZSBwb3NpdGlvbmVkIGFnYWluc3QuXG5cdCAqIEJ5IGRlZmF1bHQsIHRoZSBlbGVtZW50IGBuZ2JUb29sdGlwYCBkaXJlY3RpdmUgaXMgYXBwbGllZCB0byB3aWxsIGJlIHNldCBhcyBhIHRhcmdldC5cblx0ICpcblx0ICogQHNpbmNlIDEzLjEuMFxuXHQgKi9cblx0QElucHV0KCkgcG9zaXRpb25UYXJnZXQ/OiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcblxuXHQvKipcblx0ICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSB0b29sdGlwIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cblx0ICpcblx0ICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgYFwiYm9keVwiYC5cblx0ICovXG5cdEBJbnB1dCgpIGNvbnRhaW5lciA9IHRoaXMuX2NvbmZpZy5jb250YWluZXI7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgdG9vbHRpcCBpcyBkaXNhYmxlZCBhbmQgd29uJ3QgYmUgZGlzcGxheWVkLlxuXHQgKlxuXHQgKiBAc2luY2UgMS4xLjBcblx0ICovXG5cdEBJbnB1dCgpIGRpc2FibGVUb29sdGlwID0gdGhpcy5fY29uZmlnLmRpc2FibGVUb29sdGlwO1xuXG5cdC8qKlxuXHQgKiBBbiBvcHRpb25hbCBjbGFzcyBhcHBsaWVkIHRvIHRoZSB0b29sdGlwIHdpbmRvdyBlbGVtZW50LlxuXHQgKlxuXHQgKiBAc2luY2UgMy4yLjBcblx0ICovXG5cdEBJbnB1dCgpIHRvb2x0aXBDbGFzcyA9IHRoaXMuX2NvbmZpZy50b29sdGlwQ2xhc3M7XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgdGVtcGxhdGUgY29udGV4dCBmb3IgYFRlbXBsYXRlUmVmYCwgY2FuIGJlIG92ZXJyaWRkZW4gd2l0aCBgb3BlbmAgbWV0aG9kLlxuXHQgKlxuXHQgKiBAc2luY2UgMTUuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSB0b29sdGlwQ29udGV4dDogYW55O1xuXG5cdC8qKlxuXHQgKiBUaGUgb3BlbmluZyBkZWxheSBpbiBtcy4gV29ya3Mgb25seSBmb3IgXCJub24tbWFudWFsXCIgb3BlbmluZyB0cmlnZ2VycyBkZWZpbmVkIGJ5IHRoZSBgdHJpZ2dlcnNgIGlucHV0LlxuXHQgKlxuXHQgKiBAc2luY2UgNC4xLjBcblx0ICovXG5cdEBJbnB1dCgpIG9wZW5EZWxheSA9IHRoaXMuX2NvbmZpZy5vcGVuRGVsYXk7XG5cblx0LyoqXG5cdCAqIFRoZSBjbG9zaW5nIGRlbGF5IGluIG1zLiBXb3JrcyBvbmx5IGZvciBcIm5vbi1tYW51YWxcIiBvcGVuaW5nIHRyaWdnZXJzIGRlZmluZWQgYnkgdGhlIGB0cmlnZ2Vyc2AgaW5wdXQuXG5cdCAqXG5cdCAqIEBzaW5jZSA0LjEuMFxuXHQgKi9cblx0QElucHV0KCkgY2xvc2VEZWxheSA9IHRoaXMuX2NvbmZpZy5jbG9zZURlbGF5O1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHRvb2x0aXAgb3BlbmluZyBhbmltYXRpb24gaGFzIGZpbmlzaGVkLiBDb250YWlucyBubyBwYXlsb2FkLlxuXHQgKi9cblx0QE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHRvb2x0aXAgY2xvc2luZyBhbmltYXRpb24gaGFzIGZpbmlzaGVkLiBDb250YWlucyBubyBwYXlsb2FkLlxuXHQgKi9cblx0QE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRwcml2YXRlIF9uYXRpdmVFbGVtZW50ID0gaW5qZWN0KEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cdHByaXZhdGUgX25nWm9uZSA9IGluamVjdChOZ1pvbmUpO1xuXHRwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG5cdHByaXZhdGUgX2NoYW5nZURldGVjdG9yID0gaW5qZWN0KENoYW5nZURldGVjdG9yUmVmKTtcblx0cHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXG5cdHByaXZhdGUgX25nYlRvb2x0aXA6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXHRwcml2YXRlIF9uZ2JUb29sdGlwV2luZG93SWQgPSBgbmdiLXRvb2x0aXAtJHtuZXh0SWQrK31gO1xuXHRwcml2YXRlIF9wb3B1cFNlcnZpY2UgPSBuZXcgUG9wdXBTZXJ2aWNlKE5nYlRvb2x0aXBXaW5kb3cpO1xuXHRwcml2YXRlIF93aW5kb3dSZWY6IENvbXBvbmVudFJlZjxOZ2JUb29sdGlwV2luZG93PiB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIF91bnJlZ2lzdGVyTGlzdGVuZXJzRm47XG5cdHByaXZhdGUgX3Bvc2l0aW9uaW5nID0gbmdiUG9zaXRpb25pbmcoKTtcblx0cHJpdmF0ZSBfYWZ0ZXJSZW5kZXJSZWY6IEFmdGVyUmVuZGVyUmVmIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgc3RyaW5nIGNvbnRlbnQgb3IgYSBgVGVtcGxhdGVSZWZgIGZvciB0aGUgY29udGVudCB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIHRvb2x0aXAuXG5cdCAqXG5cdCAqIElmIHRoZSBjb250ZW50IGlmIGZhbHN5LCB0aGUgdG9vbHRpcCB3b24ndCBvcGVuLlxuXHQgKi9cblx0QElucHV0KClcblx0c2V0IG5nYlRvb2x0aXAodmFsdWU6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT4gfCBudWxsIHwgdW5kZWZpbmVkKSB7XG5cdFx0dGhpcy5fbmdiVG9vbHRpcCA9IHZhbHVlO1xuXHRcdGlmICghdmFsdWUgJiYgdGhpcy5fd2luZG93UmVmKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fVxuXHR9XG5cblx0Z2V0IG5nYlRvb2x0aXAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX25nYlRvb2x0aXA7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgdGhlIHRvb2x0aXAuXG5cdCAqXG5cdCAqIFRoaXMgaXMgY29uc2lkZXJlZCB0byBiZSBhIFwibWFudWFsXCIgdHJpZ2dlcmluZy5cblx0ICogVGhlIGBjb250ZXh0YCBpcyBhbiBvcHRpb25hbCB2YWx1ZSB0byBiZSBpbmplY3RlZCBpbnRvIHRoZSB0b29sdGlwIHRlbXBsYXRlIHdoZW4gaXQgaXMgY3JlYXRlZC5cblx0ICovXG5cdG9wZW4oY29udGV4dD86IGFueSkge1xuXHRcdGlmICghdGhpcy5fd2luZG93UmVmICYmIHRoaXMuX25nYlRvb2x0aXAgJiYgIXRoaXMuZGlzYWJsZVRvb2x0aXApIHtcblx0XHRcdGNvbnN0IHsgd2luZG93UmVmLCB0cmFuc2l0aW9uJCB9ID0gdGhpcy5fcG9wdXBTZXJ2aWNlLm9wZW4oXG5cdFx0XHRcdHRoaXMuX25nYlRvb2x0aXAsXG5cdFx0XHRcdGNvbnRleHQgPz8gdGhpcy50b29sdGlwQ29udGV4dCxcblx0XHRcdFx0dGhpcy5hbmltYXRpb24sXG5cdFx0XHQpO1xuXHRcdFx0dGhpcy5fd2luZG93UmVmID0gd2luZG93UmVmO1xuXHRcdFx0dGhpcy5fd2luZG93UmVmLnNldElucHV0KCdhbmltYXRpb24nLCB0aGlzLmFuaW1hdGlvbik7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuc2V0SW5wdXQoJ3Rvb2x0aXBDbGFzcycsIHRoaXMudG9vbHRpcENsYXNzKTtcblx0XHRcdHRoaXMuX3dpbmRvd1JlZi5zZXRJbnB1dCgnaWQnLCB0aGlzLl9uZ2JUb29sdGlwV2luZG93SWQpO1xuXG5cdFx0XHR0aGlzLl9nZXRQb3NpdGlvblRhcmdldEVsZW1lbnQoKS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aGlzLl9uZ2JUb29sdGlwV2luZG93SWQpO1xuXG5cdFx0XHRpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuXHRcdFx0XHR0aGlzLl9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX3dpbmRvd1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV2UgbmVlZCB0byBkZXRlY3QgY2hhbmdlcywgYmVjYXVzZSB3ZSBkb24ndCBrbm93IHdoZXJlIC5vcGVuKCkgbWlnaHQgYmUgY2FsbGVkIGZyb20uXG5cdFx0XHQvLyBFeC4gb3BlbmluZyB0b29sdGlwIGZyb20gb25lIG9mIGxpZmVjeWNsZSBob29rcyB0aGF0IHJ1biBhZnRlciB0aGUgQ0Rcblx0XHRcdC8vIChzYXkgZnJvbSBuZ0FmdGVyVmlld0luaXQpIHdpbGwgcmVzdWx0IGluICdFeHByZXNzaW9uSGFzQ2hhbmdlZCcgZXhjZXB0aW9uXG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG5cdFx0XHQvLyBXZSBuZWVkIHRvIG1hcmsgZm9yIGNoZWNrLCBiZWNhdXNlIHRvb2x0aXAgd29uJ3Qgd29yayBpbnNpZGUgdGhlIE9uUHVzaCBjb21wb25lbnQuXG5cdFx0XHQvLyBFeC4gd2hlbiB3ZSB1c2UgZXhwcmVzc2lvbiBsaWtlIGB7eyB0b29sdGlwLmlzT3BlbigpIDogJ29wZW5lZCcgOiAnY2xvc2VkJyB9fWBcblx0XHRcdC8vIGluc2lkZSB0aGUgdGVtcGxhdGUgb2YgYW4gT25QdXNoIGNvbXBvbmVudCBhbmQgd2UgY2hhbmdlIHRoZSB0b29sdGlwIGZyb21cblx0XHRcdC8vIG9wZW4gLT4gY2xvc2VkLCB0aGUgZXhwcmVzc2lvbiBpbiBxdWVzdGlvbiB3b24ndCBiZSB1cGRhdGVkIHVubGVzcyB3ZSBleHBsaWNpdGx5XG5cdFx0XHQvLyBtYXJrIHRoZSBwYXJlbnQgY29tcG9uZW50IHRvIGJlIGNoZWNrZWQuXG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cblx0XHRcdC8vIFNldHRpbmcgdXAgcG9wcGVyIGFuZCBzY2hlZHVsaW5nIHVwZGF0ZXMgd2hlbiB6b25lIGlzIHN0YWJsZVxuXHRcdFx0dGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuY3JlYXRlUG9wcGVyKHtcblx0XHRcdFx0XHRob3N0RWxlbWVudDogdGhpcy5fZ2V0UG9zaXRpb25UYXJnZXRFbGVtZW50KCksXG5cdFx0XHRcdFx0dGFyZ2V0RWxlbWVudDogdGhpcy5fd2luZG93UmVmIS5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XHRcdHBsYWNlbWVudDogdGhpcy5wbGFjZW1lbnQsXG5cdFx0XHRcdFx0YmFzZUNsYXNzOiAnYnMtdG9vbHRpcCcsXG5cdFx0XHRcdFx0dXBkYXRlUG9wcGVyT3B0aW9uczogKG9wdGlvbnMpID0+IHRoaXMucG9wcGVyT3B0aW9ucyhhZGRQb3BwZXJPZmZzZXQoWzAsIDZdKShvcHRpb25zKSksXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdC8vIFRoaXMgdXBkYXRlIGlzIHJlcXVpcmVkIGZvciBjb3JyZWN0IGFycm93IHBsYWNlbWVudFxuXHRcdFx0XHRcdHRoaXMuX3Bvc2l0aW9uaW5nLnVwZGF0ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5fYWZ0ZXJSZW5kZXJSZWYgPSBhZnRlclJlbmRlcihcblx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl9wb3NpdGlvbmluZy51cGRhdGUoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHsgcGhhc2U6IEFmdGVyUmVuZGVyUGhhc2UuTWl4ZWRSZWFkV3JpdGUsIGluamVjdG9yOiB0aGlzLl9pbmplY3RvciB9LFxuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG5nYkF1dG9DbG9zZShcblx0XHRcdFx0dGhpcy5fbmdab25lLFxuXHRcdFx0XHR0aGlzLl9kb2N1bWVudCxcblx0XHRcdFx0dGhpcy5hdXRvQ2xvc2UsXG5cdFx0XHRcdCgpID0+IHRoaXMuY2xvc2UoKSxcblx0XHRcdFx0dGhpcy5oaWRkZW4sXG5cdFx0XHRcdFt0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudF0sXG5cdFx0XHRcdFt0aGlzLl9uYXRpdmVFbGVtZW50XSxcblx0XHRcdCk7XG5cblx0XHRcdHRyYW5zaXRpb24kLnN1YnNjcmliZSgoKSA9PiB0aGlzLnNob3duLmVtaXQoKSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlcyB0aGUgdG9vbHRpcC5cblx0ICpcblx0ICogVGhpcyBpcyBjb25zaWRlcmVkIHRvIGJlIGEgXCJtYW51YWxcIiB0cmlnZ2VyaW5nIG9mIHRoZSB0b29sdGlwLlxuXHQgKi9cblx0Y2xvc2UoYW5pbWF0aW9uID0gdGhpcy5hbmltYXRpb24pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2luZG93UmVmICE9IG51bGwpIHtcblx0XHRcdHRoaXMuX2dldFBvc2l0aW9uVGFyZ2V0RWxlbWVudCgpLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuXHRcdFx0dGhpcy5fcG9wdXBTZXJ2aWNlLmNsb3NlKGFuaW1hdGlvbikuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fd2luZG93UmVmID0gbnVsbDtcblx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuZGVzdHJveSgpO1xuXHRcdFx0XHR0aGlzLl9hZnRlclJlbmRlclJlZj8uZGVzdHJveSgpO1xuXHRcdFx0XHR0aGlzLmhpZGRlbi5lbWl0KCk7XG5cdFx0XHRcdHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgdGhlIHRvb2x0aXAuXG5cdCAqXG5cdCAqIFRoaXMgaXMgY29uc2lkZXJlZCB0byBiZSBhIFwibWFudWFsXCIgdHJpZ2dlcmluZyBvZiB0aGUgdG9vbHRpcC5cblx0ICovXG5cdHRvZ2dsZSgpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2luZG93UmVmKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3BlbigpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGB0cnVlYCwgaWYgdGhlIHBvcG92ZXIgaXMgY3VycmVudGx5IHNob3duLlxuXHQgKi9cblx0aXNPcGVuKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDtcblx0fVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbiA9IGxpc3RlblRvVHJpZ2dlcnMoXG5cdFx0XHR0aGlzLl9uYXRpdmVFbGVtZW50LFxuXHRcdFx0dGhpcy50cmlnZ2Vycyxcblx0XHRcdHRoaXMuaXNPcGVuLmJpbmQodGhpcyksXG5cdFx0XHR0aGlzLm9wZW4uYmluZCh0aGlzKSxcblx0XHRcdHRoaXMuY2xvc2UuYmluZCh0aGlzKSxcblx0XHRcdCt0aGlzLm9wZW5EZWxheSxcblx0XHRcdCt0aGlzLmNsb3NlRGVsYXksXG5cdFx0KTtcblx0fVxuXG5cdG5nT25DaGFuZ2VzKHsgdG9vbHRpcENsYXNzIH06IFNpbXBsZUNoYW5nZXMpIHtcblx0XHRpZiAodG9vbHRpcENsYXNzICYmIHRoaXMuaXNPcGVuKCkpIHtcblx0XHRcdHRoaXMuX3dpbmRvd1JlZiEuc2V0SW5wdXQoJ3Rvb2x0aXBDbGFzcycsIHRvb2x0aXBDbGFzcy5jdXJyZW50VmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdG5nT25EZXN0cm95KCkge1xuXHRcdHRoaXMuY2xvc2UoZmFsc2UpO1xuXHRcdC8vIFRoaXMgY2hlY2sgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgaXQncyBwb3NzaWJsZSB0aGF0IG5nT25EZXN0cm95IGNvdWxkIGJlIGludm9rZWQgYmVmb3JlIG5nT25Jbml0LlxuXHRcdC8vIHVuZGVyIGNlcnRhaW4gY29uZGl0aW9ucywgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjE5OVxuXHRcdHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbj8uKCk7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRQb3NpdGlvblRhcmdldEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuXHRcdHJldHVybiAoXG5cdFx0XHQoaXNTdHJpbmcodGhpcy5wb3NpdGlvblRhcmdldCkgPyB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMucG9zaXRpb25UYXJnZXQpIDogdGhpcy5wb3NpdGlvblRhcmdldCkgfHxcblx0XHRcdHRoaXMuX25hdGl2ZUVsZW1lbnRcblx0XHQpO1xuXHR9XG59XG4iXX0=