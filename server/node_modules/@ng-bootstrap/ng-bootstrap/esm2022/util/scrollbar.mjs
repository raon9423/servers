import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * Utility to handle the scrollbar.
 *
 * It allows to hide the scrollbar and compensate the lack of a vertical scrollbar
 * by adding an equivalent padding on the right of the body, and to revert this change.
 */
export class ScrollBar {
    constructor() {
        this._document = inject(DOCUMENT);
    }
    /**
     * To be called to hide a potential vertical scrollbar:
     * - if a scrollbar is there and has a width greater than 0, adds some compensation
     * padding to the body to keep the same layout as when the scrollbar is there
     * - adds overflow: hidden
     *
     * @return a callback used to revert the change
     */
    hide() {
        const scrollbarWidth = Math.abs(window.innerWidth - this._document.documentElement.clientWidth);
        const body = this._document.body;
        const bodyStyle = body.style;
        const { overflow, paddingRight } = bodyStyle;
        if (scrollbarWidth > 0) {
            const actualPadding = parseFloat(window.getComputedStyle(body).paddingRight);
            bodyStyle.paddingRight = `${actualPadding + scrollbarWidth}px`;
        }
        bodyStyle.overflow = 'hidden';
        return () => {
            if (scrollbarWidth > 0) {
                bodyStyle.paddingRight = paddingRight;
            }
            bodyStyle.overflow = overflow;
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: ScrollBar, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: ScrollBar, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: ScrollBar, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWwvc2Nyb2xsYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFLM0M7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sU0FBUztJQUR0QjtRQUVTLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0EyQnJDO0lBekJBOzs7Ozs7O09BT0c7SUFDSCxJQUFJO1FBQ0gsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ2pDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDN0IsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDN0MsSUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDeEIsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM3RSxTQUFTLENBQUMsWUFBWSxHQUFHLEdBQUcsYUFBYSxHQUFHLGNBQWMsSUFBSSxDQUFDO1FBQ2hFLENBQUM7UUFDRCxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUM5QixPQUFPLEdBQUcsRUFBRTtZQUNYLElBQUksY0FBYyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUN4QixTQUFTLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztZQUN2QyxDQUFDO1lBQ0QsU0FBUyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDL0IsQ0FBQyxDQUFDO0lBQ0gsQ0FBQzs4R0EzQlcsU0FBUztrSEFBVCxTQUFTLGNBREksTUFBTTs7MkZBQ25CLFNBQVM7a0JBRHJCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKiBUeXBlIGZvciB0aGUgY2FsbGJhY2sgdXNlZCB0byByZXZlcnQgdGhlIHNjcm9sbGJhci4gKi9cbmV4cG9ydCB0eXBlIFNjcm9sbGJhclJldmVydGVyID0gKCkgPT4gdm9pZDtcblxuLyoqXG4gKiBVdGlsaXR5IHRvIGhhbmRsZSB0aGUgc2Nyb2xsYmFyLlxuICpcbiAqIEl0IGFsbG93cyB0byBoaWRlIHRoZSBzY3JvbGxiYXIgYW5kIGNvbXBlbnNhdGUgdGhlIGxhY2sgb2YgYSB2ZXJ0aWNhbCBzY3JvbGxiYXJcbiAqIGJ5IGFkZGluZyBhbiBlcXVpdmFsZW50IHBhZGRpbmcgb24gdGhlIHJpZ2h0IG9mIHRoZSBib2R5LCBhbmQgdG8gcmV2ZXJ0IHRoaXMgY2hhbmdlLlxuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFNjcm9sbEJhciB7XG5cdHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcblxuXHQvKipcblx0ICogVG8gYmUgY2FsbGVkIHRvIGhpZGUgYSBwb3RlbnRpYWwgdmVydGljYWwgc2Nyb2xsYmFyOlxuXHQgKiAtIGlmIGEgc2Nyb2xsYmFyIGlzIHRoZXJlIGFuZCBoYXMgYSB3aWR0aCBncmVhdGVyIHRoYW4gMCwgYWRkcyBzb21lIGNvbXBlbnNhdGlvblxuXHQgKiBwYWRkaW5nIHRvIHRoZSBib2R5IHRvIGtlZXAgdGhlIHNhbWUgbGF5b3V0IGFzIHdoZW4gdGhlIHNjcm9sbGJhciBpcyB0aGVyZVxuXHQgKiAtIGFkZHMgb3ZlcmZsb3c6IGhpZGRlblxuXHQgKlxuXHQgKiBAcmV0dXJuIGEgY2FsbGJhY2sgdXNlZCB0byByZXZlcnQgdGhlIGNoYW5nZVxuXHQgKi9cblx0aGlkZSgpOiBTY3JvbGxiYXJSZXZlcnRlciB7XG5cdFx0Y29uc3Qgc2Nyb2xsYmFyV2lkdGggPSBNYXRoLmFicyh3aW5kb3cuaW5uZXJXaWR0aCAtIHRoaXMuX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCk7XG5cdFx0Y29uc3QgYm9keSA9IHRoaXMuX2RvY3VtZW50LmJvZHk7XG5cdFx0Y29uc3QgYm9keVN0eWxlID0gYm9keS5zdHlsZTtcblx0XHRjb25zdCB7IG92ZXJmbG93LCBwYWRkaW5nUmlnaHQgfSA9IGJvZHlTdHlsZTtcblx0XHRpZiAoc2Nyb2xsYmFyV2lkdGggPiAwKSB7XG5cdFx0XHRjb25zdCBhY3R1YWxQYWRkaW5nID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShib2R5KS5wYWRkaW5nUmlnaHQpO1xuXHRcdFx0Ym9keVN0eWxlLnBhZGRpbmdSaWdodCA9IGAke2FjdHVhbFBhZGRpbmcgKyBzY3JvbGxiYXJXaWR0aH1weGA7XG5cdFx0fVxuXHRcdGJvZHlTdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRpZiAoc2Nyb2xsYmFyV2lkdGggPiAwKSB7XG5cdFx0XHRcdGJvZHlTdHlsZS5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nUmlnaHQ7XG5cdFx0XHR9XG5cdFx0XHRib2R5U3R5bGUub3ZlcmZsb3cgPSBvdmVyZmxvdztcblx0XHR9O1xuXHR9XG59XG4iXX0=