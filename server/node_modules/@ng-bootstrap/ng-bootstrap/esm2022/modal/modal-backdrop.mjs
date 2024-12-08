import { afterNextRender, AfterRenderPhase, Component, ElementRef, inject, Injector, Input, NgZone, ViewEncapsulation, } from '@angular/core';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import * as i0 from "@angular/core";
export class NgbModalBackdrop {
    constructor() {
        this._nativeElement = inject(ElementRef).nativeElement;
        this._zone = inject(NgZone);
        this._injector = inject(Injector);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbModalBackdrop, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.2", type: NgbModalBackdrop, isStandalone: true, selector: "ngb-modal-backdrop", inputs: { animation: "animation", backdropClass: "backdropClass" }, host: { properties: { "class": "\"modal-backdrop\" + (backdropClass ? \" \" + backdropClass : \"\")", "class.show": "!animation", "class.fade": "animation" }, styleAttribute: "z-index: 1055" }, ngImport: i0, template: '', isInline: true, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbModalBackdrop, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-modal-backdrop',
                    standalone: true,
                    encapsulation: ViewEncapsulation.None,
                    template: '',
                    host: {
                        '[class]': '"modal-backdrop" + (backdropClass ? " " + backdropClass : "")',
                        '[class.show]': '!animation',
                        '[class.fade]': 'animation',
                        style: 'z-index: 1055',
                    },
                }]
        }], propDecorators: { animation: [{
                type: Input
            }], backdropClass: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtYmFja2Ryb3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kYWwvbW9kYWwtYmFja2Ryb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNOLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBRU4saUJBQWlCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7O0FBY3RDLE1BQU0sT0FBTyxnQkFBZ0I7SUFaN0I7UUFhUyxtQkFBYyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUE0QixDQUFDO1FBQ2pFLFVBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQTZCckM7SUF4QkEsUUFBUTtRQUNQLGVBQWUsQ0FDZCxHQUFHLEVBQUUsQ0FDSixnQkFBZ0IsQ0FDZixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxjQUFjLEVBQ25CLENBQUMsT0FBb0IsRUFBRSxTQUFrQixFQUFFLEVBQUU7WUFDNUMsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakIsQ0FBQztZQUNELE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLENBQUMsRUFDRCxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxDQUM1RCxFQUNGLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxDQUNwRSxDQUFDO0lBQ0gsQ0FBQztJQUVELElBQUk7UUFDSCxPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDckcsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLGlCQUFpQixFQUFFLE1BQU07U0FDekIsQ0FBQyxDQUFDO0lBQ0osQ0FBQzs4R0EvQlcsZ0JBQWdCO2tHQUFoQixnQkFBZ0Isb1ZBUmxCLEVBQUU7OzJGQVFBLGdCQUFnQjtrQkFaNUIsU0FBUzttQkFBQztvQkFDVixRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRTt3QkFDTCxTQUFTLEVBQUUsK0RBQStEO3dCQUMxRSxjQUFjLEVBQUUsWUFBWTt3QkFDNUIsY0FBYyxFQUFFLFdBQVc7d0JBQzNCLEtBQUssRUFBRSxlQUFlO3FCQUN0QjtpQkFDRDs4QkFNUyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLGFBQWE7c0JBQXJCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRhZnRlck5leHRSZW5kZXIsXG5cdEFmdGVyUmVuZGVyUGhhc2UsXG5cdENvbXBvbmVudCxcblx0RWxlbWVudFJlZixcblx0aW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25Jbml0LFxuXHRWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgbmdiUnVuVHJhbnNpdGlvbiB9IGZyb20gJy4uL3V0aWwvdHJhbnNpdGlvbi9uZ2JUcmFuc2l0aW9uJztcbmltcG9ydCB7IHJlZmxvdyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25nYi1tb2RhbC1iYWNrZHJvcCcsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG5cdHRlbXBsYXRlOiAnJyxcblx0aG9zdDoge1xuXHRcdCdbY2xhc3NdJzogJ1wibW9kYWwtYmFja2Ryb3BcIiArIChiYWNrZHJvcENsYXNzID8gXCIgXCIgKyBiYWNrZHJvcENsYXNzIDogXCJcIiknLFxuXHRcdCdbY2xhc3Muc2hvd10nOiAnIWFuaW1hdGlvbicsXG5cdFx0J1tjbGFzcy5mYWRlXSc6ICdhbmltYXRpb24nLFxuXHRcdHN0eWxlOiAnei1pbmRleDogMTA1NScsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsQmFja2Ryb3AgaW1wbGVtZW50cyBPbkluaXQge1xuXHRwcml2YXRlIF9uYXRpdmVFbGVtZW50ID0gaW5qZWN0KEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cdHByaXZhdGUgX3pvbmUgPSBpbmplY3QoTmdab25lKTtcblx0cHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXG5cdEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcblx0QElucHV0KCkgYmFja2Ryb3BDbGFzczogc3RyaW5nO1xuXG5cdG5nT25Jbml0KCkge1xuXHRcdGFmdGVyTmV4dFJlbmRlcihcblx0XHRcdCgpID0+XG5cdFx0XHRcdG5nYlJ1blRyYW5zaXRpb24oXG5cdFx0XHRcdFx0dGhpcy5fem9uZSxcblx0XHRcdFx0XHR0aGlzLl9uYXRpdmVFbGVtZW50LFxuXHRcdFx0XHRcdChlbGVtZW50OiBIVE1MRWxlbWVudCwgYW5pbWF0aW9uOiBib29sZWFuKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYW5pbWF0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdHJlZmxvdyhlbGVtZW50KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0eyBhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLCBydW5uaW5nVHJhbnNpdGlvbjogJ2NvbnRpbnVlJyB9LFxuXHRcdFx0XHQpLFxuXHRcdFx0eyBpbmplY3RvcjogdGhpcy5faW5qZWN0b3IsIHBoYXNlOiBBZnRlclJlbmRlclBoYXNlLk1peGVkUmVhZFdyaXRlIH0sXG5cdFx0KTtcblx0fVxuXG5cdGhpZGUoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG5cdFx0cmV0dXJuIG5nYlJ1blRyYW5zaXRpb24odGhpcy5fem9uZSwgdGhpcy5fbmF0aXZlRWxlbWVudCwgKHsgY2xhc3NMaXN0IH0pID0+IGNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKSwge1xuXHRcdFx0YW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbixcblx0XHRcdHJ1bm5pbmdUcmFuc2l0aW9uOiAnc3RvcCcsXG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==