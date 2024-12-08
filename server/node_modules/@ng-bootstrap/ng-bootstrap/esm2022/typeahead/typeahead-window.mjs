import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { toString } from '../util/util';
import { NgbHighlight } from './highlight';
import { NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
export class NgbTypeaheadWindow {
    constructor() {
        this.activeIdx = 0;
        /**
         * Flag indicating if the first row should be active initially
         */
        this.focusFirst = true;
        /**
         * A function used to format a given result before display. This function should return a formatted string without any
         * HTML markup
         */
        this.formatter = toString;
        /**
         * Event raised when user selects a particular result row
         */
        this.selectEvent = new EventEmitter();
        this.activeChangeEvent = new EventEmitter();
    }
    hasActive() {
        return this.activeIdx > -1 && this.activeIdx < this.results.length;
    }
    getActive() {
        return this.results[this.activeIdx];
    }
    markActive(activeIdx) {
        this.activeIdx = activeIdx;
        this._activeChanged();
    }
    next() {
        if (this.activeIdx === this.results.length - 1) {
            this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
        }
        else {
            this.activeIdx++;
        }
        this._activeChanged();
    }
    prev() {
        if (this.activeIdx < 0) {
            this.activeIdx = this.results.length - 1;
        }
        else if (this.activeIdx === 0) {
            this.activeIdx = this.focusFirst ? this.results.length - 1 : -1;
        }
        else {
            this.activeIdx--;
        }
        this._activeChanged();
    }
    resetActive() {
        this.activeIdx = this.focusFirst ? 0 : -1;
        this._activeChanged();
    }
    select(item) {
        this.selectEvent.emit(item);
    }
    ngOnInit() {
        this.resetActive();
    }
    _activeChanged() {
        this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTypeaheadWindow, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.2", type: NgbTypeaheadWindow, isStandalone: true, selector: "ngb-typeahead-window", inputs: { id: "id", focusFirst: "focusFirst", results: "results", term: "term", formatter: "formatter", resultTemplate: "resultTemplate", popupClass: "popupClass" }, outputs: { selectEvent: "select", activeChangeEvent: "activeChange" }, host: { attributes: { "role": "listbox" }, listeners: { "mousedown": "$event.preventDefault()" }, properties: { "class": "\"dropdown-menu show\" + (popupClass ? \" \" + popupClass : \"\")", "id": "id" } }, exportAs: ["ngbTypeaheadWindow"], ngImport: i0, template: `
		<ng-template #rt let-result="result" let-term="term" let-formatter="formatter">
			<ngb-highlight [result]="formatter(result)" [term]="term" />
		</ng-template>
		@for (result of results; track $index) {
			<button
				type="button"
				class="dropdown-item"
				role="option"
				[id]="id + '-' + $index"
				[class.active]="$index === activeIdx"
				(mouseenter)="markActive($index)"
				(click)="select(result)"
			>
				<ng-template
					[ngTemplateOutlet]="resultTemplate || rt"
					[ngTemplateOutletContext]="{ result: result, term: term, formatter: formatter }"
				/>
			</button>
		}
	`, isInline: true, dependencies: [{ kind: "component", type: NgbHighlight, selector: "ngb-highlight", inputs: ["highlightClass", "result", "term", "accentSensitive"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTypeaheadWindow, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-typeahead-window',
                    exportAs: 'ngbTypeaheadWindow',
                    standalone: true,
                    imports: [NgbHighlight, NgTemplateOutlet],
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '(mousedown)': '$event.preventDefault()',
                        '[class]': '"dropdown-menu show" + (popupClass ? " " + popupClass : "")',
                        role: 'listbox',
                        '[id]': 'id',
                    },
                    template: `
		<ng-template #rt let-result="result" let-term="term" let-formatter="formatter">
			<ngb-highlight [result]="formatter(result)" [term]="term" />
		</ng-template>
		@for (result of results; track $index) {
			<button
				type="button"
				class="dropdown-item"
				role="option"
				[id]="id + '-' + $index"
				[class.active]="$index === activeIdx"
				(mouseenter)="markActive($index)"
				(click)="select(result)"
			>
				<ng-template
					[ngTemplateOutlet]="resultTemplate || rt"
					[ngTemplateOutletContext]="{ result: result, term: term, formatter: formatter }"
				/>
			</button>
		}
	`,
                }]
        }], propDecorators: { id: [{
                type: Input
            }], focusFirst: [{
                type: Input
            }], results: [{
                type: Input
            }], term: [{
                type: Input
            }], formatter: [{
                type: Input
            }], resultTemplate: [{
                type: Input
            }], popupClass: [{
                type: Input
            }], selectEvent: [{
                type: Output,
                args: ['select']
            }], activeChangeEvent: [{
                type: Output,
                args: ['activeChange']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWFoZWFkLXdpbmRvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90eXBlYWhlYWQvdHlwZWFoZWFkLXdpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFlLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRS9HLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDeEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUF3RG5ELE1BQU0sT0FBTyxrQkFBa0I7SUFsQy9CO1FBbUNDLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFRZDs7V0FFRztRQUNNLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFZM0I7OztXQUdHO1FBQ00sY0FBUyxHQUFHLFFBQVEsQ0FBQztRQWM5Qjs7V0FFRztRQUNlLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUzQixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0tBbUQvRDtJQWpEQSxTQUFTO1FBQ1IsT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDcEUsQ0FBQztJQUVELFNBQVM7UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxVQUFVLENBQUMsU0FBaUI7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJO1FBQ0gsSUFBSSxJQUFJLENBQUMsU0FB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O3VCQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgdG9TdHJpbmcgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgTmdiSGlnaGxpZ2h0IH0gZnJvbSAnLi9oaWdobGlnaHQnO1xuaW1wb3J0IHsgTmdUZW1wbGF0ZU91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKlxuICogVGhlIGNvbnRleHQgZm9yIHRoZSB0eXBlYWhlYWQgcmVzdWx0IHRlbXBsYXRlIGluIGNhc2UgeW91IHdhbnQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb25lLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc3VsdFRlbXBsYXRlQ29udGV4dCB7XG5cdC8qKlxuXHQgKiBZb3VyIHR5cGVhaGVhZCByZXN1bHQgaXRlbS5cblx0ICovXG5cdHJlc3VsdDogYW55O1xuXG5cdC8qKlxuXHQgKiBTZWFyY2ggdGVybSBmcm9tIHRoZSBgPGlucHV0PmAgdXNlZCB0byBnZXQgY3VycmVudCByZXN1bHQuXG5cdCAqL1xuXHR0ZXJtOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSBmdW5jdGlvbiB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN1bHQgaW50byBhIHN0cmluZ1xuXHQgKi9cblx0Zm9ybWF0dGVyOiAocmVzdWx0OiBhbnkpID0+IHN0cmluZztcbn1cblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLXR5cGVhaGVhZC13aW5kb3cnLFxuXHRleHBvcnRBczogJ25nYlR5cGVhaGVhZFdpbmRvdycsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGltcG9ydHM6IFtOZ2JIaWdobGlnaHQsIE5nVGVtcGxhdGVPdXRsZXRdLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRob3N0OiB7XG5cdFx0Jyhtb3VzZWRvd24pJzogJyRldmVudC5wcmV2ZW50RGVmYXVsdCgpJyxcblx0XHQnW2NsYXNzXSc6ICdcImRyb3Bkb3duLW1lbnUgc2hvd1wiICsgKHBvcHVwQ2xhc3MgPyBcIiBcIiArIHBvcHVwQ2xhc3MgOiBcIlwiKScsXG5cdFx0cm9sZTogJ2xpc3Rib3gnLFxuXHRcdCdbaWRdJzogJ2lkJyxcblx0fSxcblx0dGVtcGxhdGU6IGBcblx0XHQ8bmctdGVtcGxhdGUgI3J0IGxldC1yZXN1bHQ9XCJyZXN1bHRcIiBsZXQtdGVybT1cInRlcm1cIiBsZXQtZm9ybWF0dGVyPVwiZm9ybWF0dGVyXCI+XG5cdFx0XHQ8bmdiLWhpZ2hsaWdodCBbcmVzdWx0XT1cImZvcm1hdHRlcihyZXN1bHQpXCIgW3Rlcm1dPVwidGVybVwiIC8+XG5cdFx0PC9uZy10ZW1wbGF0ZT5cblx0XHRAZm9yIChyZXN1bHQgb2YgcmVzdWx0czsgdHJhY2sgJGluZGV4KSB7XG5cdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdHR5cGU9XCJidXR0b25cIlxuXHRcdFx0XHRjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIlxuXHRcdFx0XHRyb2xlPVwib3B0aW9uXCJcblx0XHRcdFx0W2lkXT1cImlkICsgJy0nICsgJGluZGV4XCJcblx0XHRcdFx0W2NsYXNzLmFjdGl2ZV09XCIkaW5kZXggPT09IGFjdGl2ZUlkeFwiXG5cdFx0XHRcdChtb3VzZWVudGVyKT1cIm1hcmtBY3RpdmUoJGluZGV4KVwiXG5cdFx0XHRcdChjbGljayk9XCJzZWxlY3QocmVzdWx0KVwiXG5cdFx0XHQ+XG5cdFx0XHRcdDxuZy10ZW1wbGF0ZVxuXHRcdFx0XHRcdFtuZ1RlbXBsYXRlT3V0bGV0XT1cInJlc3VsdFRlbXBsYXRlIHx8IHJ0XCJcblx0XHRcdFx0XHRbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyByZXN1bHQ6IHJlc3VsdCwgdGVybTogdGVybSwgZm9ybWF0dGVyOiBmb3JtYXR0ZXIgfVwiXG5cdFx0XHRcdC8+XG5cdFx0XHQ8L2J1dHRvbj5cblx0XHR9XG5cdGAsXG59KVxuZXhwb3J0IGNsYXNzIE5nYlR5cGVhaGVhZFdpbmRvdyBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cdGFjdGl2ZUlkeCA9IDA7XG5cblx0LyoqXG5cdCAqICBUaGUgaWQgZm9yIHRoZSB0eXBlYWhlYWQgd2luZG93LiBUaGUgaWQgc2hvdWxkIGJlIHVuaXF1ZSBhbmQgdGhlIHNhbWVcblx0ICogIGFzIHRoZSBhc3NvY2lhdGVkIHR5cGVhaGVhZCdzIGlkLlxuXHQgKi9cblx0QElucHV0KCkgaWQ6IHN0cmluZztcblxuXHQvKipcblx0ICogRmxhZyBpbmRpY2F0aW5nIGlmIHRoZSBmaXJzdCByb3cgc2hvdWxkIGJlIGFjdGl2ZSBpbml0aWFsbHlcblx0ICovXG5cdEBJbnB1dCgpIGZvY3VzRmlyc3QgPSB0cnVlO1xuXG5cdC8qKlxuXHQgKiBUeXBlYWhlYWQgbWF0Y2ggcmVzdWx0cyB0byBiZSBkaXNwbGF5ZWRcblx0ICovXG5cdEBJbnB1dCgpIHJlc3VsdHM7XG5cblx0LyoqXG5cdCAqIFNlYXJjaCB0ZXJtIHVzZWQgdG8gZ2V0IGN1cnJlbnQgcmVzdWx0c1xuXHQgKi9cblx0QElucHV0KCkgdGVybTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZm9ybWF0IGEgZ2l2ZW4gcmVzdWx0IGJlZm9yZSBkaXNwbGF5LiBUaGlzIGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gYSBmb3JtYXR0ZWQgc3RyaW5nIHdpdGhvdXQgYW55XG5cdCAqIEhUTUwgbWFya3VwXG5cdCAqL1xuXHRASW5wdXQoKSBmb3JtYXR0ZXIgPSB0b1N0cmluZztcblxuXHQvKipcblx0ICogQSB0ZW1wbGF0ZSB0byBvdmVycmlkZSBhIG1hdGNoaW5nIHJlc3VsdCBkZWZhdWx0IGRpc3BsYXlcblx0ICovXG5cdEBJbnB1dCgpIHJlc3VsdFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxSZXN1bHRUZW1wbGF0ZUNvbnRleHQ+O1xuXG5cdC8qKlxuXHQgKiBBIGN1c3RvbSBjbGFzcyB0byBhcHBlbmQgdG8gdGhlIHR5cGVhaGVhZCB3aW5kb3dcblx0ICpcblx0ICogQHNpbmNlIDkuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBwb3B1cENsYXNzOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIEV2ZW50IHJhaXNlZCB3aGVuIHVzZXIgc2VsZWN0cyBhIHBhcnRpY3VsYXIgcmVzdWx0IHJvd1xuXHQgKi9cblx0QE91dHB1dCgnc2VsZWN0Jykgc2VsZWN0RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QE91dHB1dCgnYWN0aXZlQ2hhbmdlJykgYWN0aXZlQ2hhbmdlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0aGFzQWN0aXZlKCkge1xuXHRcdHJldHVybiB0aGlzLmFjdGl2ZUlkeCA+IC0xICYmIHRoaXMuYWN0aXZlSWR4IDwgdGhpcy5yZXN1bHRzLmxlbmd0aDtcblx0fVxuXG5cdGdldEFjdGl2ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXN1bHRzW3RoaXMuYWN0aXZlSWR4XTtcblx0fVxuXG5cdG1hcmtBY3RpdmUoYWN0aXZlSWR4OiBudW1iZXIpIHtcblx0XHR0aGlzLmFjdGl2ZUlkeCA9IGFjdGl2ZUlkeDtcblx0XHR0aGlzLl9hY3RpdmVDaGFuZ2VkKCk7XG5cdH1cblxuXHRuZXh0KCkge1xuXHRcdGlmICh0aGlzLmFjdGl2ZUlkeCA9PT0gdGhpcy5yZXN1bHRzLmxlbmd0aCAtIDEpIHtcblx0XHRcdHRoaXMuYWN0aXZlSWR4ID0gdGhpcy5mb2N1c0ZpcnN0ID8gKHRoaXMuYWN0aXZlSWR4ICsgMSkgJSB0aGlzLnJlc3VsdHMubGVuZ3RoIDogLTE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYWN0aXZlSWR4Kys7XG5cdFx0fVxuXHRcdHRoaXMuX2FjdGl2ZUNoYW5nZWQoKTtcblx0fVxuXG5cdHByZXYoKSB7XG5cdFx0aWYgKHRoaXMuYWN0aXZlSWR4IDwgMCkge1xuXHRcdFx0dGhpcy5hY3RpdmVJZHggPSB0aGlzLnJlc3VsdHMubGVuZ3RoIC0gMTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuYWN0aXZlSWR4ID09PSAwKSB7XG5cdFx0XHR0aGlzLmFjdGl2ZUlkeCA9IHRoaXMuZm9jdXNGaXJzdCA/IHRoaXMucmVzdWx0cy5sZW5ndGggLSAxIDogLTE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYWN0aXZlSWR4LS07XG5cdFx0fVxuXHRcdHRoaXMuX2FjdGl2ZUNoYW5nZWQoKTtcblx0fVxuXG5cdHJlc2V0QWN0aXZlKCkge1xuXHRcdHRoaXMuYWN0aXZlSWR4ID0gdGhpcy5mb2N1c0ZpcnN0ID8gMCA6IC0xO1xuXHRcdHRoaXMuX2FjdGl2ZUNoYW5nZWQoKTtcblx0fVxuXG5cdHNlbGVjdChpdGVtKSB7XG5cdFx0dGhpcy5zZWxlY3RFdmVudC5lbWl0KGl0ZW0pO1xuXHR9XG5cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5yZXNldEFjdGl2ZSgpO1xuXHR9XG5cblx0cHJpdmF0ZSBfYWN0aXZlQ2hhbmdlZCgpIHtcblx0XHR0aGlzLmFjdGl2ZUNoYW5nZUV2ZW50LmVtaXQodGhpcy5hY3RpdmVJZHggPj0gMCA/IHRoaXMuaWQgKyAnLScgKyB0aGlzLmFjdGl2ZUlkeCA6IHVuZGVmaW5lZCk7XG5cdH1cbn1cbiJdfQ==