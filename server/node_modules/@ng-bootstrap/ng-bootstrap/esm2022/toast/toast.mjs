import { afterNextRender, AfterRenderPhase, Attribute, Component, ContentChild, Directive, ElementRef, EventEmitter, inject, Injector, Input, NgZone, Output, TemplateRef, ViewEncapsulation, } from '@angular/core';
import { NgbToastConfig } from './toast-config';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbToastFadeInTransition, ngbToastFadeOutTransition } from './toast-transition';
import { NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * This directive allows the usage of HTML markup or other directives
 * inside of the toast's header.
 *
 * @since 5.0.0
 */
export class NgbToastHeader {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbToastHeader, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbToastHeader, isStandalone: true, selector: "[ngbToastHeader]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbToastHeader, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbToastHeader]', standalone: true }]
        }] });
/**
 * Toasts provide feedback messages as notifications to the user.
 * Goal is to mimic the push notifications available both on mobile and desktop operating systems.
 *
 * @since 5.0.0
 */
export class NgbToast {
    constructor(ariaLive) {
        this.ariaLive = ariaLive;
        this._config = inject(NgbToastConfig);
        this._zone = inject(NgZone);
        this._injector = inject(Injector);
        this._element = inject(ElementRef);
        /**
         * If `true`, toast opening and closing will be animated.
         *
         * Animation is triggered only when the `.hide()` or `.show()` functions are called
         *
         * @since 8.0.0
         */
        this.animation = this._config.animation;
        /**
         * Delay after which the toast will hide (ms).
         * default: `500` (ms) (inherited from NgbToastConfig)
         */
        this.delay = this._config.delay;
        /**
         * Auto hide the toast after a delay in ms.
         * default: `true` (inherited from NgbToastConfig)
         */
        this.autohide = this._config.autohide;
        /**
         * A template like `<ng-template ngbToastHeader></ng-template>` can be
         * used in the projected content to allow markup usage.
         */
        this.contentHeaderTpl = null;
        /**
         * An event fired after the animation triggered by calling `.show()` method has finished.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event fired after the animation triggered by calling `.hide()` method has finished.
         *
         * It can only occur in 2 different scenarios:
         * - `autohide` timeout fires
         * - user clicks on a closing cross
         *
         * Additionally this output is purely informative. The toast won't be removed from DOM automatically, it's up
         * to the user to take care of that.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.ariaLive ??= this._config.ariaLive;
    }
    ngAfterContentInit() {
        afterNextRender(() => {
            this._init();
            this.show();
        }, { phase: AfterRenderPhase.MixedReadWrite, injector: this._injector });
    }
    ngOnChanges(changes) {
        if ('autohide' in changes) {
            this._clearTimeout();
            this._init();
        }
    }
    /**
     * Triggers toast closing programmatically.
     *
     * The returned observable will emit and be completed once the closing transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(hidden)` output
     *
     * @since 8.0.0
     */
    hide() {
        this._clearTimeout();
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbToastFadeOutTransition, {
            animation: this.animation,
            runningTransition: 'stop',
        });
        transition.subscribe(() => {
            this.hidden.emit();
        });
        return transition;
    }
    /**
     * Triggers toast opening programmatically.
     *
     * The returned observable will emit and be completed once the opening transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(shown)` output
     *
     * @since 8.0.0
     */
    show() {
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbToastFadeInTransition, {
            animation: this.animation,
            runningTransition: 'continue',
        });
        transition.subscribe(() => {
            this.shown.emit();
        });
        return transition;
    }
    _init() {
        if (this.autohide && !this._timeoutID) {
            this._timeoutID = setTimeout(() => this.hide(), this.delay);
        }
    }
    _clearTimeout() {
        if (this._timeoutID) {
            clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbToast, deps: [{ token: 'aria-live', attribute: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.2", type: NgbToast, isStandalone: true, selector: "ngb-toast", inputs: { animation: "animation", delay: "delay", autohide: "autohide", header: "header" }, outputs: { shown: "shown", hidden: "hidden" }, host: { attributes: { "role": "alert", "aria-atomic": "true" }, properties: { "attr.aria-live": "ariaLive", "class.fade": "animation" }, classAttribute: "toast" }, queries: [{ propertyName: "contentHeaderTpl", first: true, predicate: NgbToastHeader, descendants: true, read: TemplateRef, static: true }], exportAs: ["ngbToast"], usesOnChanges: true, ngImport: i0, template: `
		<ng-template #headerTpl>
			<strong class="me-auto">{{ header }}</strong>
		</ng-template>
		@if (contentHeaderTpl || header) {
			<div class="toast-header">
				<ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl" />
				<button
					type="button"
					class="btn-close"
					aria-label="Close"
					i18n-aria-label="@@ngb.toast.close-aria"
					(click)="hide()"
				>
				</button>
			</div>
		}
		<div class="toast-body">
			<ng-content />
		</div>
	`, isInline: true, styles: ["ngb-toast{display:block}ngb-toast .toast-header .close{margin-left:auto;margin-bottom:.25rem}\n"], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbToast, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-toast', exportAs: 'ngbToast', standalone: true, imports: [NgTemplateOutlet], encapsulation: ViewEncapsulation.None, host: {
                        role: 'alert',
                        '[attr.aria-live]': 'ariaLive',
                        'aria-atomic': 'true',
                        class: 'toast',
                        '[class.fade]': 'animation',
                    }, template: `
		<ng-template #headerTpl>
			<strong class="me-auto">{{ header }}</strong>
		</ng-template>
		@if (contentHeaderTpl || header) {
			<div class="toast-header">
				<ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl" />
				<button
					type="button"
					class="btn-close"
					aria-label="Close"
					i18n-aria-label="@@ngb.toast.close-aria"
					(click)="hide()"
				>
				</button>
			</div>
		}
		<div class="toast-body">
			<ng-content />
		</div>
	`, styles: ["ngb-toast{display:block}ngb-toast .toast-header .close{margin-left:auto;margin-bottom:.25rem}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['aria-live']
                }] }], propDecorators: { animation: [{
                type: Input
            }], delay: [{
                type: Input
            }], autohide: [{
                type: Input
            }], header: [{
                type: Input
            }], contentHeaderTpl: [{
                type: ContentChild,
                args: [NgbToastHeader, { read: TemplateRef, static: true }]
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdG9hc3QvdG9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVOLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsU0FBUyxFQUNULFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFFTixXQUFXLEVBQ1gsaUJBQWlCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN6RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFFbkQ7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sY0FBYzs4R0FBZCxjQUFjO2tHQUFkLGNBQWM7OzJGQUFkLGNBQWM7a0JBRDFCLFNBQVM7bUJBQUMsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTs7QUFHN0Q7Ozs7O0dBS0c7QUFxQ0gsTUFBTSxPQUFPLFFBQVE7SUE2RHBCLFlBQTJDLFFBQWdCO1FBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7UUE1RG5ELFlBQU8sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDakMsVUFBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixjQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLGFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFHdEM7Ozs7OztXQU1HO1FBQ00sY0FBUyxH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b0JULHlLQTdCUyxnQkFBZ0I7OzJGQWdDZCxRQUFRO2tCQXBDcEIsU0FBUzsrQkFDQyxXQUFXLFlBQ1gsVUFBVSxjQUNSLElBQUksV0FDUCxDQUFDLGdCQUFnQixDQUFDLGlCQUNaLGlCQUFpQixDQUFDLElBQUksUUFDL0I7d0JBQ0wsSUFBSSxFQUFFLE9BQU87d0JBQ2Isa0JBQWtCLEVBQUUsVUFBVTt3QkFDOUIsYUFBYSxFQUFFLE1BQU07d0JBQ3JCLEtBQUssRUFBRSxPQUFPO3dCQUNkLGNBQWMsRUFBRSxXQUFXO3FCQUMzQixZQUNTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CVDs7MEJBZ0VZLFNBQVM7MkJBQUMsV0FBVzt5Q0EvQ3pCLFNBQVM7c0JBQWpCLEtBQUs7Z0JBTUcsS0FBSztzQkFBYixLQUFLO2dCQU1HLFFBQVE7c0JBQWhCLEtBQUs7Z0JBTUcsTUFBTTtzQkFBZCxLQUFLO2dCQU02RCxnQkFBZ0I7c0JBQWxGLFlBQVk7dUJBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQU92RCxLQUFLO3NCQUFkLE1BQU07Z0JBY0csTUFBTTtzQkFBZixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QWZ0ZXJDb250ZW50SW5pdCxcblx0YWZ0ZXJOZXh0UmVuZGVyLFxuXHRBZnRlclJlbmRlclBoYXNlLFxuXHRBdHRyaWJ1dGUsXG5cdENvbXBvbmVudCxcblx0Q29udGVudENoaWxkLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0aW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25DaGFuZ2VzLFxuXHRPdXRwdXQsXG5cdFNpbXBsZUNoYW5nZXMsXG5cdFRlbXBsYXRlUmVmLFxuXHRWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgTmdiVG9hc3RDb25maWcgfSBmcm9tICcuL3RvYXN0LWNvbmZpZyc7XG5pbXBvcnQgeyBuZ2JSdW5UcmFuc2l0aW9uIH0gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHsgbmdiVG9hc3RGYWRlSW5UcmFuc2l0aW9uLCBuZ2JUb2FzdEZhZGVPdXRUcmFuc2l0aW9uIH0gZnJvbSAnLi90b2FzdC10cmFuc2l0aW9uJztcbmltcG9ydCB7IE5nVGVtcGxhdGVPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIGFsbG93cyB0aGUgdXNhZ2Ugb2YgSFRNTCBtYXJrdXAgb3Igb3RoZXIgZGlyZWN0aXZlc1xuICogaW5zaWRlIG9mIHRoZSB0b2FzdCdzIGhlYWRlci5cbiAqXG4gKiBAc2luY2UgNS4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25nYlRvYXN0SGVhZGVyXScsIHN0YW5kYWxvbmU6IHRydWUgfSlcbmV4cG9ydCBjbGFzcyBOZ2JUb2FzdEhlYWRlciB7fVxuXG4vKipcbiAqIFRvYXN0cyBwcm92aWRlIGZlZWRiYWNrIG1lc3NhZ2VzIGFzIG5vdGlmaWNhdGlvbnMgdG8gdGhlIHVzZXIuXG4gKiBHb2FsIGlzIHRvIG1pbWljIHRoZSBwdXNoIG5vdGlmaWNhdGlvbnMgYXZhaWxhYmxlIGJvdGggb24gbW9iaWxlIGFuZCBkZXNrdG9wIG9wZXJhdGluZyBzeXN0ZW1zLlxuICpcbiAqIEBzaW5jZSA1LjAuMFxuICovXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICduZ2ItdG9hc3QnLFxuXHRleHBvcnRBczogJ25nYlRvYXN0Jyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aW1wb3J0czogW05nVGVtcGxhdGVPdXRsZXRdLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRob3N0OiB7XG5cdFx0cm9sZTogJ2FsZXJ0Jyxcblx0XHQnW2F0dHIuYXJpYS1saXZlXSc6ICdhcmlhTGl2ZScsXG5cdFx0J2FyaWEtYXRvbWljJzogJ3RydWUnLFxuXHRcdGNsYXNzOiAndG9hc3QnLFxuXHRcdCdbY2xhc3MuZmFkZV0nOiAnYW5pbWF0aW9uJyxcblx0fSxcblx0dGVtcGxhdGU6IGBcblx0XHQ8bmctdGVtcGxhdGUgI2hlYWRlclRwbD5cblx0XHRcdDxzdHJvbmcgY2xhc3M9XCJtZS1hdXRvXCI+e3sgaGVhZGVyIH19PC9zdHJvbmc+XG5cdFx0PC9uZy10ZW1wbGF0ZT5cblx0XHRAaWYgKGNvbnRlbnRIZWFkZXJUcGwgfHwgaGVhZGVyKSB7XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidG9hc3QtaGVhZGVyXCI+XG5cdFx0XHRcdDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJjb250ZW50SGVhZGVyVHBsIHx8IGhlYWRlclRwbFwiIC8+XG5cdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHR0eXBlPVwiYnV0dG9uXCJcblx0XHRcdFx0XHRjbGFzcz1cImJ0bi1jbG9zZVwiXG5cdFx0XHRcdFx0YXJpYS1sYWJlbD1cIkNsb3NlXCJcblx0XHRcdFx0XHRpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50b2FzdC5jbG9zZS1hcmlhXCJcblx0XHRcdFx0XHQoY2xpY2spPVwiaGlkZSgpXCJcblx0XHRcdFx0PlxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdH1cblx0XHQ8ZGl2IGNsYXNzPVwidG9hc3QtYm9keVwiPlxuXHRcdFx0PG5nLWNvbnRlbnQgLz5cblx0XHQ8L2Rpdj5cblx0YCxcblx0c3R5bGVVcmw6ICcuL3RvYXN0LnNjc3MnLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JUb2FzdCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyB7XG5cdHByaXZhdGUgX2NvbmZpZyA9IGluamVjdChOZ2JUb2FzdENvbmZpZyk7XG5cdHByaXZhdGUgX3pvbmUgPSBpbmplY3QoTmdab25lKTtcblx0cHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXHRwcml2YXRlIF9lbGVtZW50ID0gaW5qZWN0KEVsZW1lbnRSZWYpO1xuXG5cdHByaXZhdGUgX3RpbWVvdXRJRDtcblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgdG9hc3Qgb3BlbmluZyBhbmQgY2xvc2luZyB3aWxsIGJlIGFuaW1hdGVkLlxuXHQgKlxuXHQgKiBBbmltYXRpb24gaXMgdHJpZ2dlcmVkIG9ubHkgd2hlbiB0aGUgYC5oaWRlKClgIG9yIGAuc2hvdygpYCBmdW5jdGlvbnMgYXJlIGNhbGxlZFxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdEBJbnB1dCgpIGFuaW1hdGlvbiA9IHRoaXMuX2NvbmZpZy5hbmltYXRpb247XG5cblx0LyoqXG5cdCAqIERlbGF5IGFmdGVyIHdoaWNoIHRoZSB0b2FzdCB3aWxsIGhpZGUgKG1zKS5cblx0ICogZGVmYXVsdDogYDUwMGAgKG1zKSAoaW5oZXJpdGVkIGZyb20gTmdiVG9hc3RDb25maWcpXG5cdCAqL1xuXHRASW5wdXQoKSBkZWxheSA9IHRoaXMuX2NvbmZpZy5kZWxheTtcblxuXHQvKipcblx0ICogQXV0byBoaWRlIHRoZSB0b2FzdCBhZnRlciBhIGRlbGF5IGluIG1zLlxuXHQgKiBkZWZhdWx0OiBgdHJ1ZWAgKGluaGVyaXRlZCBmcm9tIE5nYlRvYXN0Q29uZmlnKVxuXHQgKi9cblx0QElucHV0KCkgYXV0b2hpZGUgPSB0aGlzLl9jb25maWcuYXV0b2hpZGU7XG5cblx0LyoqXG5cdCAqIFRleHQgdG8gYmUgdXNlZCBhcyB0b2FzdCdzIGhlYWRlci5cblx0ICogSWdub3JlZCBpZiBhIENvbnRlbnRDaGlsZCB0ZW1wbGF0ZSBpcyBzcGVjaWZpZWQgYXQgdGhlIHNhbWUgdGltZS5cblx0ICovXG5cdEBJbnB1dCgpIGhlYWRlcjogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBBIHRlbXBsYXRlIGxpa2UgYDxuZy10ZW1wbGF0ZSBuZ2JUb2FzdEhlYWRlcj48L25nLXRlbXBsYXRlPmAgY2FuIGJlXG5cdCAqIHVzZWQgaW4gdGhlIHByb2plY3RlZCBjb250ZW50IHRvIGFsbG93IG1hcmt1cCB1c2FnZS5cblx0ICovXG5cdEBDb250ZW50Q2hpbGQoTmdiVG9hc3RIZWFkZXIsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KSBjb250ZW50SGVhZGVyVHBsOiBUZW1wbGF0ZVJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGZpcmVkIGFmdGVyIHRoZSBhbmltYXRpb24gdHJpZ2dlcmVkIGJ5IGNhbGxpbmcgYC5zaG93KClgIG1ldGhvZCBoYXMgZmluaXNoZWQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBmaXJlZCBhZnRlciB0aGUgYW5pbWF0aW9uIHRyaWdnZXJlZCBieSBjYWxsaW5nIGAuaGlkZSgpYCBtZXRob2QgaGFzIGZpbmlzaGVkLlxuXHQgKlxuXHQgKiBJdCBjYW4gb25seSBvY2N1ciBpbiAyIGRpZmZlcmVudCBzY2VuYXJpb3M6XG5cdCAqIC0gYGF1dG9oaWRlYCB0aW1lb3V0IGZpcmVzXG5cdCAqIC0gdXNlciBjbGlja3Mgb24gYSBjbG9zaW5nIGNyb3NzXG5cdCAqXG5cdCAqIEFkZGl0aW9uYWxseSB0aGlzIG91dHB1dCBpcyBwdXJlbHkgaW5mb3JtYXRpdmUuIFRoZSB0b2FzdCB3b24ndCBiZSByZW1vdmVkIGZyb20gRE9NIGF1dG9tYXRpY2FsbHksIGl0J3MgdXBcblx0ICogdG8gdGhlIHVzZXIgdG8gdGFrZSBjYXJlIG9mIHRoYXQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuXHRjb25zdHJ1Y3RvcihAQXR0cmlidXRlKCdhcmlhLWxpdmUnKSBwdWJsaWMgYXJpYUxpdmU6IHN0cmluZykge1xuXHRcdHRoaXMuYXJpYUxpdmUgPz89IHRoaXMuX2NvbmZpZy5hcmlhTGl2ZTtcblx0fVxuXG5cdG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcblx0XHRhZnRlck5leHRSZW5kZXIoXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX2luaXQoKTtcblx0XHRcdFx0dGhpcy5zaG93KCk7XG5cdFx0XHR9LFxuXHRcdFx0eyBwaGFzZTogQWZ0ZXJSZW5kZXJQaGFzZS5NaXhlZFJlYWRXcml0ZSwgaW5qZWN0b3I6IHRoaXMuX2luamVjdG9yIH0sXG5cdFx0KTtcblx0fVxuXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcblx0XHRpZiAoJ2F1dG9oaWRlJyBpbiBjaGFuZ2VzKSB7XG5cdFx0XHR0aGlzLl9jbGVhclRpbWVvdXQoKTtcblx0XHRcdHRoaXMuX2luaXQoKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVHJpZ2dlcnMgdG9hc3QgY2xvc2luZyBwcm9ncmFtbWF0aWNhbGx5LlxuXHQgKlxuXHQgKiBUaGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIGVtaXQgYW5kIGJlIGNvbXBsZXRlZCBvbmNlIHRoZSBjbG9zaW5nIHRyYW5zaXRpb24gaGFzIGZpbmlzaGVkLlxuXHQgKiBJZiB0aGUgYW5pbWF0aW9ucyBhcmUgdHVybmVkIG9mZiB0aGlzIGhhcHBlbnMgc3luY2hyb25vdXNseS5cblx0ICpcblx0ICogQWx0ZXJuYXRpdmVseSB5b3UgY291bGQgbGlzdGVuIG9yIHN1YnNjcmliZSB0byB0aGUgYChoaWRkZW4pYCBvdXRwdXRcblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRoaWRlKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuXHRcdHRoaXMuX2NsZWFyVGltZW91dCgpO1xuXHRcdGNvbnN0IHRyYW5zaXRpb24gPSBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgbmdiVG9hc3RGYWRlT3V0VHJhbnNpdGlvbiwge1xuXHRcdFx0YW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbixcblx0XHRcdHJ1bm5pbmdUcmFuc2l0aW9uOiAnc3RvcCcsXG5cdFx0fSk7XG5cdFx0dHJhbnNpdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0dGhpcy5oaWRkZW4uZW1pdCgpO1xuXHRcdH0pO1xuXHRcdHJldHVybiB0cmFuc2l0aW9uO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyaWdnZXJzIHRvYXN0IG9wZW5pbmcgcHJvZ3JhbW1hdGljYWxseS5cblx0ICpcblx0ICogVGhlIHJldHVybmVkIG9ic2VydmFibGUgd2lsbCBlbWl0IGFuZCBiZSBjb21wbGV0ZWQgb25jZSB0aGUgb3BlbmluZyB0cmFuc2l0aW9uIGhhcyBmaW5pc2hlZC5cblx0ICogSWYgdGhlIGFuaW1hdGlvbnMgYXJlIHR1cm5lZCBvZmYgdGhpcyBoYXBwZW5zIHN5bmNocm9ub3VzbHkuXG5cdCAqXG5cdCAqIEFsdGVybmF0aXZlbHkgeW91IGNvdWxkIGxpc3RlbiBvciBzdWJzY3JpYmUgdG8gdGhlIGAoc2hvd24pYCBvdXRwdXRcblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRzaG93KCk6IE9ic2VydmFibGU8dm9pZD4ge1xuXHRcdGNvbnN0IHRyYW5zaXRpb24gPSBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgbmdiVG9hc3RGYWRlSW5UcmFuc2l0aW9uLCB7XG5cdFx0XHRhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLFxuXHRcdFx0cnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZScsXG5cdFx0fSk7XG5cdFx0dHJhbnNpdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0dGhpcy5zaG93bi5lbWl0KCk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRyYW5zaXRpb247XG5cdH1cblxuXHRwcml2YXRlIF9pbml0KCkge1xuXHRcdGlmICh0aGlzLmF1dG9oaWRlICYmICF0aGlzLl90aW1lb3V0SUQpIHtcblx0XHRcdHRoaXMuX3RpbWVvdXRJRCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5oaWRlKCksIHRoaXMuZGVsYXkpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2NsZWFyVGltZW91dCgpIHtcblx0XHRpZiAodGhpcy5fdGltZW91dElEKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dElEKTtcblx0XHRcdHRoaXMuX3RpbWVvdXRJRCA9IG51bGw7XG5cdFx0fVxuXHR9XG59XG4iXX0=