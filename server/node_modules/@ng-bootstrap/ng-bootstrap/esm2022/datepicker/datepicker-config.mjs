import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbDatepicker`](#/components/datepicker/api#NgbDatepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
export class NgbDatepickerConfig {
    constructor() {
        this.displayMonths = 1;
        this.firstDayOfWeek = 1;
        this.navigation = 'select';
        this.outsideDays = 'visible';
        this.showWeekNumbers = false;
        this.weekdays = 'narrow';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerConfig, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci9kYXRlcGlja2VyLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFlLE1BQU0sZUFBZSxDQUFDOztBQUl4RDs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxtQkFBbUI7SUFEaEM7UUFLQyxrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUNsQixtQkFBYyxHQUFHLENBQUMsQ0FBQztRQUluQixlQUFVLEdBQWlDLFFBQVEsQ0FBQztRQUNwRCxnQkFBVyxHQUF1QyxTQUFTLENBQUM7UUFDNUQsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFFeEIsYUFBUSxHQUF3RSxRQUFRLENBQUM7S0FDekY7OEdBZFksbUJBQW1CO2tIQUFuQixtQkFBbUIsY0FETixNQUFNOzsyRkFDbkIsbUJBQW1CO2tCQUQvQixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXlUZW1wbGF0ZUNvbnRleHQgfSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXRlbXBsYXRlLWNvbnRleHQnO1xuaW1wb3J0IHsgTmdiRGF0ZVN0cnVjdCB9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcblxuLyoqXG4gKiBBIGNvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIFtgTmdiRGF0ZXBpY2tlcmBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNOZ2JEYXRlcGlja2VyKSBjb21wb25lbnQuXG4gKlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIGRhdGVwaWNrZXJzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJDb25maWcge1xuXHRkYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8RGF5VGVtcGxhdGVDb250ZXh0Pjtcblx0ZGF5VGVtcGxhdGVEYXRhOiAoZGF0ZTogTmdiRGF0ZVN0cnVjdCwgY3VycmVudD86IHsgeWVhcjogbnVtYmVyOyBtb250aDogbnVtYmVyIH0pID0+IGFueTtcblx0Zm9vdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cdGRpc3BsYXlNb250aHMgPSAxO1xuXHRmaXJzdERheU9mV2VlayA9IDE7XG5cdG1hcmtEaXNhYmxlZDogKGRhdGU6IE5nYkRhdGVTdHJ1Y3QsIGN1cnJlbnQ/OiB7IHllYXI6IG51bWJlcjsgbW9udGg6IG51bWJlciB9KSA9PiBib29sZWFuO1xuXHRtaW5EYXRlOiBOZ2JEYXRlU3RydWN0O1xuXHRtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuXHRuYXZpZ2F0aW9uOiAnc2VsZWN0JyB8ICdhcnJvd3MnIHwgJ25vbmUnID0gJ3NlbGVjdCc7XG5cdG91dHNpZGVEYXlzOiAndmlzaWJsZScgfCAnY29sbGFwc2VkJyB8ICdoaWRkZW4nID0gJ3Zpc2libGUnO1xuXHRzaG93V2Vla051bWJlcnMgPSBmYWxzZTtcblx0c3RhcnREYXRlOiB7IHllYXI6IG51bWJlcjsgbW9udGg6IG51bWJlcjsgZGF5PzogbnVtYmVyIH07XG5cdHdlZWtkYXlzOiBFeGNsdWRlPEludGwuRGF0ZVRpbWVGb3JtYXRPcHRpb25zWyd3ZWVrZGF5J10sIHVuZGVmaW5lZD4gfCBib29sZWFuID0gJ25hcnJvdyc7XG59XG4iXX0=