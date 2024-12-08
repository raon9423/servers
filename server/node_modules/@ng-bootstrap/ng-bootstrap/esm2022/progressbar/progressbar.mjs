import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { getValueInRange, isNumber } from '../util/util';
import { NgbProgressbarConfig } from './progressbar-config';
import { PercentPipe } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * A directive that provides feedback on the progress of a workflow or an action.
 */
export class NgbProgressbar {
    /**
     * The maximal value to be displayed in the progress bar.
     *
     * Should be a positive number. Will default to 100 otherwise.
     */
    set max(max) {
        this._max = !isNumber(max) || max <= 0 ? 100 : max;
    }
    get max() {
        return this._max;
    }
    constructor() {
        this._config = inject(NgbProgressbarConfig);
        this.stacked = inject(NgbProgressbarStacked, { optional: true });
        /**
         * If `true`, the stripes on the progress bar are animated.
         *
         * Takes effect only for browsers supporting CSS3 animations, and if `striped` is `true`.
         */
        this.animated = this._config.animated;
        /**
         * The accessible progress bar name.
         *
         * @since 13.1.0
         */
        this.ariaLabel = this._config.ariaLabel;
        /**
         * If `true`, the progress bars will be displayed as striped.
         */
        this.striped = this._config.striped;
        /**
         * If `true`, the current percentage will be shown in the `xx%` format.
         */
        this.showValue = this._config.showValue;
        /**
         * Optional text variant type of the progress bar.
         *
         * Supports types based on Bootstrap background color variants, like:
         *  `"success"`, `"info"`, `"warning"`, `"danger"`, `"primary"`, `"secondary"`, `"dark"` and so on.
         *
         * @since 5.2.0
         */
        this.textType = this._config.textType;
        /**
         * The type of the progress bar.
         *
         * Supports types based on Bootstrap background color variants, like:
         *  `"success"`, `"info"`, `"warning"`, `"danger"`, `"primary"`, `"secondary"`, `"dark"` and so on.
         */
        this.type = this._config.type;
        /**
         * The current value for the progress bar.
         *
         * Should be in the `[0, max]` range.
         */
        this.value = 0;
        /**
         * The height of the progress bar.
         *
         * Accepts any valid CSS height values, ex. `"2rem"`
         */
        this.height = this._config.height;
        this.max = this._config.max;
    }
    getValue() {
        return getValueInRange(this.value, this.max);
    }
    getPercentValue() {
        return (100 * this.getValue()) / this.max;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbProgressbar, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.2", type: NgbProgressbar, isStandalone: true, selector: "ngb-progressbar", inputs: { max: "max", animated: "animated", ariaLabel: "ariaLabel", striped: "striped", showValue: "showValue", textType: "textType", type: "type", value: "value", height: "height" }, host: { attributes: { "role": "progressbar", "aria-valuemin": "0" }, properties: { "attr.aria-valuenow": "getValue()", "attr.aria-valuemax": "max", "attr.aria-label": "ariaLabel", "style.width.%": "stacked ? getPercentValue() : null", "style.height": "height" }, classAttribute: "progress" }, ngImport: i0, template: `
		<div
			class="progress-bar{{ type ? (textType ? ' bg-' + type : ' text-bg-' + type) : '' }}{{
				textType ? ' text-' + textType : ''
			}}"
			[class.progress-bar-animated]="animated"
			[class.progress-bar-striped]="striped"
			[style.width.%]="!stacked ? getPercentValue() : null"
		>
			@if (showValue) {
				<span i18n="@@ngb.progressbar.value">{{ getValue() / max | percent }}</span>
			}
			<ng-content />
		</div>
	`, isInline: true, dependencies: [{ kind: "pipe", type: PercentPipe, name: "percent" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbProgressbar, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-progressbar',
                    standalone: true,
                    imports: [PercentPipe],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'progress',
                        role: 'progressbar',
                        '[attr.aria-valuenow]': 'getValue()',
                        'aria-valuemin': '0',
                        '[attr.aria-valuemax]': 'max',
                        '[attr.aria-label]': 'ariaLabel',
                        '[style.width.%]': 'stacked ? getPercentValue() : null',
                        '[style.height]': 'height',
                    },
                    template: `
		<div
			class="progress-bar{{ type ? (textType ? ' bg-' + type : ' text-bg-' + type) : '' }}{{
				textType ? ' text-' + textType : ''
			}}"
			[class.progress-bar-animated]="animated"
			[class.progress-bar-striped]="striped"
			[style.width.%]="!stacked ? getPercentValue() : null"
		>
			@if (showValue) {
				<span i18n="@@ngb.progressbar.value">{{ getValue() / max | percent }}</span>
			}
			<ng-content />
		</div>
	`,
                }]
        }], ctorParameters: () => [], propDecorators: { max: [{
                type: Input
            }], animated: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], striped: [{
                type: Input
            }], showValue: [{
                type: Input
            }], textType: [{
                type: Input
            }], type: [{
                type: Input
            }], value: [{
                type: Input,
                args: [{ required: true }]
            }], height: [{
                type: Input
            }] } });
/**
 * A directive that allow to stack progress bars.
 *
 * @since 16.0.0
 */
export class NgbProgressbarStacked {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbProgressbarStacked, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.2", type: NgbProgressbarStacked, isStandalone: true, selector: "ngb-progressbar-stacked", host: { classAttribute: "progress-stacked" }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbProgressbarStacked, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-progressbar-stacked',
                    standalone: true,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'progress-stacked',
                    },
                    template: `<ng-content></ng-content>`,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3NiYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JHLE9BQU8sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFFOUM7O0dBRUc7QUFpQ0gsTUFBTSxPQUFPLGNBQWM7SUFLMUI7Ozs7T0FJRztJQUNILElBQ0ksR0FBRyxDQUFDLEdBQVc7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNwRCxDQUFDO0lBRUQsSUFBSSxHQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2xCLENBQUM7SUEwREQ7UUExRVEsWUFBTyxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3hDLFlBQU8sR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQWlCbkU7Ozs7V0FJRztRQUNNLGFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUUxQzs7OztXQUlHO1FBQ00sY0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBRTVDOztXQUVHO1FBQ00sWUFBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBRXhDOztXQUVHO1FBQ00sY0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBRTVDOzs7Ozs7O1dBT0c7UUFDTSxhQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFFMUM7Ozs7O1dBS0c7UUFDTSxTQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFFbEM7Ozs7V0FJRztRQUN3QixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBRXJDOzs7O1dBSUc7UUFDTSxXQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFHckMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUM3QixDQUFDO0lBRUQsUUFBUTtRQUNQLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxlQUFlO1FBQ2QsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQzNDLENBQUM7OEdBckZXLGNBQWM7a0dBQWQsY0FBYyx3aUJBaEJoQjs7Ozs7Ozs7Ozs7Ozs7RUFjVCx1REEzQlMsV0FBVzs7MkZBNkJULGNBQWM7a0JBaEMxQixTQUFTO21CQUFDO29CQUNWLFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7b0JBQ3RCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNMLEtBQUssRUFBRSxVQUFVO3dCQUNqQixJQUFJLEVBQUUsYUFBYTt3QkFDbkIsc0JBQXNCLEVBQUUsWUFBWTt3QkFDcEMsZUFBZSxFQUFFLEdBQUc7d0JBQ3BCLHNCQUFzQixFQUFFLEtBQUs7d0JBQzdCLG1CQUFtQixFQUFFLFdBQVc7d0JBQ2hDLGlCQUFpQixFQUFFLG9DQUFvQzt3QkFDdkQsZ0JBQWdCLEVBQUUsUUFBUTtxQkFDMUI7b0JBQ0QsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7OztFQWNUO2lCQUNEO3dEQVlJLEdBQUc7c0JBRE4sS0FBSztnQkFjRyxRQUFRO3NCQUFoQixLQUFLO2dCQU9HLFNBQVM7c0JBQWpCLEtBQUs7Z0JBS0csT0FBTztzQkFBZixLQUFLO2dCQUtHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBVUcsUUFBUTtzQkFBaEIsS0FBSztnQkFRRyxJQUFJO3NCQUFaLEtBQUs7Z0JBT3FCLEtBQUs7c0JBQS9CLEtBQUs7dUJBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQU9oQixNQUFNO3NCQUFkLEtBQUs7O0FBZVA7Ozs7R0FJRztBQVdILE1BQU0sT0FBTyxxQkFBcUI7OEdBQXJCLHFCQUFxQjtrR0FBckIscUJBQXFCLGlJQUZ2QiwyQkFBMkI7OzJGQUV6QixxQkFBcUI7a0JBVmpDLFNBQVM7bUJBQUM7b0JBQ1YsUUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNMLEtBQUssRUFBRSxrQkFBa0I7cUJBQ3pCO29CQUNELFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgaW5qZWN0LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGdldFZhbHVlSW5SYW5nZSwgaXNOdW1iZXIgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgTmdiUHJvZ3Jlc3NiYXJDb25maWcgfSBmcm9tICcuL3Byb2dyZXNzYmFyLWNvbmZpZyc7XG5pbXBvcnQgeyBQZXJjZW50UGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBwcm92aWRlcyBmZWVkYmFjayBvbiB0aGUgcHJvZ3Jlc3Mgb2YgYSB3b3JrZmxvdyBvciBhbiBhY3Rpb24uXG4gKi9cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25nYi1wcm9ncmVzc2JhcicsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGltcG9ydHM6IFtQZXJjZW50UGlwZV0sXG5cdGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRob3N0OiB7XG5cdFx0Y2xhc3M6ICdwcm9ncmVzcycsXG5cdFx0cm9sZTogJ3Byb2dyZXNzYmFyJyxcblx0XHQnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAnZ2V0VmFsdWUoKScsXG5cdFx0J2FyaWEtdmFsdWVtaW4nOiAnMCcsXG5cdFx0J1thdHRyLmFyaWEtdmFsdWVtYXhdJzogJ21heCcsXG5cdFx0J1thdHRyLmFyaWEtbGFiZWxdJzogJ2FyaWFMYWJlbCcsXG5cdFx0J1tzdHlsZS53aWR0aC4lXSc6ICdzdGFja2VkID8gZ2V0UGVyY2VudFZhbHVlKCkgOiBudWxsJyxcblx0XHQnW3N0eWxlLmhlaWdodF0nOiAnaGVpZ2h0Jyxcblx0fSxcblx0dGVtcGxhdGU6IGBcblx0XHQ8ZGl2XG5cdFx0XHRjbGFzcz1cInByb2dyZXNzLWJhcnt7IHR5cGUgPyAodGV4dFR5cGUgPyAnIGJnLScgKyB0eXBlIDogJyB0ZXh0LWJnLScgKyB0eXBlKSA6ICcnIH19e3tcblx0XHRcdFx0dGV4dFR5cGUgPyAnIHRleHQtJyArIHRleHRUeXBlIDogJydcblx0XHRcdH19XCJcblx0XHRcdFtjbGFzcy5wcm9ncmVzcy1iYXItYW5pbWF0ZWRdPVwiYW5pbWF0ZWRcIlxuXHRcdFx0W2NsYXNzLnByb2dyZXNzLWJhci1zdHJpcGVkXT1cInN0cmlwZWRcIlxuXHRcdFx0W3N0eWxlLndpZHRoLiVdPVwiIXN0YWNrZWQgPyBnZXRQZXJjZW50VmFsdWUoKSA6IG51bGxcIlxuXHRcdD5cblx0XHRcdEBpZiAoc2hvd1ZhbHVlKSB7XG5cdFx0XHRcdDxzcGFuIGkxOG49XCJAQG5nYi5wcm9ncmVzc2Jhci52YWx1ZVwiPnt7IGdldFZhbHVlKCkgLyBtYXggfCBwZXJjZW50IH19PC9zcGFuPlxuXHRcdFx0fVxuXHRcdFx0PG5nLWNvbnRlbnQgLz5cblx0XHQ8L2Rpdj5cblx0YCxcbn0pXG5leHBvcnQgY2xhc3MgTmdiUHJvZ3Jlc3NiYXIge1xuXHRwcml2YXRlIF9jb25maWcgPSBpbmplY3QoTmdiUHJvZ3Jlc3NiYXJDb25maWcpO1xuXHRwdWJsaWMgc3RhY2tlZCA9IGluamVjdChOZ2JQcm9ncmVzc2JhclN0YWNrZWQsIHsgb3B0aW9uYWw6IHRydWUgfSk7XG5cdHByaXZhdGUgX21heDogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgbWF4aW1hbCB2YWx1ZSB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIHByb2dyZXNzIGJhci5cblx0ICpcblx0ICogU2hvdWxkIGJlIGEgcG9zaXRpdmUgbnVtYmVyLiBXaWxsIGRlZmF1bHQgdG8gMTAwIG90aGVyd2lzZS5cblx0ICovXG5cdEBJbnB1dCgpXG5cdHNldCBtYXgobWF4OiBudW1iZXIpIHtcblx0XHR0aGlzLl9tYXggPSAhaXNOdW1iZXIobWF4KSB8fCBtYXggPD0gMCA/IDEwMCA6IG1heDtcblx0fVxuXG5cdGdldCBtYXgoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5fbWF4O1xuXHR9XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgdGhlIHN0cmlwZXMgb24gdGhlIHByb2dyZXNzIGJhciBhcmUgYW5pbWF0ZWQuXG5cdCAqXG5cdCAqIFRha2VzIGVmZmVjdCBvbmx5IGZvciBicm93c2VycyBzdXBwb3J0aW5nIENTUzMgYW5pbWF0aW9ucywgYW5kIGlmIGBzdHJpcGVkYCBpcyBgdHJ1ZWAuXG5cdCAqL1xuXHRASW5wdXQoKSBhbmltYXRlZCA9IHRoaXMuX2NvbmZpZy5hbmltYXRlZDtcblxuXHQvKipcblx0ICogVGhlIGFjY2Vzc2libGUgcHJvZ3Jlc3MgYmFyIG5hbWUuXG5cdCAqXG5cdCAqIEBzaW5jZSAxMy4xLjBcblx0ICovXG5cdEBJbnB1dCgpIGFyaWFMYWJlbCA9IHRoaXMuX2NvbmZpZy5hcmlhTGFiZWw7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgdGhlIHByb2dyZXNzIGJhcnMgd2lsbCBiZSBkaXNwbGF5ZWQgYXMgc3RyaXBlZC5cblx0ICovXG5cdEBJbnB1dCgpIHN0cmlwZWQgPSB0aGlzLl9jb25maWcuc3RyaXBlZDtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB0aGUgY3VycmVudCBwZXJjZW50YWdlIHdpbGwgYmUgc2hvd24gaW4gdGhlIGB4eCVgIGZvcm1hdC5cblx0ICovXG5cdEBJbnB1dCgpIHNob3dWYWx1ZSA9IHRoaXMuX2NvbmZpZy5zaG93VmFsdWU7XG5cblx0LyoqXG5cdCAqIE9wdGlvbmFsIHRleHQgdmFyaWFudCB0eXBlIG9mIHRoZSBwcm9ncmVzcyBiYXIuXG5cdCAqXG5cdCAqIFN1cHBvcnRzIHR5cGVzIGJhc2VkIG9uIEJvb3RzdHJhcCBiYWNrZ3JvdW5kIGNvbG9yIHZhcmlhbnRzLCBsaWtlOlxuXHQgKiAgYFwic3VjY2Vzc1wiYCwgYFwiaW5mb1wiYCwgYFwid2FybmluZ1wiYCwgYFwiZGFuZ2VyXCJgLCBgXCJwcmltYXJ5XCJgLCBgXCJzZWNvbmRhcnlcImAsIGBcImRhcmtcImAgYW5kIHNvIG9uLlxuXHQgKlxuXHQgKiBAc2luY2UgNS4yLjBcblx0ICovXG5cdEBJbnB1dCgpIHRleHRUeXBlID0gdGhpcy5fY29uZmlnLnRleHRUeXBlO1xuXG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiB0aGUgcHJvZ3Jlc3MgYmFyLlxuXHQgKlxuXHQgKiBTdXBwb3J0cyB0eXBlcyBiYXNlZCBvbiBCb290c3RyYXAgYmFja2dyb3VuZCBjb2xvciB2YXJpYW50cywgbGlrZTpcblx0ICogIGBcInN1Y2Nlc3NcImAsIGBcImluZm9cImAsIGBcIndhcm5pbmdcImAsIGBcImRhbmdlclwiYCwgYFwicHJpbWFyeVwiYCwgYFwic2Vjb25kYXJ5XCJgLCBgXCJkYXJrXCJgIGFuZCBzbyBvbi5cblx0ICovXG5cdEBJbnB1dCgpIHR5cGUgPSB0aGlzLl9jb25maWcudHlwZTtcblxuXHQvKipcblx0ICogVGhlIGN1cnJlbnQgdmFsdWUgZm9yIHRoZSBwcm9ncmVzcyBiYXIuXG5cdCAqXG5cdCAqIFNob3VsZCBiZSBpbiB0aGUgYFswLCBtYXhdYCByYW5nZS5cblx0ICovXG5cdEBJbnB1dCh7IHJlcXVpcmVkOiB0cnVlIH0pIHZhbHVlID0gMDtcblxuXHQvKipcblx0ICogVGhlIGhlaWdodCBvZiB0aGUgcHJvZ3Jlc3MgYmFyLlxuXHQgKlxuXHQgKiBBY2NlcHRzIGFueSB2YWxpZCBDU1MgaGVpZ2h0IHZhbHVlcywgZXguIGBcIjJyZW1cImBcblx0ICovXG5cdEBJbnB1dCgpIGhlaWdodCA9IHRoaXMuX2NvbmZpZy5oZWlnaHQ7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5tYXggPSB0aGlzLl9jb25maWcubWF4O1xuXHR9XG5cblx0Z2V0VmFsdWUoKSB7XG5cdFx0cmV0dXJuIGdldFZhbHVlSW5SYW5nZSh0aGlzLnZhbHVlLCB0aGlzLm1heCk7XG5cdH1cblxuXHRnZXRQZXJjZW50VmFsdWUoKSB7XG5cdFx0cmV0dXJuICgxMDAgKiB0aGlzLmdldFZhbHVlKCkpIC8gdGhpcy5tYXg7XG5cdH1cbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFsbG93IHRvIHN0YWNrIHByb2dyZXNzIGJhcnMuXG4gKlxuICogQHNpbmNlIDE2LjAuMFxuICovXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICduZ2ItcHJvZ3Jlc3NiYXItc3RhY2tlZCcsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRob3N0OiB7XG5cdFx0Y2xhc3M6ICdwcm9ncmVzcy1zdGFja2VkJyxcblx0fSxcblx0dGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbn0pXG5leHBvcnQgY2xhc3MgTmdiUHJvZ3Jlc3NiYXJTdGFja2VkIHt9XG4iXX0=