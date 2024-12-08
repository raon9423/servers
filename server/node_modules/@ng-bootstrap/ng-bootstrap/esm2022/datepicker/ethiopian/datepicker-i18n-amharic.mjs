import { NgbDatepickerI18n } from '../datepicker-i18n';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
const WEEKDAYS = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሓሙስ', 'ዓርብ', 'ቅዳሜ'];
const MONTHS = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታህሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];
/**
 * @since 16.0.0
 */
export class NgbDatepickerI18nAmharic extends NgbDatepickerI18n {
    getMonthShortName(month, year) {
        return this.getMonthFullName(month, year);
    }
    getMonthFullName(month, year) {
        return MONTHS[month - 1];
    }
    getWeekdayLabel(weekday, width) {
        return WEEKDAYS[weekday - 1];
    }
    getDayAriaLabel(date) {
        return `${date.day} ${this.getMonthFullName(date.month, date.year)} ${date.year}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerI18nAmharic, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerI18nAmharic }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerI18nAmharic, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pMThuLWFtaGFyaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci9ldGhpb3BpYW4vZGF0ZXBpY2tlci1pMThuLWFtaGFyaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDdkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFHM0MsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuRSxNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRWpIOztHQUVHO0FBRUgsTUFBTSxPQUFPLHdCQUF5QixTQUFRLGlCQUFpQjtJQUM5RCxpQkFBaUIsQ0FBQyxLQUFhLEVBQUUsSUFBeUI7UUFDekQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFhLEVBQUUsSUFBeUI7UUFDeEQsT0FBTyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxlQUFlLENBQUMsT0FBZSxFQUFFLEtBQTZDO1FBQzdFLE9BQU8sUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsZUFBZSxDQUFDLElBQW1CO1FBQ2xDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkYsQ0FBQzs4R0FmVyx3QkFBd0I7a0hBQXhCLHdCQUF3Qjs7MkZBQXhCLHdCQUF3QjtrQkFEcEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nYkRhdGVwaWNrZXJJMThuIH0gZnJvbSAnLi4vZGF0ZXBpY2tlci1pMThuJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nYkRhdGVTdHJ1Y3QgfSBmcm9tICcuLi8uLi9pbmRleCc7XG5cbmNvbnN0IFdFRUtEQVlTID0gWyfhiqXhiJHhi7UnLCAn4Yiw4YqeJywgJ+GIm+GKreGIsOGKnicsICfhiKjhiaHhi5UnLCAn4YiT4YiZ4Yi1JywgJ+GLk+GIreGJpScsICfhiYXhi7PhiJwnXTtcbmNvbnN0IE1PTlRIUyA9IFsn4YiY4Yi14Yqo4Yio4YidJywgJ+GMpeGJheGIneGJtScsICfhioXhi7PhiK0nLCAn4Ymz4YiF4Yij4YilJywgJ+GMpeGIrScsICfhi6jhiqvhibLhibUnLCAn4YiY4YyL4Ymi4Ym1JywgJ+GImuGLq+GLneGLqycsICfhjI3hipXhiabhibUnLCAn4Yiw4YqUJywgJ+GIkOGIneGIjCcsICfhipDhiJDhiLQnLCAn4Yyz4YyJ4YicJ107XG5cbi8qKlxuICogQHNpbmNlIDE2LjAuMFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlckkxOG5BbWhhcmljIGV4dGVuZHMgTmdiRGF0ZXBpY2tlckkxOG4ge1xuXHRnZXRNb250aFNob3J0TmFtZShtb250aDogbnVtYmVyLCB5ZWFyPzogbnVtYmVyIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRNb250aEZ1bGxOYW1lKG1vbnRoLCB5ZWFyKTtcblx0fVxuXG5cdGdldE1vbnRoRnVsbE5hbWUobW9udGg6IG51bWJlciwgeWVhcj86IG51bWJlciB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIE1PTlRIU1ttb250aCAtIDFdO1xuXHR9XG5cblx0Z2V0V2Vla2RheUxhYmVsKHdlZWtkYXk6IG51bWJlciwgd2lkdGg/OiBJbnRsLkRhdGVUaW1lRm9ybWF0T3B0aW9uc1snd2Vla2RheSddKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gV0VFS0RBWVNbd2Vla2RheSAtIDFdO1xuXHR9XG5cblx0Z2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcge1xuXHRcdHJldHVybiBgJHtkYXRlLmRheX0gJHt0aGlzLmdldE1vbnRoRnVsbE5hbWUoZGF0ZS5tb250aCwgZGF0ZS55ZWFyKX0gJHtkYXRlLnllYXJ9YDtcblx0fVxufVxuIl19