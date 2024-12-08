import { isInteger } from '../util/util';
/**
 * A simple class that represents a date that datepicker also uses internally.
 *
 * It is the implementation of the `NgbDateStruct` interface that adds some convenience methods,
 * like `.equals()`, `.before()`, etc.
 *
 * All datepicker APIs consume `NgbDateStruct`, but return `NgbDate`.
 *
 * In many cases it is simpler to manipulate these objects together with
 * [`NgbCalendar`](#/components/datepicker/api#NgbCalendar) than native JS Dates.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details.
 *
 * @since 3.0.0
 */
export class NgbDate {
    /**
     * A **static method** that creates a new date object from the `NgbDateStruct`,
     *
     * ex. `NgbDate.from({year: 2000, month: 5, day: 1})`.
     *
     * If the `date` is already of `NgbDate` type, the method will return the same object.
     */
    static from(date) {
        if (date instanceof NgbDate) {
            return date;
        }
        return date ? new NgbDate(date.year, date.month, date.day) : null;
    }
    constructor(year, month, day) {
        this.year = isInteger(year) ? year : null;
        this.month = isInteger(month) ? month : null;
        this.day = isInteger(day) ? day : null;
    }
    /**
     * Checks if the current date is equal to another date.
     */
    equals(other) {
        return other != null && this.year === other.year && this.month === other.month && this.day === other.day;
    }
    /**
     * Checks if the current date is before another date.
     */
    before(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day < other.day;
            }
            else {
                return this.month < other.month;
            }
        }
        else {
            return this.year < other.year;
        }
    }
    /**
     * Checks if the current date is after another date.
     */
    after(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day > other.day;
            }
            else {
                return this.month > other.month;
            }
        }
        else {
            return this.year > other.year;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci9uZ2ItZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXpDOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTSxPQUFPLE9BQU87SUFnQm5COzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBMkI7UUFDdEMsSUFBSSxJQUFJLFlBQVksT0FBTyxFQUFFLENBQUM7WUFDN0IsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNuRSxDQUFDO0lBRUQsWUFBWSxJQUFZLEVBQUUsS0FBYSxFQUFFLEdBQVc7UUFDbkQsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sSUFBSSxDQUFDO1FBQy9DLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFNLElBQUksQ0FBQztRQUNsRCxJQUFJLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTSxJQUFJLENBQUM7SUFDN0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLEtBQTRCO1FBQ2xDLE9BQU8sS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUMxRyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsS0FBNEI7UUFDbEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1osT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM5QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNoQyxPQUFPLElBQUksQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDOUQsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2pDLENBQUM7UUFDRixDQUFDO2FBQU0sQ0FBQztZQUNQLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQy9CLENBQUM7SUFDRixDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsS0FBNEI7UUFDakMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1osT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM5QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNoQyxPQUFPLElBQUksQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDOUQsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2pDLENBQUM7UUFDRixDQUFDO2FBQU0sQ0FBQztZQUNQLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQy9CLENBQUM7SUFDRixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ2JEYXRlU3RydWN0IH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuaW1wb3J0IHsgaXNJbnRlZ2VyIH0gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBBIHNpbXBsZSBjbGFzcyB0aGF0IHJlcHJlc2VudHMgYSBkYXRlIHRoYXQgZGF0ZXBpY2tlciBhbHNvIHVzZXMgaW50ZXJuYWxseS5cbiAqXG4gKiBJdCBpcyB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhlIGBOZ2JEYXRlU3RydWN0YCBpbnRlcmZhY2UgdGhhdCBhZGRzIHNvbWUgY29udmVuaWVuY2UgbWV0aG9kcyxcbiAqIGxpa2UgYC5lcXVhbHMoKWAsIGAuYmVmb3JlKClgLCBldGMuXG4gKlxuICogQWxsIGRhdGVwaWNrZXIgQVBJcyBjb25zdW1lIGBOZ2JEYXRlU3RydWN0YCwgYnV0IHJldHVybiBgTmdiRGF0ZWAuXG4gKlxuICogSW4gbWFueSBjYXNlcyBpdCBpcyBzaW1wbGVyIHRvIG1hbmlwdWxhdGUgdGhlc2Ugb2JqZWN0cyB0b2dldGhlciB3aXRoXG4gKiBbYE5nYkNhbGVuZGFyYF0oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvYXBpI05nYkNhbGVuZGFyKSB0aGFuIG5hdGl2ZSBKUyBEYXRlcy5cbiAqXG4gKiBTZWUgdGhlIFtkYXRlIGZvcm1hdCBvdmVydmlld10oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvb3ZlcnZpZXcjZGF0ZS1tb2RlbCkgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc2luY2UgMy4wLjBcbiAqL1xuZXhwb3J0IGNsYXNzIE5nYkRhdGUgaW1wbGVtZW50cyBOZ2JEYXRlU3RydWN0IHtcblx0LyoqXG5cdCAqIFRoZSB5ZWFyLCBmb3IgZXhhbXBsZSAyMDE2XG5cdCAqL1xuXHR5ZWFyOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBtb250aCwgZm9yIGV4YW1wbGUgMT1KYW4gLi4uIDEyPURlYyBhcyBpbiBJU08gODYwMVxuXHQgKi9cblx0bW9udGg6IG51bWJlcjtcblxuXHQvKipcblx0ICogVGhlIGRheSBvZiBtb250aCwgc3RhcnRpbmcgd2l0aCAxXG5cdCAqL1xuXHRkYXk6IG51bWJlcjtcblxuXHQvKipcblx0ICogQSAqKnN0YXRpYyBtZXRob2QqKiB0aGF0IGNyZWF0ZXMgYSBuZXcgZGF0ZSBvYmplY3QgZnJvbSB0aGUgYE5nYkRhdGVTdHJ1Y3RgLFxuXHQgKlxuXHQgKiBleC4gYE5nYkRhdGUuZnJvbSh7eWVhcjogMjAwMCwgbW9udGg6IDUsIGRheTogMX0pYC5cblx0ICpcblx0ICogSWYgdGhlIGBkYXRlYCBpcyBhbHJlYWR5IG9mIGBOZ2JEYXRlYCB0eXBlLCB0aGUgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBzYW1lIG9iamVjdC5cblx0ICovXG5cdHN0YXRpYyBmcm9tKGRhdGU/OiBOZ2JEYXRlU3RydWN0IHwgbnVsbCk6IE5nYkRhdGUgfCBudWxsIHtcblx0XHRpZiAoZGF0ZSBpbnN0YW5jZW9mIE5nYkRhdGUpIHtcblx0XHRcdHJldHVybiBkYXRlO1xuXHRcdH1cblx0XHRyZXR1cm4gZGF0ZSA/IG5ldyBOZ2JEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCwgZGF0ZS5kYXkpIDogbnVsbDtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF5OiBudW1iZXIpIHtcblx0XHR0aGlzLnllYXIgPSBpc0ludGVnZXIoeWVhcikgPyB5ZWFyIDogPGFueT5udWxsO1xuXHRcdHRoaXMubW9udGggPSBpc0ludGVnZXIobW9udGgpID8gbW9udGggOiA8YW55Pm51bGw7XG5cdFx0dGhpcy5kYXkgPSBpc0ludGVnZXIoZGF5KSA/IGRheSA6IDxhbnk+bnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgZGF0ZSBpcyBlcXVhbCB0byBhbm90aGVyIGRhdGUuXG5cdCAqL1xuXHRlcXVhbHMob3RoZXI/OiBOZ2JEYXRlU3RydWN0IHwgbnVsbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBvdGhlciAhPSBudWxsICYmIHRoaXMueWVhciA9PT0gb3RoZXIueWVhciAmJiB0aGlzLm1vbnRoID09PSBvdGhlci5tb250aCAmJiB0aGlzLmRheSA9PT0gb3RoZXIuZGF5O1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBkYXRlIGlzIGJlZm9yZSBhbm90aGVyIGRhdGUuXG5cdCAqL1xuXHRiZWZvcmUob3RoZXI/OiBOZ2JEYXRlU3RydWN0IHwgbnVsbCk6IGJvb2xlYW4ge1xuXHRcdGlmICghb3RoZXIpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy55ZWFyID09PSBvdGhlci55ZWFyKSB7XG5cdFx0XHRpZiAodGhpcy5tb250aCA9PT0gb3RoZXIubW9udGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF5ID09PSBvdGhlci5kYXkgPyBmYWxzZSA6IHRoaXMuZGF5IDwgb3RoZXIuZGF5O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubW9udGggPCBvdGhlci5tb250aDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMueWVhciA8IG90aGVyLnllYXI7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBkYXRlIGlzIGFmdGVyIGFub3RoZXIgZGF0ZS5cblx0ICovXG5cdGFmdGVyKG90aGVyPzogTmdiRGF0ZVN0cnVjdCB8IG51bGwpOiBib29sZWFuIHtcblx0XHRpZiAoIW90aGVyKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnllYXIgPT09IG90aGVyLnllYXIpIHtcblx0XHRcdGlmICh0aGlzLm1vbnRoID09PSBvdGhlci5tb250aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXkgPT09IG90aGVyLmRheSA/IGZhbHNlIDogdGhpcy5kYXkgPiBvdGhlci5kYXk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tb250aCA+IG90aGVyLm1vbnRoO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy55ZWFyID4gb3RoZXIueWVhcjtcblx0XHR9XG5cdH1cbn1cbiJdfQ==