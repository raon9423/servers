import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * A service that represents the keyboard navigation.
 *
 * Default keyboard shortcuts [are documented in the overview](#/components/datepicker/overview#keyboard-shortcuts)
 *
 * @since 5.2.0
 */
export class NgbDatepickerKeyboardService {
    /**
     * Processes a keyboard event.
     */
    processKey(event, datepicker) {
        const { state, calendar } = datepicker;
        switch (event.key) {
            case 'PageUp':
                datepicker.focusDate(calendar.getPrev(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
                break;
            case 'PageDown':
                datepicker.focusDate(calendar.getNext(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
                break;
            case 'End':
                datepicker.focusDate(event.shiftKey ? state.maxDate : state.lastDate);
                break;
            case 'Home':
                datepicker.focusDate(event.shiftKey ? state.minDate : state.firstDate);
                break;
            case 'ArrowLeft':
                datepicker.focusDate(calendar.getPrev(state.focusedDate, 'd', 1));
                break;
            case 'ArrowUp':
                datepicker.focusDate(calendar.getPrev(state.focusedDate, 'd', calendar.getDaysPerWeek()));
                break;
            case 'ArrowRight':
                datepicker.focusDate(calendar.getNext(state.focusedDate, 'd', 1));
                break;
            case 'ArrowDown':
                datepicker.focusDate(calendar.getNext(state.focusedDate, 'd', calendar.getDaysPerWeek()));
                break;
            case 'Enter':
            case ' ':
                datepicker.focusSelect();
                break;
            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerKeyboardService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerKeyboardService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDatepickerKeyboardService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1rZXlib2FyZC1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1rZXlib2FyZC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRzNDOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyw0QkFBNEI7SUFDeEM7O09BRUc7SUFDSCxVQUFVLENBQUMsS0FBb0IsRUFBRSxVQUF5QjtRQUN6RCxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLFVBQVUsQ0FBQztRQUN2QyxRQUFRLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNuQixLQUFLLFFBQVE7Z0JBQ1osVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekYsTUFBTTtZQUNQLEtBQUssVUFBVTtnQkFDZCxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RixNQUFNO1lBQ1AsS0FBSyxLQUFLO2dCQUNULFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0RSxNQUFNO1lBQ1AsS0FBSyxNQUFNO2dCQUNWLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN2RSxNQUFNO1lBQ1AsS0FBSyxXQUFXO2dCQUNmLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxNQUFNO1lBQ1AsS0FBSyxTQUFTO2dCQUNiLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMxRixNQUFNO1lBQ1AsS0FBSyxZQUFZO2dCQUNoQixVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsTUFBTTtZQUNQLEtBQUssV0FBVztnQkFDZixVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDMUYsTUFBTTtZQUNQLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxHQUFHO2dCQUNQLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDekIsTUFBTTtZQUNQO2dCQUNDLE9BQU87UUFDVCxDQUFDO1FBQ0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDOzhHQXhDVyw0QkFBNEI7a0hBQTVCLDRCQUE0QixjQURmLE1BQU07OzJGQUNuQiw0QkFBNEI7a0JBRHhDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdiRGF0ZXBpY2tlciB9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5cbi8qKlxuICogQSBzZXJ2aWNlIHRoYXQgcmVwcmVzZW50cyB0aGUga2V5Ym9hcmQgbmF2aWdhdGlvbi5cbiAqXG4gKiBEZWZhdWx0IGtleWJvYXJkIHNob3J0Y3V0cyBbYXJlIGRvY3VtZW50ZWQgaW4gdGhlIG92ZXJ2aWV3XSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9vdmVydmlldyNrZXlib2FyZC1zaG9ydGN1dHMpXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlcktleWJvYXJkU2VydmljZSB7XG5cdC8qKlxuXHQgKiBQcm9jZXNzZXMgYSBrZXlib2FyZCBldmVudC5cblx0ICovXG5cdHByb2Nlc3NLZXkoZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGRhdGVwaWNrZXI6IE5nYkRhdGVwaWNrZXIpIHtcblx0XHRjb25zdCB7IHN0YXRlLCBjYWxlbmRhciB9ID0gZGF0ZXBpY2tlcjtcblx0XHRzd2l0Y2ggKGV2ZW50LmtleSkge1xuXHRcdFx0Y2FzZSAnUGFnZVVwJzpcblx0XHRcdFx0ZGF0ZXBpY2tlci5mb2N1c0RhdGUoY2FsZW5kYXIuZ2V0UHJldihzdGF0ZS5mb2N1c2VkRGF0ZSwgZXZlbnQuc2hpZnRLZXkgPyAneScgOiAnbScsIDEpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdQYWdlRG93bic6XG5cdFx0XHRcdGRhdGVwaWNrZXIuZm9jdXNEYXRlKGNhbGVuZGFyLmdldE5leHQoc3RhdGUuZm9jdXNlZERhdGUsIGV2ZW50LnNoaWZ0S2V5ID8gJ3knIDogJ20nLCAxKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnRW5kJzpcblx0XHRcdFx0ZGF0ZXBpY2tlci5mb2N1c0RhdGUoZXZlbnQuc2hpZnRLZXkgPyBzdGF0ZS5tYXhEYXRlIDogc3RhdGUubGFzdERhdGUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0hvbWUnOlxuXHRcdFx0XHRkYXRlcGlja2VyLmZvY3VzRGF0ZShldmVudC5zaGlmdEtleSA/IHN0YXRlLm1pbkRhdGUgOiBzdGF0ZS5maXJzdERhdGUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0Fycm93TGVmdCc6XG5cdFx0XHRcdGRhdGVwaWNrZXIuZm9jdXNEYXRlKGNhbGVuZGFyLmdldFByZXYoc3RhdGUuZm9jdXNlZERhdGUsICdkJywgMSkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0Fycm93VXAnOlxuXHRcdFx0XHRkYXRlcGlja2VyLmZvY3VzRGF0ZShjYWxlbmRhci5nZXRQcmV2KHN0YXRlLmZvY3VzZWREYXRlLCAnZCcsIGNhbGVuZGFyLmdldERheXNQZXJXZWVrKCkpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdBcnJvd1JpZ2h0Jzpcblx0XHRcdFx0ZGF0ZXBpY2tlci5mb2N1c0RhdGUoY2FsZW5kYXIuZ2V0TmV4dChzdGF0ZS5mb2N1c2VkRGF0ZSwgJ2QnLCAxKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnQXJyb3dEb3duJzpcblx0XHRcdFx0ZGF0ZXBpY2tlci5mb2N1c0RhdGUoY2FsZW5kYXIuZ2V0TmV4dChzdGF0ZS5mb2N1c2VkRGF0ZSwgJ2QnLCBjYWxlbmRhci5nZXREYXlzUGVyV2VlaygpKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnRW50ZXInOlxuXHRcdFx0Y2FzZSAnICc6XG5cdFx0XHRcdGRhdGVwaWNrZXIuZm9jdXNTZWxlY3QoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH1cbn1cbiJdfQ==