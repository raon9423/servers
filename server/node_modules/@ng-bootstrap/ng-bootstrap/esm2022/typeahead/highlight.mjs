import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { regExpEscape, removeAccents, toString } from '../util/util';
import * as i0 from "@angular/core";
/**
 * A component that helps with text highlighting.
 *
 * It splits the `result` text into parts that contain the searched `term` and generates the HTML markup to simplify
 * highlighting:
 *
 * Ex. `result="Alaska"` and `term="as"` will produce `Al<span class="ngb-highlight">as</span>ka`.
 */
export class NgbHighlight {
    constructor() {
        /**
         * The CSS class for `<span>` elements wrapping the `term` inside the `result`.
         */
        this.highlightClass = 'ngb-highlight';
        /**
         * Boolean option to determine if the highlighting should be sensitive to accents or not.
         *
         * This feature is only available for browsers that implement the `String.normalize` function
         * (typically not Internet Explorer).
         * If you want to use this feature in a browser that does not implement `String.normalize`,
         * you will have to include a polyfill in your application (`unorm` for example).
         *
         * @since 9.1.0
         */
        this.accentSensitive = true;
    }
    ngOnChanges(changes) {
        if (!this.accentSensitive && !String.prototype.normalize) {
            console.warn('The `accentSensitive` input in `ngb-highlight` cannot be set to `false` in a browser ' +
                'that does not implement the `String.normalize` function. ' +
                'You will have to include a polyfill in your application to use this feature in the current browser.');
            this.accentSensitive = true;
        }
        const result = toString(this.result);
        const terms = Array.isArray(this.term) ? this.term : [this.term];
        const prepareTerm = (term) => (this.accentSensitive ? term : removeAccents(term));
        const escapedTerms = terms.map((term) => regExpEscape(prepareTerm(toString(term)))).filter((term) => term);
        const toSplit = this.accentSensitive ? result : removeAccents(result);
        const parts = escapedTerms.length ? toSplit.split(new RegExp(`(${escapedTerms.join('|')})`, 'gmi')) : [result];
        if (this.accentSensitive) {
            this.parts = parts;
        }
        else {
            let offset = 0;
            this.parts = parts.map((part) => result.substring(offset, (offset += part.length)));
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbHighlight, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.2", type: NgbHighlight, isStandalone: true, selector: "ngb-highlight", inputs: { highlightClass: "highlightClass", result: "result", term: "term", accentSensitive: "accentSensitive" }, usesOnChanges: true, ngImport: i0, template: `
		@for (part of parts; track $index) {
			@if ($odd) {
				<span class="{{ highlightClass }}">{{ part }}</span>
			} @else {
				<ng-container>{{ part }}</ng-container>
			}
		}
	`, isInline: true, styles: [".ngb-highlight{font-weight:700}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbHighlight, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-highlight', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: `
		@for (part of parts; track $index) {
			@if ($odd) {
				<span class="{{ highlightClass }}">{{ part }}</span>
			} @else {
				<ng-container>{{ part }}</ng-container>
			}
		}
	`, styles: [".ngb-highlight{font-weight:700}\n"] }]
        }], propDecorators: { highlightClass: [{
                type: Input
            }], result: [{
                type: Input,
                args: [{ required: true }]
            }], term: [{
                type: Input,
                args: [{ required: true }]
            }], accentSensitive: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3R5cGVhaGVhZC9oaWdobGlnaHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQTRCLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7QUFFckU7Ozs7Ozs7R0FPRztBQWlCSCxNQUFNLE9BQU8sWUFBWTtJQWhCekI7UUFtQkM7O1dBRUc7UUFDTSxtQkFBYyxHQUFHLGVBQWUsQ0FBQztRQWdCMUM7Ozs7Ozs7OztXQVNHO1FBQ00sb0JBQWUsR0FBRyxJQUFJLENBQUM7S0EyQmhDO0lBekJBLFdBQVcsQ0FBQyxPQUFzQjtRQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDMUQsT0FBTyxDQUFDLElBQUksQ0FDWCx1RkFBdUY7Z0JBQ3RGLDJEQUEyRDtnQkFDM0QscUdBQXFHLENBQ3RHLENBQUM7WUFDRixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUM3QixDQUFDO1FBQ0QsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVyQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsRixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNHLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRFLE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvRyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNwQixDQUFDO2FBQU0sQ0FBQztZQUNQLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRixDQUFDO0lBQ0YsQ0FBQzs4R0ExRFcsWUFBWTtrR0FBWixZQUFZLGdOQVhkOzs7Ozs7OztFQVFUOzsyRkFHVyxZQUFZO2tCQWhCeEIsU0FBUzsrQkFDQyxlQUFlLGNBQ2IsSUFBSSxtQkFDQyx1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFlBQzNCOzs7Ozs7OztFQVFUOzhCQVNRLGNBQWM7c0JBQXRCLEtBQUs7Z0JBUXFCLE1BQU07c0JBQWhDLEtBQUs7dUJBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQU1FLElBQUk7c0JBQTlCLEtBQUs7dUJBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQVloQixlQUFlO3NCQUF2QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHJlZ0V4cEVzY2FwZSwgcmVtb3ZlQWNjZW50cywgdG9TdHJpbmcgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG4vKipcbiAqIEEgY29tcG9uZW50IHRoYXQgaGVscHMgd2l0aCB0ZXh0IGhpZ2hsaWdodGluZy5cbiAqXG4gKiBJdCBzcGxpdHMgdGhlIGByZXN1bHRgIHRleHQgaW50byBwYXJ0cyB0aGF0IGNvbnRhaW4gdGhlIHNlYXJjaGVkIGB0ZXJtYCBhbmQgZ2VuZXJhdGVzIHRoZSBIVE1MIG1hcmt1cCB0byBzaW1wbGlmeVxuICogaGlnaGxpZ2h0aW5nOlxuICpcbiAqIEV4LiBgcmVzdWx0PVwiQWxhc2thXCJgIGFuZCBgdGVybT1cImFzXCJgIHdpbGwgcHJvZHVjZSBgQWw8c3BhbiBjbGFzcz1cIm5nYi1oaWdobGlnaHRcIj5hczwvc3Bhbj5rYWAuXG4gKi9cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25nYi1oaWdobGlnaHQnLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcblx0dGVtcGxhdGU6IGBcblx0XHRAZm9yIChwYXJ0IG9mIHBhcnRzOyB0cmFjayAkaW5kZXgpIHtcblx0XHRcdEBpZiAoJG9kZCkge1xuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cInt7IGhpZ2hsaWdodENsYXNzIH19XCI+e3sgcGFydCB9fTwvc3Bhbj5cblx0XHRcdH0gQGVsc2Uge1xuXHRcdFx0XHQ8bmctY29udGFpbmVyPnt7IHBhcnQgfX08L25nLWNvbnRhaW5lcj5cblx0XHRcdH1cblx0XHR9XG5cdGAsXG5cdHN0eWxlVXJsOiAnLi9oaWdobGlnaHQuc2NzcycsXG59KVxuZXhwb3J0IGNsYXNzIE5nYkhpZ2hsaWdodCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cdHBhcnRzOiBzdHJpbmdbXTtcblxuXHQvKipcblx0ICogVGhlIENTUyBjbGFzcyBmb3IgYDxzcGFuPmAgZWxlbWVudHMgd3JhcHBpbmcgdGhlIGB0ZXJtYCBpbnNpZGUgdGhlIGByZXN1bHRgLlxuXHQgKi9cblx0QElucHV0KCkgaGlnaGxpZ2h0Q2xhc3MgPSAnbmdiLWhpZ2hsaWdodCc7XG5cblx0LyoqXG5cdCAqIFRoZSB0ZXh0IGhpZ2hsaWdodGluZyBpcyBhZGRlZCB0by5cblx0ICpcblx0ICogSWYgdGhlIGB0ZXJtYCBpcyBmb3VuZCBpbnNpZGUgdGhpcyB0ZXh0LCBpdCB3aWxsIGJlIGhpZ2hsaWdodGVkLlxuXHQgKiBJZiB0aGUgYHRlcm1gIGNvbnRhaW5zIGFycmF5IHRoZW4gYWxsIHRoZSBpdGVtcyBmcm9tIGl0IHdpbGwgYmUgaGlnaGxpZ2h0ZWQgaW5zaWRlIHRoZSB0ZXh0LlxuXHQgKi9cblx0QElucHV0KHsgcmVxdWlyZWQ6IHRydWUgfSkgcmVzdWx0Pzogc3RyaW5nIHwgbnVsbDtcblxuXHQvKipcblx0ICogVGhlIHRlcm0gb3IgYXJyYXkgb2YgdGVybXMgdG8gYmUgaGlnaGxpZ2h0ZWQuXG5cdCAqIFNpbmNlIHZlcnNpb24gYHY0LjIuMGAgdGVybSBjb3VsZCBiZSBhIGBzdHJpbmdbXWBcblx0ICovXG5cdEBJbnB1dCh7IHJlcXVpcmVkOiB0cnVlIH0pIHRlcm06IHN0cmluZyB8IHJlYWRvbmx5IHN0cmluZ1tdO1xuXG5cdC8qKlxuXHQgKiBCb29sZWFuIG9wdGlvbiB0byBkZXRlcm1pbmUgaWYgdGhlIGhpZ2hsaWdodGluZyBzaG91bGQgYmUgc2Vuc2l0aXZlIHRvIGFjY2VudHMgb3Igbm90LlxuXHQgKlxuXHQgKiBUaGlzIGZlYXR1cmUgaXMgb25seSBhdmFpbGFibGUgZm9yIGJyb3dzZXJzIHRoYXQgaW1wbGVtZW50IHRoZSBgU3RyaW5nLm5vcm1hbGl6ZWAgZnVuY3Rpb25cblx0ICogKHR5cGljYWxseSBub3QgSW50ZXJuZXQgRXhwbG9yZXIpLlxuXHQgKiBJZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBmZWF0dXJlIGluIGEgYnJvd3NlciB0aGF0IGRvZXMgbm90IGltcGxlbWVudCBgU3RyaW5nLm5vcm1hbGl6ZWAsXG5cdCAqIHlvdSB3aWxsIGhhdmUgdG8gaW5jbHVkZSBhIHBvbHlmaWxsIGluIHlvdXIgYXBwbGljYXRpb24gKGB1bm9ybWAgZm9yIGV4YW1wbGUpLlxuXHQgKlxuXHQgKiBAc2luY2UgOS4xLjBcblx0ICovXG5cdEBJbnB1dCgpIGFjY2VudFNlbnNpdGl2ZSA9IHRydWU7XG5cblx0bmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuXHRcdGlmICghdGhpcy5hY2NlbnRTZW5zaXRpdmUgJiYgIVN0cmluZy5wcm90b3R5cGUubm9ybWFsaXplKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdCdUaGUgYGFjY2VudFNlbnNpdGl2ZWAgaW5wdXQgaW4gYG5nYi1oaWdobGlnaHRgIGNhbm5vdCBiZSBzZXQgdG8gYGZhbHNlYCBpbiBhIGJyb3dzZXIgJyArXG5cdFx0XHRcdFx0J3RoYXQgZG9lcyBub3QgaW1wbGVtZW50IHRoZSBgU3RyaW5nLm5vcm1hbGl6ZWAgZnVuY3Rpb24uICcgK1xuXHRcdFx0XHRcdCdZb3Ugd2lsbCBoYXZlIHRvIGluY2x1ZGUgYSBwb2x5ZmlsbCBpbiB5b3VyIGFwcGxpY2F0aW9uIHRvIHVzZSB0aGlzIGZlYXR1cmUgaW4gdGhlIGN1cnJlbnQgYnJvd3Nlci4nLFxuXHRcdFx0KTtcblx0XHRcdHRoaXMuYWNjZW50U2Vuc2l0aXZlID0gdHJ1ZTtcblx0XHR9XG5cdFx0Y29uc3QgcmVzdWx0ID0gdG9TdHJpbmcodGhpcy5yZXN1bHQpO1xuXG5cdFx0Y29uc3QgdGVybXMgPSBBcnJheS5pc0FycmF5KHRoaXMudGVybSkgPyB0aGlzLnRlcm0gOiBbdGhpcy50ZXJtXTtcblx0XHRjb25zdCBwcmVwYXJlVGVybSA9ICh0ZXJtKSA9PiAodGhpcy5hY2NlbnRTZW5zaXRpdmUgPyB0ZXJtIDogcmVtb3ZlQWNjZW50cyh0ZXJtKSk7XG5cdFx0Y29uc3QgZXNjYXBlZFRlcm1zID0gdGVybXMubWFwKCh0ZXJtKSA9PiByZWdFeHBFc2NhcGUocHJlcGFyZVRlcm0odG9TdHJpbmcodGVybSkpKSkuZmlsdGVyKCh0ZXJtKSA9PiB0ZXJtKTtcblx0XHRjb25zdCB0b1NwbGl0ID0gdGhpcy5hY2NlbnRTZW5zaXRpdmUgPyByZXN1bHQgOiByZW1vdmVBY2NlbnRzKHJlc3VsdCk7XG5cblx0XHRjb25zdCBwYXJ0cyA9IGVzY2FwZWRUZXJtcy5sZW5ndGggPyB0b1NwbGl0LnNwbGl0KG5ldyBSZWdFeHAoYCgke2VzY2FwZWRUZXJtcy5qb2luKCd8Jyl9KWAsICdnbWknKSkgOiBbcmVzdWx0XTtcblxuXHRcdGlmICh0aGlzLmFjY2VudFNlbnNpdGl2ZSkge1xuXHRcdFx0dGhpcy5wYXJ0cyA9IHBhcnRzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgb2Zmc2V0ID0gMDtcblx0XHRcdHRoaXMucGFydHMgPSBwYXJ0cy5tYXAoKHBhcnQpID0+IHJlc3VsdC5zdWJzdHJpbmcob2Zmc2V0LCAob2Zmc2V0ICs9IHBhcnQubGVuZ3RoKSkpO1xuXHRcdH1cblx0fVxufVxuIl19