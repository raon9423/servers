import { inject, Injectable, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
export const ARIA_LIVE_DELAY = new InjectionToken('live announcer delay', {
    providedIn: 'root',
    factory: () => 100,
});
function getLiveElement(document, lazyCreate = false) {
    let element = document.body.querySelector('#ngb-live');
    if (element == null && lazyCreate) {
        element = document.createElement('div');
        element.setAttribute('id', 'ngb-live');
        element.setAttribute('aria-live', 'polite');
        element.setAttribute('aria-atomic', 'true');
        element.classList.add('visually-hidden');
        document.body.appendChild(element);
    }
    return element;
}
export class Live {
    constructor() {
        this._document = inject(DOCUMENT);
        this._delay = inject(ARIA_LIVE_DELAY);
    }
    ngOnDestroy() {
        const element = getLiveElement(this._document);
        if (element) {
            // if exists, it will always be attached to the <body>
            element.parentElement.removeChild(element);
        }
    }
    say(message) {
        const element = getLiveElement(this._document, true);
        const delay = this._delay;
        if (element != null) {
            element.textContent = '';
            const setText = () => (element.textContent = message);
            if (delay === null) {
                setText();
            }
            else {
                setTimeout(setText, delay);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: Live, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: Live, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: Live, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlsL2FjY2Vzc2liaWxpdHkvbGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDOUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUUzQyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQWdCLHNCQUFzQixFQUFFO0lBQ3hGLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0NBQ2xCLENBQUMsQ0FBQztBQUVILFNBQVMsY0FBYyxDQUFDLFFBQWEsRUFBRSxVQUFVLEdBQUcsS0FBSztJQUN4RCxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQWdCLENBQUM7SUFFdEUsSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ25DLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTVDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFekMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELE9BQU8sT0FBTyxDQUFDO0FBQ2hCLENBQUM7QUFHRCxNQUFNLE9BQU8sSUFBSTtJQURqQjtRQUVTLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0IsV0FBTSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztLQXdCekM7SUF0QkEsV0FBVztRQUNWLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNiLHNEQUFzRDtZQUN0RCxPQUFPLENBQUMsYUFBYyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxDQUFDO0lBQ0YsQ0FBQztJQUVELEdBQUcsQ0FBQyxPQUFlO1FBQ2xCLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFMUIsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFLENBQUM7WUFDckIsT0FBTyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDekIsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1lBQ3RELElBQUksS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUNwQixPQUFPLEVBQUUsQ0FBQztZQUNYLENBQUM7aUJBQU0sQ0FBQztnQkFDUCxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVCLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQzs4R0F6QlcsSUFBSTtrSEFBSixJQUFJLGNBRFMsTUFBTTs7MkZBQ25CLElBQUk7a0JBRGhCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBBUklBX0xJVkVfREVMQVkgPSBuZXcgSW5qZWN0aW9uVG9rZW48bnVtYmVyIHwgbnVsbD4oJ2xpdmUgYW5ub3VuY2VyIGRlbGF5Jywge1xuXHRwcm92aWRlZEluOiAncm9vdCcsXG5cdGZhY3Rvcnk6ICgpID0+IDEwMCxcbn0pO1xuXG5mdW5jdGlvbiBnZXRMaXZlRWxlbWVudChkb2N1bWVudDogYW55LCBsYXp5Q3JlYXRlID0gZmFsc2UpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuXHRsZXQgZWxlbWVudCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI25nYi1saXZlJykgYXMgSFRNTEVsZW1lbnQ7XG5cblx0aWYgKGVsZW1lbnQgPT0gbnVsbCAmJiBsYXp5Q3JlYXRlKSB7XG5cdFx0ZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ25nYi1saXZlJyk7XG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcblx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1hdG9taWMnLCAndHJ1ZScpO1xuXG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2aXN1YWxseS1oaWRkZW4nKTtcblxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cdH1cblxuXHRyZXR1cm4gZWxlbWVudDtcbn1cblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBMaXZlIGltcGxlbWVudHMgT25EZXN0cm95IHtcblx0cHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuXHRwcml2YXRlIF9kZWxheSA9IGluamVjdChBUklBX0xJVkVfREVMQVkpO1xuXG5cdG5nT25EZXN0cm95KCkge1xuXHRcdGNvbnN0IGVsZW1lbnQgPSBnZXRMaXZlRWxlbWVudCh0aGlzLl9kb2N1bWVudCk7XG5cdFx0aWYgKGVsZW1lbnQpIHtcblx0XHRcdC8vIGlmIGV4aXN0cywgaXQgd2lsbCBhbHdheXMgYmUgYXR0YWNoZWQgdG8gdGhlIDxib2R5PlxuXHRcdFx0ZWxlbWVudC5wYXJlbnRFbGVtZW50IS5yZW1vdmVDaGlsZChlbGVtZW50KTtcblx0XHR9XG5cdH1cblxuXHRzYXkobWVzc2FnZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgZWxlbWVudCA9IGdldExpdmVFbGVtZW50KHRoaXMuX2RvY3VtZW50LCB0cnVlKTtcblx0XHRjb25zdCBkZWxheSA9IHRoaXMuX2RlbGF5O1xuXG5cdFx0aWYgKGVsZW1lbnQgIT0gbnVsbCkge1xuXHRcdFx0ZWxlbWVudC50ZXh0Q29udGVudCA9ICcnO1xuXHRcdFx0Y29uc3Qgc2V0VGV4dCA9ICgpID0+IChlbGVtZW50LnRleHRDb250ZW50ID0gbWVzc2FnZSk7XG5cdFx0XHRpZiAoZGVsYXkgPT09IG51bGwpIHtcblx0XHRcdFx0c2V0VGV4dCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2V0VGltZW91dChzZXRUZXh0LCBkZWxheSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iXX0=