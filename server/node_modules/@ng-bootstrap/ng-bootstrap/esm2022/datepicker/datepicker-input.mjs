import { afterRender, AfterRenderPhase, ChangeDetectorRef, Directive, ElementRef, EventEmitter, forwardRef, inject, Injector, Input, NgZone, Output, ViewContainerRef, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { ngbAutoClose } from '../util/autoclose';
import { ngbFocusTrap } from '../util/focus-trap';
import { ngbPositioning } from '../util/positioning';
import { NgbDateAdapter } from './adapters/ngb-date-adapter';
import { NgbDatepicker } from './datepicker';
import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDateParserFormatter } from './ngb-date-parser-formatter';
import { NgbInputDatepickerConfig } from './datepicker-input-config';
import { NgbDatepickerConfig } from './datepicker-config';
import { isString } from '../util/util';
import { Subject } from 'rxjs';
import { addPopperOffset } from '../util/positioning-util';
import * as i0 from "@angular/core";
/**
 * A directive that allows to stick a datepicker popup to an input field.
 *
 * Manages interaction with the input field itself, does value formatting and provides forms integration.
 */
export class NgbInputDatepicker {
    constructor() {
        this._parserFormatter = inject(NgbDateParserFormatter);
        this._elRef = inject((ElementRef));
        this._vcRef = inject(ViewContainerRef);
        this._ngZone = inject(NgZone);
        this._calendar = inject(NgbCalendar);
        this._dateAdapter = inject((NgbDateAdapter));
        this._document = inject(DOCUMENT);
        this._changeDetector = inject(ChangeDetectorRef);
        this._injector = inject(Injector);
        this._config = inject(NgbInputDatepickerConfig);
        this._cRef = null;
        this._disabled = false;
        this._elWithFocus = null;
        this._model = null;
        this._positioning = ngbPositioning();
        this._destroyCloseHandlers$ = new Subject();
        /**
         * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
         *
         * * `true` - the popup will close on both date selection and outside click.
         * * `false` - the popup can only be closed manually via `close()` or `toggle()` methods.
         * * `"inside"` - the popup will close on date selection, but not outside clicks.
         * * `"outside"` - the popup will close only on the outside click and not on date selection/inside clicks.
         *
         * @since 3.0.0
         */
        this.autoClose = this._config.autoClose;
        /**
         * The preferred placement of the datepicker popup, among the [possible values](#/guides/positioning#api).
         *
         * The default order of preference is `"bottom-start bottom-end top-start top-end"`
         *
         * Please see the [positioning overview](#/positioning) for more details.
         */
        this.placement = this._config.placement;
        /**
         * Allows to change default Popper options when positioning the popup.
         * Receives current popper options and returns modified ones.
         *
         * @since 13.1.0
         */
        this.popperOptions = this._config.popperOptions;
        /**
         * A selector specifying the element the datepicker popup should be appended to.
         *
         * Currently only supports `"body"`.
         */
        this.container = this._config.container;
        /**
         * A css selector or html element specifying the element the datepicker popup should be positioned against.
         *
         * By default the input is used as a target.
         *
         * @since 4.2.0
         */
        this.positionTarget = this._config.positionTarget;
        /**
         * An event emitted when user selects a date using keyboard or mouse.
         *
         * The payload of the event is currently selected `NgbDate`.
         *
         * @since 1.1.1
         */
        this.dateSelect = new EventEmitter();
        /**
         * Event emitted right after the navigation happens and displayed month changes.
         *
         * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event fired after closing datepicker window.
         *
         * @since 4.2.0
         */
        this.closed = new EventEmitter();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this._validatorChange = () => { };
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value === '' || (value && value !== 'false');
        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(this._disabled);
        }
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    registerOnValidatorChange(fn) {
        this._validatorChange = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    validate(c) {
        const { value } = c;
        if (value != null) {
            const ngbDate = this._fromDateStruct(this._dateAdapter.fromModel(value));
            if (!ngbDate) {
                return { ngbDate: { invalid: value } };
            }
            if (this.minDate && ngbDate.before(NgbDate.from(this.minDate))) {
                return { ngbDate: { minDate: { minDate: this.minDate, actual: value } } };
            }
            if (this.maxDate && ngbDate.after(NgbDate.from(this.maxDate))) {
                return { ngbDate: { maxDate: { maxDate: this.maxDate, actual: value } } };
            }
        }
        return null;
    }
    writeValue(value) {
        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    }
    manualDateChange(value, updateView = false) {
        const inputValueChanged = value !== this._inputValue;
        if (inputValueChanged) {
            this._inputValue = value;
            this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        }
        if (inputValueChanged || !updateView) {
            this._onChange(this._model ? this._dateAdapter.toModel(this._model) : value === '' ? null : value);
        }
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    }
    isOpen() {
        return !!this._cRef;
    }
    /**
     * Opens the datepicker popup.
     *
     * If the related form control contains a valid date, the corresponding month will be opened.
     */
    open() {
        if (!this.isOpen()) {
            this._cRef = this._vcRef.createComponent(NgbDatepicker, { injector: this._injector });
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));
            // date selection event handling
            this._cRef.instance.registerOnChange((selectedDate) => {
                this.writeValue(selectedDate);
                this._onChange(selectedDate);
                this._onTouched();
            });
            this._cRef.changeDetectorRef.detectChanges();
            this._cRef.instance.setDisabledState(this.disabled);
            if (this.container === 'body') {
                this._document.querySelector(this.container)?.appendChild(this._cRef.location.nativeElement);
            }
            // focus handling
            this._elWithFocus = this._document.activeElement;
            ngbFocusTrap(this._ngZone, this._cRef.location.nativeElement, this.closed, true);
            setTimeout(() => this._cRef?.instance.focus());
            let hostElement;
            if (isString(this.positionTarget)) {
                hostElement = this._document.querySelector(this.positionTarget);
            }
            else if (this.positionTarget instanceof HTMLElement) {
                hostElement = this.positionTarget;
            }
            else {
                hostElement = this._elRef.nativeElement;
            }
            if (this.positionTarget && !hostElement) {
                throw new Error('ngbDatepicker could not find element declared in [positionTarget] to position against.');
            }
            // Setting up popper and scheduling updates when zone is stable
            this._ngZone.runOutsideAngular(() => {
                if (this._cRef && hostElement) {
                    this._positioning.createPopper({
                        hostElement,
                        targetElement: this._cRef.location.nativeElement,
                        placement: this.placement,
                        updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 2])(options)),
                    });
                    this._afterRenderRef = afterRender(() => {
                        this._positioning.update();
                    }, { phase: AfterRenderPhase.MixedReadWrite, injector: this._injector });
                }
            });
            this._setCloseHandlers();
        }
    }
    /**
     * Closes the datepicker popup.
     */
    close() {
        if (this.isOpen()) {
            this._cRef?.destroy();
            this._cRef = null;
            this._positioning.destroy();
            this._afterRenderRef?.destroy();
            this._destroyCloseHandlers$.next();
            this.closed.emit();
            this._changeDetector.markForCheck();
            // restore focus
            let elementToFocus = this._elWithFocus;
            if (isString(this.restoreFocus)) {
                elementToFocus = this._document.querySelector(this.restoreFocus);
            }
            else if (this.restoreFocus !== undefined) {
                elementToFocus = this.restoreFocus;
            }
            // in IE document.activeElement can contain an object without 'focus()' sometimes
            if (elementToFocus && elementToFocus['focus']) {
                elementToFocus.focus();
            }
            else {
                this._document.body.focus();
            }
        }
    }
    /**
     * Toggles the datepicker popup.
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     */
    navigateTo(date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    }
    onBlur() {
        this._onTouched();
    }
    onFocus() {
        this._elWithFocus = this._elRef.nativeElement;
    }
    ngOnChanges(changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
            if (this.isOpen()) {
                if (changes['minDate']) {
                    this._cRef.setInput('minDate', this.minDate);
                }
                if (changes['maxDate']) {
                    this._cRef.setInput('maxDate', this.maxDate);
                }
            }
        }
        if (changes['datepickerClass']) {
            const { currentValue, previousValue } = changes['datepickerClass'];
            this._applyPopupClass(currentValue, previousValue);
        }
        if (changes['autoClose'] && this.isOpen()) {
            this._setCloseHandlers();
        }
    }
    ngOnDestroy() {
        this.close();
    }
    _applyDatepickerInputs(datepickerComponentRef) {
        [
            'contentTemplate',
            'dayTemplate',
            'dayTemplateData',
            'displayMonths',
            'firstDayOfWeek',
            'footerTemplate',
            'markDisabled',
            'minDate',
            'maxDate',
            'navigation',
            'outsideDays',
            'showNavigation',
            'showWeekNumbers',
            'weekdays',
        ].forEach((inputName) => {
            if (this[inputName] !== undefined) {
                datepickerComponentRef.setInput(inputName, this[inputName]);
            }
        });
        datepickerComponentRef.setInput('startDate', this.startDate || this._model);
    }
    _applyPopupClass(newClass, oldClass) {
        const popupEl = this._cRef?.location.nativeElement;
        if (popupEl) {
            if (newClass) {
                popupEl.classList.add(newClass);
            }
            if (oldClass) {
                popupEl.classList.remove(oldClass);
            }
        }
    }
    _applyPopupStyling(nativeElement) {
        nativeElement.classList.add('dropdown-menu', 'show');
        if (this.container === 'body') {
            nativeElement.classList.add('ngb-dp-body');
        }
        this._applyPopupClass(this.datepickerClass);
    }
    _subscribeForDatepickerOutputs(datepickerInstance) {
        datepickerInstance.navigate.subscribe((navigateEvent) => this.navigate.emit(navigateEvent));
        datepickerInstance.dateSelect.subscribe((date) => {
            this.dateSelect.emit(date);
            if (this.autoClose === true || this.autoClose === 'inside') {
                this.close();
            }
        });
    }
    _writeModelValue(model) {
        const value = this._parserFormatter.format(model);
        this._inputValue = value;
        this._elRef.nativeElement.value = value;
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    }
    _fromDateStruct(date) {
        const ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(ngbDate) ? ngbDate : null;
    }
    _setCloseHandlers() {
        this._destroyCloseHandlers$.next();
        ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this._destroyCloseHandlers$, [], [this._elRef.nativeElement, this._cRef.location.nativeElement]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbInputDatepicker, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbInputDatepicker, isStandalone: true, selector: "input[ngbDatepicker]", inputs: { autoClose: "autoClose", contentTemplate: "contentTemplate", datepickerClass: "datepickerClass", dayTemplate: "dayTemplate", dayTemplateData: "dayTemplateData", displayMonths: "displayMonths", firstDayOfWeek: "firstDayOfWeek", footerTemplate: "footerTemplate", markDisabled: "markDisabled", minDate: "minDate", maxDate: "maxDate", navigation: "navigation", outsideDays: "outsideDays", placement: "placement", popperOptions: "popperOptions", restoreFocus: "restoreFocus", showWeekNumbers: "showWeekNumbers", startDate: "startDate", container: "container", positionTarget: "positionTarget", weekdays: "weekdays", disabled: "disabled" }, outputs: { dateSelect: "dateSelect", navigate: "navigate", closed: "closed" }, host: { listeners: { "input": "manualDateChange($event.target.value)", "change": "manualDateChange($event.target.value, true)", "focus": "onFocus()", "blur": "onBlur()" }, properties: { "disabled": "disabled" } }, providers: [
            { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
            { provide: NG_VALIDATORS, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
            { provide: NgbDatepickerConfig, useExisting: NgbInputDatepickerConfig },
        ], exportAs: ["ngbDatepicker"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbInputDatepicker, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngbDatepicker]',
                    exportAs: 'ngbDatepicker',
                    standalone: true,
                    host: {
                        '(input)': 'manualDateChange($event.target.value)',
                        '(change)': 'manualDateChange($event.target.value, true)',
                        '(focus)': 'onFocus()',
                        '(blur)': 'onBlur()',
                        '[disabled]': 'disabled',
                    },
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
                        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
                        { provide: NgbDatepickerConfig, useExisting: NgbInputDatepickerConfig },
                    ],
                }]
        }], propDecorators: { autoClose: [{
                type: Input
            }], contentTemplate: [{
                type: Input
            }], datepickerClass: [{
                type: Input
            }], dayTemplate: [{
                type: Input
            }], dayTemplateData: [{
                type: Input
            }], displayMonths: [{
                type: Input
            }], firstDayOfWeek: [{
                type: Input
            }], footerTemplate: [{
                type: Input
            }], markDisabled: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], navigation: [{
                type: Input
            }], outsideDays: [{
                type: Input
            }], placement: [{
                type: Input
            }], popperOptions: [{
                type: Input
            }], restoreFocus: [{
                type: Input
            }], showWeekNumbers: [{
                type: Input
            }], startDate: [{
                type: Input
            }], container: [{
                type: Input
            }], positionTarget: [{
                type: Input
            }], weekdays: [{
                type: Input
            }], dateSelect: [{
                type: Output
            }], navigate: [{
                type: Output
            }], closed: [{
                type: Output
            }], disabled: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNOLFdBQVcsRUFDWCxnQkFBZ0IsRUFFaEIsaUJBQWlCLEVBRWpCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxFQUdOLGdCQUFnQixHQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUdOLGFBQWEsRUFDYixpQkFBaUIsR0FHakIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGFBQWEsRUFBOEIsTUFBTSxjQUFjLENBQUM7QUFFekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFckUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDckUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN4QyxPQUFPLEVBQUUs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QW5CLE1BQU07Z0JBT0csUUFBUTtzQkFBakIsTUFBTTtnQkFPRyxNQUFNO3NCQUFmLE1BQU07Z0JBR0gsUUFBUTtzQkFEWCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0YWZ0ZXJSZW5kZXIsXG5cdEFmdGVyUmVuZGVyUGhhc2UsXG5cdEFmdGVyUmVuZGVyUmVmLFxuXHRDaGFuZ2VEZXRlY3RvclJlZixcblx0Q29tcG9uZW50UmVmLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0Zm9yd2FyZFJlZixcblx0aW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25DaGFuZ2VzLFxuXHRPbkRlc3Ryb3ksXG5cdE91dHB1dCxcblx0U2ltcGxlQ2hhbmdlcyxcblx0VGVtcGxhdGVSZWYsXG5cdFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcblx0QWJzdHJhY3RDb250cm9sLFxuXHRDb250cm9sVmFsdWVBY2Nlc3Nvcixcblx0TkdfVkFMSURBVE9SUyxcblx0TkdfVkFMVUVfQUNDRVNTT1IsXG5cdFZhbGlkYXRpb25FcnJvcnMsXG5cdFZhbGlkYXRvcixcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBuZ2JBdXRvQ2xvc2UgfSBmcm9tICcuLi91dGlsL2F1dG9jbG9zZSc7XG5pbXBvcnQgeyBuZ2JGb2N1c1RyYXAgfSBmcm9tICcuLi91dGlsL2ZvY3VzLXRyYXAnO1xuaW1wb3J0IHsgbmdiUG9zaXRpb25pbmcgfSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuaW1wb3J0IHsgTmdiRGF0ZUFkYXB0ZXIgfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHsgTmdiRGF0ZXBpY2tlciwgTmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnQgfSBmcm9tICcuL2RhdGVwaWNrZXInO1xuaW1wb3J0IHsgRGF5VGVtcGxhdGVDb250ZXh0IH0gZnJvbSAnLi9kYXRlcGlja2VyLWRheS10ZW1wbGF0ZS1jb250ZXh0JztcbmltcG9ydCB7IE5nYkNhbGVuZGFyIH0gZnJvbSAnLi9uZ2ItY2FsZW5kYXInO1xuaW1wb3J0IHsgTmdiRGF0ZSB9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHsgTmdiRGF0ZVBhcnNlckZvcm1hdHRlciB9IGZyb20gJy4vbmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlcic7XG5pbXBvcnQgeyBOZ2JEYXRlU3RydWN0IH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuaW1wb3J0IHsgTmdiSW5wdXREYXRlcGlja2VyQ29uZmlnIH0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWNvbmZpZyc7XG5pbXBvcnQgeyBOZ2JEYXRlcGlja2VyQ29uZmlnIH0gZnJvbSAnLi9kYXRlcGlja2VyLWNvbmZpZyc7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBhZGRQb3BwZXJPZmZzZXQgfSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nLXV0aWwnO1xuaW1wb3J0IHsgQ29udGVudFRlbXBsYXRlQ29udGV4dCB9IGZyb20gJy4vZGF0ZXBpY2tlci1jb250ZW50LXRlbXBsYXRlLWNvbnRleHQnO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWxsb3dzIHRvIHN0aWNrIGEgZGF0ZXBpY2tlciBwb3B1cCB0byBhbiBpbnB1dCBmaWVsZC5cbiAqXG4gKiBNYW5hZ2VzIGludGVyYWN0aW9uIHdpdGggdGhlIGlucHV0IGZpZWxkIGl0c2VsZiwgZG9lcyB2YWx1ZSBmb3JtYXR0aW5nIGFuZCBwcm92aWRlcyBmb3JtcyBpbnRlZ3JhdGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnaW5wdXRbbmdiRGF0ZXBpY2tlcl0nLFxuXHRleHBvcnRBczogJ25nYkRhdGVwaWNrZXInLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0JyhpbnB1dCknOiAnbWFudWFsRGF0ZUNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG5cdFx0JyhjaGFuZ2UpJzogJ21hbnVhbERhdGVDaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSwgdHJ1ZSknLFxuXHRcdCcoZm9jdXMpJzogJ29uRm9jdXMoKScsXG5cdFx0JyhibHVyKSc6ICdvbkJsdXIoKScsXG5cdFx0J1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuXHR9LFxuXHRwcm92aWRlcnM6IFtcblx0XHR7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JJbnB1dERhdGVwaWNrZXIpLCBtdWx0aTogdHJ1ZSB9LFxuXHRcdHsgcHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiSW5wdXREYXRlcGlja2VyKSwgbXVsdGk6IHRydWUgfSxcblx0XHR7IHByb3ZpZGU6IE5nYkRhdGVwaWNrZXJDb25maWcsIHVzZUV4aXN0aW5nOiBOZ2JJbnB1dERhdGVwaWNrZXJDb25maWcgfSxcblx0XSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiSW5wdXREYXRlcGlja2VyIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBWYWxpZGF0b3Ige1xuXHRzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYXV0b0Nsb3NlOiBib29sZWFuIHwgc3RyaW5nO1xuXHRzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IGJvb2xlYW4gfCAnJztcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX25hdmlnYXRpb246IHN0cmluZztcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX291dHNpZGVEYXlzOiBzdHJpbmc7XG5cdHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV93ZWVrZGF5czogYm9vbGVhbiB8IHN0cmluZztcblxuXHRwcml2YXRlIF9wYXJzZXJGb3JtYXR0ZXIgPSBpbmplY3QoTmdiRGF0ZVBhcnNlckZvcm1hdHRlcik7XG5cdHByaXZhdGUgX2VsUmVmID0gaW5qZWN0KEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4pO1xuXHRwcml2YXRlIF92Y1JlZiA9IGluamVjdChWaWV3Q29udGFpbmVyUmVmKTtcblx0cHJpdmF0ZSBfbmdab25lID0gaW5qZWN0KE5nWm9uZSk7XG5cdHByaXZhdGUgX2NhbGVuZGFyID0gaW5qZWN0KE5nYkNhbGVuZGFyKTtcblx0cHJpdmF0ZSBfZGF0ZUFkYXB0ZXIgPSBpbmplY3QoTmdiRGF0ZUFkYXB0ZXI8YW55Pik7XG5cdHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcblx0cHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3IgPSBpbmplY3QoQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuXHRwcml2YXRlIF9pbmplY3RvciA9IGluamVjdChJbmplY3Rvcik7XG5cdHByaXZhdGUgX2NvbmZpZyA9IGluamVjdChOZ2JJbnB1dERhdGVwaWNrZXJDb25maWcpO1xuXG5cdHByaXZhdGUgX2NSZWY6IENvbXBvbmVudFJlZjxOZ2JEYXRlcGlja2VyPiB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXHRwcml2YXRlIF9lbFdpdGhGb2N1czogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfbW9kZWw6IE5nYkRhdGUgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfaW5wdXRWYWx1ZTogc3RyaW5nO1xuXHRwcml2YXRlIF9hZnRlclJlbmRlclJlZjogQWZ0ZXJSZW5kZXJSZWYgfCB1bmRlZmluZWQ7XG5cdHByaXZhdGUgX3Bvc2l0aW9uaW5nID0gbmdiUG9zaXRpb25pbmcoKTtcblx0cHJpdmF0ZSBfZGVzdHJveUNsb3NlSGFuZGxlcnMkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IGFmdGVyIGRhdGUgc2VsZWN0aW9uIC8gb3V0c2lkZSBjbGljayBvciBub3QuXG5cdCAqXG5cdCAqICogYHRydWVgIC0gdGhlIHBvcHVwIHdpbGwgY2xvc2Ugb24gYm90aCBkYXRlIHNlbGVjdGlvbiBhbmQgb3V0c2lkZSBjbGljay5cblx0ICogKiBgZmFsc2VgIC0gdGhlIHBvcHVwIGNhbiBvbmx5IGJlIGNsb3NlZCBtYW51YWxseSB2aWEgYGNsb3NlKClgIG9yIGB0b2dnbGUoKWAgbWV0aG9kcy5cblx0ICogKiBgXCJpbnNpZGVcImAgLSB0aGUgcG9wdXAgd2lsbCBjbG9zZSBvbiBkYXRlIHNlbGVjdGlvbiwgYnV0IG5vdCBvdXRzaWRlIGNsaWNrcy5cblx0ICogKiBgXCJvdXRzaWRlXCJgIC0gdGhlIHBvcHVwIHdpbGwgY2xvc2Ugb25seSBvbiB0aGUgb3V0c2lkZSBjbGljayBhbmQgbm90IG9uIGRhdGUgc2VsZWN0aW9uL2luc2lkZSBjbGlja3MuXG5cdCAqXG5cdCAqIEBzaW5jZSAzLjAuMFxuXHQgKi9cblx0QElucHV0KCkgYXV0b0Nsb3NlID0gdGhpcy5fY29uZmlnLmF1dG9DbG9zZTtcblxuXHQvKipcblx0ICogVGhlIHJlZmVyZW5jZSB0byBhIGN1c3RvbSBjb250ZW50IHRlbXBsYXRlLlxuXHQgKlxuXHQgKiBBbGxvd3MgdG8gY29tcGxldGVseSBvdmVycmlkZSB0aGUgd2F5IGRhdGVwaWNrZXIuXG5cdCAqXG5cdCAqIFNlZSBbYE5nYkRhdGVwaWNrZXJDb250ZW50YF0oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvYXBpI05nYkRhdGVwaWNrZXJDb250ZW50KSBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgKlxuXHQgKiBAc2luY2UgMTQuMi4wXG5cdCAqL1xuXHRASW5wdXQoKSBjb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPENvbnRlbnRUZW1wbGF0ZUNvbnRleHQ+O1xuXG5cdC8qKlxuXHQgKiBBbiBvcHRpb25hbCBjbGFzcyBhcHBsaWVkIHRvIHRoZSBkYXRlcGlja2VyIHBvcHVwIGVsZW1lbnQuXG5cdCAqXG5cdCAqIEBzaW5jZSA5LjEuMFxuXHQgKi9cblx0QElucHV0KCkgZGF0ZXBpY2tlckNsYXNzOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSByZWZlcmVuY2UgdG8gYSBjdXN0b20gdGVtcGxhdGUgZm9yIHRoZSBkYXkuXG5cdCAqXG5cdCAqIEFsbG93cyB0byBjb21wbGV0ZWx5IG92ZXJyaWRlIHRoZSB3YXkgYSBkYXkgJ2NlbGwnIGluIHRoZSBjYWxlbmRhciBpcyBkaXNwbGF5ZWQuXG5cdCAqXG5cdCAqIFNlZSBbYERheVRlbXBsYXRlQ29udGV4dGBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNEYXlUZW1wbGF0ZUNvbnRleHQpIGZvciB0aGUgZGF0YSB5b3UgZ2V0IGluc2lkZS5cblx0ICovXG5cdEBJbnB1dCgpIGRheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxEYXlUZW1wbGF0ZUNvbnRleHQ+O1xuXG5cdC8qKlxuXHQgKiBUaGUgY2FsbGJhY2sgdG8gcGFzcyBhbnkgYXJiaXRyYXJ5IGRhdGEgdG8gdGhlIHRlbXBsYXRlIGNlbGwgdmlhIHRoZVxuXHQgKiBbYERheVRlbXBsYXRlQ29udGV4dGBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNEYXlUZW1wbGF0ZUNvbnRleHQpJ3MgYGRhdGFgIHBhcmFtZXRlci5cblx0ICpcblx0ICogYGN1cnJlbnRgIGlzIHRoZSBtb250aCB0aGF0IGlzIGN1cnJlbnRseSBkaXNwbGF5ZWQgYnkgdGhlIGRhdGVwaWNrZXIuXG5cdCAqXG5cdCAqIEBzaW5jZSAzLjMuMFxuXHQgKi9cblx0QElucHV0KCkgZGF5VGVtcGxhdGVEYXRhOiAoZGF0ZTogTmdiRGF0ZSwgY3VycmVudD86IHsgeWVhcjogbnVtYmVyOyBtb250aDogbnVtYmVyIH0pID0+IGFueTtcblxuXHQvKipcblx0ICogVGhlIG51bWJlciBvZiBtb250aHMgdG8gZGlzcGxheS5cblx0ICovXG5cdEBJbnB1dCgpIGRpc3BsYXlNb250aHM6IG51bWJlcjtcblxuXHQvKipcblx0ICogVGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cblx0ICpcblx0ICogV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ3dlZWtkYXknIGlzIDE9TW9uIC4uLiA3PVN1bi5cblx0ICovXG5cdEBJbnB1dCgpIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFRoZSByZWZlcmVuY2UgdG8gdGhlIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgdGhlIGRhdGVwaWNrZXIgZm9vdGVyLlxuXHQgKlxuXHQgKiBAc2luY2UgMy4zLjBcblx0ICovXG5cdEBJbnB1dCgpIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG5cdC8qKlxuXHQgKiBUaGUgY2FsbGJhY2sgdG8gbWFyayBzb21lIGRhdGVzIGFzIGRpc2FibGVkLlxuXHQgKlxuXHQgKiBJdCBpcyBjYWxsZWQgZm9yIGVhY2ggbmV3IGRhdGUgd2hlbiBuYXZpZ2F0aW5nIHRvIGEgZGlmZmVyZW50IG1vbnRoLlxuXHQgKlxuXHQgKiBgY3VycmVudGAgaXMgdGhlIG1vbnRoIHRoYXQgaXMgY3VycmVudGx5IGRpc3BsYXllZCBieSB0aGUgZGF0ZXBpY2tlci5cblx0ICovXG5cdEBJbnB1dCgpIG1hcmtEaXNhYmxlZDogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ/OiB7IHllYXI6IG51bWJlcjsgbW9udGg6IG51bWJlciB9KSA9PiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBUaGUgZWFybGllc3QgZGF0ZSB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgb3Igc2VsZWN0ZWQuIEFsc28gdXNlZCBmb3IgZm9ybSB2YWxpZGF0aW9uLlxuXHQgKlxuXHQgKiBJZiBub3QgcHJvdmlkZWQsICd5ZWFyJyBzZWxlY3QgYm94IHdpbGwgZGlzcGxheSAxMCB5ZWFycyBiZWZvcmUgdGhlIGN1cnJlbnQgbW9udGguXG5cdCAqL1xuXHRASW5wdXQoKSBtaW5EYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG5cdC8qKlxuXHQgKiBUaGUgbGF0ZXN0IGRhdGUgdGhhdCBjYW4gYmUgZGlzcGxheWVkIG9yIHNlbGVjdGVkLiBBbHNvIHVzZWQgZm9yIGZvcm0gdmFsaWRhdGlvbi5cblx0ICpcblx0ICogSWYgbm90IHByb3ZpZGVkLCAneWVhcicgc2VsZWN0IGJveCB3aWxsIGRpc3BsYXkgMTAgeWVhcnMgYWZ0ZXIgdGhlIGN1cnJlbnQgbW9udGguXG5cdCAqL1xuXHRASW5wdXQoKSBtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0aW9uIHR5cGUuXG5cdCAqXG5cdCAqICogYFwic2VsZWN0XCJgIC0gc2VsZWN0IGJveGVzIGZvciBtb250aCBhbmQgbmF2aWdhdGlvbiBhcnJvd3Ncblx0ICogKiBgXCJhcnJvd3NcImAgLSBvbmx5IG5hdmlnYXRpb24gYXJyb3dzXG5cdCAqICogYFwibm9uZVwiYCAtIG5vIG5hdmlnYXRpb24gdmlzaWJsZSBhdCBhbGxcblx0ICovXG5cdEBJbnB1dCgpIG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZSc7XG5cblx0LyoqXG5cdCAqIFRoZSB3YXkgb2YgZGlzcGxheWluZyBkYXlzIHRoYXQgZG9uJ3QgYmVsb25nIHRvIHRoZSBjdXJyZW50IG1vbnRoLlxuXHQgKlxuXHQgKiAqIGBcInZpc2libGVcImAgLSBkYXlzIGFyZSB2aXNpYmxlXG5cdCAqICogYFwiaGlkZGVuXCJgIC0gZGF5cyBhcmUgaGlkZGVuLCB3aGl0ZSBzcGFjZSBwcmVzZXJ2ZWRcblx0ICogKiBgXCJjb2xsYXBzZWRcImAgLSBkYXlzIGFyZSBjb2xsYXBzZWQsIHNvIHRoZSBkYXRlcGlja2VyIGhlaWdodCBtaWdodCBjaGFuZ2UgYmV0d2VlbiBtb250aHNcblx0ICpcblx0ICogRm9yIHRoZSAyKyBtb250aHMgdmlldywgZGF5cyBpbiBiZXR3ZWVuIG1vbnRocyBhcmUgbmV2ZXIgc2hvd24uXG5cdCAqL1xuXHRASW5wdXQoKSBvdXRzaWRlRGF5czogJ3Zpc2libGUnIHwgJ2NvbGxhcHNlZCcgfCAnaGlkZGVuJztcblxuXHQvKipcblx0ICogVGhlIHByZWZlcnJlZCBwbGFjZW1lbnQgb2YgdGhlIGRhdGVwaWNrZXIgcG9wdXAsIGFtb25nIHRoZSBbcG9zc2libGUgdmFsdWVzXSgjL2d1aWRlcy9wb3NpdGlvbmluZyNhcGkpLlxuXHQgKlxuXHQgKiBUaGUgZGVmYXVsdCBvcmRlciBvZiBwcmVmZXJlbmNlIGlzIGBcImJvdHRvbS1zdGFydCBib3R0b20tZW5kIHRvcC1zdGFydCB0b3AtZW5kXCJgXG5cdCAqXG5cdCAqIFBsZWFzZSBzZWUgdGhlIFtwb3NpdGlvbmluZyBvdmVydmlld10oIy9wb3NpdGlvbmluZykgZm9yIG1vcmUgZGV0YWlscy5cblx0ICovXG5cdEBJbnB1dCgpIHBsYWNlbWVudCA9IHRoaXMuX2NvbmZpZy5wbGFjZW1lbnQ7XG5cblx0LyoqXG5cdCAqIEFsbG93cyB0byBjaGFuZ2UgZGVmYXVsdCBQb3BwZXIgb3B0aW9ucyB3aGVuIHBvc2l0aW9uaW5nIHRoZSBwb3B1cC5cblx0ICogUmVjZWl2ZXMgY3VycmVudCBwb3BwZXIgb3B0aW9ucyBhbmQgcmV0dXJucyBtb2RpZmllZCBvbmVzLlxuXHQgKlxuXHQgKiBAc2luY2UgMTMuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBwb3BwZXJPcHRpb25zID0gdGhpcy5fY29uZmlnLnBvcHBlck9wdGlvbnM7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgd2hlbiBjbG9zaW5nIGRhdGVwaWNrZXIgd2lsbCBmb2N1cyBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIGRhdGVwaWNrZXIgd2FzIG9wZW5lZC5cblx0ICpcblx0ICogQWx0ZXJuYXRpdmVseSB5b3UgY291bGQgcHJvdmlkZSBhIHNlbGVjdG9yIG9yIGFuIGBIVE1MRWxlbWVudGAgdG8gZm9jdXMuIElmIHRoZSBlbGVtZW50IGRvZXNuJ3QgZXhpc3Qgb3IgaW52YWxpZCxcblx0ICogd2UnbGwgZmFsbGJhY2sgdG8gZm9jdXMgZG9jdW1lbnQgYm9keS5cblx0ICpcblx0ICogQHNpbmNlIDUuMi4wXG5cdCAqL1xuXHRASW5wdXQoKSByZXN0b3JlRm9jdXM6IHRydWUgfCBzdHJpbmcgfCBIVE1MRWxlbWVudDtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3ZWVrIG51bWJlcnMgd2lsbCBiZSBkaXNwbGF5ZWQuXG5cdCAqL1xuXHRASW5wdXQoKSBzaG93V2Vla051bWJlcnM6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFRoZSBkYXRlIHRvIG9wZW4gY2FsZW5kYXIgd2l0aC5cblx0ICpcblx0ICogV2l0aCB0aGUgZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlYy5cblx0ICogSWYgbm90aGluZyBvciBpbnZhbGlkIGRhdGUgaXMgcHJvdmlkZWQsIGNhbGVuZGFyIHdpbGwgb3BlbiB3aXRoIGN1cnJlbnQgbW9udGguXG5cdCAqXG5cdCAqIFlvdSBjb3VsZCB1c2UgYG5hdmlnYXRlVG8oZGF0ZSlgIG1ldGhvZCBhcyBhbiBhbHRlcm5hdGl2ZS5cblx0ICovXG5cdEBJbnB1dCgpIHN0YXJ0RGF0ZTogeyB5ZWFyOiBudW1iZXI7IG1vbnRoOiBudW1iZXI7IGRheT86IG51bWJlciB9O1xuXG5cdC8qKlxuXHQgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuXHQgKlxuXHQgKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBgXCJib2R5XCJgLlxuXHQgKi9cblx0QElucHV0KCkgY29udGFpbmVyID0gdGhpcy5fY29uZmlnLmNvbnRhaW5lcjtcblxuXHQvKipcblx0ICogQSBjc3Mgc2VsZWN0b3Igb3IgaHRtbCBlbGVtZW50IHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIHBvc2l0aW9uZWQgYWdhaW5zdC5cblx0ICpcblx0ICogQnkgZGVmYXVsdCB0aGUgaW5wdXQgaXMgdXNlZCBhcyBhIHRhcmdldC5cblx0ICpcblx0ICogQHNpbmNlIDQuMi4wXG5cdCAqL1xuXHRASW5wdXQoKSBwb3NpdGlvblRhcmdldCA9IHRoaXMuX2NvbmZpZy5wb3NpdGlvblRhcmdldDtcblxuXHQvKipcblx0ICogVGhlIHdheSB3ZWVrZGF5cyBzaG91bGQgYmUgZGlzcGxheWVkLlxuXHQgKlxuXHQgKiAqIGB0cnVlYCAtIHdlZWtkYXlzIGFyZSBkaXNwbGF5ZWQgdXNpbmcgZGVmYXVsdCB3aWR0aFxuXHQgKiAqIGBmYWxzZWAgLSB3ZWVrZGF5cyBhcmUgbm90IGRpc3BsYXllZFxuXHQgKiAqIGBcInNob3J0XCIgfCBcImxvbmdcIiB8IFwibmFycm93XCJgIC0gd2Vla2RheXMgYXJlIGRpc3BsYXllZCB1c2luZyBzcGVjaWZpZWQgd2lkdGhcblx0ICpcblx0ICogQHNpbmNlIDkuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSB3ZWVrZGF5czogRXhjbHVkZTxJbnRsLkRhdGVUaW1lRm9ybWF0T3B0aW9uc1snd2Vla2RheSddLCB1bmRlZmluZWQ+IHwgYm9vbGVhbjtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHVzZXIgc2VsZWN0cyBhIGRhdGUgdXNpbmcga2V5Ym9hcmQgb3IgbW91c2UuXG5cdCAqXG5cdCAqIFRoZSBwYXlsb2FkIG9mIHRoZSBldmVudCBpcyBjdXJyZW50bHkgc2VsZWN0ZWQgYE5nYkRhdGVgLlxuXHQgKlxuXHQgKiBAc2luY2UgMS4xLjFcblx0ICovXG5cdEBPdXRwdXQoKSBkYXRlU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JEYXRlPigpO1xuXG5cdC8qKlxuXHQgKiBFdmVudCBlbWl0dGVkIHJpZ2h0IGFmdGVyIHRoZSBuYXZpZ2F0aW9uIGhhcHBlbnMgYW5kIGRpc3BsYXllZCBtb250aCBjaGFuZ2VzLlxuXHQgKlxuXHQgKiBTZWUgW2BOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudGBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCkgZm9yIHRoZSBwYXlsb2FkIGluZm8uXG5cdCAqL1xuXHRAT3V0cHV0KCkgbmF2aWdhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50PigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBmaXJlZCBhZnRlciBjbG9zaW5nIGRhdGVwaWNrZXIgd2luZG93LlxuXHQgKlxuXHQgKiBAc2luY2UgNC4yLjBcblx0ICovXG5cdEBPdXRwdXQoKSBjbG9zZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblx0QElucHV0KClcblx0Z2V0IGRpc2FibGVkKCkge1xuXHRcdHJldHVybiB0aGlzLl9kaXNhYmxlZDtcblx0fVxuXHRzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkge1xuXHRcdHRoaXMuX2Rpc2FibGVkID0gdmFsdWUgPT09ICcnIHx8ICh2YWx1ZSAmJiB2YWx1ZSAhPT0gJ2ZhbHNlJyk7XG5cblx0XHRpZiAodGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5fY1JlZiEuaW5zdGFuY2Uuc2V0RGlzYWJsZWRTdGF0ZSh0aGlzLl9kaXNhYmxlZCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcblx0cHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cdHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9ICgpID0+IHt9O1xuXG5cdHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHtcblx0XHR0aGlzLl9vbkNoYW5nZSA9IGZuO1xuXHR9XG5cblx0cmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQge1xuXHRcdHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuXHR9XG5cblx0cmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuXHRcdHRoaXMuX3ZhbGlkYXRvckNoYW5nZSA9IGZuO1xuXHR9XG5cblx0c2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG5cdFx0dGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG5cdH1cblxuXHR2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG5cdFx0Y29uc3QgeyB2YWx1ZSB9ID0gYztcblxuXHRcdGlmICh2YWx1ZSAhPSBudWxsKSB7XG5cdFx0XHRjb25zdCBuZ2JEYXRlID0gdGhpcy5fZnJvbURhdGVTdHJ1Y3QodGhpcy5fZGF0ZUFkYXB0ZXIuZnJvbU1vZGVsKHZhbHVlKSk7XG5cblx0XHRcdGlmICghbmdiRGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4geyBuZ2JEYXRlOiB7IGludmFsaWQ6IHZhbHVlIH0gfTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMubWluRGF0ZSAmJiBuZ2JEYXRlLmJlZm9yZShOZ2JEYXRlLmZyb20odGhpcy5taW5EYXRlKSkpIHtcblx0XHRcdFx0cmV0dXJuIHsgbmdiRGF0ZTogeyBtaW5EYXRlOiB7IG1pbkRhdGU6IHRoaXMubWluRGF0ZSwgYWN0dWFsOiB2YWx1ZSB9IH0gfTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMubWF4RGF0ZSAmJiBuZ2JEYXRlLmFmdGVyKE5nYkRhdGUuZnJvbSh0aGlzLm1heERhdGUpKSkge1xuXHRcdFx0XHRyZXR1cm4geyBuZ2JEYXRlOiB7IG1heERhdGU6IHsgbWF4RGF0ZTogdGhpcy5tYXhEYXRlLCBhY3R1YWw6IHZhbHVlIH0gfSB9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0d3JpdGVWYWx1ZSh2YWx1ZSkge1xuXHRcdHRoaXMuX21vZGVsID0gdGhpcy5fZnJvbURhdGVTdHJ1Y3QodGhpcy5fZGF0ZUFkYXB0ZXIuZnJvbU1vZGVsKHZhbHVlKSk7XG5cdFx0dGhpcy5fd3JpdGVNb2RlbFZhbHVlKHRoaXMuX21vZGVsKTtcblx0fVxuXG5cdG1hbnVhbERhdGVDaGFuZ2UodmFsdWU6IHN0cmluZywgdXBkYXRlVmlldyA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgaW5wdXRWYWx1ZUNoYW5nZWQgPSB2YWx1ZSAhPT0gdGhpcy5faW5wdXRWYWx1ZTtcblx0XHRpZiAoaW5wdXRWYWx1ZUNoYW5nZWQpIHtcblx0XHRcdHRoaXMuX2lucHV0VmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoaXMuX21vZGVsID0gdGhpcy5fZnJvbURhdGVTdHJ1Y3QodGhpcy5fcGFyc2VyRm9ybWF0dGVyLnBhcnNlKHZhbHVlKSk7XG5cdFx0fVxuXHRcdGlmIChpbnB1dFZhbHVlQ2hhbmdlZCB8fCAhdXBkYXRlVmlldykge1xuXHRcdFx0dGhpcy5fb25DaGFuZ2UodGhpcy5fbW9kZWwgPyB0aGlzLl9kYXRlQWRhcHRlci50b01vZGVsKHRoaXMuX21vZGVsKSA6IHZhbHVlID09PSAnJyA/IG51bGwgOiB2YWx1ZSk7XG5cdFx0fVxuXHRcdGlmICh1cGRhdGVWaWV3ICYmIHRoaXMuX21vZGVsKSB7XG5cdFx0XHR0aGlzLl93cml0ZU1vZGVsVmFsdWUodGhpcy5fbW9kZWwpO1xuXHRcdH1cblx0fVxuXG5cdGlzT3BlbigpIHtcblx0XHRyZXR1cm4gISF0aGlzLl9jUmVmO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW5zIHRoZSBkYXRlcGlja2VyIHBvcHVwLlxuXHQgKlxuXHQgKiBJZiB0aGUgcmVsYXRlZCBmb3JtIGNvbnRyb2wgY29udGFpbnMgYSB2YWxpZCBkYXRlLCB0aGUgY29ycmVzcG9uZGluZyBtb250aCB3aWxsIGJlIG9wZW5lZC5cblx0ICovXG5cdG9wZW4oKSB7XG5cdFx0aWYgKCF0aGlzLmlzT3BlbigpKSB7XG5cdFx0XHR0aGlzLl9jUmVmID0gdGhpcy5fdmNSZWYuY3JlYXRlQ29tcG9uZW50KE5nYkRhdGVwaWNrZXIsIHsgaW5qZWN0b3I6IHRoaXMuX2luamVjdG9yIH0pO1xuXG5cdFx0XHR0aGlzLl9hcHBseVBvcHVwU3R5bGluZyh0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuXHRcdFx0dGhpcy5fYXBwbHlEYXRlcGlja2VySW5wdXRzKHRoaXMuX2NSZWYpO1xuXHRcdFx0dGhpcy5fc3Vic2NyaWJlRm9yRGF0ZXBpY2tlck91dHB1dHModGhpcy5fY1JlZi5pbnN0YW5jZSk7XG5cdFx0XHR0aGlzLl9jUmVmLmluc3RhbmNlLm5nT25Jbml0KCk7XG5cdFx0XHR0aGlzLl9jUmVmLmluc3RhbmNlLndyaXRlVmFsdWUodGhpcy5fZGF0ZUFkYXB0ZXIudG9Nb2RlbCh0aGlzLl9tb2RlbCkpO1xuXG5cdFx0XHQvLyBkYXRlIHNlbGVjdGlvbiBldmVudCBoYW5kbGluZ1xuXHRcdFx0dGhpcy5fY1JlZi5pbnN0YW5jZS5yZWdpc3Rlck9uQ2hhbmdlKChzZWxlY3RlZERhdGUpID0+IHtcblx0XHRcdFx0dGhpcy53cml0ZVZhbHVlKHNlbGVjdGVkRGF0ZSk7XG5cdFx0XHRcdHRoaXMuX29uQ2hhbmdlKHNlbGVjdGVkRGF0ZSk7XG5cdFx0XHRcdHRoaXMuX29uVG91Y2hlZCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuX2NSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG5cdFx0XHR0aGlzLl9jUmVmLmluc3RhbmNlLnNldERpc2FibGVkU3RhdGUodGhpcy5kaXNhYmxlZCk7XG5cblx0XHRcdGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG5cdFx0XHRcdHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpPy5hcHBlbmRDaGlsZCh0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBmb2N1cyBoYW5kbGluZ1xuXHRcdFx0dGhpcy5fZWxXaXRoRm9jdXMgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcblx0XHRcdG5nYkZvY3VzVHJhcCh0aGlzLl9uZ1pvbmUsIHRoaXMuX2NSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5jbG9zZWQsIHRydWUpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB0aGlzLl9jUmVmPy5pbnN0YW5jZS5mb2N1cygpKTtcblxuXHRcdFx0bGV0IGhvc3RFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdFx0XHRpZiAoaXNTdHJpbmcodGhpcy5wb3NpdGlvblRhcmdldCkpIHtcblx0XHRcdFx0aG9zdEVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMucG9zaXRpb25UYXJnZXQpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLnBvc2l0aW9uVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0XHRcdFx0aG9zdEVsZW1lbnQgPSB0aGlzLnBvc2l0aW9uVGFyZ2V0O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aG9zdEVsZW1lbnQgPSB0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5wb3NpdGlvblRhcmdldCAmJiAhaG9zdEVsZW1lbnQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCduZ2JEYXRlcGlja2VyIGNvdWxkIG5vdCBmaW5kIGVsZW1lbnQgZGVjbGFyZWQgaW4gW3Bvc2l0aW9uVGFyZ2V0XSB0byBwb3NpdGlvbiBhZ2FpbnN0LicpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZXR0aW5nIHVwIHBvcHBlciBhbmQgc2NoZWR1bGluZyB1cGRhdGVzIHdoZW4gem9uZSBpcyBzdGFibGVcblx0XHRcdHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLl9jUmVmICYmIGhvc3RFbGVtZW50KSB7XG5cdFx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuY3JlYXRlUG9wcGVyKHtcblx0XHRcdFx0XHRcdGhvc3RFbGVtZW50LFxuXHRcdFx0XHRcdFx0dGFyZ2V0RWxlbWVudDogdGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XHRcdFx0cGxhY2VtZW50OiB0aGlzLnBsYWNlbWVudCxcblx0XHRcdFx0XHRcdHVwZGF0ZVBvcHBlck9wdGlvbnM6IChvcHRpb25zKSA9PiB0aGlzLnBvcHBlck9wdGlvbnMoYWRkUG9wcGVyT2Zmc2V0KFswLCAyXSkob3B0aW9ucykpLFxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0dGhpcy5fYWZ0ZXJSZW5kZXJSZWYgPSBhZnRlclJlbmRlcihcblx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eyBwaGFzZTogQWZ0ZXJSZW5kZXJQaGFzZS5NaXhlZFJlYWRXcml0ZSwgaW5qZWN0b3I6IHRoaXMuX2luamVjdG9yIH0sXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSBkYXRlcGlja2VyIHBvcHVwLlxuXHQgKi9cblx0Y2xvc2UoKSB7XG5cdFx0aWYgKHRoaXMuaXNPcGVuKCkpIHtcblx0XHRcdHRoaXMuX2NSZWY/LmRlc3Ryb3koKTtcblx0XHRcdHRoaXMuX2NSZWYgPSBudWxsO1xuXHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuZGVzdHJveSgpO1xuXHRcdFx0dGhpcy5fYWZ0ZXJSZW5kZXJSZWY/LmRlc3Ryb3koKTtcblx0XHRcdHRoaXMuX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJC5uZXh0KCk7XG5cdFx0XHR0aGlzLmNsb3NlZC5lbWl0KCk7XG5cdFx0XHR0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcblxuXHRcdFx0Ly8gcmVzdG9yZSBmb2N1c1xuXHRcdFx0bGV0IGVsZW1lbnRUb0ZvY3VzOiBIVE1MRWxlbWVudCB8IG51bGwgPSB0aGlzLl9lbFdpdGhGb2N1cztcblx0XHRcdGlmIChpc1N0cmluZyh0aGlzLnJlc3RvcmVGb2N1cykpIHtcblx0XHRcdFx0ZWxlbWVudFRvRm9jdXMgPSB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMucmVzdG9yZUZvY3VzKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5yZXN0b3JlRm9jdXMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRlbGVtZW50VG9Gb2N1cyA9IHRoaXMucmVzdG9yZUZvY3VzIGFzIEhUTUxFbGVtZW50O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBpbiBJRSBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGNhbiBjb250YWluIGFuIG9iamVjdCB3aXRob3V0ICdmb2N1cygpJyBzb21ldGltZXNcblx0XHRcdGlmIChlbGVtZW50VG9Gb2N1cyAmJiBlbGVtZW50VG9Gb2N1c1snZm9jdXMnXSkge1xuXHRcdFx0XHRlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fZG9jdW1lbnQuYm9keS5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIHRoZSBkYXRlcGlja2VyIHBvcHVwLlxuXHQgKi9cblx0dG9nZ2xlKCkge1xuXHRcdGlmICh0aGlzLmlzT3BlbigpKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3BlbigpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgdG8gdGhlIHByb3ZpZGVkIGRhdGUuXG5cdCAqXG5cdCAqIFdpdGggdGhlIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWMuXG5cdCAqIElmIG5vdGhpbmcgb3IgaW52YWxpZCBkYXRlIHByb3ZpZGVkIGNhbGVuZGFyIHdpbGwgb3BlbiBjdXJyZW50IG1vbnRoLlxuXHQgKlxuXHQgKiBVc2UgdGhlIGBbc3RhcnREYXRlXWAgaW5wdXQgYXMgYW4gYWx0ZXJuYXRpdmUuXG5cdCAqL1xuXHRuYXZpZ2F0ZVRvKGRhdGU/OiB7IHllYXI6IG51bWJlcjsgbW9udGg6IG51bWJlcjsgZGF5PzogbnVtYmVyIH0pIHtcblx0XHRpZiAodGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5fY1JlZiEuaW5zdGFuY2UubmF2aWdhdGVUbyhkYXRlKTtcblx0XHR9XG5cdH1cblxuXHRvbkJsdXIoKSB7XG5cdFx0dGhpcy5fb25Ub3VjaGVkKCk7XG5cdH1cblxuXHRvbkZvY3VzKCkge1xuXHRcdHRoaXMuX2VsV2l0aEZvY3VzID0gdGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudDtcblx0fVxuXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcblx0XHRpZiAoY2hhbmdlc1snbWluRGF0ZSddIHx8IGNoYW5nZXNbJ21heERhdGUnXSkge1xuXHRcdFx0dGhpcy5fdmFsaWRhdG9yQ2hhbmdlKCk7XG5cblx0XHRcdGlmICh0aGlzLmlzT3BlbigpKSB7XG5cdFx0XHRcdGlmIChjaGFuZ2VzWydtaW5EYXRlJ10pIHtcblx0XHRcdFx0XHR0aGlzLl9jUmVmIS5zZXRJbnB1dCgnbWluRGF0ZScsIHRoaXMubWluRGF0ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNoYW5nZXNbJ21heERhdGUnXSkge1xuXHRcdFx0XHRcdHRoaXMuX2NSZWYhLnNldElucHV0KCdtYXhEYXRlJywgdGhpcy5tYXhEYXRlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChjaGFuZ2VzWydkYXRlcGlja2VyQ2xhc3MnXSkge1xuXHRcdFx0Y29uc3QgeyBjdXJyZW50VmFsdWUsIHByZXZpb3VzVmFsdWUgfSA9IGNoYW5nZXNbJ2RhdGVwaWNrZXJDbGFzcyddO1xuXHRcdFx0dGhpcy5fYXBwbHlQb3B1cENsYXNzKGN1cnJlbnRWYWx1ZSwgcHJldmlvdXNWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0aWYgKGNoYW5nZXNbJ2F1dG9DbG9zZSddICYmIHRoaXMuaXNPcGVuKCkpIHtcblx0XHRcdHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcblx0XHR9XG5cdH1cblxuXHRuZ09uRGVzdHJveSgpIHtcblx0XHR0aGlzLmNsb3NlKCk7XG5cdH1cblxuXHRwcml2YXRlIF9hcHBseURhdGVwaWNrZXJJbnB1dHMoZGF0ZXBpY2tlckNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPE5nYkRhdGVwaWNrZXI+KTogdm9pZCB7XG5cdFx0W1xuXHRcdFx0J2NvbnRlbnRUZW1wbGF0ZScsXG5cdFx0XHQnZGF5VGVtcGxhdGUnLFxuXHRcdFx0J2RheVRlbXBsYXRlRGF0YScsXG5cdFx0XHQnZGlzcGxheU1vbnRocycsXG5cdFx0XHQnZmlyc3REYXlPZldlZWsnLFxuXHRcdFx0J2Zvb3RlclRlbXBsYXRlJyxcblx0XHRcdCdtYXJrRGlzYWJsZWQnLFxuXHRcdFx0J21pbkRhdGUnLFxuXHRcdFx0J21heERhdGUnLFxuXHRcdFx0J25hdmlnYXRpb24nLFxuXHRcdFx0J291dHNpZGVEYXlzJyxcblx0XHRcdCdzaG93TmF2aWdhdGlvbicsXG5cdFx0XHQnc2hvd1dlZWtOdW1iZXJzJyxcblx0XHRcdCd3ZWVrZGF5cycsXG5cdFx0XS5mb3JFYWNoKChpbnB1dE5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0aWYgKHRoaXNbaW5wdXROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGRhdGVwaWNrZXJDb21wb25lbnRSZWYuc2V0SW5wdXQoaW5wdXROYW1lLCB0aGlzW2lucHV0TmFtZV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGRhdGVwaWNrZXJDb21wb25lbnRSZWYuc2V0SW5wdXQoJ3N0YXJ0RGF0ZScsIHRoaXMuc3RhcnREYXRlIHx8IHRoaXMuX21vZGVsKTtcblx0fVxuXG5cdHByaXZhdGUgX2FwcGx5UG9wdXBDbGFzcyhuZXdDbGFzczogc3RyaW5nLCBvbGRDbGFzcz86IHN0cmluZykge1xuXHRcdGNvbnN0IHBvcHVwRWwgPSB0aGlzLl9jUmVmPy5sb2NhdGlvbi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXHRcdGlmIChwb3B1cEVsKSB7XG5cdFx0XHRpZiAobmV3Q2xhc3MpIHtcblx0XHRcdFx0cG9wdXBFbC5jbGFzc0xpc3QuYWRkKG5ld0NsYXNzKTtcblx0XHRcdH1cblx0XHRcdGlmIChvbGRDbGFzcykge1xuXHRcdFx0XHRwb3B1cEVsLmNsYXNzTGlzdC5yZW1vdmUob2xkQ2xhc3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2FwcGx5UG9wdXBTdHlsaW5nKG5hdGl2ZUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG5cdFx0bmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkcm9wZG93bi1tZW51JywgJ3Nob3cnKTtcblxuXHRcdGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG5cdFx0XHRuYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ25nYi1kcC1ib2R5Jyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fYXBwbHlQb3B1cENsYXNzKHRoaXMuZGF0ZXBpY2tlckNsYXNzKTtcblx0fVxuXG5cdHByaXZhdGUgX3N1YnNjcmliZUZvckRhdGVwaWNrZXJPdXRwdXRzKGRhdGVwaWNrZXJJbnN0YW5jZTogTmdiRGF0ZXBpY2tlcikge1xuXHRcdGRhdGVwaWNrZXJJbnN0YW5jZS5uYXZpZ2F0ZS5zdWJzY3JpYmUoKG5hdmlnYXRlRXZlbnQpID0+IHRoaXMubmF2aWdhdGUuZW1pdChuYXZpZ2F0ZUV2ZW50KSk7XG5cdFx0ZGF0ZXBpY2tlckluc3RhbmNlLmRhdGVTZWxlY3Quc3Vic2NyaWJlKChkYXRlKSA9PiB7XG5cdFx0XHR0aGlzLmRhdGVTZWxlY3QuZW1pdChkYXRlKTtcblx0XHRcdGlmICh0aGlzLmF1dG9DbG9zZSA9PT0gdHJ1ZSB8fCB0aGlzLmF1dG9DbG9zZSA9PT0gJ2luc2lkZScpIHtcblx0XHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfd3JpdGVNb2RlbFZhbHVlKG1vZGVsOiBOZ2JEYXRlIHwgbnVsbCkge1xuXHRcdGNvbnN0IHZhbHVlID0gdGhpcy5fcGFyc2VyRm9ybWF0dGVyLmZvcm1hdChtb2RlbCk7XG5cdFx0dGhpcy5faW5wdXRWYWx1ZSA9IHZhbHVlO1xuXHRcdHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcblx0XHRpZiAodGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5fY1JlZiEuaW5zdGFuY2Uud3JpdGVWYWx1ZSh0aGlzLl9kYXRlQWRhcHRlci50b01vZGVsKG1vZGVsKSk7XG5cdFx0XHR0aGlzLl9vblRvdWNoZWQoKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9mcm9tRGF0ZVN0cnVjdChkYXRlOiBOZ2JEYXRlU3RydWN0IHwgbnVsbCk6IE5nYkRhdGUgfCBudWxsIHtcblx0XHRjb25zdCBuZ2JEYXRlID0gZGF0ZSA/IG5ldyBOZ2JEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCwgZGF0ZS5kYXkpIDogbnVsbDtcblx0XHRyZXR1cm4gdGhpcy5fY2FsZW5kYXIuaXNWYWxpZChuZ2JEYXRlKSA/IG5nYkRhdGUgOiBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBfc2V0Q2xvc2VIYW5kbGVycygpIHtcblx0XHR0aGlzLl9kZXN0cm95Q2xvc2VIYW5kbGVycyQubmV4dCgpO1xuXHRcdG5nYkF1dG9DbG9zZShcblx0XHRcdHRoaXMuX25nWm9uZSxcblx0XHRcdHRoaXMuX2RvY3VtZW50LFxuXHRcdFx0dGhpcy5hdXRvQ2xvc2UsXG5cdFx0XHQoKSA9PiB0aGlzLmNsb3NlKCksXG5cdFx0XHR0aGlzLl9kZXN0cm95Q2xvc2VIYW5kbGVycyQsXG5cdFx0XHRbXSxcblx0XHRcdFt0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl9jUmVmIS5sb2NhdGlvbi5uYXRpdmVFbGVtZW50XSxcblx0XHQpO1xuXHR9XG59XG4iXX0=