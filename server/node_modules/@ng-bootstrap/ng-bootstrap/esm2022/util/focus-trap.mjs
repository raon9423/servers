import { fromEvent } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
export const FOCUSABLE_ELEMENTS_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[contenteditable]',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');
/**
 * Returns first and last focusable elements inside of a given element based on specific CSS selector
 */
export function getFocusableBoundaryElements(element) {
    const list = Array.from(element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR)).filter((el) => el.tabIndex !== -1);
    return [list[0], list[list.length - 1]];
}
/**
 * Function that enforces browser focus to be trapped inside a DOM element.
 *
 * Works only for clicks inside the element and navigation with 'Tab', ignoring clicks outside of the element
 *
 * @param zone Angular zone
 * @param element The element around which focus will be trapped inside
 * @param stopFocusTrap$ The observable stream. When completed the focus trap will clean up listeners
 * and free internal resources
 * @param refocusOnClick Put the focus back to the last focused element whenever a click occurs on element (default to
 * false)
 */
export const ngbFocusTrap = (zone, element, stopFocusTrap$, refocusOnClick = false) => {
    zone.runOutsideAngular(() => {
        // last focused element
        const lastFocusedElement$ = fromEvent(element, 'focusin').pipe(takeUntil(stopFocusTrap$), map((e) => e.target));
        // 'tab' / 'shift+tab' stream
        fromEvent(element, 'keydown')
            .pipe(takeUntil(stopFocusTrap$), filter((e) => e.key === 'Tab'), withLatestFrom(lastFocusedElement$))
            .subscribe(([tabEvent, focusedElement]) => {
            const [first, last] = getFocusableBoundaryElements(element);
            if ((focusedElement === first || focusedElement === element) && tabEvent.shiftKey) {
                last.focus();
                tabEvent.preventDefault();
            }
            if (focusedElement === last && !tabEvent.shiftKey) {
                first.focus();
                tabEvent.preventDefault();
            }
        });
        // inside click
        if (refocusOnClick) {
            fromEvent(element, 'click')
                .pipe(takeUntil(stopFocusTrap$), withLatestFrom(lastFocusedElement$), map((arr) => arr[1]))
                .subscribe((lastFocusedElement) => lastFocusedElement.focus());
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMtdHJhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlsL2ZvY3VzLXRyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEUsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQUc7SUFDMUMsU0FBUztJQUNULHdCQUF3QjtJQUN4Qiw0Q0FBNEM7SUFDNUMsd0JBQXdCO0lBQ3hCLDBCQUEwQjtJQUMxQixtQkFBbUI7SUFDbkIsaUNBQWlDO0NBQ2pDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWI7O0dBRUc7QUFDSCxNQUFNLFVBQVUsNEJBQTRCLENBQUMsT0FBb0I7SUFDaEUsTUFBTSxJQUFJLEdBQWtCLEtBQUssQ0FBQyxJQUFJLENBQ3JDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQywyQkFBMkIsQ0FBNEIsQ0FDaEYsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLENBQzNCLElBQVksRUFDWixPQUFvQixFQUNwQixjQUErQixFQUMvQixjQUFjLEdBQUcsS0FBSyxFQUNyQixFQUFFO0lBQ0gsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtRQUMzQix1QkFBdUI7UUFDdkIsTUFBTSxtQkFBbUIsR0FBRyxTQUFTLENBQWEsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FDekUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUN6QixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDcEIsQ0FBQztRQUVGLDZCQUE2QjtRQUM3QixTQUFTLENBQWdCLE9BQU8sRUFBRSxTQUFTLENBQUM7YUFDMUMsSUFBSSxDQUNKLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxFQUM5QixjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FDbkM7YUFDQSxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsRUFBRSxFQUFFO1lBQ3pDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsNEJBQTRCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFNUQsSUFBSSxDQUFDLGNBQWMsS0FBSyxLQUFLLElBQUksY0FBYyxLQUFLLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbkYsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNiLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUMzQixDQUFDO1lBRUQsSUFBSSxjQUFjLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuRCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2QsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzNCLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztRQUVKLGVBQWU7UUFDZixJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ3BCLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO2lCQUN6QixJQUFJLENBQ0osU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUN6QixjQUFjLENBQUMsbUJBQW1CLENBQUMsRUFDbkMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFnQixDQUFDLENBQ25DO2lCQUNBLFNBQVMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7SUFDRixDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBmcm9tRXZlbnQsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgbWFwLCB0YWtlVW50aWwsIHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgY29uc3QgRk9DVVNBQkxFX0VMRU1FTlRTX1NFTEVDVE9SID0gW1xuXHQnYVtocmVmXScsXG5cdCdidXR0b246bm90KFtkaXNhYmxlZF0pJyxcblx0J2lucHV0Om5vdChbZGlzYWJsZWRdKTpub3QoW3R5cGU9XCJoaWRkZW5cIl0pJyxcblx0J3NlbGVjdDpub3QoW2Rpc2FibGVkXSknLFxuXHQndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pJyxcblx0J1tjb250ZW50ZWRpdGFibGVdJyxcblx0J1t0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKScsXG5dLmpvaW4oJywgJyk7XG5cbi8qKlxuICogUmV0dXJucyBmaXJzdCBhbmQgbGFzdCBmb2N1c2FibGUgZWxlbWVudHMgaW5zaWRlIG9mIGEgZ2l2ZW4gZWxlbWVudCBiYXNlZCBvbiBzcGVjaWZpYyBDU1Mgc2VsZWN0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHMoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudFtdIHtcblx0Y29uc3QgbGlzdDogSFRNTEVsZW1lbnRbXSA9IEFycmF5LmZyb20oXG5cdFx0ZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKEZPQ1VTQUJMRV9FTEVNRU5UU19TRUxFQ1RPUikgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4sXG5cdCkuZmlsdGVyKChlbCkgPT4gZWwudGFiSW5kZXggIT09IC0xKTtcblx0cmV0dXJuIFtsaXN0WzBdLCBsaXN0W2xpc3QubGVuZ3RoIC0gMV1dO1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgYnJvd3NlciBmb2N1cyB0byBiZSB0cmFwcGVkIGluc2lkZSBhIERPTSBlbGVtZW50LlxuICpcbiAqIFdvcmtzIG9ubHkgZm9yIGNsaWNrcyBpbnNpZGUgdGhlIGVsZW1lbnQgYW5kIG5hdmlnYXRpb24gd2l0aCAnVGFiJywgaWdub3JpbmcgY2xpY2tzIG91dHNpZGUgb2YgdGhlIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gem9uZSBBbmd1bGFyIHpvbmVcbiAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IGFyb3VuZCB3aGljaCBmb2N1cyB3aWxsIGJlIHRyYXBwZWQgaW5zaWRlXG4gKiBAcGFyYW0gc3RvcEZvY3VzVHJhcCQgVGhlIG9ic2VydmFibGUgc3RyZWFtLiBXaGVuIGNvbXBsZXRlZCB0aGUgZm9jdXMgdHJhcCB3aWxsIGNsZWFuIHVwIGxpc3RlbmVyc1xuICogYW5kIGZyZWUgaW50ZXJuYWwgcmVzb3VyY2VzXG4gKiBAcGFyYW0gcmVmb2N1c09uQ2xpY2sgUHV0IHRoZSBmb2N1cyBiYWNrIHRvIHRoZSBsYXN0IGZvY3VzZWQgZWxlbWVudCB3aGVuZXZlciBhIGNsaWNrIG9jY3VycyBvbiBlbGVtZW50IChkZWZhdWx0IHRvXG4gKiBmYWxzZSlcbiAqL1xuZXhwb3J0IGNvbnN0IG5nYkZvY3VzVHJhcCA9IChcblx0em9uZTogTmdab25lLFxuXHRlbGVtZW50OiBIVE1MRWxlbWVudCxcblx0c3RvcEZvY3VzVHJhcCQ6IE9ic2VydmFibGU8YW55Pixcblx0cmVmb2N1c09uQ2xpY2sgPSBmYWxzZSxcbikgPT4ge1xuXHR6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcblx0XHQvLyBsYXN0IGZvY3VzZWQgZWxlbWVudFxuXHRcdGNvbnN0IGxhc3RGb2N1c2VkRWxlbWVudCQgPSBmcm9tRXZlbnQ8Rm9jdXNFdmVudD4oZWxlbWVudCwgJ2ZvY3VzaW4nKS5waXBlKFxuXHRcdFx0dGFrZVVudGlsKHN0b3BGb2N1c1RyYXAkKSxcblx0XHRcdG1hcCgoZSkgPT4gZS50YXJnZXQpLFxuXHRcdCk7XG5cblx0XHQvLyAndGFiJyAvICdzaGlmdCt0YWInIHN0cmVhbVxuXHRcdGZyb21FdmVudDxLZXlib2FyZEV2ZW50PihlbGVtZW50LCAna2V5ZG93bicpXG5cdFx0XHQucGlwZShcblx0XHRcdFx0dGFrZVVudGlsKHN0b3BGb2N1c1RyYXAkKSxcblx0XHRcdFx0ZmlsdGVyKChlKSA9PiBlLmtleSA9PT0gJ1RhYicpLFxuXHRcdFx0XHR3aXRoTGF0ZXN0RnJvbShsYXN0Rm9jdXNlZEVsZW1lbnQkKSxcblx0XHRcdClcblx0XHRcdC5zdWJzY3JpYmUoKFt0YWJFdmVudCwgZm9jdXNlZEVsZW1lbnRdKSA9PiB7XG5cdFx0XHRcdGNvbnN0IFtmaXJzdCwgbGFzdF0gPSBnZXRGb2N1c2FibGVCb3VuZGFyeUVsZW1lbnRzKGVsZW1lbnQpO1xuXG5cdFx0XHRcdGlmICgoZm9jdXNlZEVsZW1lbnQgPT09IGZpcnN0IHx8IGZvY3VzZWRFbGVtZW50ID09PSBlbGVtZW50KSAmJiB0YWJFdmVudC5zaGlmdEtleSkge1xuXHRcdFx0XHRcdGxhc3QuZm9jdXMoKTtcblx0XHRcdFx0XHR0YWJFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGZvY3VzZWRFbGVtZW50ID09PSBsYXN0ICYmICF0YWJFdmVudC5zaGlmdEtleSkge1xuXHRcdFx0XHRcdGZpcnN0LmZvY3VzKCk7XG5cdFx0XHRcdFx0dGFiRXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHQvLyBpbnNpZGUgY2xpY2tcblx0XHRpZiAocmVmb2N1c09uQ2xpY2spIHtcblx0XHRcdGZyb21FdmVudChlbGVtZW50LCAnY2xpY2snKVxuXHRcdFx0XHQucGlwZShcblx0XHRcdFx0XHR0YWtlVW50aWwoc3RvcEZvY3VzVHJhcCQpLFxuXHRcdFx0XHRcdHdpdGhMYXRlc3RGcm9tKGxhc3RGb2N1c2VkRWxlbWVudCQpLFxuXHRcdFx0XHRcdG1hcCgoYXJyKSA9PiBhcnJbMV0gYXMgSFRNTEVsZW1lbnQpLFxuXHRcdFx0XHQpXG5cdFx0XHRcdC5zdWJzY3JpYmUoKGxhc3RGb2N1c2VkRWxlbWVudCkgPT4gbGFzdEZvY3VzZWRFbGVtZW50LmZvY3VzKCkpO1xuXHRcdH1cblx0fSk7XG59O1xuIl19