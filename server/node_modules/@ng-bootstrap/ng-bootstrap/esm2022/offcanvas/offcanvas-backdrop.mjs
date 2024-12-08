import { afterNextRender, AfterRenderPhase, Component, ElementRef, EventEmitter, inject, Injector, Input, NgZone, Output, ViewEncapsulation, } from '@angular/core';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import * as i0 from "@angular/core";
export class NgbOffcanvasBackdrop {
    constructor() {
        this._nativeElement = inject(ElementRef).nativeElement;
        this._zone = inject(NgZone);
        this._injector = inject(Injector);
        this.dismissEvent = new EventEmitter();
    }
    ngOnInit() {
        afterNextRender(() => ngbRunTransition(this._zone, this._nativeElement, (element, animation) => {
            if (animation) {
                reflow(element);
            }
            element.classList.add('show');
        }, { animation: this.animation, runningTransition: 'continue' }), { injector: this._injector, phase: AfterRenderPhase.MixedReadWrite });
    }
    hide() {
        return ngbRunTransition(this._zone, this._nativeElement, ({ classList }) => classList.remove('show'), {
            animation: this.animation,
            runningTransition: 'stop',
        });
    }
    dismiss() {
        if (!this.static) {
            this.dismissEvent.emit(OffcanvasDismissReasons.BACKDROP_CLICK);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbOffcanvasBackdrop, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.2", type: NgbOffcanvasBackdrop, isStandalone: true, selector: "ngb-offcanvas-backdrop", inputs: { animation: "animation", backdropClass: "backdropClass", static: "static" }, outputs: { dismissEvent: "dismiss" }, host: { listeners: { "mousedown": "dismiss()" }, properties: { "class": "\"offcanvas-backdrop\" + (backdropClass ? \" \" + backdropClass : \"\")", "class.show": "!animation", "class.fade": "animation" } }, ngImport: i0, template: '', isInline: true, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbOffcanvasBackdrop, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-offcanvas-backdrop',
                    standalone: true,
                    encapsulation: ViewEncapsulation.None,
                    template: '',
                    host: {
                        '[class]': '"offcanvas-backdrop" + (backdropClass ? " " + backdropClass : "")',
                        '[class.show]': '!animation',
                        '[class.fade]': 'animation',
                        '(mousedown)': 'dismiss()',
                    },
                }]
        }], propDecorators: { animation: [{
                type: Input
            }], backdropClass: [{
                type: Input
            }], static: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLWJhY2tkcm9wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL29mZmNhbnZhcy9vZmZjYW52YXMtYmFja2Ryb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNOLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFDTixpQkFBaUIsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDcEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7QUFjdEUsTUFBTSxPQUFPLG9CQUFvQjtJQVpqQztRQWFTLG1CQUFjLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQTRCLENBQUM7UUFDakUsVUFBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixjQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBTWxCLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztLQWdDckQ7SUE5QkEsUUFBUTtRQUNQLGVBQWUsQ0FDZCxHQUFHLEVBQUUsQ0FDSixnQkFBZ0IsQ0FDZixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxjQUFjLEVBQ25CLENBQUMsT0FBb0IsRUFBRSxTQUFrQixFQUFFLEVBQUU7WUFDNUMsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakIsQ0FBQztZQUNELE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLENBQUMsRUFDRCxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxDQUM1RCxFQUNGLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxDQUNwRSxDQUFDO0lBQ0gsQ0FBQztJQUVELElBQUk7UUFDSCxPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDckcsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLGlCQUFpQixFQUFFLE1BQU07U0FDekIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU87UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7SUFDRixDQUFDOzhHQXhDVyxvQkFBb0I7a0dBQXBCLG9CQUFvQiw0WkFSdEIsRUFBRTs7MkZBUUEsb0JBQW9CO2tCQVpoQyxTQUFTO21CQUFDO29CQUNWLFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFVBQVUsRUFBRSxJQUFJO29CQUNoQixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsUUFBUSxFQUFFLEVBQUU7b0JBQ1osSUFBSSxFQUFFO3dCQUNMLFNBQVMsRUFBRSxtRUFBbUU7d0JBQzlFLGNBQWMsRUFBRSxZQUFZO3dCQUM1QixjQUFjLEVBQUUsV0FBVzt3QkFDM0IsYUFBYSxFQUFFLFdBQVc7cUJBQzFCO2lCQUNEOzhCQU1TLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRWEsWUFBWTtzQkFBOUIsTUFBTTt1QkFBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0YWZ0ZXJOZXh0UmVuZGVyLFxuXHRBZnRlclJlbmRlclBoYXNlLFxuXHRDb21wb25lbnQsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0aW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25Jbml0LFxuXHRPdXRwdXQsXG5cdFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBuZ2JSdW5UcmFuc2l0aW9uIH0gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHsgcmVmbG93IH0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9mZmNhbnZhc0Rpc21pc3NSZWFzb25zIH0gZnJvbSAnLi9vZmZjYW52YXMtZGlzbWlzcy1yZWFzb25zJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLW9mZmNhbnZhcy1iYWNrZHJvcCcsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG5cdHRlbXBsYXRlOiAnJyxcblx0aG9zdDoge1xuXHRcdCdbY2xhc3NdJzogJ1wib2ZmY2FudmFzLWJhY2tkcm9wXCIgKyAoYmFja2Ryb3BDbGFzcyA/IFwiIFwiICsgYmFja2Ryb3BDbGFzcyA6IFwiXCIpJyxcblx0XHQnW2NsYXNzLnNob3ddJzogJyFhbmltYXRpb24nLFxuXHRcdCdbY2xhc3MuZmFkZV0nOiAnYW5pbWF0aW9uJyxcblx0XHQnKG1vdXNlZG93biknOiAnZGlzbWlzcygpJyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiT2ZmY2FudmFzQmFja2Ryb3AgaW1wbGVtZW50cyBPbkluaXQge1xuXHRwcml2YXRlIF9uYXRpdmVFbGVtZW50ID0gaW5qZWN0KEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cdHByaXZhdGUgX3pvbmUgPSBpbmplY3QoTmdab25lKTtcblx0cHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXG5cdEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcblx0QElucHV0KCkgYmFja2Ryb3BDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKSBzdGF0aWM6IGJvb2xlYW47XG5cblx0QE91dHB1dCgnZGlzbWlzcycpIGRpc21pc3NFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRuZ09uSW5pdCgpIHtcblx0XHRhZnRlck5leHRSZW5kZXIoXG5cdFx0XHQoKSA9PlxuXHRcdFx0XHRuZ2JSdW5UcmFuc2l0aW9uKFxuXHRcdFx0XHRcdHRoaXMuX3pvbmUsXG5cdFx0XHRcdFx0dGhpcy5fbmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XHQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGFuaW1hdGlvbjogYm9vbGVhbikgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFuaW1hdGlvbikge1xuXHRcdFx0XHRcdFx0XHRyZWZsb3coZWxlbWVudCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHsgYW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZScgfSxcblx0XHRcdFx0KSxcblx0XHRcdHsgaW5qZWN0b3I6IHRoaXMuX2luamVjdG9yLCBwaGFzZTogQWZ0ZXJSZW5kZXJQaGFzZS5NaXhlZFJlYWRXcml0ZSB9LFxuXHRcdCk7XG5cdH1cblxuXHRoaWRlKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuXHRcdHJldHVybiBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX25hdGl2ZUVsZW1lbnQsICh7IGNsYXNzTGlzdCB9KSA9PiBjbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksIHtcblx0XHRcdGFuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sXG5cdFx0XHRydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnLFxuXHRcdH0pO1xuXHR9XG5cblx0ZGlzbWlzcygpIHtcblx0XHRpZiAoIXRoaXMuc3RhdGljKSB7XG5cdFx0XHR0aGlzLmRpc21pc3NFdmVudC5lbWl0KE9mZmNhbnZhc0Rpc21pc3NSZWFzb25zLkJBQ0tEUk9QX0NMSUNLKTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==