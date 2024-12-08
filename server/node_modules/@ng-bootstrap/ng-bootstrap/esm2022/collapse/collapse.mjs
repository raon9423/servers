import { Directive, ElementRef, EventEmitter, inject, Input, NgZone, Output } from '@angular/core';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCollapsingTransition } from '../util/transition/ngbCollapseTransition';
import { NgbCollapseConfig } from './collapse-config';
import * as i0 from "@angular/core";
/**
 * A directive to provide a simple way of hiding and showing elements on the
 * page.
 */
export class NgbCollapse {
    constructor() {
        this._config = inject(NgbCollapseConfig);
        this._element = inject(ElementRef);
        this._zone = inject(NgZone);
        /**
         * If `true`, collapse will be animated.
         *
         * Animation is triggered only when clicked on triggering element
         * or via the `.toggle()` function
         *
         * @since 8.0.0
         */
        this.animation = this._config.animation;
        /**
         * Flag used to track if the collapse setter is invoked during initialization
         * or not. This distinction is made in order to avoid running the transition during initialization.
         */
        this._afterInit = false;
        this._isCollapsed = false;
        this.ngbCollapseChange = new EventEmitter();
        /**
         * If `true`, will collapse horizontally.
         *
         * @since 13.1.0
         */
        this.horizontal = this._config.horizontal;
        /**
         * An event emitted when the collapse element is shown, after the transition.
         * It has no payload.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the collapse element is hidden, after the transition.
         * It has no payload.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
    }
    /**
     * If `true`, will collapse the element or show it otherwise.
     */
    set collapsed(isCollapsed) {
        if (this._isCollapsed !== isCollapsed) {
            this._isCollapsed = isCollapsed;
            if (this._afterInit) {
                this._runTransitionWithEvents(isCollapsed, this.animation);
            }
        }
    }
    ngOnInit() {
        this._runTransition(this._isCollapsed, false);
        this._afterInit = true;
    }
    /**
     * Triggers collapsing programmatically.
     *
     * If there is a collapsing transition running already, it will be reversed.
     * If the animations are turned off this happens synchronously.
     *
     * @since 8.0.0
     */
    toggle(open = this._isCollapsed) {
        this.collapsed = !open;
        this.ngbCollapseChange.next(this._isCollapsed);
    }
    _runTransition(collapsed, animation) {
        return ngbRunTransition(this._zone, this._element.nativeElement, ngbCollapsingTransition, {
            animation,
            runningTransition: 'stop',
            context: { direction: collapsed ? 'hide' : 'show', dimension: this.horizontal ? 'width' : 'height' },
        });
    }
    _runTransitionWithEvents(collapsed, animation) {
        this._runTransition(collapsed, animation).subscribe(() => {
            if (collapsed) {
                this.hidden.emit();
            }
            else {
                this.shown.emit();
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbCollapse, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbCollapse, isStandalone: true, selector: "[ngbCollapse]", inputs: { animation: "animation", collapsed: ["ngbCollapse", "collapsed"], horizontal: "horizontal" }, outputs: { ngbCollapseChange: "ngbCollapseChange", shown: "shown", hidden: "hidden" }, host: { properties: { "class.collapse-horizontal": "horizontal" } }, exportAs: ["ngbCollapse"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbCollapse, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbCollapse]',
                    exportAs: 'ngbCollapse',
                    standalone: true,
                    host: {
                        '[class.collapse-horizontal]': 'horizontal',
                    },
                }]
        }], propDecorators: { animation: [{
                type: Input
            }], collapsed: [{
                type: Input,
                args: ['ngbCollapse']
            }], ngbCollapseChange: [{
                type: Output
            }], horizontal: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGFwc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29sbGFwc2UvY29sbGFwc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7QUFFdEQ7OztHQUdHO0FBU0gsTUFBTSxPQUFPLFdBQVc7SUFSeEI7UUFTUyxZQUFPLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDcEMsYUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QixVQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9COzs7Ozs7O1dBT0c7UUFDTSxjQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFFNUM7OztXQUdHO1FBQ0ssZUFBVSxHQUFHLEtBQUssQ0FBQztRQUVuQixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQWVuQixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBRTFEOzs7O1dBSUc7UUFDTSxlQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFFOUM7Ozs7O1dBS0c7UUFDTyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUUzQzs7Ozs7V0FLRztRQUNPLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO0tBcUM1QztJQXpFQTs7T0FFRztJQUNILElBQ0ksU0FBUyxDQUFDLFdBQW9CO1FBQ2pDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxXQUFXLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztZQUNoQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUQsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBMkJELFFBQVE7UUFDUCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxNQUFNLENBQUMsT0FBZ0IsSUFBSSxDQUFDLFlBQVk7UUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU8sY0FBYyxDQUFDLFNBQWtCLEVBQUUsU0FBa0I7UUFDNUQsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLHVCQUF1QixFQUFFO1lBQ3pGLFNBQVM7WUFDVCxpQkFBaUIsRUFBRSxNQUFNO1lBQ3pCLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtTQUNwRyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRU8sd0JBQXdCLENBQUMsU0FBa0IsRUFBRSxTQUFrQjtRQUN0RSxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3hELElBQUksU0FBUyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQixDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuQixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDOzhHQS9GVyxXQUFXO2tHQUFYLFdBQVc7OzJGQUFYLFdBQVc7a0JBUnZCLFNBQVM7bUJBQUM7b0JBQ1YsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFFBQVEsRUFBRSxhQUFhO29CQUN2QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFO3dCQUNMLDZCQUE2QixFQUFFLFlBQVk7cUJBQzNDO2lCQUNEOzhCQWNTLFNBQVM7c0JBQWpCLEtBQUs7Z0JBY0YsU0FBUztzQkFEWixLQUFLO3VCQUFDLGFBQWE7Z0JBVVYsaUJBQWlCO3NCQUExQixNQUFNO2dCQU9FLFVBQVU7c0JBQWxCLEtBQUs7Z0JBUUksS0FBSztzQkFBZCxNQUFNO2dCQVFHLE1BQU07c0JBQWYsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBpbmplY3QsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBuZ2JSdW5UcmFuc2l0aW9uIH0gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHsgbmdiQ29sbGFwc2luZ1RyYW5zaXRpb24gfSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiQ29sbGFwc2VUcmFuc2l0aW9uJztcbmltcG9ydCB7IE5nYkNvbGxhcHNlQ29uZmlnIH0gZnJvbSAnLi9jb2xsYXBzZS1jb25maWcnO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIHByb3ZpZGUgYSBzaW1wbGUgd2F5IG9mIGhpZGluZyBhbmQgc2hvd2luZyBlbGVtZW50cyBvbiB0aGVcbiAqIHBhZ2UuXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ1tuZ2JDb2xsYXBzZV0nLFxuXHRleHBvcnRBczogJ25nYkNvbGxhcHNlJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdCdbY2xhc3MuY29sbGFwc2UtaG9yaXpvbnRhbF0nOiAnaG9yaXpvbnRhbCcsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkNvbGxhcHNlIGltcGxlbWVudHMgT25Jbml0IHtcblx0cHJpdmF0ZSBfY29uZmlnID0gaW5qZWN0KE5nYkNvbGxhcHNlQ29uZmlnKTtcblx0cHJpdmF0ZSBfZWxlbWVudCA9IGluamVjdChFbGVtZW50UmVmKTtcblx0cHJpdmF0ZSBfem9uZSA9IGluamVjdChOZ1pvbmUpO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIGNvbGxhcHNlIHdpbGwgYmUgYW5pbWF0ZWQuXG5cdCAqXG5cdCAqIEFuaW1hdGlvbiBpcyB0cmlnZ2VyZWQgb25seSB3aGVuIGNsaWNrZWQgb24gdHJpZ2dlcmluZyBlbGVtZW50XG5cdCAqIG9yIHZpYSB0aGUgYC50b2dnbGUoKWAgZnVuY3Rpb25cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRASW5wdXQoKSBhbmltYXRpb24gPSB0aGlzLl9jb25maWcuYW5pbWF0aW9uO1xuXG5cdC8qKlxuXHQgKiBGbGFnIHVzZWQgdG8gdHJhY2sgaWYgdGhlIGNvbGxhcHNlIHNldHRlciBpcyBpbnZva2VkIGR1cmluZyBpbml0aWFsaXphdGlvblxuXHQgKiBvciBub3QuIFRoaXMgZGlzdGluY3Rpb24gaXMgbWFkZSBpbiBvcmRlciB0byBhdm9pZCBydW5uaW5nIHRoZSB0cmFuc2l0aW9uIGR1cmluZyBpbml0aWFsaXphdGlvbi5cblx0ICovXG5cdHByaXZhdGUgX2FmdGVySW5pdCA9IGZhbHNlO1xuXG5cdHByaXZhdGUgX2lzQ29sbGFwc2VkID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgd2lsbCBjb2xsYXBzZSB0aGUgZWxlbWVudCBvciBzaG93IGl0IG90aGVyd2lzZS5cblx0ICovXG5cdEBJbnB1dCgnbmdiQ29sbGFwc2UnKVxuXHRzZXQgY29sbGFwc2VkKGlzQ29sbGFwc2VkOiBib29sZWFuKSB7XG5cdFx0aWYgKHRoaXMuX2lzQ29sbGFwc2VkICE9PSBpc0NvbGxhcHNlZCkge1xuXHRcdFx0dGhpcy5faXNDb2xsYXBzZWQgPSBpc0NvbGxhcHNlZDtcblx0XHRcdGlmICh0aGlzLl9hZnRlckluaXQpIHtcblx0XHRcdFx0dGhpcy5fcnVuVHJhbnNpdGlvbldpdGhFdmVudHMoaXNDb2xsYXBzZWQsIHRoaXMuYW5pbWF0aW9uKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRAT3V0cHV0KCkgbmdiQ29sbGFwc2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgd2lsbCBjb2xsYXBzZSBob3Jpem9udGFsbHkuXG5cdCAqXG5cdCAqIEBzaW5jZSAxMy4xLjBcblx0ICovXG5cdEBJbnB1dCgpIGhvcml6b250YWwgPSB0aGlzLl9jb25maWcuaG9yaXpvbnRhbDtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjb2xsYXBzZSBlbGVtZW50IGlzIHNob3duLCBhZnRlciB0aGUgdHJhbnNpdGlvbi5cblx0ICogSXQgaGFzIG5vIHBheWxvYWQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbGxhcHNlIGVsZW1lbnQgaXMgaGlkZGVuLCBhZnRlciB0aGUgdHJhbnNpdGlvbi5cblx0ICogSXQgaGFzIG5vIHBheWxvYWQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLl9ydW5UcmFuc2l0aW9uKHRoaXMuX2lzQ29sbGFwc2VkLCBmYWxzZSk7XG5cdFx0dGhpcy5fYWZ0ZXJJbml0ID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcmlnZ2VycyBjb2xsYXBzaW5nIHByb2dyYW1tYXRpY2FsbHkuXG5cdCAqXG5cdCAqIElmIHRoZXJlIGlzIGEgY29sbGFwc2luZyB0cmFuc2l0aW9uIHJ1bm5pbmcgYWxyZWFkeSwgaXQgd2lsbCBiZSByZXZlcnNlZC5cblx0ICogSWYgdGhlIGFuaW1hdGlvbnMgYXJlIHR1cm5lZCBvZmYgdGhpcyBoYXBwZW5zIHN5bmNocm9ub3VzbHkuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0dG9nZ2xlKG9wZW46IGJvb2xlYW4gPSB0aGlzLl9pc0NvbGxhcHNlZCkge1xuXHRcdHRoaXMuY29sbGFwc2VkID0gIW9wZW47XG5cdFx0dGhpcy5uZ2JDb2xsYXBzZUNoYW5nZS5uZXh0KHRoaXMuX2lzQ29sbGFwc2VkKTtcblx0fVxuXG5cdHByaXZhdGUgX3J1blRyYW5zaXRpb24oY29sbGFwc2VkOiBib29sZWFuLCBhbmltYXRpb246IGJvb2xlYW4pIHtcblx0XHRyZXR1cm4gbmdiUnVuVHJhbnNpdGlvbih0aGlzLl96b25lLCB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIG5nYkNvbGxhcHNpbmdUcmFuc2l0aW9uLCB7XG5cdFx0XHRhbmltYXRpb24sXG5cdFx0XHRydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnLFxuXHRcdFx0Y29udGV4dDogeyBkaXJlY3Rpb246IGNvbGxhcHNlZCA/ICdoaWRlJyA6ICdzaG93JywgZGltZW5zaW9uOiB0aGlzLmhvcml6b250YWwgPyAnd2lkdGgnIDogJ2hlaWdodCcgfSxcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX3J1blRyYW5zaXRpb25XaXRoRXZlbnRzKGNvbGxhcHNlZDogYm9vbGVhbiwgYW5pbWF0aW9uOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fcnVuVHJhbnNpdGlvbihjb2xsYXBzZWQsIGFuaW1hdGlvbikuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdGlmIChjb2xsYXBzZWQpIHtcblx0XHRcdFx0dGhpcy5oaWRkZW4uZW1pdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5zaG93bi5lbWl0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==