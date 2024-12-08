import { afterRender, AfterRenderPhase, ChangeDetectorRef, Directive, ElementRef, EventEmitter, forwardRef, inject, Injector, Input, NgZone, Output, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, fromEvent, of, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Live } from '../util/accessibility/live';
import { ngbAutoClose } from '../util/autoclose';
import { PopupService } from '../util/popup';
import { ngbPositioning } from '../util/positioning';
import { isDefined, toString } from '../util/util';
import { NgbTypeaheadConfig } from './typeahead-config';
import { NgbTypeaheadWindow } from './typeahead-window';
import { addPopperOffset } from '../util/positioning-util';
import * as i0 from "@angular/core";
let nextWindowId = 0;
/**
 * A directive providing a simple way of creating powerful typeaheads from any text input.
 */
export class NgbTypeahead {
    constructor() {
        this._nativeElement = inject(ElementRef).nativeElement;
        this._config = inject(NgbTypeaheadConfig);
        this._live = inject(Live);
        this._document = inject(DOCUMENT);
        this._ngZone = inject(NgZone);
        this._changeDetector = inject(ChangeDetectorRef);
        this._injector = inject(Injector);
        this._popupService = new PopupService(NgbTypeaheadWindow);
        this._positioning = ngbPositioning();
        this._subscription = null;
        this._closed$ = new Subject();
        this._inputValueBackup = null;
        this._inputValueForSelectOnExact = null;
        this._valueChanges$ = fromEvent(this._nativeElement, 'input').pipe(map(($event) => $event.target.value));
        this._resubscribeTypeahead$ = new BehaviorSubject(null);
        this._windowRef = null;
        /**
         * The value for the `autocomplete` attribute for the `<input>` element.
         *
         * Defaults to `"off"` to disable the native browser autocomplete, but you can override it if necessary.
         *
         * @since 2.1.0
         */
        this.autocomplete = 'off';
        /**
         * A selector specifying the element the typeahead popup will be appended to.
         *
         * Currently only supports `"body"`.
         */
        this.container = this._config.container;
        /**
         * If `true`, model values will not be restricted only to items selected from the popup.
         */
        this.editable = this._config.editable;
        /**
         * If `true`, the first item in the result list will always stay focused while typing.
         */
        this.focusFirst = this._config.focusFirst;
        /**
         * If `true`, automatically selects the item when it is the only one that exactly matches the user input
         *
         * @since 14.2.0
         */
        this.selectOnExact = this._config.selectOnExact;
        /**
         * If `true`, will show the hint in the `<input>` when an item in the result list matches.
         */
        this.showHint = this._config.showHint;
        /**
         * The preferred placement of the typeahead, among the [possible values](#/guides/positioning#api).
         *
         * The default order of preference is `"bottom-start bottom-end top-start top-end"`
         *
         * Please see the [positioning overview](#/positioning) for more details.
         */
        this.placement = this._config.placement;
        /**
         * Allows to change default Popper options when positioning the typeahead.
         * Receives current popper options and returns modified ones.
         *
         * @since 13.1.0
         */
        this.popperOptions = this._config.popperOptions;
        /**
         * An event emitted right before an item is selected from the result list.
         *
         * Event payload is of type [`NgbTypeaheadSelectItemEvent`](#/components/typeahead/api#NgbTypeaheadSelectItemEvent).
         */
        this.selectItem = new EventEmitter();
        this.activeDescendant = null;
        this.popupId = `ngb-typeahead-${nextWindowId++}`;
        this._onTouched = () => { };
        this._onChange = (_) => { };
    }
    ngOnInit() {
        this._subscribeToUserInput();
    }
    ngOnChanges({ ngbTypeahead }) {
        if (ngbTypeahead && !ngbTypeahead.firstChange) {
            this._unsubscribeFromUserInput();
            this._subscribeToUserInput();
        }
    }
    ngOnDestroy() {
        this._closePopup();
        this._unsubscribeFromUserInput();
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    writeValue(value) {
        this._writeInputValue(this._formatItemForInput(value));
        if (this.showHint) {
            this._inputValueBackup = value;
        }
    }
    setDisabledState(isDisabled) {
        this._nativeElement.disabled = isDisabled;
    }
    /**
     * Dismisses typeahead popup window
     */
    dismissPopup() {
        if (this.isPopupOpen()) {
            this._resubscribeTypeahead$.next(null);
            this._closePopup();
            if (this.showHint && this._inputValueBackup !== null) {
                this._writeInputValue(this._inputValueBackup);
            }
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Returns true if the typeahead popup window is displayed
     */
    isPopupOpen() {
        return this._windowRef != null;
    }
    handleBlur() {
        this._resubscribeTypeahead$.next(null);
        this._onTouched();
    }
    handleKeyDown(event) {
        if (!this.isPopupOpen()) {
            return;
        }
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this._windowRef.instance.next();
                this._showHint();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this._windowRef.instance.prev();
                this._showHint();
                break;
            case 'Enter':
            case 'Tab': {
                const result = this._windowRef.instance.getActive();
                if (isDefined(result)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this._selectResult(result);
                }
                this._closePopup();
                break;
            }
        }
    }
    _openPopup() {
        if (!this.isPopupOpen()) {
            this._inputValueBackup = this._nativeElement.value;
            const { windowRef } = this._popupService.open();
            this._windowRef = windowRef;
            this._windowRef.setInput('id', this.popupId);
            this._windowRef.setInput('popupClass', this.popupClass);
            this._windowRef.instance.selectEvent.subscribe((result) => this._selectResultClosePopup(result));
            this._windowRef.instance.activeChangeEvent.subscribe((activeId) => (this.activeDescendant = activeId));
            if (this.container === 'body') {
                this._windowRef.location.nativeElement.style.zIndex = '1055';
                this._document.body.appendChild(this._windowRef.location.nativeElement);
            }
            this._changeDetector.markForCheck();
            // Setting up popper and scheduling updates when zone is stable
            this._ngZone.runOutsideAngular(() => {
                if (this._windowRef) {
                    this._positioning.createPopper({
                        hostElement: this._nativeElement,
                        targetElement: this._windowRef.location.nativeElement,
                        placement: this.placement,
                        updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 2])(options)),
                    });
                    this._afterRenderRef = afterRender(() => {
                        this._positioning.update();
                    }, { phase: AfterRenderPhase.MixedReadWrite, injector: this._injector });
                }
            });
            ngbAutoClose(this._ngZone, this._document, 'outside', () => this.dismissPopup(), this._closed$, [
                this._nativeElement,
                this._windowRef.location.nativeElement,
            ]);
        }
    }
    _closePopup() {
        this._popupService.close().subscribe(() => {
            this._positioning.destroy();
            this._afterRenderRef?.destroy();
            this._closed$.next();
            this._windowRef = null;
            this.activeDescendant = null;
        });
    }
    _selectResult(result) {
        let defaultPrevented = false;
        this.selectItem.emit({
            item: result,
            preventDefault: () => {
                defaultPrevented = true;
            },
        });
        this._resubscribeTypeahead$.next(null);
        if (!defaultPrevented) {
            this.writeValue(result);
            this._onChange(result);
        }
    }
    _selectResultClosePopup(result) {
        this._selectResult(result);
        this._closePopup();
    }
    _showHint() {
        if (this.showHint && this._windowRef?.instance.hasActive() && this._inputValueBackup != null) {
            const userInputLowerCase = this._inputValueBackup.toLowerCase();
            const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());
            if (userInputLowerCase === formattedVal.substring(0, this._inputValueBackup.length).toLowerCase()) {
                this._writeInputValue(this._inputValueBackup + formattedVal.substring(this._inputValueBackup.length));
                this._nativeElement['setSelectionRange'].apply(this._nativeElement, [
                    this._inputValueBackup.length,
                    formattedVal.length,
                ]);
            }
            else {
                this._writeInputValue(formattedVal);
            }
        }
    }
    _formatItemForInput(item) {
        return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
    }
    _writeInputValue(value) {
        this._nativeElement.value = toString(value);
    }
    _subscribeToUserInput() {
        const results$ = this._valueChanges$.pipe(tap((value) => {
            this._inputValueBackup = this.showHint ? value : null;
            this._inputValueForSelectOnExact = this.selectOnExact ? value : null;
            this._onChange(this.editable ? value : undefined);
        }), this.ngbTypeahead ? this.ngbTypeahead : () => of([]));
        this._subscription = this._resubscribeTypeahead$.pipe(switchMap(() => results$)).subscribe((results) => {
            if (!results || results.length === 0) {
                this._closePopup();
            }
            else {
                // when there is only one result and this matches the input value
                if (this.selectOnExact &&
                    results.length === 1 &&
                    this._formatItemForInput(results[0]) === this._inputValueForSelectOnExact) {
                    this._selectResult(results[0]);
                    this._closePopup();
                }
                else {
                    this._openPopup();
                    this._windowRef.setInput('focusFirst', this.focusFirst);
                    this._windowRef.setInput('results', results);
                    this._windowRef.setInput('term', this._nativeElement.value);
                    if (this.resultFormatter) {
                        this._windowRef.setInput('formatter', this.resultFormatter);
                    }
                    if (this.resultTemplate) {
                        this._windowRef.setInput('resultTemplate', this.resultTemplate);
                    }
                    this._windowRef.instance.resetActive();
                    // The observable stream we are subscribing to might have async steps
                    // and if a component containing typeahead is using the OnPush strategy
                    // the change detection turn wouldn't be invoked automatically.
                    this._windowRef.changeDetectorRef.detectChanges();
                    this._showHint();
                }
            }
            // live announcer
            const count = results ? results.length : 0;
            this._live.say(count === 0 ? 'No results available' : `${count} result${count === 1 ? '' : 's'} available`);
        });
    }
    _unsubscribeFromUserInput() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTypeahead, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbTypeahead, isStandalone: true, selector: "input[ngbTypeahead]", inputs: { autocomplete: "autocomplete", container: "container", editable: "editable", focusFirst: "focusFirst", inputFormatter: "inputFormatter", ngbTypeahead: "ngbTypeahead", resultFormatter: "resultFormatter", resultTemplate: "resultTemplate", selectOnExact: "selectOnExact", showHint: "showHint", placement: "placement", popperOptions: "popperOptions", popupClass: "popupClass" }, outputs: { selectItem: "selectItem" }, host: { attributes: { "autocapitalize": "off", "autocorrect": "off", "role": "combobox" }, listeners: { "blur": "handleBlur()", "keydown": "handleKeyDown($event)" }, properties: { "class.open": "isPopupOpen()", "autocomplete": "autocomplete", "attr.aria-autocomplete": "showHint ? \"both\" : \"list\"", "attr.aria-activedescendant": "activeDescendant", "attr.aria-owns": "isPopupOpen() ? popupId : null", "attr.aria-expanded": "isPopupOpen()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTypeahead), multi: true }], exportAs: ["ngbTypeahead"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTypeahead, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngbTypeahead]',
                    exportAs: 'ngbTypeahead',
                    standalone: true,
                    host: {
                        '(blur)': 'handleBlur()',
                        '[class.open]': 'isPopupOpen()',
                        '(keydown)': 'handleKeyDown($event)',
                        '[autocomplete]': 'autocomplete',
                        autocapitalize: 'off',
                        autocorrect: 'off',
                        role: 'combobox',
                        '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
                        '[attr.aria-activedescendant]': 'activeDescendant',
                        '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
                        '[attr.aria-expanded]': 'isPopupOpen()',
                    },
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTypeahead), multi: true }],
                }]
        }], propDecorators: { autocomplete: [{
                type: Input
            }], container: [{
                type: Input
            }], editable: [{
                type: Input
            }], focusFirst: [{
                type: Input
            }], inputFormatter: [{
                type: Input
            }], ngbTypeahead: [{
                type: Input
            }], resultFormatter: [{
                type: Input
            }], resultTemplate: [{
                type: Input
            }], selectOnExact: [{
                type: Input
            }], showHint: [{
                type: Input
            }], placement: [{
                type: Input
            }], popperOptions: [{
                type: Input
            }], popupClass: [{
                type: Input
            }], selectItem: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWFoZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3R5cGVhaGVhZC90eXBlYWhlYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNOLFdBQVcsRUFDWCxnQkFBZ0IsRUFFaEIsaUJBQWlCLEVBRWpCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxHQUdOLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFvQixPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQy9GLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFbkQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDeEQsT0FBTyxFQUFFLGtCQUFrQixFQUF5QixNQUFNLG9CQUFvQixDQUFDO0FBQy9FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7QUFpQjNELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVy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ckIsS0FBSztnQkFLRyxRQUFRO3NCQUFoQixLQUFLO2dCQVNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBUUcsYUFBYTtzQkFBckIsS0FBSztnQkFXRyxVQUFVO3NCQUFsQixLQUFLO2dCQU9JLFVBQVU7c0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRhZnRlclJlbmRlcixcblx0QWZ0ZXJSZW5kZXJQaGFzZSxcblx0QWZ0ZXJSZW5kZXJSZWYsXG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb21wb25lbnRSZWYsXG5cdERpcmVjdGl2ZSxcblx0RWxlbWVudFJlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLFxuXHRpbmplY3QsXG5cdEluamVjdG9yLFxuXHRJbnB1dCxcblx0Tmdab25lLFxuXHRPbkNoYW5nZXMsXG5cdE9uRGVzdHJveSxcblx0T25Jbml0LFxuXHRPdXRwdXQsXG5cdFNpbXBsZUNoYW5nZXMsXG5cdFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgZnJvbUV2ZW50LCBvZiwgT3BlcmF0b3JGdW5jdGlvbiwgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIHN3aXRjaE1hcCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBMaXZlIH0gZnJvbSAnLi4vdXRpbC9hY2Nlc3NpYmlsaXR5L2xpdmUnO1xuaW1wb3J0IHsgbmdiQXV0b0Nsb3NlIH0gZnJvbSAnLi4vdXRpbC9hdXRvY2xvc2UnO1xuaW1wb3J0IHsgUG9wdXBTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQgeyBuZ2JQb3NpdGlvbmluZyB9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHsgaXNEZWZpbmVkLCB0b1N0cmluZyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7IE5nYlR5cGVhaGVhZENvbmZpZyB9IGZyb20gJy4vdHlwZWFoZWFkLWNvbmZpZyc7XG5pbXBvcnQgeyBOZ2JUeXBlYWhlYWRXaW5kb3csIFJlc3VsdFRlbXBsYXRlQ29udGV4dCB9IGZyb20gJy4vdHlwZWFoZWFkLXdpbmRvdyc7XG5pbXBvcnQgeyBhZGRQb3BwZXJPZmZzZXQgfSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nLXV0aWwnO1xuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYmVmb3JlIGFuIGl0ZW0gaXMgc2VsZWN0ZWQgZnJvbSB0aGUgcmVzdWx0IGxpc3QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50PFQgPSBhbnk+IHtcblx0LyoqXG5cdCAqIFRoZSBpdGVtIGZyb20gdGhlIHJlc3VsdCBsaXN0IGFib3V0IHRvIGJlIHNlbGVjdGVkLlxuXHQgKi9cblx0aXRlbTogVDtcblxuXHQvKipcblx0ICogQ2FsbGluZyB0aGlzIGZ1bmN0aW9uIHdpbGwgcHJldmVudCBpdGVtIHNlbGVjdGlvbiBmcm9tIGhhcHBlbmluZy5cblx0ICovXG5cdHByZXZlbnREZWZhdWx0OiAoKSA9PiB2b2lkO1xufVxuXG5sZXQgbmV4dFdpbmRvd0lkID0gMDtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSBwcm92aWRpbmcgYSBzaW1wbGUgd2F5IG9mIGNyZWF0aW5nIHBvd2VyZnVsIHR5cGVhaGVhZHMgZnJvbSBhbnkgdGV4dCBpbnB1dC5cbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnaW5wdXRbbmdiVHlwZWFoZWFkXScsXG5cdGV4cG9ydEFzOiAnbmdiVHlwZWFoZWFkJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdCcoYmx1ciknOiAnaGFuZGxlQmx1cigpJyxcblx0XHQnW2NsYXNzLm9wZW5dJzogJ2lzUG9wdXBPcGVuKCknLFxuXHRcdCcoa2V5ZG93biknOiAnaGFuZGxlS2V5RG93bigkZXZlbnQpJyxcblx0XHQnW2F1dG9jb21wbGV0ZV0nOiAnYXV0b2NvbXBsZXRlJyxcblx0XHRhdXRvY2FwaXRhbGl6ZTogJ29mZicsXG5cdFx0YXV0b2NvcnJlY3Q6ICdvZmYnLFxuXHRcdHJvbGU6ICdjb21ib2JveCcsXG5cdFx0J1thdHRyLmFyaWEtYXV0b2NvbXBsZXRlXSc6ICdzaG93SGludCA/IFwiYm90aFwiIDogXCJsaXN0XCInLFxuXHRcdCdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJ2FjdGl2ZURlc2NlbmRhbnQnLFxuXHRcdCdbYXR0ci5hcmlhLW93bnNdJzogJ2lzUG9wdXBPcGVuKCkgPyBwb3B1cElkIDogbnVsbCcsXG5cdFx0J1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2lzUG9wdXBPcGVuKCknLFxuXHR9LFxuXHRwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JUeXBlYWhlYWQpLCBtdWx0aTogdHJ1ZSB9XSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiVHlwZWFoZWFkIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXHRwcml2YXRlIF9uYXRpdmVFbGVtZW50ID0gaW5qZWN0KEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudDtcblx0cHJpdmF0ZSBfY29uZmlnID0gaW5qZWN0KE5nYlR5cGVhaGVhZENvbmZpZyk7XG5cdHByaXZhdGUgX2xpdmUgPSBpbmplY3QoTGl2ZSk7XG5cdHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcblx0cHJpdmF0ZSBfbmdab25lID0gaW5qZWN0KE5nWm9uZSk7XG5cdHByaXZhdGUgX2NoYW5nZURldGVjdG9yID0gaW5qZWN0KENoYW5nZURldGVjdG9yUmVmKTtcblx0cHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXG5cdHByaXZhdGUgX3BvcHVwU2VydmljZSA9IG5ldyBQb3B1cFNlcnZpY2UoTmdiVHlwZWFoZWFkV2luZG93KTtcblx0cHJpdmF0ZSBfcG9zaXRpb25pbmcgPSBuZ2JQb3NpdGlvbmluZygpO1xuXG5cdHByaXZhdGUgX3N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGw7XG5cdHByaXZhdGUgX2Nsb3NlZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXHRwcml2YXRlIF9pbnB1dFZhbHVlQmFja3VwOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfaW5wdXRWYWx1ZUZvclNlbGVjdE9uRXhhY3Q6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIF92YWx1ZUNoYW5nZXMkID0gZnJvbUV2ZW50PEV2ZW50Pih0aGlzLl9uYXRpdmVFbGVtZW50LCAnaW5wdXQnKS5waXBlKFxuXHRcdG1hcCgoJGV2ZW50KSA9PiAoJGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSksXG5cdCk7XG5cdHByaXZhdGUgX3Jlc3Vic2NyaWJlVHlwZWFoZWFkJCA9IG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCk7XG5cdHByaXZhdGUgX3dpbmRvd1JlZjogQ29tcG9uZW50UmVmPE5nYlR5cGVhaGVhZFdpbmRvdz4gfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfYWZ0ZXJSZW5kZXJSZWY6IEFmdGVyUmVuZGVyUmVmO1xuXG5cdC8qKlxuXHQgKiBUaGUgdmFsdWUgZm9yIHRoZSBgYXV0b2NvbXBsZXRlYCBhdHRyaWJ1dGUgZm9yIHRoZSBgPGlucHV0PmAgZWxlbWVudC5cblx0ICpcblx0ICogRGVmYXVsdHMgdG8gYFwib2ZmXCJgIHRvIGRpc2FibGUgdGhlIG5hdGl2ZSBicm93c2VyIGF1dG9jb21wbGV0ZSwgYnV0IHlvdSBjYW4gb3ZlcnJpZGUgaXQgaWYgbmVjZXNzYXJ5LlxuXHQgKlxuXHQgKiBAc2luY2UgMi4xLjBcblx0ICovXG5cdEBJbnB1dCgpIGF1dG9jb21wbGV0ZSA9ICdvZmYnO1xuXG5cdC8qKlxuXHQgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIHR5cGVhaGVhZCBwb3B1cCB3aWxsIGJlIGFwcGVuZGVkIHRvLlxuXHQgKlxuXHQgKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBgXCJib2R5XCJgLlxuXHQgKi9cblx0QElucHV0KCkgY29udGFpbmVyID0gdGhpcy5fY29uZmlnLmNvbnRhaW5lcjtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCBtb2RlbCB2YWx1ZXMgd2lsbCBub3QgYmUgcmVzdHJpY3RlZCBvbmx5IHRvIGl0ZW1zIHNlbGVjdGVkIGZyb20gdGhlIHBvcHVwLlxuXHQgKi9cblx0QElucHV0KCkgZWRpdGFibGUgPSB0aGlzLl9jb25maWcuZWRpdGFibGU7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHJlc3VsdCBsaXN0IHdpbGwgYWx3YXlzIHN0YXkgZm9jdXNlZCB3aGlsZSB0eXBpbmcuXG5cdCAqL1xuXHRASW5wdXQoKSBmb2N1c0ZpcnN0ID0gdGhpcy5fY29uZmlnLmZvY3VzRmlyc3Q7XG5cblx0LyoqXG5cdCAqIFRoZSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGFuIGl0ZW0gZnJvbSB0aGUgcmVzdWx0IGxpc3QgdG8gYSBgc3RyaW5nYCB0byBkaXNwbGF5IGluIHRoZSBgPGlucHV0PmAgZmllbGQuXG5cdCAqXG5cdCAqIEl0IGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgc29tZXRoaW5nIGluIHRoZSBwb3B1cCBvciB0aGUgbW9kZWwgdmFsdWUgY2hhbmdlcywgc28gdGhlIGlucHV0IG5lZWRzIHRvXG5cdCAqIGJlIHVwZGF0ZWQuXG5cdCAqL1xuXHRASW5wdXQoKSBpbnB1dEZvcm1hdHRlcjogKGl0ZW06IGFueSkgPT4gc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUaGUgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBhIHN0cmVhbSBvZiB0ZXh0IHZhbHVlcyBmcm9tIHRoZSBgPGlucHV0PmAgZWxlbWVudCB0byB0aGUgc3RyZWFtIG9mIHRoZSBhcnJheSBvZiBpdGVtc1xuXHQgKiB0byBkaXNwbGF5IGluIHRoZSB0eXBlYWhlYWQgcG9wdXAuXG5cdCAqXG5cdCAqIElmIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBlbWl0cyBhIG5vbi1lbXB0eSBhcnJheSAtIHRoZSBwb3B1cCB3aWxsIGJlIHNob3duLiBJZiBpdCBlbWl0cyBhbiBlbXB0eSBhcnJheSAtIHRoZVxuXHQgKiBwb3B1cCB3aWxsIGJlIGNsb3NlZC5cblx0ICpcblx0ICogU2VlIHRoZSBbYmFzaWMgZXhhbXBsZV0oIy9jb21wb25lbnRzL3R5cGVhaGVhZC9leGFtcGxlcyNiYXNpYykgZm9yIG1vcmUgZGV0YWlscy5cblx0ICpcblx0ICogTm90ZSB0aGF0IHRoZSBgdGhpc2AgYXJndW1lbnQgaXMgYHVuZGVmaW5lZGAgc28geW91IG5lZWQgdG8gZXhwbGljaXRseSBiaW5kIGl0IHRvIGEgZGVzaXJlZCBcInRoaXNcIiB0YXJnZXQuXG5cdCAqL1xuXHRASW5wdXQoKSBuZ2JUeXBlYWhlYWQ6IE9wZXJhdG9yRnVuY3Rpb248c3RyaW5nLCByZWFkb25seSBhbnlbXT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBhbiBpdGVtIGZyb20gdGhlIHJlc3VsdCBsaXN0IHRvIGEgYHN0cmluZ2AgdG8gZGlzcGxheSBpbiB0aGUgcG9wdXAuXG5cdCAqXG5cdCAqIE11c3QgYmUgcHJvdmlkZWQsIGlmIHlvdXIgYG5nYlR5cGVhaGVhZGAgcmV0dXJucyBzb21ldGhpbmcgb3RoZXIgdGhhbiBgT2JzZXJ2YWJsZTxzdHJpbmdbXT5gLlxuXHQgKlxuXHQgKiBBbHRlcm5hdGl2ZWx5IGZvciBtb3JlIGNvbXBsZXggbWFya3VwIGluIHRoZSBwb3B1cCB5b3Ugc2hvdWxkIHVzZSBgcmVzdWx0VGVtcGxhdGVgLlxuXHQgKi9cblx0QElucHV0KCkgcmVzdWx0Rm9ybWF0dGVyOiAoaXRlbTogYW55KSA9PiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSB0ZW1wbGF0ZSB0byBvdmVycmlkZSB0aGUgd2F5IHJlc3VsdGluZyBpdGVtcyBhcmUgZGlzcGxheWVkIGluIHRoZSBwb3B1cC5cblx0ICpcblx0ICogU2VlIHRoZSBbUmVzdWx0VGVtcGxhdGVDb250ZXh0XSgjL2NvbXBvbmVudHMvdHlwZWFoZWFkL2FwaSNSZXN1bHRUZW1wbGF0ZUNvbnRleHQpIGZvciB0aGUgdGVtcGxhdGUgY29udGV4dC5cblx0ICpcblx0ICogQWxzbyBzZWUgdGhlIFt0ZW1wbGF0ZSBmb3IgcmVzdWx0cyBkZW1vXSgjL2NvbXBvbmVudHMvdHlwZWFoZWFkL2V4YW1wbGVzI3RlbXBsYXRlKSBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgKi9cblx0QElucHV0KCkgcmVzdWx0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPFJlc3VsdFRlbXBsYXRlQ29udGV4dD47XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgYXV0b21hdGljYWxseSBzZWxlY3RzIHRoZSBpdGVtIHdoZW4gaXQgaXMgdGhlIG9ubHkgb25lIHRoYXQgZXhhY3RseSBtYXRjaGVzIHRoZSB1c2VyIGlucHV0XG5cdCAqXG5cdCAqIEBzaW5jZSAxNC4yLjBcblx0ICovXG5cdEBJbnB1dCgpIHNlbGVjdE9uRXhhY3QgPSB0aGlzLl9jb25maWcuc2VsZWN0T25FeGFjdDtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3aWxsIHNob3cgdGhlIGhpbnQgaW4gdGhlIGA8aW5wdXQ+YCB3aGVuIGFuIGl0ZW0gaW4gdGhlIHJlc3VsdCBsaXN0IG1hdGNoZXMuXG5cdCAqL1xuXHRASW5wdXQoKSBzaG93SGludCA9IHRoaXMuX2NvbmZpZy5zaG93SGludDtcblxuXHQvKipcblx0ICogVGhlIHByZWZlcnJlZCBwbGFjZW1lbnQgb2YgdGhlIHR5cGVhaGVhZCwgYW1vbmcgdGhlIFtwb3NzaWJsZSB2YWx1ZXNdKCMvZ3VpZGVzL3Bvc2l0aW9uaW5nI2FwaSkuXG5cdCAqXG5cdCAqIFRoZSBkZWZhdWx0IG9yZGVyIG9mIHByZWZlcmVuY2UgaXMgYFwiYm90dG9tLXN0YXJ0IGJvdHRvbS1lbmQgdG9wLXN0YXJ0IHRvcC1lbmRcImBcblx0ICpcblx0ICogUGxlYXNlIHNlZSB0aGUgW3Bvc2l0aW9uaW5nIG92ZXJ2aWV3XSgjL3Bvc2l0aW9uaW5nKSBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgKi9cblx0QElucHV0KCkgcGxhY2VtZW50ID0gdGhpcy5fY29uZmlnLnBsYWNlbWVudDtcblxuXHQvKipcblx0ICogQWxsb3dzIHRvIGNoYW5nZSBkZWZhdWx0IFBvcHBlciBvcHRpb25zIHdoZW4gcG9zaXRpb25pbmcgdGhlIHR5cGVhaGVhZC5cblx0ICogUmVjZWl2ZXMgY3VycmVudCBwb3BwZXIgb3B0aW9ucyBhbmQgcmV0dXJucyBtb2RpZmllZCBvbmVzLlxuXHQgKlxuXHQgKiBAc2luY2UgMTMuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBwb3BwZXJPcHRpb25zID0gdGhpcy5fY29uZmlnLnBvcHBlck9wdGlvbnM7XG5cblx0LyoqXG5cdCAqIEEgY3VzdG9tIGNsYXNzIHRvIGFwcGVuZCB0byB0aGUgdHlwZWFoZWFkIHBvcHVwIHdpbmRvd1xuXHQgKlxuXHQgKiBBY2NlcHRzIGEgc3RyaW5nIGNvbnRhaW5pbmcgQ1NTIGNsYXNzIHRvIGJlIGFwcGxpZWQgb24gdGhlIGBuZ2ItdHlwZWFoZWFkLXdpbmRvd2AuXG5cdCAqXG5cdCAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSBpbnN0YW5jZS1zcGVjaWZpYyBzdHlsaW5nLCBleC4geW91IGNhbiBvdmVycmlkZSBwb3B1cCB3aW5kb3cgYHotaW5kZXhgXG5cdCAqXG5cdCAqIEBzaW5jZSA5LjEuMFxuXHQgKi9cblx0QElucHV0KCkgcG9wdXBDbGFzczogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHJpZ2h0IGJlZm9yZSBhbiBpdGVtIGlzIHNlbGVjdGVkIGZyb20gdGhlIHJlc3VsdCBsaXN0LlxuXHQgKlxuXHQgKiBFdmVudCBwYXlsb2FkIGlzIG9mIHR5cGUgW2BOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnRgXSgjL2NvbXBvbmVudHMvdHlwZWFoZWFkL2FwaSNOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnQpLlxuXHQgKi9cblx0QE91dHB1dCgpIHNlbGVjdEl0ZW0gPSBuZXcgRXZlbnRFbWl0dGVyPE5nYlR5cGVhaGVhZFNlbGVjdEl0ZW1FdmVudD4oKTtcblxuXHRhY3RpdmVEZXNjZW5kYW50OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblx0cG9wdXBJZCA9IGBuZ2ItdHlwZWFoZWFkLSR7bmV4dFdpbmRvd0lkKyt9YDtcblxuXHRwcml2YXRlIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblx0cHJpdmF0ZSBfb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcblxuXHRuZ09uSW5pdCgpOiB2b2lkIHtcblx0XHR0aGlzLl9zdWJzY3JpYmVUb1VzZXJJbnB1dCgpO1xuXHR9XG5cblx0bmdPbkNoYW5nZXMoeyBuZ2JUeXBlYWhlYWQgfTogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuXHRcdGlmIChuZ2JUeXBlYWhlYWQgJiYgIW5nYlR5cGVhaGVhZC5maXJzdENoYW5nZSkge1xuXHRcdFx0dGhpcy5fdW5zdWJzY3JpYmVGcm9tVXNlcklucHV0KCk7XG5cdFx0XHR0aGlzLl9zdWJzY3JpYmVUb1VzZXJJbnB1dCgpO1xuXHRcdH1cblx0fVxuXG5cdG5nT25EZXN0cm95KCk6IHZvaWQge1xuXHRcdHRoaXMuX2Nsb3NlUG9wdXAoKTtcblx0XHR0aGlzLl91bnN1YnNjcmliZUZyb21Vc2VySW5wdXQoKTtcblx0fVxuXG5cdHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHtcblx0XHR0aGlzLl9vbkNoYW5nZSA9IGZuO1xuXHR9XG5cblx0cmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQge1xuXHRcdHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuXHR9XG5cblx0d3JpdGVWYWx1ZSh2YWx1ZSkge1xuXHRcdHRoaXMuX3dyaXRlSW5wdXRWYWx1ZSh0aGlzLl9mb3JtYXRJdGVtRm9ySW5wdXQodmFsdWUpKTtcblx0XHRpZiAodGhpcy5zaG93SGludCkge1xuXHRcdFx0dGhpcy5faW5wdXRWYWx1ZUJhY2t1cCA9IHZhbHVlO1xuXHRcdH1cblx0fVxuXG5cdHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuXHRcdHRoaXMuX25hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIERpc21pc3NlcyB0eXBlYWhlYWQgcG9wdXAgd2luZG93XG5cdCAqL1xuXHRkaXNtaXNzUG9wdXAoKSB7XG5cdFx0aWYgKHRoaXMuaXNQb3B1cE9wZW4oKSkge1xuXHRcdFx0dGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQkLm5leHQobnVsbCk7XG5cdFx0XHR0aGlzLl9jbG9zZVBvcHVwKCk7XG5cdFx0XHRpZiAodGhpcy5zaG93SGludCAmJiB0aGlzLl9pbnB1dFZhbHVlQmFja3VwICE9PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuX3dyaXRlSW5wdXRWYWx1ZSh0aGlzLl9pbnB1dFZhbHVlQmFja3VwKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHR5cGVhaGVhZCBwb3B1cCB3aW5kb3cgaXMgZGlzcGxheWVkXG5cdCAqL1xuXHRpc1BvcHVwT3BlbigpIHtcblx0XHRyZXR1cm4gdGhpcy5fd2luZG93UmVmICE9IG51bGw7XG5cdH1cblxuXHRoYW5kbGVCbHVyKCkge1xuXHRcdHRoaXMuX3Jlc3Vic2NyaWJlVHlwZWFoZWFkJC5uZXh0KG51bGwpO1xuXHRcdHRoaXMuX29uVG91Y2hlZCgpO1xuXHR9XG5cblx0aGFuZGxlS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuXHRcdGlmICghdGhpcy5pc1BvcHVwT3BlbigpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0c3dpdGNoIChldmVudC5rZXkpIHtcblx0XHRcdGNhc2UgJ0Fycm93RG93bic6XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuX3dpbmRvd1JlZiEuaW5zdGFuY2UubmV4dCgpO1xuXHRcdFx0XHR0aGlzLl9zaG93SGludCgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0Fycm93VXAnOlxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLmluc3RhbmNlLnByZXYoKTtcblx0XHRcdFx0dGhpcy5fc2hvd0hpbnQoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdFbnRlcic6XG5cdFx0XHRjYXNlICdUYWInOiB7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IHRoaXMuX3dpbmRvd1JlZiEuaW5zdGFuY2UuZ2V0QWN0aXZlKCk7XG5cdFx0XHRcdGlmIChpc0RlZmluZWQocmVzdWx0KSkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5fc2VsZWN0UmVzdWx0KHJlc3VsdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fY2xvc2VQb3B1cCgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9vcGVuUG9wdXAoKSB7XG5cdFx0aWYgKCF0aGlzLmlzUG9wdXBPcGVuKCkpIHtcblx0XHRcdHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgPSB0aGlzLl9uYXRpdmVFbGVtZW50LnZhbHVlO1xuXHRcdFx0Y29uc3QgeyB3aW5kb3dSZWYgfSA9IHRoaXMuX3BvcHVwU2VydmljZS5vcGVuKCk7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYgPSB3aW5kb3dSZWY7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuc2V0SW5wdXQoJ2lkJywgdGhpcy5wb3B1cElkKTtcblx0XHRcdHRoaXMuX3dpbmRvd1JlZi5zZXRJbnB1dCgncG9wdXBDbGFzcycsIHRoaXMucG9wdXBDbGFzcyk7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2Uuc2VsZWN0RXZlbnQuc3Vic2NyaWJlKChyZXN1bHQ6IGFueSkgPT4gdGhpcy5fc2VsZWN0UmVzdWx0Q2xvc2VQb3B1cChyZXN1bHQpKTtcblx0XHRcdHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5hY3RpdmVDaGFuZ2VFdmVudC5zdWJzY3JpYmUoKGFjdGl2ZUlkOiBzdHJpbmcpID0+ICh0aGlzLmFjdGl2ZURlc2NlbmRhbnQgPSBhY3RpdmVJZCkpO1xuXG5cdFx0XHRpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuXHRcdFx0XHQodGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnpJbmRleCA9ICcxMDU1Jztcblx0XHRcdFx0dGhpcy5fZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuXG5cdFx0XHQvLyBTZXR0aW5nIHVwIHBvcHBlciBhbmQgc2NoZWR1bGluZyB1cGRhdGVzIHdoZW4gem9uZSBpcyBzdGFibGVcblx0XHRcdHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLl93aW5kb3dSZWYpIHtcblx0XHRcdFx0XHR0aGlzLl9wb3NpdGlvbmluZy5jcmVhdGVQb3BwZXIoe1xuXHRcdFx0XHRcdFx0aG9zdEVsZW1lbnQ6IHRoaXMuX25hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdFx0XHR0YXJnZXRFbGVtZW50OiB0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XHRcdHBsYWNlbWVudDogdGhpcy5wbGFjZW1lbnQsXG5cdFx0XHRcdFx0XHR1cGRhdGVQb3BwZXJPcHRpb25zOiAob3B0aW9ucykgPT4gdGhpcy5wb3BwZXJPcHRpb25zKGFkZFBvcHBlck9mZnNldChbMCwgMl0pKG9wdGlvbnMpKSxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHRoaXMuX2FmdGVyUmVuZGVyUmVmID0gYWZ0ZXJSZW5kZXIoXG5cdFx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3Bvc2l0aW9uaW5nLnVwZGF0ZSgpO1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHsgcGhhc2U6IEFmdGVyUmVuZGVyUGhhc2UuTWl4ZWRSZWFkV3JpdGUsIGluamVjdG9yOiB0aGlzLl9pbmplY3RvciB9LFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRuZ2JBdXRvQ2xvc2UodGhpcy5fbmdab25lLCB0aGlzLl9kb2N1bWVudCwgJ291dHNpZGUnLCAoKSA9PiB0aGlzLmRpc21pc3NQb3B1cCgpLCB0aGlzLl9jbG9zZWQkLCBbXG5cdFx0XHRcdHRoaXMuX25hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdHRoaXMuX3dpbmRvd1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XSk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfY2xvc2VQb3B1cCgpIHtcblx0XHR0aGlzLl9wb3B1cFNlcnZpY2UuY2xvc2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuZGVzdHJveSgpO1xuXHRcdFx0dGhpcy5fYWZ0ZXJSZW5kZXJSZWY/LmRlc3Ryb3koKTtcblx0XHRcdHRoaXMuX2Nsb3NlZCQubmV4dCgpO1xuXHRcdFx0dGhpcy5fd2luZG93UmVmID0gbnVsbDtcblx0XHRcdHRoaXMuYWN0aXZlRGVzY2VuZGFudCA9IG51bGw7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF9zZWxlY3RSZXN1bHQocmVzdWx0OiBhbnkpIHtcblx0XHRsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuXHRcdHRoaXMuc2VsZWN0SXRlbS5lbWl0KHtcblx0XHRcdGl0ZW06IHJlc3VsdCxcblx0XHRcdHByZXZlbnREZWZhdWx0OiAoKSA9PiB7XG5cdFx0XHRcdGRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlO1xuXHRcdFx0fSxcblx0XHR9KTtcblx0XHR0aGlzLl9yZXN1YnNjcmliZVR5cGVhaGVhZCQubmV4dChudWxsKTtcblxuXHRcdGlmICghZGVmYXVsdFByZXZlbnRlZCkge1xuXHRcdFx0dGhpcy53cml0ZVZhbHVlKHJlc3VsdCk7XG5cdFx0XHR0aGlzLl9vbkNoYW5nZShyZXN1bHQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3NlbGVjdFJlc3VsdENsb3NlUG9wdXAocmVzdWx0OiBhbnkpIHtcblx0XHR0aGlzLl9zZWxlY3RSZXN1bHQocmVzdWx0KTtcblx0XHR0aGlzLl9jbG9zZVBvcHVwKCk7XG5cdH1cblxuXHRwcml2YXRlIF9zaG93SGludCgpIHtcblx0XHRpZiAodGhpcy5zaG93SGludCAmJiB0aGlzLl93aW5kb3dSZWY/Lmluc3RhbmNlLmhhc0FjdGl2ZSgpICYmIHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgIT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgdXNlcklucHV0TG93ZXJDYXNlID0gdGhpcy5faW5wdXRWYWx1ZUJhY2t1cC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0Y29uc3QgZm9ybWF0dGVkVmFsID0gdGhpcy5fZm9ybWF0SXRlbUZvcklucHV0KHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5nZXRBY3RpdmUoKSk7XG5cblx0XHRcdGlmICh1c2VySW5wdXRMb3dlckNhc2UgPT09IGZvcm1hdHRlZFZhbC5zdWJzdHJpbmcoMCwgdGhpcy5faW5wdXRWYWx1ZUJhY2t1cC5sZW5ndGgpLnRvTG93ZXJDYXNlKCkpIHtcblx0XHRcdFx0dGhpcy5fd3JpdGVJbnB1dFZhbHVlKHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgKyBmb3JtYXR0ZWRWYWwuc3Vic3RyaW5nKHRoaXMuX2lucHV0VmFsdWVCYWNrdXAubGVuZ3RoKSk7XG5cdFx0XHRcdHRoaXMuX25hdGl2ZUVsZW1lbnRbJ3NldFNlbGVjdGlvblJhbmdlJ10uYXBwbHkodGhpcy5fbmF0aXZlRWxlbWVudCwgW1xuXHRcdFx0XHRcdHRoaXMuX2lucHV0VmFsdWVCYWNrdXAubGVuZ3RoLFxuXHRcdFx0XHRcdGZvcm1hdHRlZFZhbC5sZW5ndGgsXG5cdFx0XHRcdF0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fd3JpdGVJbnB1dFZhbHVlKGZvcm1hdHRlZFZhbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfZm9ybWF0SXRlbUZvcklucHV0KGl0ZW06IGFueSk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIGl0ZW0gIT0gbnVsbCAmJiB0aGlzLmlucHV0Rm9ybWF0dGVyID8gdGhpcy5pbnB1dEZvcm1hdHRlcihpdGVtKSA6IHRvU3RyaW5nKGl0ZW0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfd3JpdGVJbnB1dFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcblx0XHR0aGlzLl9uYXRpdmVFbGVtZW50LnZhbHVlID0gdG9TdHJpbmcodmFsdWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfc3Vic2NyaWJlVG9Vc2VySW5wdXQoKTogdm9pZCB7XG5cdFx0Y29uc3QgcmVzdWx0cyQgPSB0aGlzLl92YWx1ZUNoYW5nZXMkLnBpcGUoXG5cdFx0XHR0YXAoKHZhbHVlKSA9PiB7XG5cdFx0XHRcdHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgPSB0aGlzLnNob3dIaW50ID8gdmFsdWUgOiBudWxsO1xuXHRcdFx0XHR0aGlzLl9pbnB1dFZhbHVlRm9yU2VsZWN0T25FeGFjdCA9IHRoaXMuc2VsZWN0T25FeGFjdCA/IHZhbHVlIDogbnVsbDtcblx0XHRcdFx0dGhpcy5fb25DaGFuZ2UodGhpcy5lZGl0YWJsZSA/IHZhbHVlIDogdW5kZWZpbmVkKTtcblx0XHRcdH0pLFxuXHRcdFx0dGhpcy5uZ2JUeXBlYWhlYWQgPyB0aGlzLm5nYlR5cGVhaGVhZCA6ICgpID0+IG9mKFtdKSxcblx0XHQpO1xuXG5cdFx0dGhpcy5fc3Vic2NyaXB0aW9uID0gdGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQkLnBpcGUoc3dpdGNoTWFwKCgpID0+IHJlc3VsdHMkKSkuc3Vic2NyaWJlKChyZXN1bHRzKSA9PiB7XG5cdFx0XHRpZiAoIXJlc3VsdHMgfHwgcmVzdWx0cy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0dGhpcy5fY2xvc2VQb3B1cCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gd2hlbiB0aGVyZSBpcyBvbmx5IG9uZSByZXN1bHQgYW5kIHRoaXMgbWF0Y2hlcyB0aGUgaW5wdXQgdmFsdWVcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMuc2VsZWN0T25FeGFjdCAmJlxuXHRcdFx0XHRcdHJlc3VsdHMubGVuZ3RoID09PSAxICYmXG5cdFx0XHRcdFx0dGhpcy5fZm9ybWF0SXRlbUZvcklucHV0KHJlc3VsdHNbMF0pID09PSB0aGlzLl9pbnB1dFZhbHVlRm9yU2VsZWN0T25FeGFjdFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR0aGlzLl9zZWxlY3RSZXN1bHQocmVzdWx0c1swXSk7XG5cdFx0XHRcdFx0dGhpcy5fY2xvc2VQb3B1cCgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX29wZW5Qb3B1cCgpO1xuXHRcdFx0XHRcdHRoaXMuX3dpbmRvd1JlZiEuc2V0SW5wdXQoJ2ZvY3VzRmlyc3QnLCB0aGlzLmZvY3VzRmlyc3QpO1xuXHRcdFx0XHRcdHRoaXMuX3dpbmRvd1JlZiEuc2V0SW5wdXQoJ3Jlc3VsdHMnLCByZXN1bHRzKTtcblx0XHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLnNldElucHV0KCd0ZXJtJywgdGhpcy5fbmF0aXZlRWxlbWVudC52YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKHRoaXMucmVzdWx0Rm9ybWF0dGVyKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLnNldElucHV0KCdmb3JtYXR0ZXInLCB0aGlzLnJlc3VsdEZvcm1hdHRlcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLnJlc3VsdFRlbXBsYXRlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLnNldElucHV0KCdyZXN1bHRUZW1wbGF0ZScsIHRoaXMucmVzdWx0VGVtcGxhdGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLmluc3RhbmNlLnJlc2V0QWN0aXZlKCk7XG5cblx0XHRcdFx0XHQvLyBUaGUgb2JzZXJ2YWJsZSBzdHJlYW0gd2UgYXJlIHN1YnNjcmliaW5nIHRvIG1pZ2h0IGhhdmUgYXN5bmMgc3RlcHNcblx0XHRcdFx0XHQvLyBhbmQgaWYgYSBjb21wb25lbnQgY29udGFpbmluZyB0eXBlYWhlYWQgaXMgdXNpbmcgdGhlIE9uUHVzaCBzdHJhdGVneVxuXHRcdFx0XHRcdC8vIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIHR1cm4gd291bGRuJ3QgYmUgaW52b2tlZCBhdXRvbWF0aWNhbGx5LlxuXHRcdFx0XHRcdHRoaXMuX3dpbmRvd1JlZiEuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG5cdFx0XHRcdFx0dGhpcy5fc2hvd0hpbnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBsaXZlIGFubm91bmNlclxuXHRcdFx0Y29uc3QgY291bnQgPSByZXN1bHRzID8gcmVzdWx0cy5sZW5ndGggOiAwO1xuXHRcdFx0dGhpcy5fbGl2ZS5zYXkoY291bnQgPT09IDAgPyAnTm8gcmVzdWx0cyBhdmFpbGFibGUnIDogYCR7Y291bnR9IHJlc3VsdCR7Y291bnQgPT09IDEgPyAnJyA6ICdzJ30gYXZhaWxhYmxlYCk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF91bnN1YnNjcmliZUZyb21Vc2VySW5wdXQoKSB7XG5cdFx0aWYgKHRoaXMuX3N1YnNjcmlwdGlvbikge1xuXHRcdFx0dGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cdFx0fVxuXHRcdHRoaXMuX3N1YnNjcmlwdGlvbiA9IG51bGw7XG5cdH1cbn1cbiJdfQ==