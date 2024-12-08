import { afterRender, AfterRenderPhase, ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, inject, Injector, Input, NgZone, Output, TemplateRef, ViewEncapsulation, } from '@angular/core';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { listenToTriggers } from '../util/triggers';
import { ngbAutoClose } from '../util/autoclose';
import { ngbPositioning } from '../util/positioning';
import { PopupService } from '../util/popup';
import { isString } from '../util/util';
import { NgbPopoverConfig } from './popover-config';
import { addPopperOffset } from '../util/positioning-util';
import * as i0 from "@angular/core";
let nextId = 0;
export class NgbPopoverWindow {
    isTitleTemplate() {
        return this.title instanceof TemplateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbPopoverWindow, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.2", type: NgbPopoverWindow, isStandalone: true, selector: "ngb-popover-window", inputs: { animation: "animation", title: "title", id: "id", popoverClass: "popoverClass", context: "context" }, host: { attributes: { "role": "tooltip" }, properties: { "class": "\"popover\" + (popoverClass ? \" \" + popoverClass : \"\")", "class.fade": "animation", "id": "id" }, styleAttribute: "position: absolute;" }, ngImport: i0, template: `
		<div class="popover-arrow" data-popper-arrow></div>
		@if (title) {
			<h3 class="popover-header">
				<ng-template #simpleTitle>{{ title }}</ng-template>
				<ng-template
					[ngTemplateOutlet]="isTitleTemplate() ? $any(title) : simpleTitle"
					[ngTemplateOutletContext]="context"
				/>
			</h3>
		}
		<div class="popover-body">
			<ng-content />
		</div>
	`, isInline: true, dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbPopoverWindow, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-popover-window',
                    standalone: true,
                    imports: [NgTemplateOutlet],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class]': '"popover" + (popoverClass ? " " + popoverClass : "")',
                        '[class.fade]': 'animation',
                        role: 'tooltip',
                        '[id]': 'id',
                        style: 'position: absolute;',
                    },
                    template: `
		<div class="popover-arrow" data-popper-arrow></div>
		@if (title) {
			<h3 class="popover-header">
				<ng-template #simpleTitle>{{ title }}</ng-template>
				<ng-template
					[ngTemplateOutlet]="isTitleTemplate() ? $any(title) : simpleTitle"
					[ngTemplateOutletContext]="context"
				/>
			</h3>
		}
		<div class="popover-body">
			<ng-content />
		</div>
	`,
                }]
        }], propDecorators: { animation: [{
                type: Input
            }], title: [{
                type: Input
            }], id: [{
                type: Input
            }], popoverClass: [{
                type: Input
            }], context: [{
                type: Input
            }] } });
/**
 * A lightweight and extensible directive for fancy popover creation.
 */
export class NgbPopover {
    constructor() {
        this._config = inject(NgbPopoverConfig);
        /**
         * If `true`, popover opening and closing will be animated.
         *
         * @since 8.0.0
         */
        this.animation = this._config.animation;
        /**
         * Indicates whether the popover should be closed on `Escape` key and inside/outside clicks:
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
         * The preferred placement of the popover, among the [possible values](#/guides/positioning#api).
         *
         * The default order of preference is `"auto"`.
         *
         * Please see the [positioning overview](#/positioning) for more details.
         */
        this.placement = this._config.placement;
        /**
         * Allows to change default Popper options when positioning the popover.
         * Receives current popper options and returns modified ones.
         *
         * @since 13.1.0
         */
        this.popperOptions = this._config.popperOptions;
        /**
         * Specifies events that should trigger the tooltip.
         *
         * Supports a space separated list of event names.
         * For more details see the [triggers demo](#/components/popover/examples#triggers).
         */
        this.triggers = this._config.triggers;
        /**
         * A selector specifying the element the popover should be appended to.
         *
         * Currently only supports `body`.
         */
        this.container = this._config.container;
        /**
         * If `true`, popover is disabled and won't be displayed.
         *
         * @since 1.1.0
         */
        this.disablePopover = this._config.disablePopover;
        /**
         * An optional class applied to the popover window element.
         *
         * @since 2.2.0
         */
        this.popoverClass = this._config.popoverClass;
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
         * An event emitted when the popover opening animation has finished. Contains no payload.
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the popover closing animation has finished. Contains no payload.
         *
         * At this point popover is not in the DOM anymore.
         */
        this.hidden = new EventEmitter();
        this._nativeElement = inject(ElementRef).nativeElement;
        this._ngZone = inject(NgZone);
        this._document = inject(DOCUMENT);
        this._changeDetector = inject(ChangeDetectorRef);
        this._injector = inject(Injector);
        this._ngbPopoverWindowId = `ngb-popover-${nextId++}`;
        this._popupService = new PopupService(NgbPopoverWindow);
        this._windowRef = null;
        this._positioning = ngbPositioning();
    }
    /**
     * Opens the popover.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the popover template when it is created.
     */
    open(context) {
        if (!this._windowRef && !this._isDisabled()) {
            // this type assertion is safe because otherwise _isDisabled would return true
            const { windowRef, transition$ } = this._popupService.open(this.ngbPopover, context ?? this.popoverContext, this.animation);
            this._windowRef = windowRef;
            this._windowRef.setInput('animation', this.animation);
            this._windowRef.setInput('title', this.popoverTitle);
            this._windowRef.setInput('context', context ?? this.popoverContext);
            this._windowRef.setInput('popoverClass', this.popoverClass);
            this._windowRef.setInput('id', this._ngbPopoverWindowId);
            this._getPositionTargetElement().setAttribute('aria-describedby', this._ngbPopoverWindowId);
            if (this.container === 'body') {
                this._document.body.appendChild(this._windowRef.location.nativeElement);
            }
            // We need to detect changes, because we don't know where .open() might be called from.
            // Ex. opening popover from one of lifecycle hooks that run after the CD
            // (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
            this._windowRef.changeDetectorRef.detectChanges();
            // We need to mark for check, because popover won't work inside the OnPush component.
            // Ex. when we use expression like `{{ popover.isOpen() : 'opened' : 'closed' }}`
            // inside the template of an OnPush component and we change the popover from
            // open -> closed, the expression in question won't be updated unless we explicitly
            // mark the parent component to be checked.
            this._windowRef.changeDetectorRef.markForCheck();
            // Setting up popper and scheduling updates when zone is stable
            this._ngZone.runOutsideAngular(() => {
                this._positioning.createPopper({
                    hostElement: this._getPositionTargetElement(),
                    targetElement: this._windowRef.location.nativeElement,
                    placement: this.placement,
                    baseClass: 'bs-popover',
                    updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 8])(options)),
                });
                Promise.resolve().then(() => {
                    // This update is required for correct arrow placement
                    this._positioning.update();
                });
                this._afterRenderRef = afterRender(() => {
                    this._positioning.update();
                }, { phase: AfterRenderPhase.MixedReadWrite, injector: this._injector });
            });
            ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden, [
                this._windowRef.location.nativeElement,
            ]);
            transition$.subscribe(() => this.shown.emit());
        }
    }
    /**
     * Closes the popover.
     *
     * This is considered to be a "manual" triggering of the popover.
     */
    close(animation = this.animation) {
        if (this._windowRef) {
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
     * Toggles the popover.
     *
     * This is considered to be a "manual" triggering of the popover.
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
    ngOnChanges({ ngbPopover, popoverTitle, disablePopover, popoverClass }) {
        if (popoverClass && this.isOpen()) {
            this._windowRef.setInput('popoverClass', popoverClass.currentValue);
        }
        // close popover if title and content become empty, or disablePopover set to true
        if ((ngbPopover || popoverTitle || disablePopover) && this._isDisabled()) {
            this.close();
        }
    }
    ngOnDestroy() {
        this.close(false);
        // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        this._unregisterListenersFn?.();
    }
    _isDisabled() {
        return this.disablePopover ? true : !this.ngbPopover && !this.popoverTitle;
    }
    _getPositionTargetElement() {
        return ((isString(this.positionTarget) ? this._document.querySelector(this.positionTarget) : this.positionTarget) ||
            this._nativeElement);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbPopover, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbPopover, isStandalone: true, selector: "[ngbPopover]", inputs: { animation: "animation", autoClose: "autoClose", ngbPopover: "ngbPopover", popoverTitle: "popoverTitle", placement: "placement", popperOptions: "popperOptions", triggers: "triggers", positionTarget: "positionTarget", container: "container", disablePopover: "disablePopover", popoverClass: "popoverClass", popoverContext: "popoverContext", openDelay: "openDelay", closeDelay: "closeDelay" }, outputs: { shown: "shown", hidden: "hidden" }, exportAs: ["ngbPopover"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbPopover, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbPopover]', exportAs: 'ngbPopover', standalone: true }]
        }], propDecorators: { animation: [{
                type: Input
            }], autoClose: [{
                type: Input
            }], ngbPopover: [{
                type: Input
            }], popoverTitle: [{
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
            }], disablePopover: [{
                type: Input
            }], popoverClass: [{
                type: Input
            }], popoverContext: [{
                type: Input
            }], openDelay: [{
                type: Input
            }], closeDelay: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3BvdmVyL3BvcG92ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNOLFdBQVcsRUFDWCxnQkFBZ0IsRUFFaEIsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBRVQsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUlOLE1BQU0sRUFFTixXQUFXLEVBQ1gsaUJBQWlCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUU3RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV4QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVwRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7O0FBRTNELElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQStCZixNQUFNLE9BQU8sZ0JBQWdCO0lBTzVCLGVBQWU7UUFDZCxPQUFPLElBQUksQ0FBQyxLQUFLLFlBQVksV0FBVyxDQUFDO0lBQzFDLENBQUM7OEdBVFcsZ0JBQWdCO2tHQUFoQixnQkFBZ0IsZ1pBaEJsQjs7Ozs7Ozs7Ozs7Ozs7RUFjVCw0REF4QlMsZ0JBQWdCOzsyRkEwQmQsZ0JBQWdCO2tCQTdCNUIsU0FBUzttQkFBQztvQkFDVixRQUFRLEVB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Q0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUN6RyxJQUFJLENBQUMsY0FBYyxDQUNuQixDQUFDO0lBQ0gsQ0FBQzs4R0E1UlcsVUFBVTtrR0FBVixVQUFVOzsyRkFBVixVQUFVO2tCQUR0QixTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7OEJBV3ZFLFNBQVM7c0JBQWpCLEtBQUs7Z0JBYUcsU0FBUztzQkFBakIsS0FBSztnQkFPRyxVQUFVO3NCQUFsQixLQUFLO2dCQU9HLFlBQVk7c0JBQXBCLEtBQUs7Z0JBU0csU0FBUztzQkFBakIsS0FBSztnQkFRRyxhQUFhO3NCQUFyQixLQUFLO2dCQVFHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBUUcsY0FBYztzQkFBdEIsS0FBSztnQkFPRyxTQUFTO3NCQUFqQixLQUFLO2dCQU9HLGNBQWM7c0JBQXRCLEtBQUs7Z0JBT0csWUFBWTtzQkFBcEIsS0FBSztnQkFPRyxjQUFjO3NCQUF0QixLQUFLO2dCQU9HLFNBQVM7c0JBQWpCLEtBQUs7Z0JBT0csVUFBVTtzQkFBbEIsS0FBSztnQkFLSSxLQUFLO3NCQUFkLE1BQU07Z0JBT0csTUFBTTtzQkFBZixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0YWZ0ZXJSZW5kZXIsXG5cdEFmdGVyUmVuZGVyUGhhc2UsXG5cdEFmdGVyUmVuZGVyUmVmLFxuXHRDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbXBvbmVudCxcblx0Q29tcG9uZW50UmVmLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0aW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25DaGFuZ2VzLFxuXHRPbkRlc3Ryb3ksXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRUZW1wbGF0ZVJlZixcblx0Vmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQsIE5nVGVtcGxhdGVPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBsaXN0ZW5Ub1RyaWdnZXJzIH0gZnJvbSAnLi4vdXRpbC90cmlnZ2Vycyc7XG5pbXBvcnQgeyBuZ2JBdXRvQ2xvc2UgfSBmcm9tICcuLi91dGlsL2F1dG9jbG9zZSc7XG5pbXBvcnQgeyBuZ2JQb3NpdGlvbmluZyB9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHsgUG9wdXBTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7IE5nYlBvcG92ZXJDb25maWcgfSBmcm9tICcuL3BvcG92ZXItY29uZmlnJztcblxuaW1wb3J0IHsgYWRkUG9wcGVyT2Zmc2V0IH0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZy11dGlsJztcblxubGV0IG5leHRJZCA9IDA7XG5cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25nYi1wb3BvdmVyLXdpbmRvdycsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGltcG9ydHM6IFtOZ1RlbXBsYXRlT3V0bGV0XSxcblx0Y2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG5cdGhvc3Q6IHtcblx0XHQnW2NsYXNzXSc6ICdcInBvcG92ZXJcIiArIChwb3BvdmVyQ2xhc3MgPyBcIiBcIiArIHBvcG92ZXJDbGFzcyA6IFwiXCIpJyxcblx0XHQnW2NsYXNzLmZhZGVdJzogJ2FuaW1hdGlvbicsXG5cdFx0cm9sZTogJ3Rvb2x0aXAnLFxuXHRcdCdbaWRdJzogJ2lkJyxcblx0XHRzdHlsZTogJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsnLFxuXHR9LFxuXHR0ZW1wbGF0ZTogYFxuXHRcdDxkaXYgY2xhc3M9XCJwb3BvdmVyLWFycm93XCIgZGF0YS1wb3BwZXItYXJyb3c+PC9kaXY+XG5cdFx0QGlmICh0aXRsZSkge1xuXHRcdFx0PGgzIGNsYXNzPVwicG9wb3Zlci1oZWFkZXJcIj5cblx0XHRcdFx0PG5nLXRlbXBsYXRlICNzaW1wbGVUaXRsZT57eyB0aXRsZSB9fTwvbmctdGVtcGxhdGU+XG5cdFx0XHRcdDxuZy10ZW1wbGF0ZVxuXHRcdFx0XHRcdFtuZ1RlbXBsYXRlT3V0bGV0XT1cImlzVGl0bGVUZW1wbGF0ZSgpID8gJGFueSh0aXRsZSkgOiBzaW1wbGVUaXRsZVwiXG5cdFx0XHRcdFx0W25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImNvbnRleHRcIlxuXHRcdFx0XHQvPlxuXHRcdFx0PC9oMz5cblx0XHR9XG5cdFx0PGRpdiBjbGFzcz1cInBvcG92ZXItYm9keVwiPlxuXHRcdFx0PG5nLWNvbnRlbnQgLz5cblx0XHQ8L2Rpdj5cblx0YCxcbn0pXG5leHBvcnQgY2xhc3MgTmdiUG9wb3ZlcldpbmRvdyB7XG5cdEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcblx0QElucHV0KCkgdGl0bGU6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXHRASW5wdXQoKSBpZDogc3RyaW5nO1xuXHRASW5wdXQoKSBwb3BvdmVyQ2xhc3M6IHN0cmluZztcblx0QElucHV0KCkgY29udGV4dDogYW55O1xuXG5cdGlzVGl0bGVUZW1wbGF0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy50aXRsZSBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmO1xuXHR9XG59XG5cbi8qKlxuICogQSBsaWdodHdlaWdodCBhbmQgZXh0ZW5zaWJsZSBkaXJlY3RpdmUgZm9yIGZhbmN5IHBvcG92ZXIgY3JlYXRpb24uXG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ2JQb3BvdmVyXScsIGV4cG9ydEFzOiAnbmdiUG9wb3ZlcicsIHN0YW5kYWxvbmU6IHRydWUgfSlcbmV4cG9ydCBjbGFzcyBOZ2JQb3BvdmVyIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG5cdHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvQ2xvc2U6IGJvb2xlYW4gfCBzdHJpbmc7XG5cblx0cHJpdmF0ZSBfY29uZmlnID0gaW5qZWN0KE5nYlBvcG92ZXJDb25maWcpO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHBvcG92ZXIgb3BlbmluZyBhbmQgY2xvc2luZyB3aWxsIGJlIGFuaW1hdGVkLlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdEBJbnB1dCgpIGFuaW1hdGlvbiA9IHRoaXMuX2NvbmZpZy5hbmltYXRpb247XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBwb3BvdmVyIHNob3VsZCBiZSBjbG9zZWQgb24gYEVzY2FwZWAga2V5IGFuZCBpbnNpZGUvb3V0c2lkZSBjbGlja3M6XG5cdCAqXG5cdCAqICogYHRydWVgIC0gY2xvc2VzIG9uIGJvdGggb3V0c2lkZSBhbmQgaW5zaWRlIGNsaWNrcyBhcyB3ZWxsIGFzIGBFc2NhcGVgIHByZXNzZXNcblx0ICogKiBgZmFsc2VgIC0gZGlzYWJsZXMgdGhlIGF1dG9DbG9zZSBmZWF0dXJlIChOQjogdHJpZ2dlcnMgc3RpbGwgYXBwbHkpXG5cdCAqICogYFwiaW5zaWRlXCJgIC0gY2xvc2VzIG9uIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuXHQgKiAqIGBcIm91dHNpZGVcImAgLSBjbG9zZXMgb24gb3V0c2lkZSBjbGlja3MgKHNvbWV0aW1lcyBhbHNvIGFjaGlldmFibGUgdGhyb3VnaCB0cmlnZ2Vycylcblx0ICogYXMgd2VsbCBhcyBgRXNjYXBlYCBwcmVzc2VzXG5cdCAqXG5cdCAqIEBzaW5jZSAzLjAuMFxuXHQgKi9cblx0QElucHV0KCkgYXV0b0Nsb3NlID0gdGhpcy5fY29uZmlnLmF1dG9DbG9zZTtcblxuXHQvKipcblx0ICogVGhlIHN0cmluZyBjb250ZW50IG9yIGEgYFRlbXBsYXRlUmVmYCBmb3IgdGhlIGNvbnRlbnQgdG8gYmUgZGlzcGxheWVkIGluIHRoZSBwb3BvdmVyLlxuXHQgKlxuXHQgKiBJZiB0aGUgdGl0bGUgYW5kIHRoZSBjb250ZW50IGFyZSBmYWxzeSwgdGhlIHBvcG92ZXIgd29uJ3Qgb3Blbi5cblx0ICovXG5cdEBJbnB1dCgpIG5nYlBvcG92ZXI6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgdGl0bGUgb2YgdGhlIHBvcG92ZXIuXG5cdCAqXG5cdCAqIElmIHRoZSB0aXRsZSBhbmQgdGhlIGNvbnRlbnQgYXJlIGZhbHN5LCB0aGUgcG9wb3ZlciB3b24ndCBvcGVuLlxuXHQgKi9cblx0QElucHV0KCkgcG9wb3ZlclRpdGxlOiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuXHQvKipcblx0ICogVGhlIHByZWZlcnJlZCBwbGFjZW1lbnQgb2YgdGhlIHBvcG92ZXIsIGFtb25nIHRoZSBbcG9zc2libGUgdmFsdWVzXSgjL2d1aWRlcy9wb3NpdGlvbmluZyNhcGkpLlxuXHQgKlxuXHQgKiBUaGUgZGVmYXVsdCBvcmRlciBvZiBwcmVmZXJlbmNlIGlzIGBcImF1dG9cImAuXG5cdCAqXG5cdCAqIFBsZWFzZSBzZWUgdGhlIFtwb3NpdGlvbmluZyBvdmVydmlld10oIy9wb3NpdGlvbmluZykgZm9yIG1vcmUgZGV0YWlscy5cblx0ICovXG5cdEBJbnB1dCgpIHBsYWNlbWVudCA9IHRoaXMuX2NvbmZpZy5wbGFjZW1lbnQ7XG5cblx0LyoqXG5cdCAqIEFsbG93cyB0byBjaGFuZ2UgZGVmYXVsdCBQb3BwZXIgb3B0aW9ucyB3aGVuIHBvc2l0aW9uaW5nIHRoZSBwb3BvdmVyLlxuXHQgKiBSZWNlaXZlcyBjdXJyZW50IHBvcHBlciBvcHRpb25zIGFuZCByZXR1cm5zIG1vZGlmaWVkIG9uZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxMy4xLjBcblx0ICovXG5cdEBJbnB1dCgpIHBvcHBlck9wdGlvbnMgPSB0aGlzLl9jb25maWcucG9wcGVyT3B0aW9ucztcblxuXHQvKipcblx0ICogU3BlY2lmaWVzIGV2ZW50cyB0aGF0IHNob3VsZCB0cmlnZ2VyIHRoZSB0b29sdGlwLlxuXHQgKlxuXHQgKiBTdXBwb3J0cyBhIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGV2ZW50IG5hbWVzLlxuXHQgKiBGb3IgbW9yZSBkZXRhaWxzIHNlZSB0aGUgW3RyaWdnZXJzIGRlbW9dKCMvY29tcG9uZW50cy9wb3BvdmVyL2V4YW1wbGVzI3RyaWdnZXJzKS5cblx0ICovXG5cdEBJbnB1dCgpIHRyaWdnZXJzID0gdGhpcy5fY29uZmlnLnRyaWdnZXJzO1xuXG5cdC8qKlxuXHQgKiBBIGNzcyBzZWxlY3RvciBvciBodG1sIGVsZW1lbnQgc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgcG9wb3ZlciBzaG91bGQgYmUgcG9zaXRpb25lZCBhZ2FpbnN0LlxuXHQgKiBCeSBkZWZhdWx0LCB0aGUgZWxlbWVudCBgbmdiUG9wb3ZlcmAgZGlyZWN0aXZlIGlzIGFwcGxpZWQgdG8gd2lsbCBiZSBzZXQgYXMgYSB0YXJnZXQuXG5cdCAqXG5cdCAqIEBzaW5jZSAxMy4xLjBcblx0ICovXG5cdEBJbnB1dCgpIHBvc2l0aW9uVGFyZ2V0Pzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG5cblx0LyoqXG5cdCAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgcG9wb3ZlciBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG5cdCAqXG5cdCAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIGBib2R5YC5cblx0ICovXG5cdEBJbnB1dCgpIGNvbnRhaW5lciA9IHRoaXMuX2NvbmZpZy5jb250YWluZXI7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgcG9wb3ZlciBpcyBkaXNhYmxlZCBhbmQgd29uJ3QgYmUgZGlzcGxheWVkLlxuXHQgKlxuXHQgKiBAc2luY2UgMS4xLjBcblx0ICovXG5cdEBJbnB1dCgpIGRpc2FibGVQb3BvdmVyID0gdGhpcy5fY29uZmlnLmRpc2FibGVQb3BvdmVyO1xuXG5cdC8qKlxuXHQgKiBBbiBvcHRpb25hbCBjbGFzcyBhcHBsaWVkIHRvIHRoZSBwb3BvdmVyIHdpbmRvdyBlbGVtZW50LlxuXHQgKlxuXHQgKiBAc2luY2UgMi4yLjBcblx0ICovXG5cdEBJbnB1dCgpIHBvcG92ZXJDbGFzcyA9IHRoaXMuX2NvbmZpZy5wb3BvdmVyQ2xhc3M7XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgdGVtcGxhdGUgY29udGV4dCBmb3IgYFRlbXBsYXRlUmVmYCwgY2FuIGJlIG92ZXJyaWRkZW4gd2l0aCBgb3BlbmAgbWV0aG9kLlxuXHQgKlxuXHQgKiBAc2luY2UgMTUuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBwb3BvdmVyQ29udGV4dDogYW55O1xuXG5cdC8qKlxuXHQgKiBUaGUgb3BlbmluZyBkZWxheSBpbiBtcy4gV29ya3Mgb25seSBmb3IgXCJub24tbWFudWFsXCIgb3BlbmluZyB0cmlnZ2VycyBkZWZpbmVkIGJ5IHRoZSBgdHJpZ2dlcnNgIGlucHV0LlxuXHQgKlxuXHQgKiBAc2luY2UgNC4xLjBcblx0ICovXG5cdEBJbnB1dCgpIG9wZW5EZWxheSA9IHRoaXMuX2NvbmZpZy5vcGVuRGVsYXk7XG5cblx0LyoqXG5cdCAqIFRoZSBjbG9zaW5nIGRlbGF5IGluIG1zLiBXb3JrcyBvbmx5IGZvciBcIm5vbi1tYW51YWxcIiBvcGVuaW5nIHRyaWdnZXJzIGRlZmluZWQgYnkgdGhlIGB0cmlnZ2Vyc2AgaW5wdXQuXG5cdCAqXG5cdCAqIEBzaW5jZSA0LjEuMFxuXHQgKi9cblx0QElucHV0KCkgY2xvc2VEZWxheSA9IHRoaXMuX2NvbmZpZy5jbG9zZURlbGF5O1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHBvcG92ZXIgb3BlbmluZyBhbmltYXRpb24gaGFzIGZpbmlzaGVkLiBDb250YWlucyBubyBwYXlsb2FkLlxuXHQgKi9cblx0QE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHBvcG92ZXIgY2xvc2luZyBhbmltYXRpb24gaGFzIGZpbmlzaGVkLiBDb250YWlucyBubyBwYXlsb2FkLlxuXHQgKlxuXHQgKiBBdCB0aGlzIHBvaW50IHBvcG92ZXIgaXMgbm90IGluIHRoZSBET00gYW55bW9yZS5cblx0ICovXG5cdEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblx0cHJpdmF0ZSBfbmF0aXZlRWxlbWVudCA9IGluamVjdChFbGVtZW50UmVmKS5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXHRwcml2YXRlIF9uZ1pvbmUgPSBpbmplY3QoTmdab25lKTtcblx0cHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuXHRwcml2YXRlIF9jaGFuZ2VEZXRlY3RvciA9IGluamVjdChDaGFuZ2VEZXRlY3RvclJlZik7XG5cdHByaXZhdGUgX2luamVjdG9yID0gaW5qZWN0KEluamVjdG9yKTtcblxuXHRwcml2YXRlIF9uZ2JQb3BvdmVyV2luZG93SWQgPSBgbmdiLXBvcG92ZXItJHtuZXh0SWQrK31gO1xuXHRwcml2YXRlIF9wb3B1cFNlcnZpY2UgPSBuZXcgUG9wdXBTZXJ2aWNlKE5nYlBvcG92ZXJXaW5kb3cpO1xuXHRwcml2YXRlIF93aW5kb3dSZWY6IENvbXBvbmVudFJlZjxOZ2JQb3BvdmVyV2luZG93PiB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIF91bnJlZ2lzdGVyTGlzdGVuZXJzRm47XG5cdHByaXZhdGUgX3Bvc2l0aW9uaW5nID0gbmdiUG9zaXRpb25pbmcoKTtcblx0cHJpdmF0ZSBfYWZ0ZXJSZW5kZXJSZWY6IEFmdGVyUmVuZGVyUmVmO1xuXG5cdC8qKlxuXHQgKiBPcGVucyB0aGUgcG9wb3Zlci5cblx0ICpcblx0ICogVGhpcyBpcyBjb25zaWRlcmVkIHRvIGJlIGEgXCJtYW51YWxcIiB0cmlnZ2VyaW5nLlxuXHQgKiBUaGUgYGNvbnRleHRgIGlzIGFuIG9wdGlvbmFsIHZhbHVlIHRvIGJlIGluamVjdGVkIGludG8gdGhlIHBvcG92ZXIgdGVtcGxhdGUgd2hlbiBpdCBpcyBjcmVhdGVkLlxuXHQgKi9cblx0b3Blbihjb250ZXh0PzogYW55KSB7XG5cdFx0aWYgKCF0aGlzLl93aW5kb3dSZWYgJiYgIXRoaXMuX2lzRGlzYWJsZWQoKSkge1xuXHRcdFx0Ly8gdGhpcyB0eXBlIGFzc2VydGlvbiBpcyBzYWZlIGJlY2F1c2Ugb3RoZXJ3aXNlIF9pc0Rpc2FibGVkIHdvdWxkIHJldHVybiB0cnVlXG5cdFx0XHRjb25zdCB7IHdpbmRvd1JlZiwgdHJhbnNpdGlvbiQgfSA9IHRoaXMuX3BvcHVwU2VydmljZS5vcGVuKFxuXHRcdFx0XHR0aGlzLm5nYlBvcG92ZXIgYXMgc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55Pixcblx0XHRcdFx0Y29udGV4dCA/PyB0aGlzLnBvcG92ZXJDb250ZXh0LFxuXHRcdFx0XHR0aGlzLmFuaW1hdGlvbixcblx0XHRcdCk7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYgPSB3aW5kb3dSZWY7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuc2V0SW5wdXQoJ2FuaW1hdGlvbicsIHRoaXMuYW5pbWF0aW9uKTtcblx0XHRcdHRoaXMuX3dpbmRvd1JlZi5zZXRJbnB1dCgndGl0bGUnLCB0aGlzLnBvcG92ZXJUaXRsZSk7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuc2V0SW5wdXQoJ2NvbnRleHQnLCBjb250ZXh0ID8/IHRoaXMucG9wb3ZlckNvbnRleHQpO1xuXHRcdFx0dGhpcy5fd2luZG93UmVmLnNldElucHV0KCdwb3BvdmVyQ2xhc3MnLCB0aGlzLnBvcG92ZXJDbGFzcyk7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuc2V0SW5wdXQoJ2lkJywgdGhpcy5fbmdiUG9wb3ZlcldpbmRvd0lkKTtcblxuXHRcdFx0dGhpcy5fZ2V0UG9zaXRpb25UYXJnZXRFbGVtZW50KCkuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgdGhpcy5fbmdiUG9wb3ZlcldpbmRvd0lkKTtcblxuXHRcdFx0aWYgKHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIHtcblx0XHRcdFx0dGhpcy5fZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdlIG5lZWQgdG8gZGV0ZWN0IGNoYW5nZXMsIGJlY2F1c2Ugd2UgZG9uJ3Qga25vdyB3aGVyZSAub3BlbigpIG1pZ2h0IGJlIGNhbGxlZCBmcm9tLlxuXHRcdFx0Ly8gRXguIG9wZW5pbmcgcG9wb3ZlciBmcm9tIG9uZSBvZiBsaWZlY3ljbGUgaG9va3MgdGhhdCBydW4gYWZ0ZXIgdGhlIENEXG5cdFx0XHQvLyAoc2F5IGZyb20gbmdBZnRlclZpZXdJbml0KSB3aWxsIHJlc3VsdCBpbiAnRXhwcmVzc2lvbkhhc0NoYW5nZWQnIGV4Y2VwdGlvblxuXHRcdFx0dGhpcy5fd2luZG93UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblxuXHRcdFx0Ly8gV2UgbmVlZCB0byBtYXJrIGZvciBjaGVjaywgYmVjYXVzZSBwb3BvdmVyIHdvbid0IHdvcmsgaW5zaWRlIHRoZSBPblB1c2ggY29tcG9uZW50LlxuXHRcdFx0Ly8gRXguIHdoZW4gd2UgdXNlIGV4cHJlc3Npb24gbGlrZSBge3sgcG9wb3Zlci5pc09wZW4oKSA6ICdvcGVuZWQnIDogJ2Nsb3NlZCcgfX1gXG5cdFx0XHQvLyBpbnNpZGUgdGhlIHRlbXBsYXRlIG9mIGFuIE9uUHVzaCBjb21wb25lbnQgYW5kIHdlIGNoYW5nZSB0aGUgcG9wb3ZlciBmcm9tXG5cdFx0XHQvLyBvcGVuIC0+IGNsb3NlZCwgdGhlIGV4cHJlc3Npb24gaW4gcXVlc3Rpb24gd29uJ3QgYmUgdXBkYXRlZCB1bmxlc3Mgd2UgZXhwbGljaXRseVxuXHRcdFx0Ly8gbWFyayB0aGUgcGFyZW50IGNvbXBvbmVudCB0byBiZSBjaGVja2VkLlxuXHRcdFx0dGhpcy5fd2luZG93UmVmLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXG5cdFx0XHQvLyBTZXR0aW5nIHVwIHBvcHBlciBhbmQgc2NoZWR1bGluZyB1cGRhdGVzIHdoZW4gem9uZSBpcyBzdGFibGVcblx0XHRcdHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3Bvc2l0aW9uaW5nLmNyZWF0ZVBvcHBlcih7XG5cdFx0XHRcdFx0aG9zdEVsZW1lbnQ6IHRoaXMuX2dldFBvc2l0aW9uVGFyZ2V0RWxlbWVudCgpLFxuXHRcdFx0XHRcdHRhcmdldEVsZW1lbnQ6IHRoaXMuX3dpbmRvd1JlZiEubG9jYXRpb24ubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XHRwbGFjZW1lbnQ6IHRoaXMucGxhY2VtZW50LFxuXHRcdFx0XHRcdGJhc2VDbGFzczogJ2JzLXBvcG92ZXInLFxuXHRcdFx0XHRcdHVwZGF0ZVBvcHBlck9wdGlvbnM6IChvcHRpb25zKSA9PiB0aGlzLnBvcHBlck9wdGlvbnMoYWRkUG9wcGVyT2Zmc2V0KFswLCA4XSkob3B0aW9ucykpLFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcblx0XHRcdFx0XHQvLyBUaGlzIHVwZGF0ZSBpcyByZXF1aXJlZCBmb3IgY29ycmVjdCBhcnJvdyBwbGFjZW1lbnRcblx0XHRcdFx0XHR0aGlzLl9wb3NpdGlvbmluZy51cGRhdGUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuX2FmdGVyUmVuZGVyUmVmID0gYWZ0ZXJSZW5kZXIoXG5cdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7IHBoYXNlOiBBZnRlclJlbmRlclBoYXNlLk1peGVkUmVhZFdyaXRlLCBpbmplY3RvcjogdGhpcy5faW5qZWN0b3IgfSxcblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXG5cdFx0XHRuZ2JBdXRvQ2xvc2UodGhpcy5fbmdab25lLCB0aGlzLl9kb2N1bWVudCwgdGhpcy5hdXRvQ2xvc2UsICgpID0+IHRoaXMuY2xvc2UoKSwgdGhpcy5oaWRkZW4sIFtcblx0XHRcdFx0dGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRdKTtcblxuXHRcdFx0dHJhbnNpdGlvbiQuc3Vic2NyaWJlKCgpID0+IHRoaXMuc2hvd24uZW1pdCgpKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSBwb3BvdmVyLlxuXHQgKlxuXHQgKiBUaGlzIGlzIGNvbnNpZGVyZWQgdG8gYmUgYSBcIm1hbnVhbFwiIHRyaWdnZXJpbmcgb2YgdGhlIHBvcG92ZXIuXG5cdCAqL1xuXHRjbG9zZShhbmltYXRpb24gPSB0aGlzLmFuaW1hdGlvbikge1xuXHRcdGlmICh0aGlzLl93aW5kb3dSZWYpIHtcblx0XHRcdHRoaXMuX2dldFBvc2l0aW9uVGFyZ2V0RWxlbWVudCgpLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuXHRcdFx0dGhpcy5fcG9wdXBTZXJ2aWNlLmNsb3NlKGFuaW1hdGlvbikuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fd2luZG93UmVmID0gbnVsbDtcblx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuZGVzdHJveSgpO1xuXHRcdFx0XHR0aGlzLl9hZnRlclJlbmRlclJlZj8uZGVzdHJveSgpO1xuXHRcdFx0XHR0aGlzLmhpZGRlbi5lbWl0KCk7XG5cdFx0XHRcdHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgdGhlIHBvcG92ZXIuXG5cdCAqXG5cdCAqIFRoaXMgaXMgY29uc2lkZXJlZCB0byBiZSBhIFwibWFudWFsXCIgdHJpZ2dlcmluZyBvZiB0aGUgcG9wb3Zlci5cblx0ICovXG5cdHRvZ2dsZSgpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2luZG93UmVmKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3BlbigpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGB0cnVlYCwgaWYgdGhlIHBvcG92ZXIgaXMgY3VycmVudGx5IHNob3duLlxuXHQgKi9cblx0aXNPcGVuKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDtcblx0fVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbiA9IGxpc3RlblRvVHJpZ2dlcnMoXG5cdFx0XHR0aGlzLl9uYXRpdmVFbGVtZW50LFxuXHRcdFx0dGhpcy50cmlnZ2Vycyxcblx0XHRcdHRoaXMuaXNPcGVuLmJpbmQodGhpcyksXG5cdFx0XHR0aGlzLm9wZW4uYmluZCh0aGlzKSxcblx0XHRcdHRoaXMuY2xvc2UuYmluZCh0aGlzKSxcblx0XHRcdCt0aGlzLm9wZW5EZWxheSxcblx0XHRcdCt0aGlzLmNsb3NlRGVsYXksXG5cdFx0KTtcblx0fVxuXG5cdG5nT25DaGFuZ2VzKHsgbmdiUG9wb3ZlciwgcG9wb3ZlclRpdGxlLCBkaXNhYmxlUG9wb3ZlciwgcG9wb3ZlckNsYXNzIH06IFNpbXBsZUNoYW5nZXMpIHtcblx0XHRpZiAocG9wb3ZlckNsYXNzICYmIHRoaXMuaXNPcGVuKCkpIHtcblx0XHRcdHRoaXMuX3dpbmRvd1JlZiEuc2V0SW5wdXQoJ3BvcG92ZXJDbGFzcycsIHBvcG92ZXJDbGFzcy5jdXJyZW50VmFsdWUpO1xuXHRcdH1cblx0XHQvLyBjbG9zZSBwb3BvdmVyIGlmIHRpdGxlIGFuZCBjb250ZW50IGJlY29tZSBlbXB0eSwgb3IgZGlzYWJsZVBvcG92ZXIgc2V0IHRvIHRydWVcblx0XHRpZiAoKG5nYlBvcG92ZXIgfHwgcG9wb3ZlclRpdGxlIHx8IGRpc2FibGVQb3BvdmVyKSAmJiB0aGlzLl9pc0Rpc2FibGVkKCkpIHtcblx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHR9XG5cdH1cblxuXHRuZ09uRGVzdHJveSgpIHtcblx0XHR0aGlzLmNsb3NlKGZhbHNlKTtcblx0XHQvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCBhcyBpdCBtaWdodCBoYXBwZW4gdGhhdCBuZ09uRGVzdHJveSBpcyBjYWxsZWQgYmVmb3JlIG5nT25Jbml0XG5cdFx0Ly8gdW5kZXIgY2VydGFpbiBjb25kaXRpb25zLCBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2lzc3Vlcy8yMTk5XG5cdFx0dGhpcy5fdW5yZWdpc3Rlckxpc3RlbmVyc0ZuPy4oKTtcblx0fVxuXG5cdHByaXZhdGUgX2lzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuZGlzYWJsZVBvcG92ZXIgPyB0cnVlIDogIXRoaXMubmdiUG9wb3ZlciAmJiAhdGhpcy5wb3BvdmVyVGl0bGU7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRQb3NpdGlvblRhcmdldEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuXHRcdHJldHVybiAoXG5cdFx0XHQoaXNTdHJpbmcodGhpcy5wb3NpdGlvblRhcmdldCkgPyB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMucG9zaXRpb25UYXJnZXQpIDogdGhpcy5wb3NpdGlvblRhcmdldCkgfHxcblx0XHRcdHRoaXMuX25hdGl2ZUVsZW1lbnRcblx0XHQpO1xuXHR9XG59XG4iXX0=