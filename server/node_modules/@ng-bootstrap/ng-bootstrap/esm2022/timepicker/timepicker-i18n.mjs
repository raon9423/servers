import { formatDate } from '@angular/common';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Type of the service supplying day periods (for example, 'AM' and 'PM') to NgbTimepicker component.
 * The default implementation of this service honors the Angular locale, and uses the registered locale data,
 * as explained in the Angular i18n guide.
 */
export class NgbTimepickerI18n {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTimepickerI18n, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTimepickerI18n, providedIn: 'root', useFactory: () => new NgbTimepickerI18nDefault() }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTimepickerI18n, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useFactory: () => new NgbTimepickerI18nDefault(),
                }]
        }] });
export class NgbTimepickerI18nDefault extends NgbTimepickerI18n {
    constructor() {
        super(...arguments);
        this._locale = inject(LOCALE_ID);
        this._periods = [
            formatDate(new Date(3600000), 'a', this._locale, 'UTC'),
            formatDate(new Date(3600000 * 13), 'a', this._locale, 'UTC'),
        ];
    }
    getMorningPeriod() {
        return this._periods[0];
    }
    getAfternoonPeriod() {
        return this._periods[1];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTimepickerI18nDefault, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTimepickerI18nDefault }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbTimepickerI18nDefault, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXBpY2tlci1pMThuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3RpbWVwaWNrZXIvdGltZXBpY2tlci1pMThuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRTlEOzs7O0dBSUc7QUFLSCxNQUFNLE9BQWdCLGlCQUFpQjs4R0FBakIsaUJBQWlCO2tIQUFqQixpQkFBaUIsY0FIMUIsTUFBTSxjQUNOLEdBQUcsRUFBRSxDQUFDLElBQUksd0JBQXdCLEVBQUU7OzJGQUUzQixpQkFBaUI7a0JBSnRDLFVBQVU7bUJBQUM7b0JBQ1gsVUFBVSxFQUFFLE1BQU07b0JBQ2xCLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLHdCQUF3QixFQUFFO2lCQUNoRDs7QUFjRCxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsaUJBQWlCO0lBRC9EOztRQUVTLFlBQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFNUIsYUFBUSxHQUFHO1lBQ2xCLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7WUFDdkQsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7U0FDNUQsQ0FBQztLQVNGO0lBUEEsZ0JBQWdCO1FBQ2YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxrQkFBa0I7UUFDakIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7OEdBZFcsd0JBQXdCO2tIQUF4Qix3QkFBd0I7OzJGQUF4Qix3QkFBd0I7a0JBRHBDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmb3JtYXREYXRlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdGFibGUsIExPQ0FMRV9JRCwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgc2VydmljZSBzdXBwbHlpbmcgZGF5IHBlcmlvZHMgKGZvciBleGFtcGxlLCAnQU0nIGFuZCAnUE0nKSB0byBOZ2JUaW1lcGlja2VyIGNvbXBvbmVudC5cbiAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgc2VydmljZSBob25vcnMgdGhlIEFuZ3VsYXIgbG9jYWxlLCBhbmQgdXNlcyB0aGUgcmVnaXN0ZXJlZCBsb2NhbGUgZGF0YSxcbiAqIGFzIGV4cGxhaW5lZCBpbiB0aGUgQW5ndWxhciBpMThuIGd1aWRlLlxuICovXG5ASW5qZWN0YWJsZSh7XG5cdHByb3ZpZGVkSW46ICdyb290Jyxcblx0dXNlRmFjdG9yeTogKCkgPT4gbmV3IE5nYlRpbWVwaWNrZXJJMThuRGVmYXVsdCgpLFxufSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JUaW1lcGlja2VySTE4biB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBuYW1lIGZvciB0aGUgcGVyaW9kIGJlZm9yZSBtaWRkYXkuXG5cdCAqL1xuXHRhYnN0cmFjdCBnZXRNb3JuaW5nUGVyaW9kKCk6IHN0cmluZztcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbmFtZSBmb3IgdGhlIHBlcmlvZCBhZnRlciBtaWRkYXkuXG5cdCAqL1xuXHRhYnN0cmFjdCBnZXRBZnRlcm5vb25QZXJpb2QoKTogc3RyaW5nO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiVGltZXBpY2tlckkxOG5EZWZhdWx0IGV4dGVuZHMgTmdiVGltZXBpY2tlckkxOG4ge1xuXHRwcml2YXRlIF9sb2NhbGUgPSBpbmplY3QoTE9DQUxFX0lEKTtcblxuXHRwcml2YXRlIF9wZXJpb2RzID0gW1xuXHRcdGZvcm1hdERhdGUobmV3IERhdGUoMzYwMDAwMCksICdhJywgdGhpcy5fbG9jYWxlLCAnVVRDJyksXG5cdFx0Zm9ybWF0RGF0ZShuZXcgRGF0ZSgzNjAwMDAwICogMTMpLCAnYScsIHRoaXMuX2xvY2FsZSwgJ1VUQycpLFxuXHRdO1xuXG5cdGdldE1vcm5pbmdQZXJpb2QoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5fcGVyaW9kc1swXTtcblx0fVxuXG5cdGdldEFmdGVybm9vblBlcmlvZCgpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9wZXJpb2RzWzFdO1xuXHR9XG59XG4iXX0=