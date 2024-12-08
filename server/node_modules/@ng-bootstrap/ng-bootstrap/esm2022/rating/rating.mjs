import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, forwardRef, inject, Input, Output, TemplateRef, ViewEncapsulation, } from '@angular/core';
import { NgbRatingConfig } from './rating-config';
import { getValueInRange } from '../util/util';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * A directive that helps visualising and interacting with a star rating bar.
 */
export class NgbRating {
    constructor() {
        this.contexts = [];
        this._config = inject(NgbRatingConfig);
        this._changeDetectorRef = inject(ChangeDetectorRef);
        /**
         * If `true`, the rating can't be changed or focused.
         */
        this.disabled = false;
        /**
         * The maximal rating that can be given.
         */
        this.max = this._config.max;
        /**
         * If `true`, the rating can't be changed.
         */
        this.readonly = this._config.readonly;
        /**
         * If `true`, the rating can be reset to `0` by mouse clicking currently set rating.
         */
        this.resettable = this._config.resettable;
        /**
         * Allows setting a custom rating tabindex.
         * If the component is disabled, `tabindex` will still be set to `-1`.
         *
         * @since 13.1.0
         */
        this.tabindex = this._config.tabindex;
        /**
         * An event emitted when the user is hovering over a given rating.
         *
         * Event payload equals to the rating being hovered over.
         */
        this.hover = new EventEmitter();
        /**
         * An event emitted when the user stops hovering over a given rating.
         *
         * Event payload equals to the rating of the last item being hovered over.
         */
        this.leave = new EventEmitter();
        /**
         * An event emitted when the rating is changed.
         *
         * Event payload equals to the newly selected rating.
         */
        this.rateChange = new EventEmitter(true);
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    /**
     * Allows to provide a function to set a custom aria-valuetext
     *
     * @since 14.1.0
     */
    ariaValueText(current, max) {
        return `${current} out of ${max}`;
    }
    isInteractive() {
        return !this.readonly && !this.disabled;
    }
    enter(value) {
        if (this.isInteractive()) {
            this._updateState(value);
        }
        this.hover.emit(value);
    }
    handleBlur() {
        this.onTouched();
    }
    handleClick(value) {
        if (this.isInteractive()) {
            this.update(this.resettable && this.rate === value ? 0 : value);
        }
    }
    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowLeft':
                this.update(this.rate - 1);
                break;
            case 'ArrowUp':
            case 'ArrowRight':
                this.update(this.rate + 1);
                break;
            case 'Home':
                this.update(0);
                break;
            case 'End':
                this.update(this.max);
                break;
            default:
                return;
        }
        // note 'return' in default case
        event.preventDefault();
    }
    ngOnChanges(changes) {
        if (changes['rate']) {
            this.update(this.rate);
        }
        if (changes['max']) {
            this._updateMax();
        }
    }
    ngOnInit() {
        this._setupContexts();
        this._updateState(this.rate);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    reset() {
        this.leave.emit(this.nextRate);
        this._updateState(this.rate);
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    update(value, internalChange = true) {
        const newRate = getValueInRange(value, this.max, 0);
        if (this.isInteractive() && this.rate !== newRate) {
            this.rate = newRate;
            this.rateChange.emit(this.rate);
        }
        if (internalChange) {
            this.onChange(this.rate);
            this.onTouched();
        }
        this._updateState(this.rate);
    }
    writeValue(value) {
        this.update(value, false);
        this._changeDetectorRef.markForCheck();
    }
    _updateState(nextValue) {
        this.nextRate = nextValue;
        this.contexts.forEach((context, index) => (context.fill = Math.round(getValueInRange(nextValue - index, 1, 0) * 100)));
    }
    _updateMax() {
        if (this.max > 0) {
            this._setupContexts();
            this.update(this.rate);
        }
    }
    _setupContexts() {
        this.contexts = Array.from({ length: this.max }, (v, k) => ({ fill: 0, index: k }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbRating, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.2", type: NgbRating, isStandalone: true, selector: "ngb-rating", inputs: { disabled: "disabled", max: "max", rate: "rate", readonly: "readonly", resettable: "resettable", starTemplate: "starTemplate", tabindex: "tabindex", ariaValueText: "ariaValueText" }, outputs: { hover: "hover", leave: "leave", rateChange: "rateChange" }, host: { attributes: { "role": "slider", "aria-valuemin": "0" }, listeners: { "blur": "handleBlur()", "keydown": "handleKeyDown($event)", "mouseleave": "reset()" }, properties: { "tabindex": "disabled ? -1 : tabindex", "attr.aria-valuemax": "max", "attr.aria-valuenow": "nextRate", "attr.aria-valuetext": "ariaValueText(nextRate, max)", "attr.aria-readonly": "readonly && !disabled ? true : null", "attr.aria-disabled": "disabled ? true : null" }, classAttribute: "d-inline-flex" }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbRating), multi: true }], queries: [{ propertyName: "starTemplateFromContent", first: true, predicate: TemplateRef, descendants: true }], usesOnChanges: true, ngImport: i0, template: `
		<ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
		@for (_ of contexts; track _; let index = $index) {
			<span class="visually-hidden">({{ index < nextRate ? '*' : ' ' }})</span>
			<span
				(mouseenter)="enter(index + 1)"
				(click)="handleClick(index + 1)"
				[style.cursor]="isInteractive() ? 'pointer' : 'default'"
			>
				<ng-template
					[ngTemplateOutlet]="starTemplate || starTemplateFromContent || t"
					[ngTemplateOutletContext]="contexts[index]"
				/>
			</span>
		}
	`, isInline: true, dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbRating, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-rating',
                    standalone: true,
                    imports: [NgTemplateOutlet],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'd-inline-flex',
                        '[tabindex]': 'disabled ? -1 : tabindex',
                        role: 'slider',
                        'aria-valuemin': '0',
                        '[attr.aria-valuemax]': 'max',
                        '[attr.aria-valuenow]': 'nextRate',
                        '[attr.aria-valuetext]': 'ariaValueText(nextRate, max)',
                        '[attr.aria-readonly]': 'readonly && !disabled ? true : null',
                        '[attr.aria-disabled]': 'disabled ? true : null',
                        '(blur)': 'handleBlur()',
                        '(keydown)': 'handleKeyDown($event)',
                        '(mouseleave)': 'reset()',
                    },
                    template: `
		<ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
		@for (_ of contexts; track _; let index = $index) {
			<span class="visually-hidden">({{ index < nextRate ? '*' : ' ' }})</span>
			<span
				(mouseenter)="enter(index + 1)"
				(click)="handleClick(index + 1)"
				[style.cursor]="isInteractive() ? 'pointer' : 'default'"
			>
				<ng-template
					[ngTemplateOutlet]="starTemplate || starTemplateFromContent || t"
					[ngTemplateOutletContext]="contexts[index]"
				/>
			</span>
		}
	`,
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbRating), multi: true }],
                }]
        }], propDecorators: { disabled: [{
                type: Input
            }], max: [{
                type: Input
            }], rate: [{
                type: Input
            }], readonly: [{
                type: Input
            }], resettable: [{
                type: Input
            }], starTemplate: [{
                type: Input
            }], starTemplateFromContent: [{
                type: ContentChild,
                args: [TemplateRef, { static: false }]
            }], tabindex: [{
                type: Input
            }], ariaValueText: [{
                type: Input
            }], hover: [{
                type: Output
            }], leave: [{
                type: Output
            }], rateChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3JhdGluZy9yYXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNOLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUVOLFdBQVcsRUFDWCxpQkFBaUIsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDL0MsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQWlCbkQ7O0dBRUc7QUF1Q0gsTUFBTSxPQUFPLFNBQVM7SUF0Q3RCO1FBdUNDLGFBQVEsR0FBMEIsRUFBRSxDQUFDO1FBRzdCLFlBQU8sR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbEMsdUJBQWtCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFdkQ7O1dBRUc7UUFDTSxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRTFCOztXQUVHO1FBQ00sUUFBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBT2hDOztXQUVHO1FBQ00sYUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRTFDOztXQUVHO1FBQ00sZUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBVTlDOzs7OztXQUtHO1FBQ00sYUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBVzFDOzs7O1dBSUc7UUFDTyxVQUFLLEdBQUcsSUFBSSxZ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d0JBQ0wsS0FBSyxFQUFFLGVBQWU7d0JBQ3RCLFlBQVksRUFBRSwwQkFBMEI7d0JBQ3hDLElBQUksRUFBRSxRQUFRO3dCQUNkLGVBQWUsRUFBRSxHQUFHO3dCQUNwQixzQkFBc0IsRUFBRSxLQUFLO3dCQUM3QixzQkFBc0IsRUFBRSxVQUFVO3dCQUNsQyx1QkFBdUIsRUFBRSw4QkFBOEI7d0JBQ3ZELHNCQUFzQixFQUFFLHFDQUFxQzt3QkFDN0Qsc0JBQXNCLEVBQUUsd0JBQXdCO3dCQUNoRCxRQUFRLEVBQUUsY0FBYzt3QkFDeEIsV0FBVyxFQUFFLHVCQUF1Qjt3QkFDcEMsY0FBYyxFQUFFLFNBQVM7cUJBQ3pCO29CQUNELFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0VBZVQ7b0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDO2lCQUNsRzs4QkFXUyxRQUFRO3NCQUFoQixLQUFLO2dCQUtHLEdBQUc7c0JBQVgsS0FBSztnQkFLRyxJQUFJO3NCQUFaLEtBQUs7Z0JBS0csUUFBUTtzQkFBaEIsS0FBSztnQkFLRyxVQUFVO3NCQUFsQixLQUFLO2dCQU9HLFlBQVk7c0JBQXBCLEtBQUs7Z0JBQ3dDLHVCQUF1QjtzQkFBcEUsWUFBWTt1QkFBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dCQVFuQyxRQUFRO3NCQUFoQixLQUFLO2dCQU9HLGFBQWE7c0JBQXJCLEtBQUs7Z0JBU0ksS0FBSztzQkFBZCxNQUFNO2dCQU9HLEtBQUs7c0JBQWQsTUFBTTtnQkFPRyxVQUFVO3NCQUFuQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb21wb25lbnQsXG5cdENvbnRlbnRDaGlsZCxcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLFxuXHRpbmplY3QsXG5cdElucHV0LFxuXHRPbkNoYW5nZXMsXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRUZW1wbGF0ZVJlZixcblx0Vmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdiUmF0aW5nQ29uZmlnIH0gZnJvbSAnLi9yYXRpbmctY29uZmlnJztcbmltcG9ydCB7IGdldFZhbHVlSW5SYW5nZSB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBOZ1RlbXBsYXRlT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuLyoqXG4gKiBUaGUgY29udGV4dCBmb3IgdGhlIGN1c3RvbSBzdGFyIGRpc3BsYXkgdGVtcGxhdGUgZGVmaW5lZCBpbiB0aGUgYHN0YXJUZW1wbGF0ZWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhclRlbXBsYXRlQ29udGV4dCB7XG5cdC8qKlxuXHQgKiBUaGUgc3RhciBmaWxsIHBlcmNlbnRhZ2UsIGFuIGludGVnZXIgaW4gdGhlIGBbMCwgMTAwXWAgcmFuZ2UuXG5cdCAqL1xuXHRmaWxsOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIEluZGV4IG9mIHRoZSBzdGFyLCBzdGFydHMgd2l0aCBgMGAuXG5cdCAqL1xuXHRpbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgaGVscHMgdmlzdWFsaXNpbmcgYW5kIGludGVyYWN0aW5nIHdpdGggYSBzdGFyIHJhdGluZyBiYXIuXG4gKi9cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25nYi1yYXRpbmcnLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRpbXBvcnRzOiBbTmdUZW1wbGF0ZU91dGxldF0sXG5cdGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRob3N0OiB7XG5cdFx0Y2xhc3M6ICdkLWlubGluZS1mbGV4Jyxcblx0XHQnW3RhYmluZGV4XSc6ICdkaXNhYmxlZCA/IC0xIDogdGFiaW5kZXgnLFxuXHRcdHJvbGU6ICdzbGlkZXInLFxuXHRcdCdhcmlhLXZhbHVlbWluJzogJzAnLFxuXHRcdCdbYXR0ci5hcmlhLXZhbHVlbWF4XSc6ICdtYXgnLFxuXHRcdCdbYXR0ci5hcmlhLXZhbHVlbm93XSc6ICduZXh0UmF0ZScsXG5cdFx0J1thdHRyLmFyaWEtdmFsdWV0ZXh0XSc6ICdhcmlhVmFsdWVUZXh0KG5leHRSYXRlLCBtYXgpJyxcblx0XHQnW2F0dHIuYXJpYS1yZWFkb25seV0nOiAncmVhZG9ubHkgJiYgIWRpc2FibGVkID8gdHJ1ZSA6IG51bGwnLFxuXHRcdCdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCA/IHRydWUgOiBudWxsJyxcblx0XHQnKGJsdXIpJzogJ2hhbmRsZUJsdXIoKScsXG5cdFx0JyhrZXlkb3duKSc6ICdoYW5kbGVLZXlEb3duKCRldmVudCknLFxuXHRcdCcobW91c2VsZWF2ZSknOiAncmVzZXQoKScsXG5cdH0sXG5cdHRlbXBsYXRlOiBgXG5cdFx0PG5nLXRlbXBsYXRlICN0IGxldC1maWxsPVwiZmlsbFwiPnt7IGZpbGwgPT09IDEwMCA/ICcmIzk3MzM7JyA6ICcmIzk3MzQ7JyB9fTwvbmctdGVtcGxhdGU+XG5cdFx0QGZvciAoXyBvZiBjb250ZXh0czsgdHJhY2sgXzsgbGV0IGluZGV4ID0gJGluZGV4KSB7XG5cdFx0XHQ8c3BhbiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiPih7eyBpbmRleCA8IG5leHRSYXRlID8gJyonIDogJyAnIH19KTwvc3Bhbj5cblx0XHRcdDxzcGFuXG5cdFx0XHRcdChtb3VzZWVudGVyKT1cImVudGVyKGluZGV4ICsgMSlcIlxuXHRcdFx0XHQoY2xpY2spPVwiaGFuZGxlQ2xpY2soaW5kZXggKyAxKVwiXG5cdFx0XHRcdFtzdHlsZS5jdXJzb3JdPVwiaXNJbnRlcmFjdGl2ZSgpID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnXCJcblx0XHRcdD5cblx0XHRcdFx0PG5nLXRlbXBsYXRlXG5cdFx0XHRcdFx0W25nVGVtcGxhdGVPdXRsZXRdPVwic3RhclRlbXBsYXRlIHx8IHN0YXJUZW1wbGF0ZUZyb21Db250ZW50IHx8IHRcIlxuXHRcdFx0XHRcdFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJjb250ZXh0c1tpbmRleF1cIlxuXHRcdFx0XHQvPlxuXHRcdFx0PC9zcGFuPlxuXHRcdH1cblx0YCxcblx0cHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiUmF0aW5nKSwgbXVsdGk6IHRydWUgfV0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYlJhdGluZyBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cdGNvbnRleHRzOiBTdGFyVGVtcGxhdGVDb250ZXh0W10gPSBbXTtcblx0bmV4dFJhdGU6IG51bWJlcjtcblxuXHRwcml2YXRlIF9jb25maWcgPSBpbmplY3QoTmdiUmF0aW5nQ29uZmlnKTtcblx0cHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWYgPSBpbmplY3QoQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHRoZSByYXRpbmcgY2FuJ3QgYmUgY2hhbmdlZCBvciBmb2N1c2VkLlxuXHQgKi9cblx0QElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcblxuXHQvKipcblx0ICogVGhlIG1heGltYWwgcmF0aW5nIHRoYXQgY2FuIGJlIGdpdmVuLlxuXHQgKi9cblx0QElucHV0KCkgbWF4ID0gdGhpcy5fY29uZmlnLm1heDtcblxuXHQvKipcblx0ICogVGhlIGN1cnJlbnQgcmF0aW5nLiBDb3VsZCBiZSBhIGRlY2ltYWwgdmFsdWUgbGlrZSBgMy43NWAuXG5cdCAqL1xuXHRASW5wdXQoKSByYXRlOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgdGhlIHJhdGluZyBjYW4ndCBiZSBjaGFuZ2VkLlxuXHQgKi9cblx0QElucHV0KCkgcmVhZG9ubHkgPSB0aGlzLl9jb25maWcucmVhZG9ubHk7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgdGhlIHJhdGluZyBjYW4gYmUgcmVzZXQgdG8gYDBgIGJ5IG1vdXNlIGNsaWNraW5nIGN1cnJlbnRseSBzZXQgcmF0aW5nLlxuXHQgKi9cblx0QElucHV0KCkgcmVzZXR0YWJsZSA9IHRoaXMuX2NvbmZpZy5yZXNldHRhYmxlO1xuXG5cdC8qKlxuXHQgKiBUaGUgdGVtcGxhdGUgdG8gb3ZlcnJpZGUgdGhlIHdheSBlYWNoIHN0YXIgaXMgZGlzcGxheWVkLlxuXHQgKlxuXHQgKiBBbHRlcm5hdGl2ZWx5IHB1dCBhbiBgPG5nLXRlbXBsYXRlPmAgYXMgdGhlIG9ubHkgY2hpbGQgb2YgeW91ciBgPG5nYi1yYXRpbmc+YCBlbGVtZW50XG5cdCAqL1xuXHRASW5wdXQoKSBzdGFyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPFN0YXJUZW1wbGF0ZUNvbnRleHQ+O1xuXHRAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmLCB7IHN0YXRpYzogZmFsc2UgfSkgc3RhclRlbXBsYXRlRnJvbUNvbnRlbnQ6IFRlbXBsYXRlUmVmPFN0YXJUZW1wbGF0ZUNvbnRleHQ+O1xuXG5cdC8qKlxuXHQgKiBBbGxvd3Mgc2V0dGluZyBhIGN1c3RvbSByYXRpbmcgdGFiaW5kZXguXG5cdCAqIElmIHRoZSBjb21wb25lbnQgaXMgZGlzYWJsZWQsIGB0YWJpbmRleGAgd2lsbCBzdGlsbCBiZSBzZXQgdG8gYC0xYC5cblx0ICpcblx0ICogQHNpbmNlIDEzLjEuMFxuXHQgKi9cblx0QElucHV0KCkgdGFiaW5kZXggPSB0aGlzLl9jb25maWcudGFiaW5kZXg7XG5cblx0LyoqXG5cdCAqIEFsbG93cyB0byBwcm92aWRlIGEgZnVuY3Rpb24gdG8gc2V0IGEgY3VzdG9tIGFyaWEtdmFsdWV0ZXh0XG5cdCAqXG5cdCAqIEBzaW5jZSAxNC4xLjBcblx0ICovXG5cdEBJbnB1dCgpIGFyaWFWYWx1ZVRleHQoY3VycmVudDogbnVtYmVyLCBtYXg6IG51bWJlcikge1xuXHRcdHJldHVybiBgJHtjdXJyZW50fSBvdXQgb2YgJHttYXh9YDtcblx0fVxuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgaXMgaG92ZXJpbmcgb3ZlciBhIGdpdmVuIHJhdGluZy5cblx0ICpcblx0ICogRXZlbnQgcGF5bG9hZCBlcXVhbHMgdG8gdGhlIHJhdGluZyBiZWluZyBob3ZlcmVkIG92ZXIuXG5cdCAqL1xuXHRAT3V0cHV0KCkgaG92ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIHN0b3BzIGhvdmVyaW5nIG92ZXIgYSBnaXZlbiByYXRpbmcuXG5cdCAqXG5cdCAqIEV2ZW50IHBheWxvYWQgZXF1YWxzIHRvIHRoZSByYXRpbmcgb2YgdGhlIGxhc3QgaXRlbSBiZWluZyBob3ZlcmVkIG92ZXIuXG5cdCAqL1xuXHRAT3V0cHV0KCkgbGVhdmUgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSByYXRpbmcgaXMgY2hhbmdlZC5cblx0ICpcblx0ICogRXZlbnQgcGF5bG9hZCBlcXVhbHMgdG8gdGhlIG5ld2x5IHNlbGVjdGVkIHJhdGluZy5cblx0ICovXG5cdEBPdXRwdXQoKSByYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KHRydWUpO1xuXG5cdG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG5cdG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG5cdGlzSW50ZXJhY3RpdmUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuICF0aGlzLnJlYWRvbmx5ICYmICF0aGlzLmRpc2FibGVkO1xuXHR9XG5cblx0ZW50ZXIodmFsdWU6IG51bWJlcik6IHZvaWQge1xuXHRcdGlmICh0aGlzLmlzSW50ZXJhY3RpdmUoKSkge1xuXHRcdFx0dGhpcy5fdXBkYXRlU3RhdGUodmFsdWUpO1xuXHRcdH1cblx0XHR0aGlzLmhvdmVyLmVtaXQodmFsdWUpO1xuXHR9XG5cblx0aGFuZGxlQmx1cigpIHtcblx0XHR0aGlzLm9uVG91Y2hlZCgpO1xuXHR9XG5cblx0aGFuZGxlQ2xpY2sodmFsdWU6IG51bWJlcikge1xuXHRcdGlmICh0aGlzLmlzSW50ZXJhY3RpdmUoKSkge1xuXHRcdFx0dGhpcy51cGRhdGUodGhpcy5yZXNldHRhYmxlICYmIHRoaXMucmF0ZSA9PT0gdmFsdWUgPyAwIDogdmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZUtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcblx0XHRzd2l0Y2ggKGV2ZW50LmtleSkge1xuXHRcdFx0Y2FzZSAnQXJyb3dEb3duJzpcblx0XHRcdGNhc2UgJ0Fycm93TGVmdCc6XG5cdFx0XHRcdHRoaXMudXBkYXRlKHRoaXMucmF0ZSAtIDEpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0Fycm93VXAnOlxuXHRcdFx0Y2FzZSAnQXJyb3dSaWdodCc6XG5cdFx0XHRcdHRoaXMudXBkYXRlKHRoaXMucmF0ZSArIDEpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0hvbWUnOlxuXHRcdFx0XHR0aGlzLnVwZGF0ZSgwKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdFbmQnOlxuXHRcdFx0XHR0aGlzLnVwZGF0ZSh0aGlzLm1heCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIG5vdGUgJ3JldHVybicgaW4gZGVmYXVsdCBjYXNlXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fVxuXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcblx0XHRpZiAoY2hhbmdlc1sncmF0ZSddKSB7XG5cdFx0XHR0aGlzLnVwZGF0ZSh0aGlzLnJhdGUpO1xuXHRcdH1cblx0XHRpZiAoY2hhbmdlc1snbWF4J10pIHtcblx0XHRcdHRoaXMuX3VwZGF0ZU1heCgpO1xuXHRcdH1cblx0fVxuXG5cdG5nT25Jbml0KCk6IHZvaWQge1xuXHRcdHRoaXMuX3NldHVwQ29udGV4dHMoKTtcblx0XHR0aGlzLl91cGRhdGVTdGF0ZSh0aGlzLnJhdGUpO1xuXHR9XG5cblx0cmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQge1xuXHRcdHRoaXMub25DaGFuZ2UgPSBmbjtcblx0fVxuXG5cdHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHtcblx0XHR0aGlzLm9uVG91Y2hlZCA9IGZuO1xuXHR9XG5cblx0cmVzZXQoKTogdm9pZCB7XG5cdFx0dGhpcy5sZWF2ZS5lbWl0KHRoaXMubmV4dFJhdGUpO1xuXHRcdHRoaXMuX3VwZGF0ZVN0YXRlKHRoaXMucmF0ZSk7XG5cdH1cblxuXHRzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcblx0XHR0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcblx0fVxuXG5cdHVwZGF0ZSh2YWx1ZTogbnVtYmVyLCBpbnRlcm5hbENoYW5nZSA9IHRydWUpOiB2b2lkIHtcblx0XHRjb25zdCBuZXdSYXRlID0gZ2V0VmFsdWVJblJhbmdlKHZhbHVlLCB0aGlzLm1heCwgMCk7XG5cdFx0aWYgKHRoaXMuaXNJbnRlcmFjdGl2ZSgpICYmIHRoaXMucmF0ZSAhPT0gbmV3UmF0ZSkge1xuXHRcdFx0dGhpcy5yYXRlID0gbmV3UmF0ZTtcblx0XHRcdHRoaXMucmF0ZUNoYW5nZS5lbWl0KHRoaXMucmF0ZSk7XG5cdFx0fVxuXHRcdGlmIChpbnRlcm5hbENoYW5nZSkge1xuXHRcdFx0dGhpcy5vbkNoYW5nZSh0aGlzLnJhdGUpO1xuXHRcdFx0dGhpcy5vblRvdWNoZWQoKTtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlU3RhdGUodGhpcy5yYXRlKTtcblx0fVxuXG5cdHdyaXRlVmFsdWUodmFsdWUpIHtcblx0XHR0aGlzLnVwZGF0ZSh2YWx1ZSwgZmFsc2UpO1xuXHRcdHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXHR9XG5cblx0cHJpdmF0ZSBfdXBkYXRlU3RhdGUobmV4dFZhbHVlOiBudW1iZXIpIHtcblx0XHR0aGlzLm5leHRSYXRlID0gbmV4dFZhbHVlO1xuXHRcdHRoaXMuY29udGV4dHMuZm9yRWFjaChcblx0XHRcdChjb250ZXh0LCBpbmRleCkgPT4gKGNvbnRleHQuZmlsbCA9IE1hdGgucm91bmQoZ2V0VmFsdWVJblJhbmdlKG5leHRWYWx1ZSAtIGluZGV4LCAxLCAwKSAqIDEwMCkpLFxuXHRcdCk7XG5cdH1cblxuXHRwcml2YXRlIF91cGRhdGVNYXgoKSB7XG5cdFx0aWYgKHRoaXMubWF4ID4gMCkge1xuXHRcdFx0dGhpcy5fc2V0dXBDb250ZXh0cygpO1xuXHRcdFx0dGhpcy51cGRhdGUodGhpcy5yYXRlKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9zZXR1cENvbnRleHRzKCkge1xuXHRcdHRoaXMuY29udGV4dHMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiB0aGlzLm1heCB9LCAodiwgaykgPT4gKHsgZmlsbDogMCwgaW5kZXg6IGsgfSkpO1xuXHR9XG59XG4iXX0=