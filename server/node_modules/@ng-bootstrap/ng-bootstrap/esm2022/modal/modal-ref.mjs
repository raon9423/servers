import { of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isDefined } from '../util/util';
import { isPromise } from '../util/util';
/**
 * A reference to the currently opened (active) modal.
 *
 * Instances of this class can be injected into your component passed as modal content.
 * So you can `.update()`, `.close()` or `.dismiss()` the modal window from your component.
 */
export class NgbActiveModal {
    /**
     * Updates options of an opened modal.
     *
     * @since 14.2.0
     */
    update(options) { }
    /**
     * Closes the modal with an optional `result` value.
     *
     * The `NgbModalRef.result` promise will be resolved with the provided value.
     */
    close(result) { }
    /**
     * Dismisses the modal with an optional `reason` value.
     *
     * The `NgbModalRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) { }
}
const WINDOW_ATTRIBUTES = [
    'animation',
    'ariaLabelledBy',
    'ariaDescribedBy',
    'backdrop',
    'centered',
    'fullscreen',
    'keyboard',
    'scrollable',
    'size',
    'windowClass',
    'modalDialogClass',
];
const BACKDROP_ATTRIBUTES = ['animation', 'backdropClass'];
/**
 * A reference to the newly opened modal returned by the `NgbModal.open()` method.
 */
export class NgbModalRef {
    _applyWindowOptions(windowInstance, options) {
        WINDOW_ATTRIBUTES.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }
    _applyBackdropOptions(backdropInstance, options) {
        BACKDROP_ATTRIBUTES.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                backdropInstance[optionName] = options[optionName];
            }
        });
    }
    /**
     * Updates options of an opened modal.
     *
     * @since 14.2.0
     */
    update(options) {
        this._applyWindowOptions(this._windowCmptRef.instance, options);
        if (this._backdropCmptRef && this._backdropCmptRef.instance) {
            this._applyBackdropOptions(this._backdropCmptRef.instance, options);
        }
    }
    /**
     * The instance of a component used for the modal content.
     *
     * When a `TemplateRef` is used as the content or when the modal is closed, will return `undefined`.
     */
    get componentInstance() {
        if (this._contentRef && this._contentRef.componentRef) {
            return this._contentRef.componentRef.instance;
        }
    }
    /**
     * The observable that emits when the modal is closed via the `.close()` method.
     *
     * It will emit the result passed to the `.close()` method.
     *
     * @since 8.0.0
     */
    get closed() {
        return this._closed.asObservable().pipe(takeUntil(this._hidden));
    }
    /**
     * The observable that emits when the modal is dismissed via the `.dismiss()` method.
     *
     * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
     * reasons like backdrop click or ESC key press.
     *
     * @since 8.0.0
     */
    get dismissed() {
        return this._dismissed.asObservable().pipe(takeUntil(this._hidden));
    }
    /**
     * The observable that emits when both modal window and backdrop are closed and animations were finished.
     * At this point modal and backdrop elements will be removed from the DOM tree.
     *
     * This observable will be completed after emitting.
     *
     * @since 8.0.0
     */
    get hidden() {
        return this._hidden.asObservable();
    }
    /**
     * The observable that emits when modal is fully visible and animation was finished.
     * Modal DOM element is always available synchronously after calling 'modal.open()' service.
     *
     * This observable will be completed after emitting.
     * It will not emit, if modal is closed before open animation is finished.
     *
     * @since 8.0.0
     */
    get shown() {
        return this._windowCmptRef.instance.shown.asObservable();
    }
    constructor(_windowCmptRef, _contentRef, _backdropCmptRef, _beforeDismiss) {
        this._windowCmptRef = _windowCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        this._beforeDismiss = _beforeDismiss;
        this._closed = new Subject();
        this._dismissed = new Subject();
        this._hidden = new Subject();
        _windowCmptRef.instance.dismissEvent.subscribe((reason) => {
            this.dismiss(reason);
        });
        this.result = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this.result.then(null, () => { });
    }
    /**
     * Closes the modal with an optional `result` value.
     *
     * The `NgbMobalRef.result` promise will be resolved with the provided value.
     */
    close(result) {
        if (this._windowCmptRef) {
            this._closed.next(result);
            this._resolve(result);
            this._removeModalElements();
        }
    }
    _dismiss(reason) {
        this._dismissed.next(reason);
        this._reject(reason);
        this._removeModalElements();
    }
    /**
     * Dismisses the modal with an optional `reason` value.
     *
     * The `NgbModalRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) {
        if (this._windowCmptRef) {
            if (!this._beforeDismiss) {
                this._dismiss(reason);
            }
            else {
                const dismiss = this._beforeDismiss();
                if (isPromise(dismiss)) {
                    dismiss.then((result) => {
                        if (result !== false) {
                            this._dismiss(reason);
                        }
                    }, () => { });
                }
                else if (dismiss !== false) {
                    this._dismiss(reason);
                }
            }
        }
    }
    _removeModalElements() {
        const windowTransition$ = this._windowCmptRef.instance.hide();
        const backdropTransition$ = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : of(undefined);
        // hiding window
        windowTransition$.subscribe(() => {
            const { nativeElement } = this._windowCmptRef.location;
            nativeElement.parentNode.removeChild(nativeElement);
            this._windowCmptRef.destroy();
            this._contentRef?.viewRef?.destroy();
            this._windowCmptRef = null;
            this._contentRef = null;
        });
        // hiding backdrop
        backdropTransition$.subscribe(() => {
            if (this._backdropCmptRef) {
                const { nativeElement } = this._backdropCmptRef.location;
                nativeElement.parentNode.removeChild(nativeElement);
                this._backdropCmptRef.destroy();
                this._backdropCmptRef = null;
            }
        });
        // all done
        zip(windowTransition$, backdropTransition$).subscribe(() => {
            this._hidden.next();
            this._hidden.complete();
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZGFsL21vZGFsLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFHekMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV6Qzs7Ozs7R0FLRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBQzFCOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsT0FBaUMsSUFBUyxDQUFDO0lBQ2xEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsTUFBWSxJQUFTLENBQUM7SUFFNUI7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxNQUFZLElBQVMsQ0FBQztDQUM5QjtBQUVELE1BQU0saUJBQWlCLEdBQWE7SUFDbkMsV0FBVztJQUNYLGdCQUFnQjtJQUNoQixpQkFBaUI7SUFDakIsVUFBVTtJQUNWLFVBQVU7SUFDVixZQUFZO0lBQ1osVUFBVTtJQUNWLFlBQVk7SUFDWixNQUFNO0lBQ04sYUFBYTtJQUNiLGtCQUFrQjtDQUNsQixDQUFDO0FBQ0YsTUFBTSxtQkFBbUIsR0FBYSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUVyRTs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBT2YsbUJBQW1CLENBQUMsY0FBOEIsRUFBRSxPQUF3QjtRQUNuRixpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFrQixFQUFFLEVBQUU7WUFDaEQsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDcEMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxV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QUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsZ0JBQWdCLEdBQVEsSUFBSSxDQUFDO1lBQ25DLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztRQUVILFdBQVc7UUFDWCxHQUFHLENBQUMsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQzFELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgU3ViamVjdCwgemlwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE5nYk1vZGFsQmFja2Ryb3AgfSBmcm9tICcuL21vZGFsLWJhY2tkcm9wJztcbmltcG9ydCB7IE5nYk1vZGFsV2luZG93IH0gZnJvbSAnLi9tb2RhbC13aW5kb3cnO1xuaW1wb3J0IHsgTmdiTW9kYWxPcHRpb25zLCBOZ2JNb2RhbFVwZGF0YWJsZU9wdGlvbnMgfSBmcm9tICcuL21vZGFsLWNvbmZpZyc7XG5pbXBvcnQgeyBpc0RlZmluZWQgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5pbXBvcnQgeyBDb250ZW50UmVmIH0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQgeyBpc1Byb21pc2UgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG4vKipcbiAqIEEgcmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHkgb3BlbmVkIChhY3RpdmUpIG1vZGFsLlxuICpcbiAqIEluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIGNhbiBiZSBpbmplY3RlZCBpbnRvIHlvdXIgY29tcG9uZW50IHBhc3NlZCBhcyBtb2RhbCBjb250ZW50LlxuICogU28geW91IGNhbiBgLnVwZGF0ZSgpYCwgYC5jbG9zZSgpYCBvciBgLmRpc21pc3MoKWAgdGhlIG1vZGFsIHdpbmRvdyBmcm9tIHlvdXIgY29tcG9uZW50LlxuICovXG5leHBvcnQgY2xhc3MgTmdiQWN0aXZlTW9kYWwge1xuXHQvKipcblx0ICogVXBkYXRlcyBvcHRpb25zIG9mIGFuIG9wZW5lZCBtb2RhbC5cblx0ICpcblx0ICogQHNpbmNlIDE0LjIuMFxuXHQgKi9cblx0dXBkYXRlKG9wdGlvbnM6IE5nYk1vZGFsVXBkYXRhYmxlT3B0aW9ucyk6IHZvaWQge31cblx0LyoqXG5cdCAqIENsb3NlcyB0aGUgbW9kYWwgd2l0aCBhbiBvcHRpb25hbCBgcmVzdWx0YCB2YWx1ZS5cblx0ICpcblx0ICogVGhlIGBOZ2JNb2RhbFJlZi5yZXN1bHRgIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cblx0ICovXG5cdGNsb3NlKHJlc3VsdD86IGFueSk6IHZvaWQge31cblxuXHQvKipcblx0ICogRGlzbWlzc2VzIHRoZSBtb2RhbCB3aXRoIGFuIG9wdGlvbmFsIGByZWFzb25gIHZhbHVlLlxuXHQgKlxuXHQgKiBUaGUgYE5nYk1vZGFsUmVmLnJlc3VsdGAgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuXHQgKi9cblx0ZGlzbWlzcyhyZWFzb24/OiBhbnkpOiB2b2lkIHt9XG59XG5cbmNvbnN0IFdJTkRPV19BVFRSSUJVVEVTOiBzdHJpbmdbXSA9IFtcblx0J2FuaW1hdGlvbicsXG5cdCdhcmlhTGFiZWxsZWRCeScsXG5cdCdhcmlhRGVzY3JpYmVkQnknLFxuXHQnYmFja2Ryb3AnLFxuXHQnY2VudGVyZWQnLFxuXHQnZnVsbHNjcmVlbicsXG5cdCdrZXlib2FyZCcsXG5cdCdzY3JvbGxhYmxlJyxcblx0J3NpemUnLFxuXHQnd2luZG93Q2xhc3MnLFxuXHQnbW9kYWxEaWFsb2dDbGFzcycsXG5dO1xuY29uc3QgQkFDS0RST1BfQVRUUklCVVRFUzogc3RyaW5nW10gPSBbJ2FuaW1hdGlvbicsICdiYWNrZHJvcENsYXNzJ107XG5cbi8qKlxuICogQSByZWZlcmVuY2UgdG8gdGhlIG5ld2x5IG9wZW5lZCBtb2RhbCByZXR1cm5lZCBieSB0aGUgYE5nYk1vZGFsLm9wZW4oKWAgbWV0aG9kLlxuICovXG5leHBvcnQgY2xhc3MgTmdiTW9kYWxSZWYge1xuXHRwcml2YXRlIF9jbG9zZWQgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG5cdHByaXZhdGUgX2Rpc21pc3NlZCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblx0cHJpdmF0ZSBfaGlkZGVuID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblx0cHJpdmF0ZSBfcmVzb2x2ZTogKHJlc3VsdD86IGFueSkgPT4gdm9pZDtcblx0cHJpdmF0ZSBfcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xuXG5cdHByaXZhdGUgX2FwcGx5V2luZG93T3B0aW9ucyh3aW5kb3dJbnN0YW5jZTogTmdiTW9kYWxXaW5kb3csIG9wdGlvbnM6IE5nYk1vZGFsT3B0aW9ucyk6IHZvaWQge1xuXHRcdFdJTkRPV19BVFRSSUJVVEVTLmZvckVhY2goKG9wdGlvbk5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0aWYgKGlzRGVmaW5lZChvcHRpb25zW29wdGlvbk5hbWVdKSkge1xuXHRcdFx0XHR3aW5kb3dJbnN0YW5jZVtvcHRpb25OYW1lXSA9IG9wdGlvbnNbb3B0aW9uTmFtZV07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF9hcHBseUJhY2tkcm9wT3B0aW9ucyhiYWNrZHJvcEluc3RhbmNlOiBOZ2JNb2RhbEJhY2tkcm9wLCBvcHRpb25zOiBOZ2JNb2RhbE9wdGlvbnMpOiB2b2lkIHtcblx0XHRCQUNLRFJPUF9BVFRSSUJVVEVTLmZvckVhY2goKG9wdGlvbk5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0aWYgKGlzRGVmaW5lZChvcHRpb25zW29wdGlvbk5hbWVdKSkge1xuXHRcdFx0XHRiYWNrZHJvcEluc3RhbmNlW29wdGlvbk5hbWVdID0gb3B0aW9uc1tvcHRpb25OYW1lXTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIG9wdGlvbnMgb2YgYW4gb3BlbmVkIG1vZGFsLlxuXHQgKlxuXHQgKiBAc2luY2UgMTQuMi4wXG5cdCAqL1xuXHR1cGRhdGUob3B0aW9uczogTmdiTW9kYWxVcGRhdGFibGVPcHRpb25zKTogdm9pZCB7XG5cdFx0dGhpcy5fYXBwbHlXaW5kb3dPcHRpb25zKHRoaXMuX3dpbmRvd0NtcHRSZWYuaW5zdGFuY2UsIG9wdGlvbnMpO1xuXHRcdGlmICh0aGlzLl9iYWNrZHJvcENtcHRSZWYgJiYgdGhpcy5fYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlKSB7XG5cdFx0XHR0aGlzLl9hcHBseUJhY2tkcm9wT3B0aW9ucyh0aGlzLl9iYWNrZHJvcENtcHRSZWYuaW5zdGFuY2UsIG9wdGlvbnMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgaW5zdGFuY2Ugb2YgYSBjb21wb25lbnQgdXNlZCBmb3IgdGhlIG1vZGFsIGNvbnRlbnQuXG5cdCAqXG5cdCAqIFdoZW4gYSBgVGVtcGxhdGVSZWZgIGlzIHVzZWQgYXMgdGhlIGNvbnRlbnQgb3Igd2hlbiB0aGUgbW9kYWwgaXMgY2xvc2VkLCB3aWxsIHJldHVybiBgdW5kZWZpbmVkYC5cblx0ICovXG5cdGdldCBjb21wb25lbnRJbnN0YW5jZSgpOiBhbnkge1xuXHRcdGlmICh0aGlzLl9jb250ZW50UmVmICYmIHRoaXMuX2NvbnRlbnRSZWYuY29tcG9uZW50UmVmKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGVudFJlZi5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgbW9kYWwgaXMgY2xvc2VkIGFuZCByZWplY3RlZCB3aGVuIHRoZSBtb2RhbCBpcyBkaXNtaXNzZWQuXG5cdCAqL1xuXHRyZXN1bHQ6IFByb21pc2U8YW55PjtcblxuXHQvKipcblx0ICogVGhlIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIHRoZSBtb2RhbCBpcyBjbG9zZWQgdmlhIHRoZSBgLmNsb3NlKClgIG1ldGhvZC5cblx0ICpcblx0ICogSXQgd2lsbCBlbWl0IHRoZSByZXN1bHQgcGFzc2VkIHRvIHRoZSBgLmNsb3NlKClgIG1ldGhvZC5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRnZXQgY2xvc2VkKCk6IE9ic2VydmFibGU8YW55PiB7XG5cdFx0cmV0dXJuIHRoaXMuX2Nsb3NlZC5hc09ic2VydmFibGUoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9oaWRkZW4pKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1vZGFsIGlzIGRpc21pc3NlZCB2aWEgdGhlIGAuZGlzbWlzcygpYCBtZXRob2QuXG5cdCAqXG5cdCAqIEl0IHdpbGwgZW1pdCB0aGUgcmVhc29uIHBhc3NlZCB0byB0aGUgYC5kaXNtaXNzZWQoKWAgbWV0aG9kIGJ5IHRoZSB1c2VyLCBvciBvbmUgb2YgdGhlIGludGVybmFsXG5cdCAqIHJlYXNvbnMgbGlrZSBiYWNrZHJvcCBjbGljayBvciBFU0Mga2V5IHByZXNzLlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdGdldCBkaXNtaXNzZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHRyZXR1cm4gdGhpcy5fZGlzbWlzc2VkLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZVVudGlsKHRoaXMuX2hpZGRlbikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiBib3RoIG1vZGFsIHdpbmRvdyBhbmQgYmFja2Ryb3AgYXJlIGNsb3NlZCBhbmQgYW5pbWF0aW9ucyB3ZXJlIGZpbmlzaGVkLlxuXHQgKiBBdCB0aGlzIHBvaW50IG1vZGFsIGFuZCBiYWNrZHJvcCBlbGVtZW50cyB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgRE9NIHRyZWUuXG5cdCAqXG5cdCAqIFRoaXMgb2JzZXJ2YWJsZSB3aWxsIGJlIGNvbXBsZXRlZCBhZnRlciBlbWl0dGluZy5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRnZXQgaGlkZGVuKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuXHRcdHJldHVybiB0aGlzLl9oaWRkZW4uYXNPYnNlcnZhYmxlKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIG1vZGFsIGlzIGZ1bGx5IHZpc2libGUgYW5kIGFuaW1hdGlvbiB3YXMgZmluaXNoZWQuXG5cdCAqIE1vZGFsIERPTSBlbGVtZW50IGlzIGFsd2F5cyBhdmFpbGFibGUgc3luY2hyb25vdXNseSBhZnRlciBjYWxsaW5nICdtb2RhbC5vcGVuKCknIHNlcnZpY2UuXG5cdCAqXG5cdCAqIFRoaXMgb2JzZXJ2YWJsZSB3aWxsIGJlIGNvbXBsZXRlZCBhZnRlciBlbWl0dGluZy5cblx0ICogSXQgd2lsbCBub3QgZW1pdCwgaWYgbW9kYWwgaXMgY2xvc2VkIGJlZm9yZSBvcGVuIGFuaW1hdGlvbiBpcyBmaW5pc2hlZC5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRnZXQgc2hvd24oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG5cdFx0cmV0dXJuIHRoaXMuX3dpbmRvd0NtcHRSZWYuaW5zdGFuY2Uuc2hvd24uYXNPYnNlcnZhYmxlKCk7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIF93aW5kb3dDbXB0UmVmOiBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+LFxuXHRcdHByaXZhdGUgX2NvbnRlbnRSZWY6IENvbnRlbnRSZWYsXG5cdFx0cHJpdmF0ZSBfYmFja2Ryb3BDbXB0UmVmPzogQ29tcG9uZW50UmVmPE5nYk1vZGFsQmFja2Ryb3A+LFxuXHRcdHByaXZhdGUgX2JlZm9yZURpc21pc3M/OiAoKSA9PiBib29sZWFuIHwgUHJvbWlzZTxib29sZWFuPixcblx0KSB7XG5cdFx0X3dpbmRvd0NtcHRSZWYuaW5zdGFuY2UuZGlzbWlzc0V2ZW50LnN1YnNjcmliZSgocmVhc29uOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuZGlzbWlzcyhyZWFzb24pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5yZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcblx0XHRcdHRoaXMuX3JlamVjdCA9IHJlamVjdDtcblx0XHR9KTtcblx0XHR0aGlzLnJlc3VsdC50aGVuKG51bGwsICgpID0+IHt9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9zZXMgdGhlIG1vZGFsIHdpdGggYW4gb3B0aW9uYWwgYHJlc3VsdGAgdmFsdWUuXG5cdCAqXG5cdCAqIFRoZSBgTmdiTW9iYWxSZWYucmVzdWx0YCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWUuXG5cdCAqL1xuXHRjbG9zZShyZXN1bHQ/OiBhbnkpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2luZG93Q21wdFJlZikge1xuXHRcdFx0dGhpcy5fY2xvc2VkLm5leHQocmVzdWx0KTtcblx0XHRcdHRoaXMuX3Jlc29sdmUocmVzdWx0KTtcblx0XHRcdHRoaXMuX3JlbW92ZU1vZGFsRWxlbWVudHMoKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9kaXNtaXNzKHJlYXNvbj86IGFueSkge1xuXHRcdHRoaXMuX2Rpc21pc3NlZC5uZXh0KHJlYXNvbik7XG5cdFx0dGhpcy5fcmVqZWN0KHJlYXNvbik7XG5cdFx0dGhpcy5fcmVtb3ZlTW9kYWxFbGVtZW50cygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERpc21pc3NlcyB0aGUgbW9kYWwgd2l0aCBhbiBvcHRpb25hbCBgcmVhc29uYCB2YWx1ZS5cblx0ICpcblx0ICogVGhlIGBOZ2JNb2RhbFJlZi5yZXN1bHRgIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cblx0ICovXG5cdGRpc21pc3MocmVhc29uPzogYW55KTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX3dpbmRvd0NtcHRSZWYpIHtcblx0XHRcdGlmICghdGhpcy5fYmVmb3JlRGlzbWlzcykge1xuXHRcdFx0XHR0aGlzLl9kaXNtaXNzKHJlYXNvbik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBkaXNtaXNzID0gdGhpcy5fYmVmb3JlRGlzbWlzcygpO1xuXHRcdFx0XHRpZiAoaXNQcm9taXNlKGRpc21pc3MpKSB7XG5cdFx0XHRcdFx0ZGlzbWlzcy50aGVuKFxuXHRcdFx0XHRcdFx0KHJlc3VsdCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0ICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2Rpc21pc3MocmVhc29uKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdCgpID0+IHt9LFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZGlzbWlzcyAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHR0aGlzLl9kaXNtaXNzKHJlYXNvbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9yZW1vdmVNb2RhbEVsZW1lbnRzKCkge1xuXHRcdGNvbnN0IHdpbmRvd1RyYW5zaXRpb24kID0gdGhpcy5fd2luZG93Q21wdFJlZi5pbnN0YW5jZS5oaWRlKCk7XG5cdFx0Y29uc3QgYmFja2Ryb3BUcmFuc2l0aW9uJCA9IHRoaXMuX2JhY2tkcm9wQ21wdFJlZiA/IHRoaXMuX2JhY2tkcm9wQ21wdFJlZi5pbnN0YW5jZS5oaWRlKCkgOiBvZih1bmRlZmluZWQpO1xuXG5cdFx0Ly8gaGlkaW5nIHdpbmRvd1xuXHRcdHdpbmRvd1RyYW5zaXRpb24kLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRjb25zdCB7IG5hdGl2ZUVsZW1lbnQgfSA9IHRoaXMuX3dpbmRvd0NtcHRSZWYubG9jYXRpb247XG5cdFx0XHRuYXRpdmVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmF0aXZlRWxlbWVudCk7XG5cdFx0XHR0aGlzLl93aW5kb3dDbXB0UmVmLmRlc3Ryb3koKTtcblx0XHRcdHRoaXMuX2NvbnRlbnRSZWY/LnZpZXdSZWY/LmRlc3Ryb3koKTtcblxuXHRcdFx0dGhpcy5fd2luZG93Q21wdFJlZiA9IDxhbnk+bnVsbDtcblx0XHRcdHRoaXMuX2NvbnRlbnRSZWYgPSA8YW55Pm51bGw7XG5cdFx0fSk7XG5cblx0XHQvLyBoaWRpbmcgYmFja2Ryb3Bcblx0XHRiYWNrZHJvcFRyYW5zaXRpb24kLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5fYmFja2Ryb3BDbXB0UmVmKSB7XG5cdFx0XHRcdGNvbnN0IHsgbmF0aXZlRWxlbWVudCB9ID0gdGhpcy5fYmFja2Ryb3BDbXB0UmVmLmxvY2F0aW9uO1xuXHRcdFx0XHRuYXRpdmVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmF0aXZlRWxlbWVudCk7XG5cdFx0XHRcdHRoaXMuX2JhY2tkcm9wQ21wdFJlZi5kZXN0cm95KCk7XG5cdFx0XHRcdHRoaXMuX2JhY2tkcm9wQ21wdFJlZiA9IDxhbnk+bnVsbDtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIGFsbCBkb25lXG5cdFx0emlwKHdpbmRvd1RyYW5zaXRpb24kLCBiYWNrZHJvcFRyYW5zaXRpb24kKS5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0dGhpcy5faGlkZGVuLm5leHQoKTtcblx0XHRcdHRoaXMuX2hpZGRlbi5jb21wbGV0ZSgpO1xuXHRcdH0pO1xuXHR9XG59XG4iXX0=