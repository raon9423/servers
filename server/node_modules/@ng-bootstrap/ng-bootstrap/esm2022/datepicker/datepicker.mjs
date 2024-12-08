import { fromEvent, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { afterNextRender, AfterRenderPhase, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, DestroyRef, Directive, ElementRef, EventEmitter, forwardRef, inject, Injector, Input, NgZone, Output, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDatepickerService } from './datepicker-service';
import { NavigationEvent } from './datepicker-view-model';
import { NgbDatepickerConfig } from './datepicker-config';
import { NgbDateAdapter } from './adapters/ngb-date-adapter';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { NgbDatepickerKeyboardService } from './datepicker-keyboard-service';
import { isChangedDate, isChangedMonth } from './datepicker-tools';
import { NgbDatepickerDayView } from './datepicker-day-view';
import { NgbDatepickerNavigation } from './datepicker-navigation';
import * as i0 from "@angular/core";
/**
 * A directive that marks the content template that customizes the way datepicker months are displayed
 *
 * @since 5.3.0
 */
export class NgbDatepickerContent {
    constructor() {
        this.templateRef = inject(TemplateRef);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerContent, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbDatepickerContent, isStandalone: true, selector: "ng-template[ngbDatepickerContent]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerContent, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbDatepickerContent]', standalone: true }]
        }] });
/**
 * A component that renders one month including all the days, weekdays and week numbers. Can be used inside
 * the `<ng-template ngbDatepickerMonths></ng-template>` when you want to customize months layout.
 *
 * For a usage example, see [custom month layout demo](#/components/datepicker/examples#custommonth)
 *
 * @since 5.3.0
 */
export class NgbDatepickerMonth {
    constructor() {
        this._keyboardService = inject(NgbDatepickerKeyboardService);
        this._service = inject(NgbDatepickerService);
        this.i18n = inject(NgbDatepickerI18n);
        this.datepicker = inject(NgbDatepicker);
    }
    /**
     * The first date of month to be rendered.
     *
     * This month must one of the months present in the
     * [datepicker state](#/components/datepicker/api#NgbDatepickerState).
     */
    set month(month) {
        this.viewModel = this._service.getMonth(month);
    }
    onKeyDown(event) {
        this._keyboardService.processKey(event, this.datepicker);
    }
    doSelect(day) {
        if (!day.context.disabled && !day.hidden) {
            this.datepicker.onDateSelect(day.date);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerMonth, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.2", type: NgbDatepickerMonth, isStandalone: true, selector: "ngb-datepicker-month", inputs: { month: "month" }, host: { attributes: { "role": "grid" }, listeners: { "keydown": "onKeyDown($event)" } }, ngImport: i0, template: `
		@if (viewModel.weekdays.length > 0) {
			<div class="ngb-dp-week ngb-dp-weekdays" role="row">
				@if (datepicker.showWeekNumbers) {
					<div class="ngb-dp-weekday ngb-dp-showweek small">{{ i18n.getWeekLabel() }}</div>
				}
				@for (weekday of viewModel.weekdays; track $index) {
					<div class="ngb-dp-weekday small" role="columnheader">{{ weekday }}</div>
				}
			</div>
		}
		@for (week of viewModel.weeks; track week) {
			@if (!week.collapsed) {
				<div class="ngb-dp-week" role="row">
					@if (datepicker.showWeekNumbers) {
						<div class="ngb-dp-week-number small text-muted">{{ i18n.getWeekNumerals(week.number) }}</div>
					}
					@for (day of week.days; track day) {
						<div
							(click)="doSelect(day); $event.preventDefault()"
							class="ngb-dp-day"
							role="gridcell"
							[class.disabled]="day.context.disabled"
							[tabindex]="day.tabindex"
							[class.hidden]="day.hidden"
							[class.ngb-dp-today]="day.context.today"
							[attr.aria-label]="day.ariaLabel"
						>
							@if (!day.hidden) {
								<ng-template [ngTemplateOutlet]="datepicker.dayTemplate" [ngTemplateOutletContext]="day.context" />
							}
						</div>
					}
				</div>
			}
		}
	`, isInline: true, styles: ["ngb-datepicker-month{display:block}.ngb-dp-weekday,.ngb-dp-week-number{line-height:2rem;text-align:center;font-style:italic}.ngb-dp-weekday{color:var(--bs-info)}.ngb-dp-week{border-radius:.25rem;display:flex}.ngb-dp-weekdays{border-bottom:1px solid var(--bs-border-color);border-radius:0;background-color:var(--bs-tertiary-bg)}.ngb-dp-day,.ngb-dp-weekday,.ngb-dp-week-number{width:2rem;height:2rem}.ngb-dp-day{cursor:pointer}.ngb-dp-day.disabled,.ngb-dp-day.hidden{cursor:default;pointer-events:none}.ngb-dp-day[tabindex=\"0\"]{z-index:1}\n"], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerMonth, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-datepicker-month', standalone: true, imports: [NgTemplateOutlet], host: {
                        role: 'grid',
                        '(keydown)': 'onKeyDown($event)',
                    }, encapsulation: ViewEncapsulation.None, template: `
		@if (viewModel.weekdays.length > 0) {
			<div class="ngb-dp-week ngb-dp-weekdays" role="row">
				@if (datepicker.showWeekNumbers) {
					<div class="ngb-dp-weekday ngb-dp-showweek small">{{ i18n.getWeekLabel() }}</div>
				}
				@for (weekday of viewModel.weekdays; track $index) {
					<div class="ngb-dp-weekday small" role="columnheader">{{ weekday }}</div>
				}
			</div>
		}
		@for (week of viewModel.weeks; track week) {
			@if (!week.collapsed) {
				<div class="ngb-dp-week" role="row">
					@if (datepicker.showWeekNumbers) {
						<div class="ngb-dp-week-number small text-muted">{{ i18n.getWeekNumerals(week.number) }}</div>
					}
					@for (day of week.days; track day) {
						<div
							(click)="doSelect(day); $event.preventDefault()"
							class="ngb-dp-day"
							role="gridcell"
							[class.disabled]="day.context.disabled"
							[tabindex]="day.tabindex"
							[class.hidden]="day.hidden"
							[class.ngb-dp-today]="day.context.today"
							[attr.aria-label]="day.ariaLabel"
						>
							@if (!day.hidden) {
								<ng-template [ngTemplateOutlet]="datepicker.dayTemplate" [ngTemplateOutletContext]="day.context" />
							}
						</div>
					}
				</div>
			}
		}
	`, styles: ["ngb-datepicker-month{display:block}.ngb-dp-weekday,.ngb-dp-week-number{line-height:2rem;text-align:center;font-style:italic}.ngb-dp-weekday{color:var(--bs-info)}.ngb-dp-week{border-radius:.25rem;display:flex}.ngb-dp-weekdays{border-bottom:1px solid var(--bs-border-color);border-radius:0;background-color:var(--bs-tertiary-bg)}.ngb-dp-day,.ngb-dp-weekday,.ngb-dp-week-number{width:2rem;height:2rem}.ngb-dp-day{cursor:pointer}.ngb-dp-day.disabled,.ngb-dp-day.hidden{cursor:default;pointer-events:none}.ngb-dp-day[tabindex=\"0\"]{z-index:1}\n"] }]
        }], propDecorators: { month: [{
                type: Input
            }] } });
/**
 * A highly configurable component that helps you with selecting calendar dates.
 *
 * `NgbDatepicker` is meant to be displayed inline on a page or put inside a popup.
 */
export class NgbDatepicker {
    constructor() {
        this.injector = inject(Injector);
        this._service = inject(NgbDatepickerService);
        this._calendar = inject(NgbCalendar);
        this._i18n = inject(NgbDatepickerI18n);
        this._config = inject(NgbDatepickerConfig);
        this._nativeElement = inject(ElementRef).nativeElement;
        this._ngbDateAdapter = inject((NgbDateAdapter));
        this._ngZone = inject(NgZone);
        this._destroyRef = inject(DestroyRef);
        this._injector = inject(Injector);
        this._controlValue = null;
        this._publicState = {};
        this._initialized = false;
        /**
         * The reference to a custom template for the day.
         *
         * Allows to completely override the way a day 'cell' in the calendar is displayed.
         *
         * See [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext) for the data you get inside.
         */
        this.dayTemplate = this._config.dayTemplate;
        /**
         * The callback to pass any arbitrary data to the template cell via the
         * [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext)'s `data` parameter.
         *
         * `current` is the month that is currently displayed by the datepicker.
         *
         * @since 3.3.0
         */
        this.dayTemplateData = this._config.dayTemplateData;
        /**
         * The number of months to display.
         */
        this.displayMonths = this._config.displayMonths;
        /**
         * The first day of the week.
         *
         * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
         */
        this.firstDayOfWeek = this._config.firstDayOfWeek;
        /**
         * The reference to the custom template for the datepicker footer.
         *
         * @since 3.3.0
         */
        this.footerTemplate = this._config.footerTemplate;
        /**
         * The callback to mark some dates as disabled.
         *
         * It is called for each new date when navigating to a different month.
         *
         * `current` is the month that is currently displayed by the datepicker.
         */
        this.markDisabled = this._config.markDisabled;
        /**
         * The latest date that can be displayed or selected.
         *
         * If not provided, 'year' select box will display 10 years after the current month.
         */
        this.maxDate = this._config.maxDate;
        /**
         * The earliest date that can be displayed or selected.
         *
         * If not provided, 'year' select box will display 10 years before the current month.
         */
        this.minDate = this._config.minDate;
        /**
         * Navigation type.
         *
         * * `"select"` - select boxes for month and navigation arrows
         * * `"arrows"` - only navigation arrows
         * * `"none"` - no navigation visible at all
         */
        this.navigation = this._config.navigation;
        /**
         * The way of displaying days that don't belong to the current month.
         *
         * * `"visible"` - days are visible
         * * `"hidden"` - days are hidden, white space preserved
         * * `"collapsed"` - days are collapsed, so the datepicker height might change between months
         *
         * For the 2+ months view, days in between months are never shown.
         */
        this.outsideDays = this._config.outsideDays;
        /**
         * If `true`, week numbers will be displayed.
         */
        this.showWeekNumbers = this._config.showWeekNumbers;
        /**
         * The date to open calendar with.
         *
         * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
         * If nothing or invalid date is provided, calendar will open with current month.
         *
         * You could use `navigateTo(date)` method as an alternative.
         */
        this.startDate = this._config.startDate;
        /**
         * The way weekdays should be displayed.
         *
         * * `true` - weekdays are displayed using default width
         * * `false` - weekdays are not displayed
         * * `"short" | "long" | "narrow"` - weekdays are displayed using specified width
         *
         * @since 9.1.0
         */
        this.weekdays = this._config.weekdays;
        /**
         * An event emitted right before the navigation happens and displayed month changes.
         *
         * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event emitted when user selects a date using keyboard or mouse.
         *
         * The payload of the event is currently selected `NgbDate`.
         *
         * @since 5.2.0
         */
        this.dateSelect = new EventEmitter();
        this.onChange = (_) => { };
        this.onTouched = () => { };
        const cd = inject(ChangeDetectorRef);
        this._service.dateSelect$.pipe(takeUntilDestroyed()).subscribe((date) => {
            this.dateSelect.emit(date);
        });
        this._service.model$.pipe(takeUntilDestroyed()).subscribe((model) => {
            const newDate = model.firstDate;
            const oldDate = this.model ? this.model.firstDate : null;
            // update public state
            this._publicState = {
                maxDate: model.maxDate,
                minDate: model.minDate,
                firstDate: model.firstDate,
                lastDate: model.lastDate,
                focusedDate: model.focusDate,
                months: model.months.map((viewModel) => viewModel.firstDate),
            };
            let navigationPrevented = false;
            // emitting navigation event if the first month changes
            if (!newDate.equals(oldDate)) {
                this.navigate.emit({
                    current: oldDate ? { year: oldDate.year, month: oldDate.month } : null,
                    next: { year: newDate.year, month: newDate.month },
                    preventDefault: () => (navigationPrevented = true),
                });
                // can't prevent the very first navigation
                if (navigationPrevented && oldDate !== null) {
                    this._service.open(oldDate);
                    return;
                }
            }
            const newSelectedDate = model.selectedDate;
            const newFocusedDate = model.focusDate;
            const oldFocusedDate = this.model ? this.model.focusDate : null;
            this.model = model;
            // handling selection change
            if (isChangedDate(newSelectedDate, this._controlValue)) {
                this._controlValue = newSelectedDate;
                this.onTouched();
                this.onChange(this._ngbDateAdapter.toModel(newSelectedDate));
            }
            // handling focus change
            if (isChangedDate(newFocusedDate, oldFocusedDate) && oldFocusedDate && model.focusVisible) {
                this.focus();
            }
            cd.markForCheck();
        });
    }
    /**
     *  Returns the readonly public state of the datepicker
     *
     * @since 5.2.0
     */
    get state() {
        return this._publicState;
    }
    /**
     *  Returns the calendar service used in the specific datepicker instance.
     *
     *  @since 5.3.0
     */
    get calendar() {
        return this._calendar;
    }
    /**
     * Returns the i18n service used in the specific datepicker instance.
     *
     * @since 14.2.0
     */
    get i18n() {
        return this._i18n;
    }
    /**
     *  Focuses on given date.
     */
    focusDate(date) {
        this._service.focus(NgbDate.from(date));
    }
    /**
     *  Selects focused date.
     */
    focusSelect() {
        this._service.focusSelect();
    }
    focus() {
        afterNextRender(() => {
            this._nativeElement.querySelector('div.ngb-dp-day[tabindex="0"]')?.focus();
        }, { phase: AfterRenderPhase.Read, injector: this._injector });
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
        this._service.open(NgbDate.from(date ? (date.day ? date : { ...date, day: 1 }) : null));
    }
    ngAfterViewInit() {
        this._ngZone.runOutsideAngular(() => {
            const focusIns$ = fromEvent(this._contentEl.nativeElement, 'focusin');
            const focusOuts$ = fromEvent(this._contentEl.nativeElement, 'focusout');
            // we're changing 'focusVisible' only when entering or leaving months view
            // and ignoring all focus events where both 'target' and 'related' target are day cells
            merge(focusIns$, focusOuts$)
                .pipe(filter((focusEvent) => {
                const target = focusEvent.target;
                const relatedTarget = focusEvent.relatedTarget;
                return !(target?.classList.contains('ngb-dp-day') &&
                    relatedTarget?.classList.contains('ngb-dp-day') &&
                    this._nativeElement.contains(target) &&
                    this._nativeElement.contains(relatedTarget));
            }), takeUntilDestroyed(this._destroyRef))
                .subscribe(({ type }) => this._ngZone.run(() => this._service.set({ focusVisible: type === 'focusin' })));
        });
    }
    ngOnInit() {
        if (this.model === undefined) {
            const inputs = {};
            [
                'dayTemplateData',
                'displayMonths',
                'markDisabled',
                'firstDayOfWeek',
                'navigation',
                'minDate',
                'maxDate',
                'outsideDays',
                'weekdays',
            ].forEach((name) => (inputs[name] = this[name]));
            this._service.set(inputs);
            this.navigateTo(this.startDate);
        }
        if (!this.dayTemplate) {
            this.dayTemplate = this._defaultDayTemplate;
        }
        this._initialized = true;
    }
    ngOnChanges(changes) {
        const inputs = {};
        [
            'dayTemplateData',
            'displayMonths',
            'markDisabled',
            'firstDayOfWeek',
            'navigation',
            'minDate',
            'maxDate',
            'outsideDays',
            'weekdays',
        ]
            .filter((name) => name in changes)
            .forEach((name) => (inputs[name] = this[name]));
        this._service.set(inputs);
        if ('startDate' in changes && this._initialized) {
            const { currentValue, previousValue } = changes.startDate;
            if (isChangedMonth(previousValue, currentValue)) {
                this.navigateTo(this.startDate);
            }
        }
    }
    onDateSelect(date) {
        this._service.focus(date);
        this._service.select(date, { emitEvent: true });
    }
    onNavigateDateSelect(date) {
        this._service.open(date);
    }
    onNavigateEvent(event) {
        switch (event) {
            case NavigationEvent.PREV:
                this._service.open(this._calendar.getPrev(this.model.firstDate, 'm', 1));
                break;
            case NavigationEvent.NEXT:
                this._service.open(this._calendar.getNext(this.model.firstDate, 'm', 1));
                break;
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(disabled) {
        this._service.set({ disabled });
    }
    writeValue(value) {
        this._controlValue = NgbDate.from(this._ngbDateAdapter.fromModel(value));
        this._service.select(this._controlValue);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepicker, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.2", type: NgbDatepicker, isStandalone: true, selector: "ngb-datepicker", inputs: { contentTemplate: "contentTemplate", dayTemplate: "dayTemplate", dayTemplateData: "dayTemplateData", displayMonths: "displayMonths", firstDayOfWeek: "firstDayOfWeek", footerTemplate: "footerTemplate", markDisabled: "markDisabled", maxDate: "maxDate", minDate: "minDate", navigation: "navigation", outsideDays: "outsideDays", showWeekNumbers: "showWeekNumbers", startDate: "startDate", weekdays: "weekdays" }, outputs: { navigate: "navigate", dateSelect: "dateSelect" }, host: { properties: { "class.disabled": "model.disabled" } }, providers: [
            { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbDatepicker), multi: true },
            NgbDatepickerService,
        ], queries: [{ propertyName: "contentTemplateFromContent", first: true, predicate: NgbDatepickerContent, descendants: true, static: true }], viewQueries: [{ propertyName: "_defaultDayTemplate", first: true, predicate: ["defaultDayTemplate"], descendants: true, static: true }, { propertyName: "_contentEl", first: true, predicate: ["content"], descendants: true, static: true }], exportAs: ["ngbDatepicker"], usesOnChanges: true, ngImport: i0, template: `
		<ng-template
			#defaultDayTemplate
			let-date="date"
			let-currentMonth="currentMonth"
			let-selected="selected"
			let-disabled="disabled"
			let-focused="focused"
		>
			<div
				ngbDatepickerDayView
				[date]="date"
				[currentMonth]="currentMonth"
				[selected]="selected"
				[disabled]="disabled"
				[focused]="focused"
			>
			</div>
		</ng-template>

		<ng-template #defaultContentTemplate>
			@for (month of model.months; track month) {
				<div class="ngb-dp-month">
					@if (navigation === 'none' || (displayMonths > 1 && navigation === 'select')) {
						<div class="ngb-dp-month-name">
							{{ i18n.getMonthLabel(month.firstDate) }}
						</div>
					}
					<ngb-datepicker-month [month]="month.firstDate" />
				</div>
			}
		</ng-template>

		<div class="ngb-dp-header">
			@if (navigation !== 'none') {
				<ngb-datepicker-navigation
					[date]="model.firstDate!"
					[months]="model.months"
					[disabled]="model.disabled"
					[showSelect]="model.navigation === 'select'"
					[prevDisabled]="model.prevDisabled"
					[nextDisabled]="model.nextDisabled"
					[selectBoxes]="model.selectBoxes"
					(navigate)="onNavigateEvent($event)"
					(select)="onNavigateDateSelect($event)"
				/>
			}
		</div>

		<div class="ngb-dp-content" [class.ngb-dp-months]="!contentTemplate" #content>
			<ng-template
				[ngTemplateOutlet]="contentTemplate || contentTemplateFromContent?.templateRef || defaultContentTemplate"
				[ngTemplateOutletContext]="{ $implicit: this }"
				[ngTemplateOutletInjector]="injector"
			/>
		</div>

		<ng-template [ngTemplateOutlet]="footerTemplate" />
	`, isInline: true, styles: ["ngb-datepicker{border:1px solid var(--bs-border-color);border-radius:.25rem;display:inline-block}ngb-datepicker-month{pointer-events:auto}ngb-datepicker.dropdown-menu{padding:0}ngb-datepicker.disabled .ngb-dp-weekday,ngb-datepicker.disabled .ngb-dp-week-number,ngb-datepicker.disabled .ngb-dp-month-name{color:var(--bs-text-muted)}.ngb-dp-body{z-index:1055}.ngb-dp-header{border-bottom:0;border-radius:.25rem .25rem 0 0;padding-top:.25rem;background-color:var(--bs-tertiary-bg)}.ngb-dp-months{display:flex}.ngb-dp-month{pointer-events:none}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center;background-color:var(--bs-tertiary-bg)}.ngb-dp-month+.ngb-dp-month .ngb-dp-month-name,.ngb-dp-month+.ngb-dp-month .ngb-dp-week{padding-left:1rem}.ngb-dp-month:last-child .ngb-dp-week{padding-right:.25rem}.ngb-dp-month:first-child .ngb-dp-week{padding-left:.25rem}.ngb-dp-month .ngb-dp-week:last-child{padding-bottom:.25rem}\n"], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: NgbDatepickerDayView, selector: "[ngbDatepickerDayView]", inputs: ["currentMonth", "date", "disabled", "focused", "selected"] }, { kind: "component", type: NgbDatepickerMonth, selector: "ngb-datepicker-month", inputs: ["month"] }, { kind: "component", type: NgbDatepickerNavigation, selector: "ngb-datepicker-navigation", inputs: ["date", "disabled", "months", "showSelect", "prevDisabled", "nextDisabled", "selectBoxes"], outputs: ["navigate", "select"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepicker, decorators: [{
            type: Component,
            args: [{ exportAs: 'ngbDatepicker', selector: 'ngb-datepicker', standalone: true, imports: [NgTemplateOutlet, NgbDatepickerDayView, NgbDatepickerMonth, NgbDatepickerNavigation], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        '[class.disabled]': 'model.disabled',
                    }, template: `
		<ng-template
			#defaultDayTemplate
			let-date="date"
			let-currentMonth="currentMonth"
			let-selected="selected"
			let-disabled="disabled"
			let-focused="focused"
		>
			<div
				ngbDatepickerDayView
				[date]="date"
				[currentMonth]="currentMonth"
				[selected]="selected"
				[disabled]="disabled"
				[focused]="focused"
			>
			</div>
		</ng-template>

		<ng-template #defaultContentTemplate>
			@for (month of model.months; track month) {
				<div class="ngb-dp-month">
					@if (navigation === 'none' || (displayMonths > 1 && navigation === 'select')) {
						<div class="ngb-dp-month-name">
							{{ i18n.getMonthLabel(month.firstDate) }}
						</div>
					}
					<ngb-datepicker-month [month]="month.firstDate" />
				</div>
			}
		</ng-template>

		<div class="ngb-dp-header">
			@if (navigation !== 'none') {
				<ngb-datepicker-navigation
					[date]="model.firstDate!"
					[months]="model.months"
					[disabled]="model.disabled"
					[showSelect]="model.navigation === 'select'"
					[prevDisabled]="model.prevDisabled"
					[nextDisabled]="model.nextDisabled"
					[selectBoxes]="model.selectBoxes"
					(navigate)="onNavigateEvent($event)"
					(select)="onNavigateDateSelect($event)"
				/>
			}
		</div>

		<div class="ngb-dp-content" [class.ngb-dp-months]="!contentTemplate" #content>
			<ng-template
				[ngTemplateOutlet]="contentTemplate || contentTemplateFromContent?.templateRef || defaultContentTemplate"
				[ngTemplateOutletContext]="{ $implicit: this }"
				[ngTemplateOutletInjector]="injector"
			/>
		</div>

		<ng-template [ngTemplateOutlet]="footerTemplate" />
	`, providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbDatepicker), multi: true },
                        NgbDatepickerService,
                    ], styles: ["ngb-datepicker{border:1px solid var(--bs-border-color);border-radius:.25rem;display:inline-block}ngb-datepicker-month{pointer-events:auto}ngb-datepicker.dropdown-menu{padding:0}ngb-datepicker.disabled .ngb-dp-weekday,ngb-datepicker.disabled .ngb-dp-week-number,ngb-datepicker.disabled .ngb-dp-month-name{color:var(--bs-text-muted)}.ngb-dp-body{z-index:1055}.ngb-dp-header{border-bottom:0;border-radius:.25rem .25rem 0 0;padding-top:.25rem;background-color:var(--bs-tertiary-bg)}.ngb-dp-months{display:flex}.ngb-dp-month{pointer-events:none}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center;background-color:var(--bs-tertiary-bg)}.ngb-dp-month+.ngb-dp-month .ngb-dp-month-name,.ngb-dp-month+.ngb-dp-month .ngb-dp-week{padding-left:1rem}.ngb-dp-month:last-child .ngb-dp-week{padding-right:.25rem}.ngb-dp-month:first-child .ngb-dp-week{padding-left:.25rem}.ngb-dp-month .ngb-dp-week:last-child{padding-bottom:.25rem}\n"] }]
        }], ctorParameters: () => [], propDecorators: { _defaultDayTemplate: [{
                type: ViewChild,
                args: ['defaultDayTemplate', { static: true }]
            }], _contentEl: [{
                type: ViewChild,
                args: ['content', { static: true }]
            }], contentTemplate: [{
                type: Input
            }], contentTemplateFromContent: [{
                type: ContentChild,
                args: [NgbDatepickerContent, { static: true }]
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
            }], maxDate: [{
                type: Input
            }], minDate: [{
                type: Input
            }], navigation: [{
                type: Input
            }], outsideDays: [{
                type: Input
            }], showWeekNumbers: [{
                type: Input
            }], startDate: [{
                type: Input
            }], weekdays: [{
                type: Input
            }], navigate: [{
                type: Output
            }], dateSelect: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlcGlja2VyL2RhdGVwaWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDeEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hDLE9BQU8sRUFDTixlQUFlLEVBQ2YsZ0JBQWdCLEVBRWhCLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBQ1IsS0FBSyxFQUNMLE1BQU0sRUFHTixNQUFNLEVBRU4sV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRWhFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBMkIsb0JBQW9CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRixPQUFPLEVBQXFELGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTdHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUU3RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztB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U0csWUFBWTtzQkFBcEIsS0FBSztnQkFPRyxPQUFPO3NCQUFmLEtBQUs7Z0JBT0csT0FBTztzQkFBZixLQUFLO2dCQVNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBV0csV0FBVztzQkFBbkIsS0FBSztnQkFLRyxlQUFlO3NCQUF2QixLQUFLO2dCQVVHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBV0csUUFBUTtzQkFBaEIsS0FBSztnQkFPSSxRQUFRO3NCQUFqQixNQUFNO2dCQVNHLFVBQVU7c0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmcm9tRXZlbnQsIG1lcmdlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1xuXHRhZnRlck5leHRSZW5kZXIsXG5cdEFmdGVyUmVuZGVyUGhhc2UsXG5cdEFmdGVyVmlld0luaXQsXG5cdENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuXHRDaGFuZ2VEZXRlY3RvclJlZixcblx0Q29tcG9uZW50LFxuXHRDb250ZW50Q2hpbGQsXG5cdERlc3Ryb3lSZWYsXG5cdERpcmVjdGl2ZSxcblx0RWxlbWVudFJlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLFxuXHRpbmplY3QsXG5cdEluamVjdG9yLFxuXHRJbnB1dCxcblx0Tmdab25lLFxuXHRPbkNoYW5nZXMsXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRUZW1wbGF0ZVJlZixcblx0Vmlld0NoaWxkLFxuXHRWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBOZ1RlbXBsYXRlT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IHRha2VVbnRpbERlc3Ryb3llZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvcnhqcy1pbnRlcm9wJztcblxuaW1wb3J0IHsgTmdiQ2FsZW5kYXIgfSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5pbXBvcnQgeyBOZ2JEYXRlIH0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQgeyBEYXRlcGlja2VyU2VydmljZUlucHV0cywgTmdiRGF0ZXBpY2tlclNlcnZpY2UgfSBmcm9tICcuL2RhdGVwaWNrZXItc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlcGlja2VyVmlld01vZGVsLCBEYXlWaWV3TW9kZWwsIE1vbnRoVmlld01vZGVsLCBOYXZpZ2F0aW9uRXZlbnQgfSBmcm9tICcuL2RhdGVwaWNrZXItdmlldy1tb2RlbCc7XG5pbXBvcnQgeyBEYXlUZW1wbGF0ZUNvbnRleHQgfSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXRlbXBsYXRlLWNvbnRleHQnO1xuaW1wb3J0IHsgTmdiRGF0ZXBpY2tlckNvbmZpZyB9IGZyb20gJy4vZGF0ZXBpY2tlci1jb25maWcnO1xuaW1wb3J0IHsgTmdiRGF0ZUFkYXB0ZXIgfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHsgTmdiRGF0ZVN0cnVjdCB9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7IE5nYkRhdGVwaWNrZXJJMThuIH0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuaW1wb3J0IHsgTmdiRGF0ZXBpY2tlcktleWJvYXJkU2VydmljZSB9IGZyb20gJy4vZGF0ZXBpY2tlci1rZXlib2FyZC1zZXJ2aWNlJztcbmltcG9ydCB7IGlzQ2hhbmdlZERhdGUsIGlzQ2hhbmdlZE1vbnRoIH0gZnJvbSAnLi9kYXRlcGlja2VyLXRvb2xzJztcbmltcG9ydCB7IE5nYkRhdGVwaWNrZXJEYXlWaWV3IH0gZnJvbSAnLi9kYXRlcGlja2VyLWRheS12aWV3JztcbmltcG9ydCB7IE5nYkRhdGVwaWNrZXJOYXZpZ2F0aW9uIH0gZnJvbSAnLi9kYXRlcGlja2VyLW5hdmlnYXRpb24nO1xuaW1wb3J0IHsgQ29udGVudFRlbXBsYXRlQ29udGV4dCB9IGZyb20gJy4vZGF0ZXBpY2tlci1jb250ZW50LXRlbXBsYXRlLWNvbnRleHQnO1xuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYmVmb3JlIHRoZSBuYXZpZ2F0aW9uIGhhcHBlbnMgYW5kIHRoZSBtb250aCBkaXNwbGF5ZWQgYnkgdGhlIGRhdGVwaWNrZXIgY2hhbmdlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCB7XG5cdC8qKlxuXHQgKiBUaGUgY3VycmVudGx5IGRpc3BsYXllZCBtb250aC5cblx0ICovXG5cdGN1cnJlbnQ6IHsgeWVhcjogbnVtYmVyOyBtb250aDogbnVtYmVyIH0gfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBUaGUgbW9udGggd2UncmUgbmF2aWdhdGluZyB0by5cblx0ICovXG5cdG5leHQ6IHsgeWVhcjogbnVtYmVyOyBtb250aDogbnVtYmVyIH07XG5cblx0LyoqXG5cdCAqIENhbGxpbmcgdGhpcyBmdW5jdGlvbiB3aWxsIHByZXZlbnQgbmF2aWdhdGlvbiBmcm9tIGhhcHBlbmluZy5cblx0ICpcblx0ICogQHNpbmNlIDQuMS4wXG5cdCAqL1xuXHRwcmV2ZW50RGVmYXVsdDogKCkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBBbiBpbnRlcmZhY2UgdGhhdCByZXByZXNlbnRzIHRoZSByZWFkb25seSBwdWJsaWMgc3RhdGUgb2YgdGhlIGRhdGVwaWNrZXIuXG4gKlxuICogQWNjZXNzaWJsZSB2aWEgdGhlIGBkYXRlcGlja2VyLnN0YXRlYCBnZXR0ZXJcbiAqXG4gKiBAc2luY2UgNS4yLjBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JEYXRlcGlja2VyU3RhdGUge1xuXHQvKipcblx0ICogVGhlIGVhcmxpZXN0IGRhdGUgdGhhdCBjYW4gYmUgZGlzcGxheWVkIG9yIHNlbGVjdGVkXG5cdCAqL1xuXHRyZWFkb25seSBtaW5EYXRlOiBOZ2JEYXRlIHwgbnVsbDtcblxuXHQvKipcblx0ICogVGhlIGxhdGVzdCBkYXRlIHRoYXQgY2FuIGJlIGRpc3BsYXllZCBvciBzZWxlY3RlZFxuXHQgKi9cblx0cmVhZG9ubHkgbWF4RGF0ZTogTmdiRGF0ZSB8IG51bGw7XG5cblx0LyoqXG5cdCAqIFRoZSBmaXJzdCB2aXNpYmxlIGRhdGUgb2YgY3VycmVudGx5IGRpc3BsYXllZCBtb250aHNcblx0ICovXG5cdHJlYWRvbmx5IGZpcnN0RGF0ZTogTmdiRGF0ZTtcblxuXHQvKipcblx0ICogVGhlIGxhc3QgdmlzaWJsZSBkYXRlIG9mIGN1cnJlbnRseSBkaXNwbGF5ZWQgbW9udGhzXG5cdCAqL1xuXHRyZWFkb25seSBsYXN0RGF0ZTogTmdiRGF0ZTtcblxuXHQvKipcblx0ICogVGhlIGRhdGUgY3VycmVudGx5IGZvY3VzZWQgYnkgdGhlIGRhdGVwaWNrZXJcblx0ICovXG5cdHJlYWRvbmx5IGZvY3VzZWREYXRlOiBOZ2JEYXRlO1xuXG5cdC8qKlxuXHQgKiBGaXJzdCBkYXRlcyBvZiBtb250aHMgY3VycmVudGx5IGRpc3BsYXllZCBieSB0aGUgZGF0ZXBpY2tlclxuXHQgKlxuXHQgKiBAc2luY2UgNS4zLjBcblx0ICovXG5cdHJlYWRvbmx5IG1vbnRoczogTmdiRGF0ZVtdO1xufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgbWFya3MgdGhlIGNvbnRlbnQgdGVtcGxhdGUgdGhhdCBjdXN0b21pemVzIHRoZSB3YXkgZGF0ZXBpY2tlciBtb250aHMgYXJlIGRpc3BsYXllZFxuICpcbiAqIEBzaW5jZSA1LjMuMFxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JEYXRlcGlja2VyQ29udGVudF0nLCBzdGFuZGFsb25lOiB0cnVlIH0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlckNvbnRlbnQge1xuXHR0ZW1wbGF0ZVJlZiA9IGluamVjdChUZW1wbGF0ZVJlZik7XG59XG5cbi8qKlxuICogQSBjb21wb25lbnQgdGhhdCByZW5kZXJzIG9uZSBtb250aCBpbmNsdWRpbmcgYWxsIHRoZSBkYXlzLCB3ZWVrZGF5cyBhbmQgd2VlayBudW1iZXJzLiBDYW4gYmUgdXNlZCBpbnNpZGVcbiAqIHRoZSBgPG5nLXRlbXBsYXRlIG5nYkRhdGVwaWNrZXJNb250aHM+PC9uZy10ZW1wbGF0ZT5gIHdoZW4geW91IHdhbnQgdG8gY3VzdG9taXplIG1vbnRocyBsYXlvdXQuXG4gKlxuICogRm9yIGEgdXNhZ2UgZXhhbXBsZSwgc2VlIFtjdXN0b20gbW9udGggbGF5b3V0IGRlbW9dKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2V4YW1wbGVzI2N1c3RvbW1vbnRoKVxuICpcbiAqIEBzaW5jZSA1LjMuMFxuICovXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICduZ2ItZGF0ZXBpY2tlci1tb250aCcsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGltcG9ydHM6IFtOZ1RlbXBsYXRlT3V0bGV0XSxcblx0aG9zdDoge1xuXHRcdHJvbGU6ICdncmlkJyxcblx0XHQnKGtleWRvd24pJzogJ29uS2V5RG93bigkZXZlbnQpJyxcblx0fSxcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcblx0c3R5bGVVcmw6ICcuL2RhdGVwaWNrZXItbW9udGguc2NzcycsXG5cdHRlbXBsYXRlOiBgXG5cdFx0QGlmICh2aWV3TW9kZWwud2Vla2RheXMubGVuZ3RoID4gMCkge1xuXHRcdFx0PGRpdiBjbGFzcz1cIm5nYi1kcC13ZWVrIG5nYi1kcC13ZWVrZGF5c1wiIHJvbGU9XCJyb3dcIj5cblx0XHRcdFx0QGlmIChkYXRlcGlja2VyLnNob3dXZWVrTnVtYmVycykge1xuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJuZ2ItZHAtd2Vla2RheSBuZ2ItZHAtc2hvd3dlZWsgc21hbGxcIj57eyBpMThuLmdldFdlZWtMYWJlbCgpIH19PC9kaXY+XG5cdFx0XHRcdH1cblx0XHRcdFx0QGZvciAod2Vla2RheSBvZiB2aWV3TW9kZWwud2Vla2RheXM7IHRyYWNrICRpbmRleCkge1xuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJuZ2ItZHAtd2Vla2RheSBzbWFsbFwiIHJvbGU9XCJjb2x1bW5oZWFkZXJcIj57eyB3ZWVrZGF5IH19PC9kaXY+XG5cdFx0XHRcdH1cblx0XHRcdDwvZGl2PlxuXHRcdH1cblx0XHRAZm9yICh3ZWVrIG9mIHZpZXdNb2RlbC53ZWVrczsgdHJhY2sgd2Vlaykge1xuXHRcdFx0QGlmICghd2Vlay5jb2xsYXBzZWQpIHtcblx0XHRcdFx0PGRpdiBjbGFzcz1cIm5nYi1kcC13ZWVrXCIgcm9sZT1cInJvd1wiPlxuXHRcdFx0XHRcdEBpZiAoZGF0ZXBpY2tlci5zaG93V2Vla051bWJlcnMpIHtcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJuZ2ItZHAtd2Vlay1udW1iZXIgc21hbGwgdGV4dC1tdXRlZFwiPnt7IGkxOG4uZ2V0V2Vla051bWVyYWxzKHdlZWsubnVtYmVyKSB9fTwvZGl2PlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRAZm9yIChkYXkgb2Ygd2Vlay5kYXlzOyB0cmFjayBkYXkpIHtcblx0XHRcdFx0XHRcdDxkaXZcblx0XHRcdFx0XHRcdFx0KGNsaWNrKT1cImRvU2VsZWN0KGRheSk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCJcblx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJuZ2ItZHAtZGF5XCJcblx0XHRcdFx0XHRcdFx0cm9sZT1cImdyaWRjZWxsXCJcblx0XHRcdFx0XHRcdFx0W2NsYXNzLmRpc2FibGVkXT1cImRheS5jb250ZXh0LmRpc2FibGVkXCJcblx0XHRcdFx0XHRcdFx0W3RhYmluZGV4XT1cImRheS50YWJpbmRleFwiXG5cdFx0XHRcdFx0XHRcdFtjbGFzcy5oaWRkZW5dPVwiZGF5LmhpZGRlblwiXG5cdFx0XHRcdFx0XHRcdFtjbGFzcy5uZ2ItZHAtdG9kYXldPVwiZGF5LmNvbnRleHQudG9kYXlcIlxuXHRcdFx0XHRcdFx0XHRbYXR0ci5hcmlhLWxhYmVsXT1cImRheS5hcmlhTGFiZWxcIlxuXHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRAaWYgKCFkYXkuaGlkZGVuKSB7XG5cdFx0XHRcdFx0XHRcdFx0PG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRhdGVwaWNrZXIuZGF5VGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiZGF5LmNvbnRleHRcIiAvPlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0fVxuXHRcdH1cblx0YCxcbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlck1vbnRoIHtcblx0cHJpdmF0ZSBfa2V5Ym9hcmRTZXJ2aWNlID0gaW5qZWN0KE5nYkRhdGVwaWNrZXJLZXlib2FyZFNlcnZpY2UpO1xuXHRwcml2YXRlIF9zZXJ2aWNlID0gaW5qZWN0KE5nYkRhdGVwaWNrZXJTZXJ2aWNlKTtcblxuXHRpMThuID0gaW5qZWN0KE5nYkRhdGVwaWNrZXJJMThuKTtcblx0ZGF0ZXBpY2tlciA9IGluamVjdChOZ2JEYXRlcGlja2VyKTtcblxuXHR2aWV3TW9kZWw6IE1vbnRoVmlld01vZGVsO1xuXG5cdC8qKlxuXHQgKiBUaGUgZmlyc3QgZGF0ZSBvZiBtb250aCB0byBiZSByZW5kZXJlZC5cblx0ICpcblx0ICogVGhpcyBtb250aCBtdXN0IG9uZSBvZiB0aGUgbW9udGhzIHByZXNlbnQgaW4gdGhlXG5cdCAqIFtkYXRlcGlja2VyIHN0YXRlXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjTmdiRGF0ZXBpY2tlclN0YXRlKS5cblx0ICovXG5cdEBJbnB1dCgpXG5cdHNldCBtb250aChtb250aDogTmdiRGF0ZVN0cnVjdCkge1xuXHRcdHRoaXMudmlld01vZGVsID0gdGhpcy5fc2VydmljZS5nZXRNb250aChtb250aCk7XG5cdH1cblxuXHRvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcblx0XHR0aGlzLl9rZXlib2FyZFNlcnZpY2UucHJvY2Vzc0tleShldmVudCwgdGhpcy5kYXRlcGlja2VyKTtcblx0fVxuXG5cdGRvU2VsZWN0KGRheTogRGF5Vmlld01vZGVsKSB7XG5cdFx0aWYgKCFkYXkuY29udGV4dC5kaXNhYmxlZCAmJiAhZGF5LmhpZGRlbikge1xuXHRcdFx0dGhpcy5kYXRlcGlja2VyLm9uRGF0ZVNlbGVjdChkYXkuZGF0ZSk7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQSBoaWdobHkgY29uZmlndXJhYmxlIGNvbXBvbmVudCB0aGF0IGhlbHBzIHlvdSB3aXRoIHNlbGVjdGluZyBjYWxlbmRhciBkYXRlcy5cbiAqXG4gKiBgTmdiRGF0ZXBpY2tlcmAgaXMgbWVhbnQgdG8gYmUgZGlzcGxheWVkIGlubGluZSBvbiBhIHBhZ2Ugb3IgcHV0IGluc2lkZSBhIHBvcHVwLlxuICovXG5AQ29tcG9uZW50KHtcblx0ZXhwb3J0QXM6ICduZ2JEYXRlcGlja2VyJyxcblx0c2VsZWN0b3I6ICduZ2ItZGF0ZXBpY2tlcicsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGltcG9ydHM6IFtOZ1RlbXBsYXRlT3V0bGV0LCBOZ2JEYXRlcGlja2VyRGF5VmlldywgTmdiRGF0ZXBpY2tlck1vbnRoLCBOZ2JEYXRlcGlja2VyTmF2aWdhdGlvbl0sXG5cdGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRzdHlsZVVybDogJy4vZGF0ZXBpY2tlci5zY3NzJyxcblx0aG9zdDoge1xuXHRcdCdbY2xhc3MuZGlzYWJsZWRdJzogJ21vZGVsLmRpc2FibGVkJyxcblx0fSxcblx0dGVtcGxhdGU6IGBcblx0XHQ8bmctdGVtcGxhdGVcblx0XHRcdCNkZWZhdWx0RGF5VGVtcGxhdGVcblx0XHRcdGxldC1kYXRlPVwiZGF0ZVwiXG5cdFx0XHRsZXQtY3VycmVudE1vbnRoPVwiY3VycmVudE1vbnRoXCJcblx0XHRcdGxldC1zZWxlY3RlZD1cInNlbGVjdGVkXCJcblx0XHRcdGxldC1kaXNhYmxlZD1cImRpc2FibGVkXCJcblx0XHRcdGxldC1mb2N1c2VkPVwiZm9jdXNlZFwiXG5cdFx0PlxuXHRcdFx0PGRpdlxuXHRcdFx0XHRuZ2JEYXRlcGlja2VyRGF5Vmlld1xuXHRcdFx0XHRbZGF0ZV09XCJkYXRlXCJcblx0XHRcdFx0W2N1cnJlbnRNb250aF09XCJjdXJyZW50TW9udGhcIlxuXHRcdFx0XHRbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuXHRcdFx0XHRbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuXHRcdFx0XHRbZm9jdXNlZF09XCJmb2N1c2VkXCJcblx0XHRcdD5cblx0XHRcdDwvZGl2PlxuXHRcdDwvbmctdGVtcGxhdGU+XG5cblx0XHQ8bmctdGVtcGxhdGUgI2RlZmF1bHRDb250ZW50VGVtcGxhdGU+XG5cdFx0XHRAZm9yIChtb250aCBvZiBtb2RlbC5tb250aHM7IHRyYWNrIG1vbnRoKSB7XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJuZ2ItZHAtbW9udGhcIj5cblx0XHRcdFx0XHRAaWYgKG5hdmlnYXRpb24gPT09ICdub25lJyB8fCAoZGlzcGxheU1vbnRocyA+IDEgJiYgbmF2aWdhdGlvbiA9PT0gJ3NlbGVjdCcpKSB7XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibmdiLWRwLW1vbnRoLW5hbWVcIj5cblx0XHRcdFx0XHRcdFx0e3sgaTE4bi5nZXRNb250aExhYmVsKG1vbnRoLmZpcnN0RGF0ZSkgfX1cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQ8bmdiLWRhdGVwaWNrZXItbW9udGggW21vbnRoXT1cIm1vbnRoLmZpcnN0RGF0ZVwiIC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0fVxuXHRcdDwvbmctdGVtcGxhdGU+XG5cblx0XHQ8ZGl2IGNsYXNzPVwibmdiLWRwLWhlYWRlclwiPlxuXHRcdFx0QGlmIChuYXZpZ2F0aW9uICE9PSAnbm9uZScpIHtcblx0XHRcdFx0PG5nYi1kYXRlcGlja2VyLW5hdmlnYXRpb25cblx0XHRcdFx0XHRbZGF0ZV09XCJtb2RlbC5maXJzdERhdGUhXCJcblx0XHRcdFx0XHRbbW9udGhzXT1cIm1vZGVsLm1vbnRoc1wiXG5cdFx0XHRcdFx0W2Rpc2FibGVkXT1cIm1vZGVsLmRpc2FibGVkXCJcblx0XHRcdFx0XHRbc2hvd1NlbGVjdF09XCJtb2RlbC5uYXZpZ2F0aW9uID09PSAnc2VsZWN0J1wiXG5cdFx0XHRcdFx0W3ByZXZEaXNhYmxlZF09XCJtb2RlbC5wcmV2RGlzYWJsZWRcIlxuXHRcdFx0XHRcdFtuZXh0RGlzYWJsZWRdPVwibW9kZWwubmV4dERpc2FibGVkXCJcblx0XHRcdFx0XHRbc2VsZWN0Qm94ZXNdPVwibW9kZWwuc2VsZWN0Qm94ZXNcIlxuXHRcdFx0XHRcdChuYXZpZ2F0ZSk9XCJvbk5hdmlnYXRlRXZlbnQoJGV2ZW50KVwiXG5cdFx0XHRcdFx0KHNlbGVjdCk9XCJvbk5hdmlnYXRlRGF0ZVNlbGVjdCgkZXZlbnQpXCJcblx0XHRcdFx0Lz5cblx0XHRcdH1cblx0XHQ8L2Rpdj5cblxuXHRcdDxkaXYgY2xhc3M9XCJuZ2ItZHAtY29udGVudFwiIFtjbGFzcy5uZ2ItZHAtbW9udGhzXT1cIiFjb250ZW50VGVtcGxhdGVcIiAjY29udGVudD5cblx0XHRcdDxuZy10ZW1wbGF0ZVxuXHRcdFx0XHRbbmdUZW1wbGF0ZU91dGxldF09XCJjb250ZW50VGVtcGxhdGUgfHwgY29udGVudFRlbXBsYXRlRnJvbUNvbnRlbnQ/LnRlbXBsYXRlUmVmIHx8IGRlZmF1bHRDb250ZW50VGVtcGxhdGVcIlxuXHRcdFx0XHRbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IHRoaXMgfVwiXG5cdFx0XHRcdFtuZ1RlbXBsYXRlT3V0bGV0SW5qZWN0b3JdPVwiaW5qZWN0b3JcIlxuXHRcdFx0Lz5cblx0XHQ8L2Rpdj5cblxuXHRcdDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJmb290ZXJUZW1wbGF0ZVwiIC8+XG5cdGAsXG5cdHByb3ZpZGVyczogW1xuXHRcdHsgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYkRhdGVwaWNrZXIpLCBtdWx0aTogdHJ1ZSB9LFxuXHRcdE5nYkRhdGVwaWNrZXJTZXJ2aWNlLFxuXHRdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9DbG9zZTogYm9vbGVhbiB8IHN0cmluZztcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX25hdmlnYXRpb246IHN0cmluZztcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX291dHNpZGVEYXlzOiBzdHJpbmc7XG5cdHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV93ZWVrZGF5czogYm9vbGVhbiB8IHN0cmluZztcblxuXHRtb2RlbDogRGF0ZXBpY2tlclZpZXdNb2RlbDtcblxuXHRAVmlld0NoaWxkKCdkZWZhdWx0RGF5VGVtcGxhdGUnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIF9kZWZhdWx0RGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPERheVRlbXBsYXRlQ29udGV4dD47XG5cdEBWaWV3Q2hpbGQoJ2NvbnRlbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIF9jb250ZW50RWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG5cdHByb3RlY3RlZCBpbmplY3RvciA9IGluamVjdChJbmplY3Rvcik7XG5cblx0cHJpdmF0ZSBfc2VydmljZSA9IGluamVjdChOZ2JEYXRlcGlja2VyU2VydmljZSk7XG5cdHByaXZhdGUgX2NhbGVuZGFyID0gaW5qZWN0KE5nYkNhbGVuZGFyKTtcblx0cHJpdmF0ZSBfaTE4biA9IGluamVjdChOZ2JEYXRlcGlja2VySTE4bik7XG5cdHByaXZhdGUgX2NvbmZpZyA9IGluamVjdChOZ2JEYXRlcGlja2VyQ29uZmlnKTtcblx0cHJpdmF0ZSBfbmF0aXZlRWxlbWVudCA9IGluamVjdChFbGVtZW50UmVmKS5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXHRwcml2YXRlIF9uZ2JEYXRlQWRhcHRlciA9IGluamVjdChOZ2JEYXRlQWRhcHRlcjxhbnk+KTtcblx0cHJpdmF0ZSBfbmdab25lID0gaW5qZWN0KE5nWm9uZSk7XG5cdHByaXZhdGUgX2Rlc3Ryb3lSZWYgPSBpbmplY3QoRGVzdHJveVJlZik7XG5cdHByaXZhdGUgX2luamVjdG9yID0gaW5qZWN0KEluamVjdG9yKTtcblxuXHRwcml2YXRlIF9jb250cm9sVmFsdWU6IE5nYkRhdGUgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfcHVibGljU3RhdGU6IE5nYkRhdGVwaWNrZXJTdGF0ZSA9IDxhbnk+e307XG5cdHByaXZhdGUgX2luaXRpYWxpemVkID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqIFRoZSByZWZlcmVuY2UgdG8gYSBjdXN0b20gY29udGVudCB0ZW1wbGF0ZS5cblx0ICpcblx0ICogQWxsb3dzIHRvIGNvbXBsZXRlbHkgb3ZlcnJpZGUgdGhlIHdheSBkYXRlcGlja2VyIGRpc3BsYXlzIG1vbnRocy5cblx0ICpcblx0ICogU2VlIFtgTmdiRGF0ZXBpY2tlckNvbnRlbnRgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjTmdiRGF0ZXBpY2tlckNvbnRlbnQpIGFuZFxuXHQgKiBbYENvbnRlbnRUZW1wbGF0ZUNvbnRleHRgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjQ29udGVudFRlbXBsYXRlQ29udGV4dCkgZm9yIG1vcmUgZGV0YWlscy5cblx0ICpcblx0ICogQHNpbmNlIDE0LjIuMFxuXHQgKi9cblx0QElucHV0KCkgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxDb250ZW50VGVtcGxhdGVDb250ZXh0Pjtcblx0QENvbnRlbnRDaGlsZChOZ2JEYXRlcGlja2VyQ29udGVudCwgeyBzdGF0aWM6IHRydWUgfSkgY29udGVudFRlbXBsYXRlRnJvbUNvbnRlbnQ/OiBOZ2JEYXRlcGlja2VyQ29udGVudDtcblxuXHQvKipcblx0ICogVGhlIHJlZmVyZW5jZSB0byBhIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgdGhlIGRheS5cblx0ICpcblx0ICogQWxsb3dzIHRvIGNvbXBsZXRlbHkgb3ZlcnJpZGUgdGhlIHdheSBhIGRheSAnY2VsbCcgaW4gdGhlIGNhbGVuZGFyIGlzIGRpc3BsYXllZC5cblx0ICpcblx0ICogU2VlIFtgRGF5VGVtcGxhdGVDb250ZXh0YF0oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvYXBpI0RheVRlbXBsYXRlQ29udGV4dCkgZm9yIHRoZSBkYXRhIHlvdSBnZXQgaW5zaWRlLlxuXHQgKi9cblx0QElucHV0KCkgZGF5VGVtcGxhdGUgPSB0aGlzLl9jb25maWcuZGF5VGVtcGxhdGU7XG5cblx0LyoqXG5cdCAqIFRoZSBjYWxsYmFjayB0byBwYXNzIGFueSBhcmJpdHJhcnkgZGF0YSB0byB0aGUgdGVtcGxhdGUgY2VsbCB2aWEgdGhlXG5cdCAqIFtgRGF5VGVtcGxhdGVDb250ZXh0YF0oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvYXBpI0RheVRlbXBsYXRlQ29udGV4dCkncyBgZGF0YWAgcGFyYW1ldGVyLlxuXHQgKlxuXHQgKiBgY3VycmVudGAgaXMgdGhlIG1vbnRoIHRoYXQgaXMgY3VycmVudGx5IGRpc3BsYXllZCBieSB0aGUgZGF0ZXBpY2tlci5cblx0ICpcblx0ICogQHNpbmNlIDMuMy4wXG5cdCAqL1xuXHRASW5wdXQoKSBkYXlUZW1wbGF0ZURhdGEgPSB0aGlzLl9jb25maWcuZGF5VGVtcGxhdGVEYXRhO1xuXG5cdC8qKlxuXHQgKiBUaGUgbnVtYmVyIG9mIG1vbnRocyB0byBkaXNwbGF5LlxuXHQgKi9cblx0QElucHV0KCkgZGlzcGxheU1vbnRocyA9IHRoaXMuX2NvbmZpZy5kaXNwbGF5TW9udGhzO1xuXG5cdC8qKlxuXHQgKiBUaGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuXHQgKlxuXHQgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnd2Vla2RheScgaXMgMT1Nb24gLi4uIDc9U3VuLlxuXHQgKi9cblx0QElucHV0KCkgZmlyc3REYXlPZldlZWsgPSB0aGlzLl9jb25maWcuZmlyc3REYXlPZldlZWs7XG5cblx0LyoqXG5cdCAqIFRoZSByZWZlcmVuY2UgdG8gdGhlIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgdGhlIGRhdGVwaWNrZXIgZm9vdGVyLlxuXHQgKlxuXHQgKiBAc2luY2UgMy4zLjBcblx0ICovXG5cdEBJbnB1dCgpIGZvb3RlclRlbXBsYXRlID0gdGhpcy5fY29uZmlnLmZvb3RlclRlbXBsYXRlO1xuXG5cdC8qKlxuXHQgKiBUaGUgY2FsbGJhY2sgdG8gbWFyayBzb21lIGRhdGVzIGFzIGRpc2FibGVkLlxuXHQgKlxuXHQgKiBJdCBpcyBjYWxsZWQgZm9yIGVhY2ggbmV3IGRhdGUgd2hlbiBuYXZpZ2F0aW5nIHRvIGEgZGlmZmVyZW50IG1vbnRoLlxuXHQgKlxuXHQgKiBgY3VycmVudGAgaXMgdGhlIG1vbnRoIHRoYXQgaXMgY3VycmVudGx5IGRpc3BsYXllZCBieSB0aGUgZGF0ZXBpY2tlci5cblx0ICovXG5cdEBJbnB1dCgpIG1hcmtEaXNhYmxlZCA9IHRoaXMuX2NvbmZpZy5tYXJrRGlzYWJsZWQ7XG5cblx0LyoqXG5cdCAqIFRoZSBsYXRlc3QgZGF0ZSB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgb3Igc2VsZWN0ZWQuXG5cdCAqXG5cdCAqIElmIG5vdCBwcm92aWRlZCwgJ3llYXInIHNlbGVjdCBib3ggd2lsbCBkaXNwbGF5IDEwIHllYXJzIGFmdGVyIHRoZSBjdXJyZW50IG1vbnRoLlxuXHQgKi9cblx0QElucHV0KCkgbWF4RGF0ZSA9IHRoaXMuX2NvbmZpZy5tYXhEYXRlO1xuXG5cdC8qKlxuXHQgKiBUaGUgZWFybGllc3QgZGF0ZSB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgb3Igc2VsZWN0ZWQuXG5cdCAqXG5cdCAqIElmIG5vdCBwcm92aWRlZCwgJ3llYXInIHNlbGVjdCBib3ggd2lsbCBkaXNwbGF5IDEwIHllYXJzIGJlZm9yZSB0aGUgY3VycmVudCBtb250aC5cblx0ICovXG5cdEBJbnB1dCgpIG1pbkRhdGUgPSB0aGlzLl9jb25maWcubWluRGF0ZTtcblxuXHQvKipcblx0ICogTmF2aWdhdGlvbiB0eXBlLlxuXHQgKlxuXHQgKiAqIGBcInNlbGVjdFwiYCAtIHNlbGVjdCBib3hlcyBmb3IgbW9udGggYW5kIG5hdmlnYXRpb24gYXJyb3dzXG5cdCAqICogYFwiYXJyb3dzXCJgIC0gb25seSBuYXZpZ2F0aW9uIGFycm93c1xuXHQgKiAqIGBcIm5vbmVcImAgLSBubyBuYXZpZ2F0aW9uIHZpc2libGUgYXQgYWxsXG5cdCAqL1xuXHRASW5wdXQoKSBuYXZpZ2F0aW9uID0gdGhpcy5fY29uZmlnLm5hdmlnYXRpb247XG5cblx0LyoqXG5cdCAqIFRoZSB3YXkgb2YgZGlzcGxheWluZyBkYXlzIHRoYXQgZG9uJ3QgYmVsb25nIHRvIHRoZSBjdXJyZW50IG1vbnRoLlxuXHQgKlxuXHQgKiAqIGBcInZpc2libGVcImAgLSBkYXlzIGFyZSB2aXNpYmxlXG5cdCAqICogYFwiaGlkZGVuXCJgIC0gZGF5cyBhcmUgaGlkZGVuLCB3aGl0ZSBzcGFjZSBwcmVzZXJ2ZWRcblx0ICogKiBgXCJjb2xsYXBzZWRcImAgLSBkYXlzIGFyZSBjb2xsYXBzZWQsIHNvIHRoZSBkYXRlcGlja2VyIGhlaWdodCBtaWdodCBjaGFuZ2UgYmV0d2VlbiBtb250aHNcblx0ICpcblx0ICogRm9yIHRoZSAyKyBtb250aHMgdmlldywgZGF5cyBpbiBiZXR3ZWVuIG1vbnRocyBhcmUgbmV2ZXIgc2hvd24uXG5cdCAqL1xuXHRASW5wdXQoKSBvdXRzaWRlRGF5cyA9IHRoaXMuX2NvbmZpZy5vdXRzaWRlRGF5cztcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3ZWVrIG51bWJlcnMgd2lsbCBiZSBkaXNwbGF5ZWQuXG5cdCAqL1xuXHRASW5wdXQoKSBzaG93V2Vla051bWJlcnMgPSB0aGlzLl9jb25maWcuc2hvd1dlZWtOdW1iZXJzO1xuXG5cdC8qKlxuXHQgKiBUaGUgZGF0ZSB0byBvcGVuIGNhbGVuZGFyIHdpdGguXG5cdCAqXG5cdCAqIFdpdGggdGhlIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWMuXG5cdCAqIElmIG5vdGhpbmcgb3IgaW52YWxpZCBkYXRlIGlzIHByb3ZpZGVkLCBjYWxlbmRhciB3aWxsIG9wZW4gd2l0aCBjdXJyZW50IG1vbnRoLlxuXHQgKlxuXHQgKiBZb3UgY291bGQgdXNlIGBuYXZpZ2F0ZVRvKGRhdGUpYCBtZXRob2QgYXMgYW4gYWx0ZXJuYXRpdmUuXG5cdCAqL1xuXHRASW5wdXQoKSBzdGFydERhdGUgPSB0aGlzLl9jb25maWcuc3RhcnREYXRlO1xuXG5cdC8qKlxuXHQgKiBUaGUgd2F5IHdlZWtkYXlzIHNob3VsZCBiZSBkaXNwbGF5ZWQuXG5cdCAqXG5cdCAqICogYHRydWVgIC0gd2Vla2RheXMgYXJlIGRpc3BsYXllZCB1c2luZyBkZWZhdWx0IHdpZHRoXG5cdCAqICogYGZhbHNlYCAtIHdlZWtkYXlzIGFyZSBub3QgZGlzcGxheWVkXG5cdCAqICogYFwic2hvcnRcIiB8IFwibG9uZ1wiIHwgXCJuYXJyb3dcImAgLSB3ZWVrZGF5cyBhcmUgZGlzcGxheWVkIHVzaW5nIHNwZWNpZmllZCB3aWR0aFxuXHQgKlxuXHQgKiBAc2luY2UgOS4xLjBcblx0ICovXG5cdEBJbnB1dCgpIHdlZWtkYXlzID0gdGhpcy5fY29uZmlnLndlZWtkYXlzO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHJpZ2h0IGJlZm9yZSB0aGUgbmF2aWdhdGlvbiBoYXBwZW5zIGFuZCBkaXNwbGF5ZWQgbW9udGggY2hhbmdlcy5cblx0ICpcblx0ICogU2VlIFtgTmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnRgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjTmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnQpIGZvciB0aGUgcGF5bG9hZCBpbmZvLlxuXHQgKi9cblx0QE91dHB1dCgpIG5hdmlnYXRlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudD4oKTtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHVzZXIgc2VsZWN0cyBhIGRhdGUgdXNpbmcga2V5Ym9hcmQgb3IgbW91c2UuXG5cdCAqXG5cdCAqIFRoZSBwYXlsb2FkIG9mIHRoZSBldmVudCBpcyBjdXJyZW50bHkgc2VsZWN0ZWQgYE5nYkRhdGVgLlxuXHQgKlxuXHQgKiBAc2luY2UgNS4yLjBcblx0ICovXG5cdEBPdXRwdXQoKSBkYXRlU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JEYXRlPigpO1xuXG5cdG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG5cdG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdGNvbnN0IGNkID0gaW5qZWN0KENoYW5nZURldGVjdG9yUmVmKTtcblxuXHRcdHRoaXMuX3NlcnZpY2UuZGF0ZVNlbGVjdCQucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQoKSkuc3Vic2NyaWJlKChkYXRlKSA9PiB7XG5cdFx0XHR0aGlzLmRhdGVTZWxlY3QuZW1pdChkYXRlKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuX3NlcnZpY2UubW9kZWwkLnBpcGUodGFrZVVudGlsRGVzdHJveWVkKCkpLnN1YnNjcmliZSgobW9kZWwpID0+IHtcblx0XHRcdGNvbnN0IG5ld0RhdGUgPSBtb2RlbC5maXJzdERhdGUhO1xuXHRcdFx0Y29uc3Qgb2xkRGF0ZSA9IHRoaXMubW9kZWwgPyB0aGlzLm1vZGVsLmZpcnN0RGF0ZSA6IG51bGw7XG5cblx0XHRcdC8vIHVwZGF0ZSBwdWJsaWMgc3RhdGVcblx0XHRcdHRoaXMuX3B1YmxpY1N0YXRlID0ge1xuXHRcdFx0XHRtYXhEYXRlOiBtb2RlbC5tYXhEYXRlLFxuXHRcdFx0XHRtaW5EYXRlOiBtb2RlbC5taW5EYXRlLFxuXHRcdFx0XHRmaXJzdERhdGU6IG1vZGVsLmZpcnN0RGF0ZSEsXG5cdFx0XHRcdGxhc3REYXRlOiBtb2RlbC5sYXN0RGF0ZSEsXG5cdFx0XHRcdGZvY3VzZWREYXRlOiBtb2RlbC5mb2N1c0RhdGUhLFxuXHRcdFx0XHRtb250aHM6IG1vZGVsLm1vbnRocy5tYXAoKHZpZXdNb2RlbCkgPT4gdmlld01vZGVsLmZpcnN0RGF0ZSksXG5cdFx0XHR9O1xuXG5cdFx0XHRsZXQgbmF2aWdhdGlvblByZXZlbnRlZCA9IGZhbHNlO1xuXHRcdFx0Ly8gZW1pdHRpbmcgbmF2aWdhdGlvbiBldmVudCBpZiB0aGUgZmlyc3QgbW9udGggY2hhbmdlc1xuXHRcdFx0aWYgKCFuZXdEYXRlLmVxdWFscyhvbGREYXRlKSkge1xuXHRcdFx0XHR0aGlzLm5hdmlnYXRlLmVtaXQoe1xuXHRcdFx0XHRcdGN1cnJlbnQ6IG9sZERhdGUgPyB7IHllYXI6IG9sZERhdGUueWVhciwgbW9udGg6IG9sZERhdGUubW9udGggfSA6IG51bGwsXG5cdFx0XHRcdFx0bmV4dDogeyB5ZWFyOiBuZXdEYXRlLnllYXIsIG1vbnRoOiBuZXdEYXRlLm1vbnRoIH0sXG5cdFx0XHRcdFx0cHJldmVudERlZmF1bHQ6ICgpID0+IChuYXZpZ2F0aW9uUHJldmVudGVkID0gdHJ1ZSksXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIGNhbid0IHByZXZlbnQgdGhlIHZlcnkgZmlyc3QgbmF2aWdhdGlvblxuXHRcdFx0XHRpZiAobmF2aWdhdGlvblByZXZlbnRlZCAmJiBvbGREYXRlICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhpcy5fc2VydmljZS5vcGVuKG9sZERhdGUpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdTZWxlY3RlZERhdGUgPSBtb2RlbC5zZWxlY3RlZERhdGU7XG5cdFx0XHRjb25zdCBuZXdGb2N1c2VkRGF0ZSA9IG1vZGVsLmZvY3VzRGF0ZTtcblx0XHRcdGNvbnN0IG9sZEZvY3VzZWREYXRlID0gdGhpcy5tb2RlbCA/IHRoaXMubW9kZWwuZm9jdXNEYXRlIDogbnVsbDtcblxuXHRcdFx0dGhpcy5tb2RlbCA9IG1vZGVsO1xuXG5cdFx0XHQvLyBoYW5kbGluZyBzZWxlY3Rpb24gY2hhbmdlXG5cdFx0XHRpZiAoaXNDaGFuZ2VkRGF0ZShuZXdTZWxlY3RlZERhdGUsIHRoaXMuX2NvbnRyb2xWYWx1ZSkpIHtcblx0XHRcdFx0dGhpcy5fY29udHJvbFZhbHVlID0gbmV3U2VsZWN0ZWREYXRlO1xuXHRcdFx0XHR0aGlzLm9uVG91Y2hlZCgpO1xuXHRcdFx0XHR0aGlzLm9uQ2hhbmdlKHRoaXMuX25nYkRhdGVBZGFwdGVyLnRvTW9kZWwobmV3U2VsZWN0ZWREYXRlKSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGhhbmRsaW5nIGZvY3VzIGNoYW5nZVxuXHRcdFx0aWYgKGlzQ2hhbmdlZERhdGUobmV3Rm9jdXNlZERhdGUsIG9sZEZvY3VzZWREYXRlKSAmJiBvbGRGb2N1c2VkRGF0ZSAmJiBtb2RlbC5mb2N1c1Zpc2libGUpIHtcblx0XHRcdFx0dGhpcy5mb2N1cygpO1xuXHRcdFx0fVxuXG5cdFx0XHRjZC5tYXJrRm9yQ2hlY2soKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiAgUmV0dXJucyB0aGUgcmVhZG9ubHkgcHVibGljIHN0YXRlIG9mIHRoZSBkYXRlcGlja2VyXG5cdCAqXG5cdCAqIEBzaW5jZSA1LjIuMFxuXHQgKi9cblx0Z2V0IHN0YXRlKCk6IE5nYkRhdGVwaWNrZXJTdGF0ZSB7XG5cdFx0cmV0dXJuIHRoaXMuX3B1YmxpY1N0YXRlO1xuXHR9XG5cblx0LyoqXG5cdCAqICBSZXR1cm5zIHRoZSBjYWxlbmRhciBzZXJ2aWNlIHVzZWQgaW4gdGhlIHNwZWNpZmljIGRhdGVwaWNrZXIgaW5zdGFuY2UuXG5cdCAqXG5cdCAqICBAc2luY2UgNS4zLjBcblx0ICovXG5cdGdldCBjYWxlbmRhcigpOiBOZ2JDYWxlbmRhciB7XG5cdFx0cmV0dXJuIHRoaXMuX2NhbGVuZGFyO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGkxOG4gc2VydmljZSB1c2VkIGluIHRoZSBzcGVjaWZpYyBkYXRlcGlja2VyIGluc3RhbmNlLlxuXHQgKlxuXHQgKiBAc2luY2UgMTQuMi4wXG5cdCAqL1xuXHRnZXQgaTE4bigpOiBOZ2JEYXRlcGlja2VySTE4biB7XG5cdFx0cmV0dXJuIHRoaXMuX2kxOG47XG5cdH1cblxuXHQvKipcblx0ICogIEZvY3VzZXMgb24gZ2l2ZW4gZGF0ZS5cblx0ICovXG5cdGZvY3VzRGF0ZShkYXRlPzogTmdiRGF0ZVN0cnVjdCB8IG51bGwpOiB2b2lkIHtcblx0XHR0aGlzLl9zZXJ2aWNlLmZvY3VzKE5nYkRhdGUuZnJvbShkYXRlKSk7XG5cdH1cblxuXHQvKipcblx0ICogIFNlbGVjdHMgZm9jdXNlZCBkYXRlLlxuXHQgKi9cblx0Zm9jdXNTZWxlY3QoKTogdm9pZCB7XG5cdFx0dGhpcy5fc2VydmljZS5mb2N1c1NlbGVjdCgpO1xuXHR9XG5cblx0Zm9jdXMoKSB7XG5cdFx0YWZ0ZXJOZXh0UmVuZGVyKFxuXHRcdFx0KCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdkaXYubmdiLWRwLWRheVt0YWJpbmRleD1cIjBcIl0nKT8uZm9jdXMoKTtcblx0XHRcdH0sXG5cdFx0XHR7IHBoYXNlOiBBZnRlclJlbmRlclBoYXNlLlJlYWQsIGluamVjdG9yOiB0aGlzLl9pbmplY3RvciB9LFxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGVzIHRvIHRoZSBwcm92aWRlZCBkYXRlLlxuXHQgKlxuXHQgKiBXaXRoIHRoZSBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ21vbnRoJyBpcyAxPUphbiAuLi4gMTI9RGVjLlxuXHQgKiBJZiBub3RoaW5nIG9yIGludmFsaWQgZGF0ZSBwcm92aWRlZCBjYWxlbmRhciB3aWxsIG9wZW4gY3VycmVudCBtb250aC5cblx0ICpcblx0ICogVXNlIHRoZSBgW3N0YXJ0RGF0ZV1gIGlucHV0IGFzIGFuIGFsdGVybmF0aXZlLlxuXHQgKi9cblx0bmF2aWdhdGVUbyhkYXRlPzogeyB5ZWFyOiBudW1iZXI7IG1vbnRoOiBudW1iZXI7IGRheT86IG51bWJlciB9KSB7XG5cdFx0dGhpcy5fc2VydmljZS5vcGVuKE5nYkRhdGUuZnJvbShkYXRlID8gKGRhdGUuZGF5ID8gKGRhdGUgYXMgTmdiRGF0ZVN0cnVjdCkgOiB7IC4uLmRhdGUsIGRheTogMSB9KSA6IG51bGwpKTtcblx0fVxuXG5cdG5nQWZ0ZXJWaWV3SW5pdCgpIHtcblx0XHR0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXHRcdFx0Y29uc3QgZm9jdXNJbnMkID0gZnJvbUV2ZW50PEZvY3VzRXZlbnQ+KHRoaXMuX2NvbnRlbnRFbC5uYXRpdmVFbGVtZW50LCAnZm9jdXNpbicpO1xuXHRcdFx0Y29uc3QgZm9jdXNPdXRzJCA9IGZyb21FdmVudDxGb2N1c0V2ZW50Pih0aGlzLl9jb250ZW50RWwubmF0aXZlRWxlbWVudCwgJ2ZvY3Vzb3V0Jyk7XG5cblx0XHRcdC8vIHdlJ3JlIGNoYW5naW5nICdmb2N1c1Zpc2libGUnIG9ubHkgd2hlbiBlbnRlcmluZyBvciBsZWF2aW5nIG1vbnRocyB2aWV3XG5cdFx0XHQvLyBhbmQgaWdub3JpbmcgYWxsIGZvY3VzIGV2ZW50cyB3aGVyZSBib3RoICd0YXJnZXQnIGFuZCAncmVsYXRlZCcgdGFyZ2V0IGFyZSBkYXkgY2VsbHNcblx0XHRcdG1lcmdlKGZvY3VzSW5zJCwgZm9jdXNPdXRzJClcblx0XHRcdFx0LnBpcGUoXG5cdFx0XHRcdFx0ZmlsdGVyKChmb2N1c0V2ZW50KSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0YXJnZXQgPSBmb2N1c0V2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG5cdFx0XHRcdFx0XHRjb25zdCByZWxhdGVkVGFyZ2V0ID0gZm9jdXNFdmVudC5yZWxhdGVkVGFyZ2V0IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcblxuXHRcdFx0XHRcdFx0cmV0dXJuICEoXG5cdFx0XHRcdFx0XHRcdHRhcmdldD8uY2xhc3NMaXN0LmNvbnRhaW5zKCduZ2ItZHAtZGF5JykgJiZcblx0XHRcdFx0XHRcdFx0cmVsYXRlZFRhcmdldD8uY2xhc3NMaXN0LmNvbnRhaW5zKCduZ2ItZHAtZGF5JykgJiZcblx0XHRcdFx0XHRcdFx0dGhpcy5fbmF0aXZlRWxlbWVudC5jb250YWlucyh0YXJnZXQpICYmXG5cdFx0XHRcdFx0XHRcdHRoaXMuX25hdGl2ZUVsZW1lbnQuY29udGFpbnMocmVsYXRlZFRhcmdldClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0dGFrZVVudGlsRGVzdHJveWVkKHRoaXMuX2Rlc3Ryb3lSZWYpLFxuXHRcdFx0XHQpXG5cdFx0XHRcdC5zdWJzY3JpYmUoKHsgdHlwZSB9KSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuX3NlcnZpY2Uuc2V0KHsgZm9jdXNWaXNpYmxlOiB0eXBlID09PSAnZm9jdXNpbicgfSkpKTtcblx0XHR9KTtcblx0fVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdGlmICh0aGlzLm1vZGVsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IGlucHV0czogRGF0ZXBpY2tlclNlcnZpY2VJbnB1dHMgPSB7fTtcblx0XHRcdFtcblx0XHRcdFx0J2RheVRlbXBsYXRlRGF0YScsXG5cdFx0XHRcdCdkaXNwbGF5TW9udGhzJyxcblx0XHRcdFx0J21hcmtEaXNhYmxlZCcsXG5cdFx0XHRcdCdmaXJzdERheU9mV2VlaycsXG5cdFx0XHRcdCduYXZpZ2F0aW9uJyxcblx0XHRcdFx0J21pbkRhdGUnLFxuXHRcdFx0XHQnbWF4RGF0ZScsXG5cdFx0XHRcdCdvdXRzaWRlRGF5cycsXG5cdFx0XHRcdCd3ZWVrZGF5cycsXG5cdFx0XHRdLmZvckVhY2goKG5hbWUpID0+IChpbnB1dHNbbmFtZV0gPSB0aGlzW25hbWVdKSk7XG5cdFx0XHR0aGlzLl9zZXJ2aWNlLnNldChpbnB1dHMpO1xuXG5cdFx0XHR0aGlzLm5hdmlnYXRlVG8odGhpcy5zdGFydERhdGUpO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMuZGF5VGVtcGxhdGUpIHtcblx0XHRcdHRoaXMuZGF5VGVtcGxhdGUgPSB0aGlzLl9kZWZhdWx0RGF5VGVtcGxhdGU7XG5cdFx0fVxuXHRcdHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcblx0fVxuXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcblx0XHRjb25zdCBpbnB1dHM6IERhdGVwaWNrZXJTZXJ2aWNlSW5wdXRzID0ge307XG5cdFx0W1xuXHRcdFx0J2RheVRlbXBsYXRlRGF0YScsXG5cdFx0XHQnZGlzcGxheU1vbnRocycsXG5cdFx0XHQnbWFya0Rpc2FibGVkJyxcblx0XHRcdCdmaXJzdERheU9mV2VlaycsXG5cdFx0XHQnbmF2aWdhdGlvbicsXG5cdFx0XHQnbWluRGF0ZScsXG5cdFx0XHQnbWF4RGF0ZScsXG5cdFx0XHQnb3V0c2lkZURheXMnLFxuXHRcdFx0J3dlZWtkYXlzJyxcblx0XHRdXG5cdFx0XHQuZmlsdGVyKChuYW1lKSA9PiBuYW1lIGluIGNoYW5nZXMpXG5cdFx0XHQuZm9yRWFjaCgobmFtZSkgPT4gKGlucHV0c1tuYW1lXSA9IHRoaXNbbmFtZV0pKTtcblx0XHR0aGlzLl9zZXJ2aWNlLnNldChpbnB1dHMpO1xuXG5cdFx0aWYgKCdzdGFydERhdGUnIGluIGNoYW5nZXMgJiYgdGhpcy5faW5pdGlhbGl6ZWQpIHtcblx0XHRcdGNvbnN0IHsgY3VycmVudFZhbHVlLCBwcmV2aW91c1ZhbHVlIH0gPSBjaGFuZ2VzLnN0YXJ0RGF0ZTtcblx0XHRcdGlmIChpc0NoYW5nZWRNb250aChwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUpKSB7XG5cdFx0XHRcdHRoaXMubmF2aWdhdGVUbyh0aGlzLnN0YXJ0RGF0ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0b25EYXRlU2VsZWN0KGRhdGU6IE5nYkRhdGUpIHtcblx0XHR0aGlzLl9zZXJ2aWNlLmZvY3VzKGRhdGUpO1xuXHRcdHRoaXMuX3NlcnZpY2Uuc2VsZWN0KGRhdGUsIHsgZW1pdEV2ZW50OiB0cnVlIH0pO1xuXHR9XG5cblx0b25OYXZpZ2F0ZURhdGVTZWxlY3QoZGF0ZTogTmdiRGF0ZSkge1xuXHRcdHRoaXMuX3NlcnZpY2Uub3BlbihkYXRlKTtcblx0fVxuXG5cdG9uTmF2aWdhdGVFdmVudChldmVudDogTmF2aWdhdGlvbkV2ZW50KSB7XG5cdFx0c3dpdGNoIChldmVudCkge1xuXHRcdFx0Y2FzZSBOYXZpZ2F0aW9uRXZlbnQuUFJFVjpcblx0XHRcdFx0dGhpcy5fc2VydmljZS5vcGVuKHRoaXMuX2NhbGVuZGFyLmdldFByZXYodGhpcy5tb2RlbC5maXJzdERhdGUhLCAnbScsIDEpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIE5hdmlnYXRpb25FdmVudC5ORVhUOlxuXHRcdFx0XHR0aGlzLl9zZXJ2aWNlLm9wZW4odGhpcy5fY2FsZW5kYXIuZ2V0TmV4dCh0aGlzLm1vZGVsLmZpcnN0RGF0ZSEsICdtJywgMSkpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRyZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7XG5cdFx0dGhpcy5vbkNoYW5nZSA9IGZuO1xuXHR9XG5cblx0cmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQge1xuXHRcdHRoaXMub25Ub3VjaGVkID0gZm47XG5cdH1cblxuXHRzZXREaXNhYmxlZFN0YXRlKGRpc2FibGVkOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fc2VydmljZS5zZXQoeyBkaXNhYmxlZCB9KTtcblx0fVxuXG5cdHdyaXRlVmFsdWUodmFsdWUpIHtcblx0XHR0aGlzLl9jb250cm9sVmFsdWUgPSBOZ2JEYXRlLmZyb20odGhpcy5fbmdiRGF0ZUFkYXB0ZXIuZnJvbU1vZGVsKHZhbHVlKSk7XG5cdFx0dGhpcy5fc2VydmljZS5zZWxlY3QodGhpcy5fY29udHJvbFZhbHVlKTtcblx0fVxufVxuIl19