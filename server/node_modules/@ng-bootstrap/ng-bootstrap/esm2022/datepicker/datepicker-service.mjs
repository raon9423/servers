import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { inject, Injectable } from '@angular/core';
import { isInteger, toInteger } from '../util/util';
import { Subject } from 'rxjs';
import { buildMonths, checkDateInRange, checkMinBeforeMax, generateSelectBoxMonths, generateSelectBoxYears, isChangedDate, isChangedMonth, isDateSelectable, nextMonthDisabled, prevMonthDisabled, } from './datepicker-tools';
import { filter } from 'rxjs/operators';
import { NgbDatepickerI18n } from './datepicker-i18n';
import * as i0 from "@angular/core";
export class NgbDatepickerService {
    constructor() {
        this._VALIDATORS = {
            dayTemplateData: (dayTemplateData) => {
                if (this._state.dayTemplateData !== dayTemplateData) {
                    return { dayTemplateData };
                }
            },
            displayMonths: (displayMonths) => {
                displayMonths = toInteger(displayMonths);
                if (isInteger(displayMonths) && displayMonths > 0 && this._state.displayMonths !== displayMonths) {
                    return { displayMonths };
                }
            },
            disabled: (disabled) => {
                if (this._state.disabled !== disabled) {
                    return { disabled };
                }
            },
            firstDayOfWeek: (firstDayOfWeek) => {
                firstDayOfWeek = toInteger(firstDayOfWeek);
                if (isInteger(firstDayOfWeek) && firstDayOfWeek >= 0 && this._state.firstDayOfWeek !== firstDayOfWeek) {
                    return { firstDayOfWeek };
                }
            },
            focusVisible: (focusVisible) => {
                if (this._state.focusVisible !== focusVisible && !this._state.disabled) {
                    return { focusVisible };
                }
            },
            markDisabled: (markDisabled) => {
                if (this._state.markDisabled !== markDisabled) {
                    return { markDisabled };
                }
            },
            maxDate: (date) => {
                const maxDate = this.toValidDate(date, null);
                if (isChangedDate(this._state.maxDate, maxDate)) {
                    return { maxDate };
                }
            },
            minDate: (date) => {
                const minDate = this.toValidDate(date, null);
                if (isChangedDate(this._state.minDate, minDate)) {
                    return { minDate };
                }
            },
            navigation: (navigation) => {
                if (this._state.navigation !== navigation) {
                    return { navigation };
                }
            },
            outsideDays: (outsideDays) => {
                if (this._state.outsideDays !== outsideDays) {
                    return { outsideDays };
                }
            },
            weekdays: (weekdays) => {
                const weekdayWidth = weekdays === true || weekdays === false ? 'narrow' : weekdays;
                const weekdaysVisible = weekdays === true || weekdays === false ? weekdays : true;
                if (this._state.weekdayWidth !== weekdayWidth || this._state.weekdaysVisible !== weekdaysVisible) {
                    return { weekdayWidth, weekdaysVisible };
                }
            },
        };
        this._calendar = inject(NgbCalendar);
        this._i18n = inject(NgbDatepickerI18n);
        this._model$ = new Subject();
        this._dateSelect$ = new Subject();
        this._state = {
            dayTemplateData: null,
            markDisabled: null,
            maxDate: null,
            minDate: null,
            disabled: false,
            displayMonths: 1,
            firstDate: null,
            firstDayOfWeek: 1,
            lastDate: null,
            focusDate: null,
            focusVisible: false,
            months: [],
            navigation: 'select',
            outsideDays: 'visible',
            prevDisabled: false,
            nextDisabled: false,
            selectedDate: null,
            selectBoxes: { years: [], months: [] },
            weekdayWidth: 'narrow',
            weekdaysVisible: true,
        };
    }
    get model$() {
        return this._model$.pipe(filter((model) => model.months.length > 0));
    }
    get dateSelect$() {
        return this._dateSelect$.pipe(filter((date) => date !== null));
    }
    set(options) {
        let patch = Object.keys(options)
            .map((key) => this._VALIDATORS[key](options[key]))
            .reduce((obj, part) => ({ ...obj, ...part }), {});
        if (Object.keys(patch).length > 0) {
            this._nextState(patch);
        }
    }
    focus(date) {
        const focusedDate = this.toValidDate(date, null);
        if (focusedDate != null && !this._state.disabled && isChangedDate(this._state.focusDate, focusedDate)) {
            this._nextState({ focusDate: date });
        }
    }
    focusSelect() {
        if (isDateSelectable(this._state.focusDate, this._state)) {
            this.select(this._state.focusDate, { emitEvent: true });
        }
    }
    open(date) {
        const firstDate = this.toValidDate(date, this._calendar.getToday());
        if (firstDate != null &&
            !this._state.disabled &&
            (!this._state.firstDate || isChangedMonth(this._state.firstDate, firstDate))) {
            this._nextState({ firstDate });
        }
    }
    select(date, options = {}) {
        const selectedDate = this.toValidDate(date, null);
        if (selectedDate != null && !this._state.disabled) {
            if (isChangedDate(this._state.selectedDate, selectedDate)) {
                this._nextState({ selectedDate });
            }
            if (options.emitEvent && isDateSelectable(selectedDate, this._state)) {
                this._dateSelect$.next(selectedDate);
            }
        }
    }
    toValidDate(date, defaultValue) {
        const ngbDate = NgbDate.from(date);
        if (defaultValue === undefined) {
            defaultValue = this._calendar.getToday();
        }
        return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
    }
    getMonth(struct) {
        for (let month of this._state.months) {
            if (struct.month === month.number && struct.year === month.year) {
                return month;
            }
        }
        throw new Error(`month ${struct.month} of year ${struct.year} not found`);
    }
    _nextState(patch) {
        const newState = this._updateState(patch);
        this._patchContexts(newState);
        this._state = newState;
        this._model$.next(this._state);
    }
    _patchContexts(state) {
        const { months, displayMonths, selectedDate, focusDate, focusVisible, disabled, outsideDays } = state;
        state.months.forEach((month) => {
            month.weeks.forEach((week) => {
                week.days.forEach((day) => {
                    // patch focus flag
                    if (focusDate) {
                        day.context.focused = focusDate.equals(day.date) && focusVisible;
                    }
                    // calculating tabindex
                    day.tabindex =
                        !disabled && focusDate && day.date.equals(focusDate) && focusDate.month === month.number ? 0 : -1;
                    // override context disabled
                    if (disabled === true) {
                        day.context.disabled = true;
                    }
                    // patch selection flag
                    if (selectedDate !== undefined) {
                        day.context.selected = selectedDate !== null && selectedDate.equals(day.date);
                    }
                    // visibility
                    if (month.number !== day.date.month) {
                        day.hidden =
                            outsideDays === 'hidden' ||
                                outsideDays === 'collapsed' ||
                                (displayMonths > 1 &&
                                    day.date.after(months[0].firstDate) &&
                                    day.date.before(months[displayMonths - 1].lastDate));
                    }
                });
            });
        });
    }
    _updateState(patch) {
        // patching fields
        const state = Object.assign({}, this._state, patch);
        let startDate = state.firstDate;
        // min/max dates changed
        if ('minDate' in patch || 'maxDate' in patch) {
            checkMinBeforeMax(state.minDate, state.maxDate);
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
        }
        // disabled
        if ('disabled' in patch) {
            state.focusVisible = false;
        }
        // initial rebuild via 'select()'
        if ('selectedDate' in patch && this._state.months.length === 0) {
            startDate = state.selectedDate;
        }
        // terminate early if only focus visibility was changed
        if ('focusVisible' in patch) {
            return state;
        }
        // focus date changed
        if ('focusDate' in patch) {
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
            // nothing to rebuild if only focus changed and it is still visible
            if (state.months.length !== 0 &&
                state.focusDate &&
                !state.focusDate.before(state.firstDate) &&
                !state.focusDate.after(state.lastDate)) {
                return state;
            }
        }
        // first date changed
        if ('firstDate' in patch) {
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.firstDate;
        }
        // rebuilding months
        if (startDate) {
            const forceRebuild = 'dayTemplateData' in patch ||
                'firstDayOfWeek' in patch ||
                'markDisabled' in patch ||
                'minDate' in patch ||
                'maxDate' in patch ||
                'disabled' in patch ||
                'outsideDays' in patch ||
                'weekdaysVisible' in patch;
            const months = buildMonths(this._calendar, startDate, state, this._i18n, forceRebuild);
            // updating months and boundary dates
            state.months = months;
            state.firstDate = months[0].firstDate;
            state.lastDate = months[months.length - 1].lastDate;
            // reset selected date if 'markDisabled' returns true
            if ('selectedDate' in patch && !isDateSelectable(state.selectedDate, state)) {
                state.selectedDate = null;
            }
            // adjusting focus after months were built
            if ('firstDate' in patch) {
                if (!state.focusDate || state.focusDate.before(state.firstDate) || state.focusDate.after(state.lastDate)) {
                    state.focusDate = startDate;
                }
            }
            // adjusting months/years for the select box navigation
            const yearChanged = !this._state.firstDate || this._state.firstDate.year !== state.firstDate.year;
            const monthChanged = !this._state.firstDate || this._state.firstDate.month !== state.firstDate.month;
            if (state.navigation === 'select') {
                // years ->  boundaries (min/max were changed)
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.years.length === 0 || yearChanged) {
                    state.selectBoxes.years = generateSelectBoxYears(state.firstDate, state.minDate, state.maxDate);
                }
                // months -> when current year or boundaries change
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.months.length === 0 || yearChanged) {
                    state.selectBoxes.months = generateSelectBoxMonths(this._calendar, state.firstDate, state.minDate, state.maxDate);
                }
            }
            else {
                state.selectBoxes = { years: [], months: [] };
            }
            // updating navigation arrows -> boundaries change (min/max) or month/year changes
            if ((state.navigation === 'arrows' || state.navigation === 'select') &&
                (monthChanged || yearChanged || 'minDate' in patch || 'maxDate' in patch || 'disabled' in patch)) {
                state.prevDisabled = state.disabled || prevMonthDisabled(this._calendar, state.firstDate, state.minDate);
                state.nextDisabled = state.disabled || nextMonthDisabled(this._calendar, state.lastDate, state.maxDate);
            }
        }
        return state;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBR3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3BELE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUNOLFdBQVcsRUFDWCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLHVCQUF1QixFQUN2QixzQkFBc0IsRUFDdEIsYUFBYSxFQUNiLGNBQWMsRUFDZCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGlCQUFpQixHQUNqQixNQUFNLG9CQUFvQixDQUFDO0FBRTVCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7QUFpQnRELE1BQU0sT0FBTyxvQkFBb0I7SUFEakM7UUFFUyxnQkFBVyxHQUVmO1lBQ0gsZUFBZSxFQUFFLENBQUMsZUFBbUMsRUFBRSxFQUFFO2dCQUN4RCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxLQUFLLGVBQWUsRUFBRSxDQUFDO29CQUNyRCxPQUFPLEVBQUUsZUFBZSxFQUFFLENBQUM7Z0JBQzVCLENBQUM7WUFDRixDQUFDO1lBQ0QsYUFBYSxFQUFFLENBQUMsYUFBcUIsRUFBRSxFQUFFO2dCQUN4QyxhQUFhLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLFNB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b250ZW50IjpbImltcG9ydCB7IE5nYkNhbGVuZGFyIH0gZnJvbSAnLi9uZ2ItY2FsZW5kYXInO1xuaW1wb3J0IHsgTmdiRGF0ZSB9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHsgTmdiRGF0ZVN0cnVjdCB9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7IERhdGVwaWNrZXJWaWV3TW9kZWwsIE5nYkRheVRlbXBsYXRlRGF0YSwgTmdiTWFya0Rpc2FibGVkIH0gZnJvbSAnLi9kYXRlcGlja2VyLXZpZXctbW9kZWwnO1xuaW1wb3J0IHsgaW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc0ludGVnZXIsIHRvSW50ZWdlciB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuXHRidWlsZE1vbnRocyxcblx0Y2hlY2tEYXRlSW5SYW5nZSxcblx0Y2hlY2tNaW5CZWZvcmVNYXgsXG5cdGdlbmVyYXRlU2VsZWN0Qm94TW9udGhzLFxuXHRnZW5lcmF0ZVNlbGVjdEJveFllYXJzLFxuXHRpc0NoYW5nZWREYXRlLFxuXHRpc0NoYW5nZWRNb250aCxcblx0aXNEYXRlU2VsZWN0YWJsZSxcblx0bmV4dE1vbnRoRGlzYWJsZWQsXG5cdHByZXZNb250aERpc2FibGVkLFxufSBmcm9tICcuL2RhdGVwaWNrZXItdG9vbHMnO1xuXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOZ2JEYXRlcGlja2VySTE4biB9IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcblxuZXhwb3J0IHR5cGUgRGF0ZXBpY2tlclNlcnZpY2VJbnB1dHMgPSBQYXJ0aWFsPHtcblx0ZGF5VGVtcGxhdGVEYXRhOiBOZ2JEYXlUZW1wbGF0ZURhdGE7XG5cdGRpc3BsYXlNb250aHM6IG51bWJlcjtcblx0ZGlzYWJsZWQ6IGJvb2xlYW47XG5cdGZpcnN0RGF5T2ZXZWVrOiBudW1iZXI7XG5cdGZvY3VzVmlzaWJsZTogYm9vbGVhbjtcblx0bWFya0Rpc2FibGVkOiBOZ2JNYXJrRGlzYWJsZWQ7XG5cdG1heERhdGU6IE5nYkRhdGUgfCBudWxsO1xuXHRtaW5EYXRlOiBOZ2JEYXRlIHwgbnVsbDtcblx0bmF2aWdhdGlvbjogJ3NlbGVjdCcgfCAnYXJyb3dzJyB8ICdub25lJztcblx0b3V0c2lkZURheXM6ICd2aXNpYmxlJyB8ICdjb2xsYXBzZWQnIHwgJ2hpZGRlbic7XG5cdHdlZWtkYXlzOiBFeGNsdWRlPEludGwuRGF0ZVRpbWVGb3JtYXRPcHRpb25zWyd3ZWVrZGF5J10sIHVuZGVmaW5lZD4gfCBib29sZWFuO1xufT47XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyU2VydmljZSB7XG5cdHByaXZhdGUgX1ZBTElEQVRPUlM6IHtcblx0XHRbSyBpbiBrZXlvZiBEYXRlcGlja2VyU2VydmljZUlucHV0c106ICh2OiBEYXRlcGlja2VyU2VydmljZUlucHV0c1tLXSkgPT4gUGFydGlhbDxEYXRlcGlja2VyVmlld01vZGVsPiB8IHZvaWQ7XG5cdH0gPSB7XG5cdFx0ZGF5VGVtcGxhdGVEYXRhOiAoZGF5VGVtcGxhdGVEYXRhOiBOZ2JEYXlUZW1wbGF0ZURhdGEpID0+IHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZS5kYXlUZW1wbGF0ZURhdGEgIT09IGRheVRlbXBsYXRlRGF0YSkge1xuXHRcdFx0XHRyZXR1cm4geyBkYXlUZW1wbGF0ZURhdGEgfTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGRpc3BsYXlNb250aHM6IChkaXNwbGF5TW9udGhzOiBudW1iZXIpID0+IHtcblx0XHRcdGRpc3BsYXlNb250aHMgPSB0b0ludGVnZXIoZGlzcGxheU1vbnRocyk7XG5cdFx0XHRpZiAoaXNJbnRlZ2VyKGRpc3BsYXlNb250aHMpICYmIGRpc3BsYXlNb250aHMgPiAwICYmIHRoaXMuX3N0YXRlLmRpc3BsYXlNb250aHMgIT09IGRpc3BsYXlNb250aHMpIHtcblx0XHRcdFx0cmV0dXJuIHsgZGlzcGxheU1vbnRocyB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGlzYWJsZWQ6IChkaXNhYmxlZDogYm9vbGVhbikgPT4ge1xuXHRcdFx0aWYgKHRoaXMuX3N0YXRlLmRpc2FibGVkICE9PSBkaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm4geyBkaXNhYmxlZCB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Zmlyc3REYXlPZldlZWs6IChmaXJzdERheU9mV2VlazogbnVtYmVyKSA9PiB7XG5cdFx0XHRmaXJzdERheU9mV2VlayA9IHRvSW50ZWdlcihmaXJzdERheU9mV2Vlayk7XG5cdFx0XHRpZiAoaXNJbnRlZ2VyKGZpcnN0RGF5T2ZXZWVrKSAmJiBmaXJzdERheU9mV2VlayA+PSAwICYmIHRoaXMuX3N0YXRlLmZpcnN0RGF5T2ZXZWVrICE9PSBmaXJzdERheU9mV2Vlaykge1xuXHRcdFx0XHRyZXR1cm4geyBmaXJzdERheU9mV2VlayB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Zm9jdXNWaXNpYmxlOiAoZm9jdXNWaXNpYmxlOiBib29sZWFuKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5fc3RhdGUuZm9jdXNWaXNpYmxlICE9PSBmb2N1c1Zpc2libGUgJiYgIXRoaXMuX3N0YXRlLmRpc2FibGVkKSB7XG5cdFx0XHRcdHJldHVybiB7IGZvY3VzVmlzaWJsZSB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWFya0Rpc2FibGVkOiAobWFya0Rpc2FibGVkOiBOZ2JNYXJrRGlzYWJsZWQpID0+IHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZS5tYXJrRGlzYWJsZWQgIT09IG1hcmtEaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm4geyBtYXJrRGlzYWJsZWQgfTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG1heERhdGU6IChkYXRlOiBOZ2JEYXRlIHwgbnVsbCkgPT4ge1xuXHRcdFx0Y29uc3QgbWF4RGF0ZSA9IHRoaXMudG9WYWxpZERhdGUoZGF0ZSwgbnVsbCk7XG5cdFx0XHRpZiAoaXNDaGFuZ2VkRGF0ZSh0aGlzLl9zdGF0ZS5tYXhEYXRlLCBtYXhEYXRlKSkge1xuXHRcdFx0XHRyZXR1cm4geyBtYXhEYXRlIH07XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtaW5EYXRlOiAoZGF0ZTogTmdiRGF0ZSB8IG51bGwpID0+IHtcblx0XHRcdGNvbnN0IG1pbkRhdGUgPSB0aGlzLnRvVmFsaWREYXRlKGRhdGUsIG51bGwpO1xuXHRcdFx0aWYgKGlzQ2hhbmdlZERhdGUodGhpcy5fc3RhdGUubWluRGF0ZSwgbWluRGF0ZSkpIHtcblx0XHRcdFx0cmV0dXJuIHsgbWluRGF0ZSB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bmF2aWdhdGlvbjogKG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZScpID0+IHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZS5uYXZpZ2F0aW9uICE9PSBuYXZpZ2F0aW9uKSB7XG5cdFx0XHRcdHJldHVybiB7IG5hdmlnYXRpb24gfTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG91dHNpZGVEYXlzOiAob3V0c2lkZURheXM6ICd2aXNpYmxlJyB8ICdjb2xsYXBzZWQnIHwgJ2hpZGRlbicpID0+IHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZS5vdXRzaWRlRGF5cyAhPT0gb3V0c2lkZURheXMpIHtcblx0XHRcdFx0cmV0dXJuIHsgb3V0c2lkZURheXMgfTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHdlZWtkYXlzOiAod2Vla2RheXM6IGJvb2xlYW4gfCBFeGNsdWRlPEludGwuRGF0ZVRpbWVGb3JtYXRPcHRpb25zWyd3ZWVrZGF5J10sIHVuZGVmaW5lZD4pID0+IHtcblx0XHRcdGNvbnN0IHdlZWtkYXlXaWR0aCA9IHdlZWtkYXlzID09PSB0cnVlIHx8IHdlZWtkYXlzID09PSBmYWxzZSA/ICduYXJyb3cnIDogd2Vla2RheXM7XG5cdFx0XHRjb25zdCB3ZWVrZGF5c1Zpc2libGUgPSB3ZWVrZGF5cyA9PT0gdHJ1ZSB8fCB3ZWVrZGF5cyA9PT0gZmFsc2UgPyB3ZWVrZGF5cyA6IHRydWU7XG5cdFx0XHRpZiAodGhpcy5fc3RhdGUud2Vla2RheVdpZHRoICE9PSB3ZWVrZGF5V2lkdGggfHwgdGhpcy5fc3RhdGUud2Vla2RheXNWaXNpYmxlICE9PSB3ZWVrZGF5c1Zpc2libGUpIHtcblx0XHRcdFx0cmV0dXJuIHsgd2Vla2RheVdpZHRoLCB3ZWVrZGF5c1Zpc2libGUgfTtcblx0XHRcdH1cblx0XHR9LFxuXHR9O1xuXG5cdHByaXZhdGUgX2NhbGVuZGFyID0gaW5qZWN0KE5nYkNhbGVuZGFyKTtcblx0cHJpdmF0ZSBfaTE4biA9IGluamVjdChOZ2JEYXRlcGlja2VySTE4bik7XG5cblx0cHJpdmF0ZSBfbW9kZWwkID0gbmV3IFN1YmplY3Q8RGF0ZXBpY2tlclZpZXdNb2RlbD4oKTtcblxuXHRwcml2YXRlIF9kYXRlU2VsZWN0JCA9IG5ldyBTdWJqZWN0PE5nYkRhdGU+KCk7XG5cblx0cHJpdmF0ZSBfc3RhdGU6IERhdGVwaWNrZXJWaWV3TW9kZWwgPSB7XG5cdFx0ZGF5VGVtcGxhdGVEYXRhOiBudWxsLFxuXHRcdG1hcmtEaXNhYmxlZDogbnVsbCxcblx0XHRtYXhEYXRlOiBudWxsLFxuXHRcdG1pbkRhdGU6IG51bGwsXG5cdFx0ZGlzYWJsZWQ6IGZhbHNlLFxuXHRcdGRpc3BsYXlNb250aHM6IDEsXG5cdFx0Zmlyc3REYXRlOiBudWxsLFxuXHRcdGZpcnN0RGF5T2ZXZWVrOiAxLFxuXHRcdGxhc3REYXRlOiBudWxsLFxuXHRcdGZvY3VzRGF0ZTogbnVsbCxcblx0XHRmb2N1c1Zpc2libGU6IGZhbHNlLFxuXHRcdG1vbnRoczogW10sXG5cdFx0bmF2aWdhdGlvbjogJ3NlbGVjdCcsXG5cdFx0b3V0c2lkZURheXM6ICd2aXNpYmxlJyxcblx0XHRwcmV2RGlzYWJsZWQ6IGZhbHNlLFxuXHRcdG5leHREaXNhYmxlZDogZmFsc2UsXG5cdFx0c2VsZWN0ZWREYXRlOiBudWxsLFxuXHRcdHNlbGVjdEJveGVzOiB7IHllYXJzOiBbXSwgbW9udGhzOiBbXSB9LFxuXHRcdHdlZWtkYXlXaWR0aDogJ25hcnJvdycsXG5cdFx0d2Vla2RheXNWaXNpYmxlOiB0cnVlLFxuXHR9O1xuXG5cdGdldCBtb2RlbCQoKTogT2JzZXJ2YWJsZTxEYXRlcGlja2VyVmlld01vZGVsPiB7XG5cdFx0cmV0dXJuIHRoaXMuX21vZGVsJC5waXBlKGZpbHRlcigobW9kZWwpID0+IG1vZGVsLm1vbnRocy5sZW5ndGggPiAwKSk7XG5cdH1cblxuXHRnZXQgZGF0ZVNlbGVjdCQoKTogT2JzZXJ2YWJsZTxOZ2JEYXRlPiB7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGVTZWxlY3QkLnBpcGUoZmlsdGVyKChkYXRlKSA9PiBkYXRlICE9PSBudWxsKSk7XG5cdH1cblxuXHRzZXQob3B0aW9uczogRGF0ZXBpY2tlclNlcnZpY2VJbnB1dHMpIHtcblx0XHRsZXQgcGF0Y2ggPSBPYmplY3Qua2V5cyhvcHRpb25zKVxuXHRcdFx0Lm1hcCgoa2V5KSA9PiB0aGlzLl9WQUxJREFUT1JTW2tleV0ob3B0aW9uc1trZXldKSlcblx0XHRcdC5yZWR1Y2UoKG9iaiwgcGFydCkgPT4gKHsgLi4ub2JqLCAuLi5wYXJ0IH0pLCB7fSk7XG5cblx0XHRpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMuX25leHRTdGF0ZShwYXRjaCk7XG5cdFx0fVxuXHR9XG5cblx0Zm9jdXMoZGF0ZT86IE5nYkRhdGUgfCBudWxsKSB7XG5cdFx0Y29uc3QgZm9jdXNlZERhdGUgPSB0aGlzLnRvVmFsaWREYXRlKGRhdGUsIG51bGwpO1xuXHRcdGlmIChmb2N1c2VkRGF0ZSAhPSBudWxsICYmICF0aGlzLl9zdGF0ZS5kaXNhYmxlZCAmJiBpc0NoYW5nZWREYXRlKHRoaXMuX3N0YXRlLmZvY3VzRGF0ZSwgZm9jdXNlZERhdGUpKSB7XG5cdFx0XHR0aGlzLl9uZXh0U3RhdGUoeyBmb2N1c0RhdGU6IGRhdGUgfSk7XG5cdFx0fVxuXHR9XG5cblx0Zm9jdXNTZWxlY3QoKSB7XG5cdFx0aWYgKGlzRGF0ZVNlbGVjdGFibGUodGhpcy5fc3RhdGUuZm9jdXNEYXRlLCB0aGlzLl9zdGF0ZSkpIHtcblx0XHRcdHRoaXMuc2VsZWN0KHRoaXMuX3N0YXRlLmZvY3VzRGF0ZSwgeyBlbWl0RXZlbnQ6IHRydWUgfSk7XG5cdFx0fVxuXHR9XG5cblx0b3BlbihkYXRlPzogTmdiRGF0ZSB8IG51bGwpIHtcblx0XHRjb25zdCBmaXJzdERhdGUgPSB0aGlzLnRvVmFsaWREYXRlKGRhdGUsIHRoaXMuX2NhbGVuZGFyLmdldFRvZGF5KCkpO1xuXHRcdGlmIChcblx0XHRcdGZpcnN0RGF0ZSAhPSBudWxsICYmXG5cdFx0XHQhdGhpcy5fc3RhdGUuZGlzYWJsZWQgJiZcblx0XHRcdCghdGhpcy5fc3RhdGUuZmlyc3REYXRlIHx8IGlzQ2hhbmdlZE1vbnRoKHRoaXMuX3N0YXRlLmZpcnN0RGF0ZSwgZmlyc3REYXRlKSlcblx0XHQpIHtcblx0XHRcdHRoaXMuX25leHRTdGF0ZSh7IGZpcnN0RGF0ZSB9KTtcblx0XHR9XG5cdH1cblxuXHRzZWxlY3QoZGF0ZT86IE5nYkRhdGUgfCBudWxsLCBvcHRpb25zOiB7IGVtaXRFdmVudD86IGJvb2xlYW4gfSA9IHt9KSB7XG5cdFx0Y29uc3Qgc2VsZWN0ZWREYXRlID0gdGhpcy50b1ZhbGlkRGF0ZShkYXRlLCBudWxsKTtcblx0XHRpZiAoc2VsZWN0ZWREYXRlICE9IG51bGwgJiYgIXRoaXMuX3N0YXRlLmRpc2FibGVkKSB7XG5cdFx0XHRpZiAoaXNDaGFuZ2VkRGF0ZSh0aGlzLl9zdGF0ZS5zZWxlY3RlZERhdGUsIHNlbGVjdGVkRGF0ZSkpIHtcblx0XHRcdFx0dGhpcy5fbmV4dFN0YXRlKHsgc2VsZWN0ZWREYXRlIH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3B0aW9ucy5lbWl0RXZlbnQgJiYgaXNEYXRlU2VsZWN0YWJsZShzZWxlY3RlZERhdGUsIHRoaXMuX3N0YXRlKSkge1xuXHRcdFx0XHR0aGlzLl9kYXRlU2VsZWN0JC5uZXh0KHNlbGVjdGVkRGF0ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dG9WYWxpZERhdGUoZGF0ZT86IE5nYkRhdGVTdHJ1Y3QgfCBudWxsLCBkZWZhdWx0VmFsdWU/OiBOZ2JEYXRlIHwgbnVsbCk6IE5nYkRhdGUgfCBudWxsIHtcblx0XHRjb25zdCBuZ2JEYXRlID0gTmdiRGF0ZS5mcm9tKGRhdGUpO1xuXHRcdGlmIChkZWZhdWx0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0ZGVmYXVsdFZhbHVlID0gdGhpcy5fY2FsZW5kYXIuZ2V0VG9kYXkoKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2NhbGVuZGFyLmlzVmFsaWQobmdiRGF0ZSkgPyBuZ2JEYXRlIDogZGVmYXVsdFZhbHVlO1xuXHR9XG5cblx0Z2V0TW9udGgoc3RydWN0OiBOZ2JEYXRlU3RydWN0KSB7XG5cdFx0Zm9yIChsZXQgbW9udGggb2YgdGhpcy5fc3RhdGUubW9udGhzKSB7XG5cdFx0XHRpZiAoc3RydWN0Lm1vbnRoID09PSBtb250aC5udW1iZXIgJiYgc3RydWN0LnllYXIgPT09IG1vbnRoLnllYXIpIHtcblx0XHRcdFx0cmV0dXJuIG1vbnRoO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aHJvdyBuZXcgRXJyb3IoYG1vbnRoICR7c3RydWN0Lm1vbnRofSBvZiB5ZWFyICR7c3RydWN0LnllYXJ9IG5vdCBmb3VuZGApO1xuXHR9XG5cblx0cHJpdmF0ZSBfbmV4dFN0YXRlKHBhdGNoOiBQYXJ0aWFsPERhdGVwaWNrZXJWaWV3TW9kZWw+KSB7XG5cdFx0Y29uc3QgbmV3U3RhdGUgPSB0aGlzLl91cGRhdGVTdGF0ZShwYXRjaCk7XG5cdFx0dGhpcy5fcGF0Y2hDb250ZXh0cyhuZXdTdGF0ZSk7XG5cdFx0dGhpcy5fc3RhdGUgPSBuZXdTdGF0ZTtcblx0XHR0aGlzLl9tb2RlbCQubmV4dCh0aGlzLl9zdGF0ZSk7XG5cdH1cblxuXHRwcml2YXRlIF9wYXRjaENvbnRleHRzKHN0YXRlOiBEYXRlcGlja2VyVmlld01vZGVsKSB7XG5cdFx0Y29uc3QgeyBtb250aHMsIGRpc3BsYXlNb250aHMsIHNlbGVjdGVkRGF0ZSwgZm9jdXNEYXRlLCBmb2N1c1Zpc2libGUsIGRpc2FibGVkLCBvdXRzaWRlRGF5cyB9ID0gc3RhdGU7XG5cdFx0c3RhdGUubW9udGhzLmZvckVhY2goKG1vbnRoKSA9PiB7XG5cdFx0XHRtb250aC53ZWVrcy5mb3JFYWNoKCh3ZWVrKSA9PiB7XG5cdFx0XHRcdHdlZWsuZGF5cy5mb3JFYWNoKChkYXkpID0+IHtcblx0XHRcdFx0XHQvLyBwYXRjaCBmb2N1cyBmbGFnXG5cdFx0XHRcdFx0aWYgKGZvY3VzRGF0ZSkge1xuXHRcdFx0XHRcdFx0ZGF5LmNvbnRleHQuZm9jdXNlZCA9IGZvY3VzRGF0ZS5lcXVhbHMoZGF5LmRhdGUpICYmIGZvY3VzVmlzaWJsZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBjYWxjdWxhdGluZyB0YWJpbmRleFxuXHRcdFx0XHRcdGRheS50YWJpbmRleCA9XG5cdFx0XHRcdFx0XHQhZGlzYWJsZWQgJiYgZm9jdXNEYXRlICYmIGRheS5kYXRlLmVxdWFscyhmb2N1c0RhdGUpICYmIGZvY3VzRGF0ZS5tb250aCA9PT0gbW9udGgubnVtYmVyID8gMCA6IC0xO1xuXG5cdFx0XHRcdFx0Ly8gb3ZlcnJpZGUgY29udGV4dCBkaXNhYmxlZFxuXHRcdFx0XHRcdGlmIChkaXNhYmxlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0ZGF5LmNvbnRleHQuZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHBhdGNoIHNlbGVjdGlvbiBmbGFnXG5cdFx0XHRcdFx0aWYgKHNlbGVjdGVkRGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRkYXkuY29udGV4dC5zZWxlY3RlZCA9IHNlbGVjdGVkRGF0ZSAhPT0gbnVsbCAmJiBzZWxlY3RlZERhdGUuZXF1YWxzKGRheS5kYXRlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyB2aXNpYmlsaXR5XG5cdFx0XHRcdFx0aWYgKG1vbnRoLm51bWJlciAhPT0gZGF5LmRhdGUubW9udGgpIHtcblx0XHRcdFx0XHRcdGRheS5oaWRkZW4gPVxuXHRcdFx0XHRcdFx0XHRvdXRzaWRlRGF5cyA9PT0gJ2hpZGRlbicgfHxcblx0XHRcdFx0XHRcdFx0b3V0c2lkZURheXMgPT09ICdjb2xsYXBzZWQnIHx8XG5cdFx0XHRcdFx0XHRcdChkaXNwbGF5TW9udGhzID4gMSAmJlxuXHRcdFx0XHRcdFx0XHRcdGRheS5kYXRlLmFmdGVyKG1vbnRoc1swXS5maXJzdERhdGUpICYmXG5cdFx0XHRcdFx0XHRcdFx0ZGF5LmRhdGUuYmVmb3JlKG1vbnRoc1tkaXNwbGF5TW9udGhzIC0gMV0ubGFzdERhdGUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF91cGRhdGVTdGF0ZShwYXRjaDogUGFydGlhbDxEYXRlcGlja2VyVmlld01vZGVsPik6IERhdGVwaWNrZXJWaWV3TW9kZWwge1xuXHRcdC8vIHBhdGNoaW5nIGZpZWxkc1xuXHRcdGNvbnN0IHN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fc3RhdGUsIHBhdGNoKTtcblxuXHRcdGxldCBzdGFydERhdGUgPSBzdGF0ZS5maXJzdERhdGU7XG5cblx0XHQvLyBtaW4vbWF4IGRhdGVzIGNoYW5nZWRcblx0XHRpZiAoJ21pbkRhdGUnIGluIHBhdGNoIHx8ICdtYXhEYXRlJyBpbiBwYXRjaCkge1xuXHRcdFx0Y2hlY2tNaW5CZWZvcmVNYXgoc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG5cdFx0XHRzdGF0ZS5mb2N1c0RhdGUgPSBjaGVja0RhdGVJblJhbmdlKHN0YXRlLmZvY3VzRGF0ZSwgc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG5cdFx0XHRzdGF0ZS5maXJzdERhdGUgPSBjaGVja0RhdGVJblJhbmdlKHN0YXRlLmZpcnN0RGF0ZSwgc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG5cdFx0XHRzdGFydERhdGUgPSBzdGF0ZS5mb2N1c0RhdGU7XG5cdFx0fVxuXG5cdFx0Ly8gZGlzYWJsZWRcblx0XHRpZiAoJ2Rpc2FibGVkJyBpbiBwYXRjaCkge1xuXHRcdFx0c3RhdGUuZm9jdXNWaXNpYmxlID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaW5pdGlhbCByZWJ1aWxkIHZpYSAnc2VsZWN0KCknXG5cdFx0aWYgKCdzZWxlY3RlZERhdGUnIGluIHBhdGNoICYmIHRoaXMuX3N0YXRlLm1vbnRocy5sZW5ndGggPT09IDApIHtcblx0XHRcdHN0YXJ0RGF0ZSA9IHN0YXRlLnNlbGVjdGVkRGF0ZTtcblx0XHR9XG5cblx0XHQvLyB0ZXJtaW5hdGUgZWFybHkgaWYgb25seSBmb2N1cyB2aXNpYmlsaXR5IHdhcyBjaGFuZ2VkXG5cdFx0aWYgKCdmb2N1c1Zpc2libGUnIGluIHBhdGNoKSB7XG5cdFx0XHRyZXR1cm4gc3RhdGU7XG5cdFx0fVxuXG5cdFx0Ly8gZm9jdXMgZGF0ZSBjaGFuZ2VkXG5cdFx0aWYgKCdmb2N1c0RhdGUnIGluIHBhdGNoKSB7XG5cdFx0XHRzdGF0ZS5mb2N1c0RhdGUgPSBjaGVja0RhdGVJblJhbmdlKHN0YXRlLmZvY3VzRGF0ZSwgc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG5cdFx0XHRzdGFydERhdGUgPSBzdGF0ZS5mb2N1c0RhdGU7XG5cblx0XHRcdC8vIG5vdGhpbmcgdG8gcmVidWlsZCBpZiBvbmx5IGZvY3VzIGNoYW5nZWQgYW5kIGl0IGlzIHN0aWxsIHZpc2libGVcblx0XHRcdGlmIChcblx0XHRcdFx0c3RhdGUubW9udGhzLmxlbmd0aCAhPT0gMCAmJlxuXHRcdFx0XHRzdGF0ZS5mb2N1c0RhdGUgJiZcblx0XHRcdFx0IXN0YXRlLmZvY3VzRGF0ZS5iZWZvcmUoc3RhdGUuZmlyc3REYXRlKSAmJlxuXHRcdFx0XHQhc3RhdGUuZm9jdXNEYXRlLmFmdGVyKHN0YXRlLmxhc3REYXRlKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBmaXJzdCBkYXRlIGNoYW5nZWRcblx0XHRpZiAoJ2ZpcnN0RGF0ZScgaW4gcGF0Y2gpIHtcblx0XHRcdHN0YXRlLmZpcnN0RGF0ZSA9IGNoZWNrRGF0ZUluUmFuZ2Uoc3RhdGUuZmlyc3REYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcblx0XHRcdHN0YXJ0RGF0ZSA9IHN0YXRlLmZpcnN0RGF0ZTtcblx0XHR9XG5cblx0XHQvLyByZWJ1aWxkaW5nIG1vbnRoc1xuXHRcdGlmIChzdGFydERhdGUpIHtcblx0XHRcdGNvbnN0IGZvcmNlUmVidWlsZCA9XG5cdFx0XHRcdCdkYXlUZW1wbGF0ZURhdGEnIGluIHBhdGNoIHx8XG5cdFx0XHRcdCdmaXJzdERheU9mV2VlaycgaW4gcGF0Y2ggfHxcblx0XHRcdFx0J21hcmtEaXNhYmxlZCcgaW4gcGF0Y2ggfHxcblx0XHRcdFx0J21pbkRhdGUnIGluIHBhdGNoIHx8XG5cdFx0XHRcdCdtYXhEYXRlJyBpbiBwYXRjaCB8fFxuXHRcdFx0XHQnZGlzYWJsZWQnIGluIHBhdGNoIHx8XG5cdFx0XHRcdCdvdXRzaWRlRGF5cycgaW4gcGF0Y2ggfHxcblx0XHRcdFx0J3dlZWtkYXlzVmlzaWJsZScgaW4gcGF0Y2g7XG5cblx0XHRcdGNvbnN0IG1vbnRocyA9IGJ1aWxkTW9udGhzKHRoaXMuX2NhbGVuZGFyLCBzdGFydERhdGUsIHN0YXRlLCB0aGlzLl9pMThuLCBmb3JjZVJlYnVpbGQpO1xuXG5cdFx0XHQvLyB1cGRhdGluZyBtb250aHMgYW5kIGJvdW5kYXJ5IGRhdGVzXG5cdFx0XHRzdGF0ZS5tb250aHMgPSBtb250aHM7XG5cdFx0XHRzdGF0ZS5maXJzdERhdGUgPSBtb250aHNbMF0uZmlyc3REYXRlO1xuXHRcdFx0c3RhdGUubGFzdERhdGUgPSBtb250aHNbbW9udGhzLmxlbmd0aCAtIDFdLmxhc3REYXRlO1xuXG5cdFx0XHQvLyByZXNldCBzZWxlY3RlZCBkYXRlIGlmICdtYXJrRGlzYWJsZWQnIHJldHVybnMgdHJ1ZVxuXHRcdFx0aWYgKCdzZWxlY3RlZERhdGUnIGluIHBhdGNoICYmICFpc0RhdGVTZWxlY3RhYmxlKHN0YXRlLnNlbGVjdGVkRGF0ZSwgc3RhdGUpKSB7XG5cdFx0XHRcdHN0YXRlLnNlbGVjdGVkRGF0ZSA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGFkanVzdGluZyBmb2N1cyBhZnRlciBtb250aHMgd2VyZSBidWlsdFxuXHRcdFx0aWYgKCdmaXJzdERhdGUnIGluIHBhdGNoKSB7XG5cdFx0XHRcdGlmICghc3RhdGUuZm9jdXNEYXRlIHx8IHN0YXRlLmZvY3VzRGF0ZS5iZWZvcmUoc3RhdGUuZmlyc3REYXRlKSB8fCBzdGF0ZS5mb2N1c0RhdGUuYWZ0ZXIoc3RhdGUubGFzdERhdGUpKSB7XG5cdFx0XHRcdFx0c3RhdGUuZm9jdXNEYXRlID0gc3RhcnREYXRlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGFkanVzdGluZyBtb250aHMveWVhcnMgZm9yIHRoZSBzZWxlY3QgYm94IG5hdmlnYXRpb25cblx0XHRcdGNvbnN0IHllYXJDaGFuZ2VkID0gIXRoaXMuX3N0YXRlLmZpcnN0RGF0ZSB8fCB0aGlzLl9zdGF0ZS5maXJzdERhdGUueWVhciAhPT0gc3RhdGUuZmlyc3REYXRlLnllYXI7XG5cdFx0XHRjb25zdCBtb250aENoYW5nZWQgPSAhdGhpcy5fc3RhdGUuZmlyc3REYXRlIHx8IHRoaXMuX3N0YXRlLmZpcnN0RGF0ZS5tb250aCAhPT0gc3RhdGUuZmlyc3REYXRlLm1vbnRoO1xuXHRcdFx0aWYgKHN0YXRlLm5hdmlnYXRpb24gPT09ICdzZWxlY3QnKSB7XG5cdFx0XHRcdC8vIHllYXJzIC0+ICBib3VuZGFyaWVzIChtaW4vbWF4IHdlcmUgY2hhbmdlZClcblx0XHRcdFx0aWYgKCdtaW5EYXRlJyBpbiBwYXRjaCB8fCAnbWF4RGF0ZScgaW4gcGF0Y2ggfHwgc3RhdGUuc2VsZWN0Qm94ZXMueWVhcnMubGVuZ3RoID09PSAwIHx8IHllYXJDaGFuZ2VkKSB7XG5cdFx0XHRcdFx0c3RhdGUuc2VsZWN0Qm94ZXMueWVhcnMgPSBnZW5lcmF0ZVNlbGVjdEJveFllYXJzKHN0YXRlLmZpcnN0RGF0ZSwgc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBtb250aHMgLT4gd2hlbiBjdXJyZW50IHllYXIgb3IgYm91bmRhcmllcyBjaGFuZ2Vcblx0XHRcdFx0aWYgKCdtaW5EYXRlJyBpbiBwYXRjaCB8fCAnbWF4RGF0ZScgaW4gcGF0Y2ggfHwgc3RhdGUuc2VsZWN0Qm94ZXMubW9udGhzLmxlbmd0aCA9PT0gMCB8fCB5ZWFyQ2hhbmdlZCkge1xuXHRcdFx0XHRcdHN0YXRlLnNlbGVjdEJveGVzLm1vbnRocyA9IGdlbmVyYXRlU2VsZWN0Qm94TW9udGhzKFxuXHRcdFx0XHRcdFx0dGhpcy5fY2FsZW5kYXIsXG5cdFx0XHRcdFx0XHRzdGF0ZS5maXJzdERhdGUsXG5cdFx0XHRcdFx0XHRzdGF0ZS5taW5EYXRlLFxuXHRcdFx0XHRcdFx0c3RhdGUubWF4RGF0ZSxcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdGF0ZS5zZWxlY3RCb3hlcyA9IHsgeWVhcnM6IFtdLCBtb250aHM6IFtdIH07XG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0aW5nIG5hdmlnYXRpb24gYXJyb3dzIC0+IGJvdW5kYXJpZXMgY2hhbmdlIChtaW4vbWF4KSBvciBtb250aC95ZWFyIGNoYW5nZXNcblx0XHRcdGlmIChcblx0XHRcdFx0KHN0YXRlLm5hdmlnYXRpb24gPT09ICdhcnJvd3MnIHx8IHN0YXRlLm5hdmlnYXRpb24gPT09ICdzZWxlY3QnKSAmJlxuXHRcdFx0XHQobW9udGhDaGFuZ2VkIHx8IHllYXJDaGFuZ2VkIHx8ICdtaW5EYXRlJyBpbiBwYXRjaCB8fCAnbWF4RGF0ZScgaW4gcGF0Y2ggfHwgJ2Rpc2FibGVkJyBpbiBwYXRjaClcblx0XHRcdCkge1xuXHRcdFx0XHRzdGF0ZS5wcmV2RGlzYWJsZWQgPSBzdGF0ZS5kaXNhYmxlZCB8fCBwcmV2TW9udGhEaXNhYmxlZCh0aGlzLl9jYWxlbmRhciwgc3RhdGUuZmlyc3REYXRlLCBzdGF0ZS5taW5EYXRlKTtcblx0XHRcdFx0c3RhdGUubmV4dERpc2FibGVkID0gc3RhdGUuZGlzYWJsZWQgfHwgbmV4dE1vbnRoRGlzYWJsZWQodGhpcy5fY2FsZW5kYXIsIHN0YXRlLmxhc3REYXRlLCBzdGF0ZS5tYXhEYXRlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gc3RhdGU7XG5cdH1cbn1cbiJdfQ==