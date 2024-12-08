import { ChangeDetectorRef, ContentChildren, DestroyRef, Directive, ElementRef, inject, Input, Output, } from '@angular/core';
import { NgbScrollSpyService } from './scrollspy.service';
import { isString } from '../util/util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as i0 from "@angular/core";
/**
 * A helper directive to that links menu items and fragments together.
 *
 * It will automatically add the `.active` class to the menu item when the associated fragment becomes active.
 *
 * @since 15.1.0
 */
export class NgbScrollSpyItem {
    constructor() {
        this._changeDetector = inject(ChangeDetectorRef);
        this._scrollSpyMenu = inject(NgbScrollSpyMenu, { optional: true });
        this._scrollSpyAPI = this._scrollSpyMenu ?? inject(NgbScrollSpyService);
        this._destroyRef = inject(DestroyRef);
        this._isActive = false;
    }
    /**
     * References the scroll spy directive, the id of the associated fragment and the parent menu item.
     *
     * Can be used like:
     *  - `ngbScrollSpyItem="fragmentId"`
     *  - `[ngbScrollSpyItem]="scrollSpy" fragment="fragmentId"
     *  - `[ngbScrollSpyItem]="[scrollSpy, 'fragmentId']"` parent="parentId"`
     *  - `[ngbScrollSpyItem]="[scrollSpy, 'fragmentId', 'parentId']"`
     *
     *  As well as together with `[fragment]` and `[parent]` inputs.
     */
    set data(data) {
        if (Array.isArray(data)) {
            this._scrollSpyAPI = data[0];
            this.fragment = data[1];
            this.parent ??= data[2];
        }
        else if (data instanceof NgbScrollSpy) {
            this._scrollSpyAPI = data;
        }
        else if (isString(data)) {
            this.fragment = data;
        }
    }
    ngOnInit() {
        // if it is not a part of a bigger menu, it should handle activation itself
        if (!this._scrollSpyMenu) {
            this._scrollSpyAPI.active$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((active) => {
                if (active === this.fragment) {
                    this._activate();
                }
                else {
                    this._deactivate();
                }
                this._changeDetector.markForCheck();
            });
        }
    }
    /**
     * @internal
     */
    _activate() {
        this._isActive = true;
        if (this._scrollSpyMenu) {
            this._scrollSpyMenu.getItem(this.parent ?? '')?._activate();
        }
    }
    /**
     * @internal
     */
    _deactivate() {
        this._isActive = false;
        if (this._scrollSpyMenu) {
            this._scrollSpyMenu.getItem(this.parent ?? '')?._deactivate();
        }
    }
    /**
     * Returns `true`, if the associated fragment is active.
     */
    isActive() {
        return this._isActive;
    }
    /**
     * Scrolls to the associated fragment.
     */
    scrollTo(options) {
        this._scrollSpyAPI.scrollTo(this.fragment, options);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbScrollSpyItem, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbScrollSpyItem, isStandalone: true, selector: "[ngbScrollSpyItem]", inputs: { data: ["ngbScrollSpyItem", "data"], fragment: "fragment", parent: "parent" }, host: { listeners: { "click": "scrollTo();" }, properties: { "class.active": "isActive()" } }, exportAs: ["ngbScrollSpyItem"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbScrollSpyItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbScrollSpyItem]',
                    standalone: true,
                    exportAs: 'ngbScrollSpyItem',
                    host: {
                        '[class.active]': 'isActive()',
                        '(click)': 'scrollTo();',
                    },
                }]
        }], propDecorators: { data: [{
                type: Input,
                args: ['ngbScrollSpyItem']
            }], fragment: [{
                type: Input
            }], parent: [{
                type: Input
            }] } });
/**
 * An optional scroll spy menu directive to build hierarchical menus
 * and simplify the [`NgbScrollSpyItem`](#/components/scrollspy/api#NgbScrollSpyItem) configuration.
 *
 * @since 15.1.0
 */
export class NgbScrollSpyMenu {
    constructor() {
        this._scrollSpyRef = inject(NgbScrollSpyService);
        this._destroyRef = inject(DestroyRef);
        this._map = new Map();
        this._lastActiveItem = null;
    }
    set scrollSpy(scrollSpy) {
        this._scrollSpyRef = scrollSpy;
    }
    get active() {
        return this._scrollSpyRef.active;
    }
    get active$() {
        return this._scrollSpyRef.active$;
    }
    scrollTo(fragment, options) {
        this._scrollSpyRef.scrollTo(fragment, options);
    }
    getItem(id) {
        return this._map.get(id);
    }
    ngAfterViewInit() {
        this._items.changes.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this._rebuildMap());
        this._rebuildMap();
        this._scrollSpyRef.active$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((activeId) => {
            this._lastActiveItem?._deactivate();
            const item = this._map.get(activeId);
            if (item) {
                item._activate();
                this._lastActiveItem = item;
            }
        });
    }
    _rebuildMap() {
        this._map.clear();
        for (let item of this._items) {
            this._map.set(item.fragment, item);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbScrollSpyMenu, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbScrollSpyMenu, isStandalone: true, selector: "[ngbScrollSpyMenu]", inputs: { scrollSpy: ["ngbScrollSpyMenu", "scrollSpy"] }, queries: [{ propertyName: "_items", predicate: NgbScrollSpyItem, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbScrollSpyMenu, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbScrollSpyMenu]',
                    standalone: true,
                }]
        }], propDecorators: { _items: [{
                type: ContentChildren,
                args: [NgbScrollSpyItem, { descendants: true }]
            }], scrollSpy: [{
                type: Input,
                args: ['ngbScrollSpyMenu']
            }] } });
/**
 * A directive to put on a scrollable container.
 *
 * It will instantiate a [`NgbScrollSpyService`](#/components/scrollspy/api#NgbScrollSpyService).
 *
 * @since 15.1.0
 */
export class NgbScrollSpy {
    constructor() {
        this._initialFragment = null;
        this._service = inject(NgbScrollSpyService);
        this._nativeElement = inject(ElementRef).nativeElement;
        /**
         * An event raised when the active section changes.
         *
         * Payload is the id of the new active section, empty string if none.
         */
        this.activeChange = this._service.active$;
    }
    set active(fragment) {
        this._initialFragment = fragment;
        this.scrollTo(fragment);
    }
    /**
     * Getter/setter for the currently active fragment id.
     */
    get active() {
        return this._service.active;
    }
    /**
     * Returns an observable that emits currently active section id.
     */
    get active$() {
        return this._service.active$;
    }
    ngAfterViewInit() {
        this._service.start({
            processChanges: this.processChanges,
            root: this._nativeElement,
            rootMargin: this.rootMargin,
            threshold: this.threshold,
            ...(this._initialFragment && { initialFragment: this._initialFragment }),
        });
    }
    /**
     * @internal
     */
    _registerFragment(fragment) {
        this._service.observe(fragment.id);
    }
    /**
     * @internal
     */
    _unregisterFragment(fragment) {
        this._service.unobserve(fragment.id);
    }
    /**
     * Scrolls to a fragment that is identified by the `ngbScrollSpyFragment` directive.
     * An id or an element reference can be passed.
     */
    scrollTo(fragment, options) {
        this._service.scrollTo(fragment, {
            ...(this.scrollBehavior && { behavior: this.scrollBehavior }),
            ...options,
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbScrollSpy, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbScrollSpy, isStandalone: true, selector: "[ngbScrollSpy]", inputs: { processChanges: "processChanges", rootMargin: "rootMargin", scrollBehavior: "scrollBehavior", threshold: "threshold", active: "active" }, outputs: { activeChange: "activeChange" }, host: { attributes: { "tabindex": "0" }, styleAttribute: "overflow-y: auto" }, providers: [NgbScrollSpyService], exportAs: ["ngbScrollSpy"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbScrollSpy, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbScrollSpy]',
                    standalone: true,
                    exportAs: 'ngbScrollSpy',
                    host: {
                        tabindex: '0',
                        style: 'overflow-y: auto',
                    },
                    providers: [NgbScrollSpyService],
                }]
        }], propDecorators: { processChanges: [{
                type: Input
            }], rootMargin: [{
                type: Input
            }], scrollBehavior: [{
                type: Input
            }], threshold: [{
                type: Input
            }], active: [{
                type: Input
            }], activeChange: [{
                type: Output
            }] } });
/**
 * A directive to put on a fragment observed inside a scrollspy container.
 *
 * @since 15.1.0
 */
export class NgbScrollSpyFragment {
    constructor() {
        this._destroyRef = inject(DestroyRef);
        this._scrollSpy = inject(NgbScrollSpy);
    }
    ngAfterViewInit() {
        this._scrollSpy._registerFragment(this);
        this._destroyRef.onDestroy(() => this._scrollSpy._unregisterFragment(this));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbScrollSpyFragment, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbScrollSpyFragment, isStandalone: true, selector: "[ngbScrollSpyFragment]", inputs: { id: ["ngbScrollSpyFragment", "id"] }, host: { properties: { "id": "id" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbScrollSpyFragment, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbScrollSpyFragment]',
                    standalone: true,
                    host: {
                        '[id]': 'id',
                    },
                }]
        }], propDecorators: { id: [{
                type: Input,
                args: ['ngbScrollSpyFragment']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsc3B5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Njcm9sbHNweS9zY3JvbGxzcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVOLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsVUFBVSxFQUNWLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFFTCxNQUFNLEdBRU4sTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUE4QixtQkFBbUIsRUFBc0IsTUFBTSxxQkFBcUIsQ0FBQztBQUUxRyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDOztBQWFoRTs7Ozs7O0dBTUc7QUFVSCxNQUFNLE9BQU8sZ0JBQWdCO0lBVDdCO1FBVVMsb0JBQWUsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM1QyxtQkFBYyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzlELGtCQUFhLEdBQW9CLElBQUksQ0FBQyxjQUFjLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDcEYsZ0JBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFakMsY0FBUyxHQUFHLEtBQUssQ0FBQztLQWtGMUI7SUFoRkE7Ozs7Ozs7Ozs7T0FVRztJQUNILElBQStCLElBQUksQ0FBQyxJQUE2RDtRQUNoRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsTUFBTSxLQUFL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aUJBQ2hDOzhCQWFTLGNBQWM7c0JBQXRCLEtBQUs7Z0JBS0csVUFBVTtzQkFBbEIsS0FBSztnQkFLRyxjQUFjO3NCQUF0QixLQUFLO2dCQUtHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRU8sTUFBTTtzQkFBbEIsS0FBSztnQkFVSSxZQUFZO3NCQUFyQixNQUFNOztBQW9EUjs7OztHQUlHO0FBUUgsTUFBTSxPQUFPLG9CQUFvQjtJQVBqQztRQVFTLGdCQUFXLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pDLGVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7S0FZMUM7SUFKQSxlQUFlO1FBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQzs4R0FiVyxvQkFBb0I7a0dBQXBCLG9CQUFvQjs7MkZBQXBCLG9CQUFvQjtrQkFQaEMsU0FBUzttQkFBQztvQkFDVixRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFO3dCQUNMLE1BQU0sRUFBRSxJQUFJO3FCQUNaO2lCQUNEOzhCQVMrQixFQUFFO3NCQUFoQyxLQUFLO3VCQUFDLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFmdGVyVmlld0luaXQsXG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb250ZW50Q2hpbGRyZW4sXG5cdERlc3Ryb3lSZWYsXG5cdERpcmVjdGl2ZSxcblx0RWxlbWVudFJlZixcblx0aW5qZWN0LFxuXHRJbnB1dCxcblx0T25Jbml0LFxuXHRPdXRwdXQsXG5cdFF1ZXJ5TGlzdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ2JTY3JvbGxTcHlQcm9jZXNzQ2hhbmdlcywgTmdiU2Nyb2xsU3B5U2VydmljZSwgTmdiU2Nyb2xsVG9PcHRpb25zIH0gZnJvbSAnLi9zY3JvbGxzcHkuc2VydmljZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyB0YWtlVW50aWxEZXN0cm95ZWQgfSBmcm9tICdAYW5ndWxhci9jb3JlL3J4anMtaW50ZXJvcCc7XG5cbi8qKlxuICogQ29tbW9uIGludGVyZmFjZSBmb3IgdGhlIHNjcm9sbCBzcHkgQVBJLlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlNjcm9sbFNweVJlZiB7XG5cdGdldCBhY3RpdmUoKTogc3RyaW5nO1xuXHRnZXQgYWN0aXZlJCgpOiBPYnNlcnZhYmxlPHN0cmluZz47XG5cdHNjcm9sbFRvKGZyYWdtZW50OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgb3B0aW9ucz86IE5nYlNjcm9sbFRvT3B0aW9ucyk6IHZvaWQ7XG59XG5cbi8qKlxuICogQSBoZWxwZXIgZGlyZWN0aXZlIHRvIHRoYXQgbGlua3MgbWVudSBpdGVtcyBhbmQgZnJhZ21lbnRzIHRvZ2V0aGVyLlxuICpcbiAqIEl0IHdpbGwgYXV0b21hdGljYWxseSBhZGQgdGhlIGAuYWN0aXZlYCBjbGFzcyB0byB0aGUgbWVudSBpdGVtIHdoZW4gdGhlIGFzc29jaWF0ZWQgZnJhZ21lbnQgYmVjb21lcyBhY3RpdmUuXG4gKlxuICogQHNpbmNlIDE1LjEuMFxuICovXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdbbmdiU2Nyb2xsU3B5SXRlbV0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRleHBvcnRBczogJ25nYlNjcm9sbFNweUl0ZW0nLFxuXHRob3N0OiB7XG5cdFx0J1tjbGFzcy5hY3RpdmVdJzogJ2lzQWN0aXZlKCknLFxuXHRcdCcoY2xpY2spJzogJ3Njcm9sbFRvKCk7Jyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiU2Nyb2xsU3B5SXRlbSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cdHByaXZhdGUgX2NoYW5nZURldGVjdG9yID0gaW5qZWN0KENoYW5nZURldGVjdG9yUmVmKTtcblx0cHJpdmF0ZSBfc2Nyb2xsU3B5TWVudSA9IGluamVjdChOZ2JTY3JvbGxTcHlNZW51LCB7IG9wdGlvbmFsOiB0cnVlIH0pO1xuXHRwcml2YXRlIF9zY3JvbGxTcHlBUEk6IE5nYlNjcm9sbFNweVJlZiA9IHRoaXMuX3Njcm9sbFNweU1lbnUgPz8gaW5qZWN0KE5nYlNjcm9sbFNweVNlcnZpY2UpO1xuXHRwcml2YXRlIF9kZXN0cm95UmVmID0gaW5qZWN0KERlc3Ryb3lSZWYpO1xuXG5cdHByaXZhdGUgX2lzQWN0aXZlID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqIFJlZmVyZW5jZXMgdGhlIHNjcm9sbCBzcHkgZGlyZWN0aXZlLCB0aGUgaWQgb2YgdGhlIGFzc29jaWF0ZWQgZnJhZ21lbnQgYW5kIHRoZSBwYXJlbnQgbWVudSBpdGVtLlxuXHQgKlxuXHQgKiBDYW4gYmUgdXNlZCBsaWtlOlxuXHQgKiAgLSBgbmdiU2Nyb2xsU3B5SXRlbT1cImZyYWdtZW50SWRcImBcblx0ICogIC0gYFtuZ2JTY3JvbGxTcHlJdGVtXT1cInNjcm9sbFNweVwiIGZyYWdtZW50PVwiZnJhZ21lbnRJZFwiXG5cdCAqICAtIGBbbmdiU2Nyb2xsU3B5SXRlbV09XCJbc2Nyb2xsU3B5LCAnZnJhZ21lbnRJZCddXCJgIHBhcmVudD1cInBhcmVudElkXCJgXG5cdCAqICAtIGBbbmdiU2Nyb2xsU3B5SXRlbV09XCJbc2Nyb2xsU3B5LCAnZnJhZ21lbnRJZCcsICdwYXJlbnRJZCddXCJgXG5cdCAqXG5cdCAqICBBcyB3ZWxsIGFzIHRvZ2V0aGVyIHdpdGggYFtmcmFnbWVudF1gIGFuZCBgW3BhcmVudF1gIGlucHV0cy5cblx0ICovXG5cdEBJbnB1dCgnbmdiU2Nyb2xsU3B5SXRlbScpIHNldCBkYXRhKGRhdGE6IE5nYlNjcm9sbFNweSB8IHN0cmluZyB8IFtOZ2JTY3JvbGxTcHksIHN0cmluZywgc3RyaW5nP10pIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHRcdFx0dGhpcy5fc2Nyb2xsU3B5QVBJID0gZGF0YVswXTtcblx0XHRcdHRoaXMuZnJhZ21lbnQgPSBkYXRhWzFdO1xuXHRcdFx0dGhpcy5wYXJlbnQgPz89IGRhdGFbMl07XG5cdFx0fSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgTmdiU2Nyb2xsU3B5KSB7XG5cdFx0XHR0aGlzLl9zY3JvbGxTcHlBUEkgPSBkYXRhO1xuXHRcdH0gZWxzZSBpZiAoaXNTdHJpbmcoZGF0YSkpIHtcblx0XHRcdHRoaXMuZnJhZ21lbnQgPSBkYXRhO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgaWQgb2YgdGhlIGFzc29jaWF0ZWQgZnJhZ21lbnQuXG5cdCAqL1xuXHRASW5wdXQoKSBmcmFnbWVudDogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUaGUgaWQgb2YgdGhlIHBhcmVudCBzY3JvbGwgc3B5IG1lbnUgaXRlbS5cblx0ICovXG5cdEBJbnB1dCgpIHBhcmVudDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG5cdG5nT25Jbml0KCk6IHZvaWQge1xuXHRcdC8vIGlmIGl0IGlzIG5vdCBhIHBhcnQgb2YgYSBiaWdnZXIgbWVudSwgaXQgc2hvdWxkIGhhbmRsZSBhY3RpdmF0aW9uIGl0c2VsZlxuXHRcdGlmICghdGhpcy5fc2Nyb2xsU3B5TWVudSkge1xuXHRcdFx0dGhpcy5fc2Nyb2xsU3B5QVBJLmFjdGl2ZSQucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQodGhpcy5fZGVzdHJveVJlZikpLnN1YnNjcmliZSgoYWN0aXZlOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0aWYgKGFjdGl2ZSA9PT0gdGhpcy5mcmFnbWVudCkge1xuXHRcdFx0XHRcdHRoaXMuX2FjdGl2YXRlKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fZGVhY3RpdmF0ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0X2FjdGl2YXRlKCk6IHZvaWQge1xuXHRcdHRoaXMuX2lzQWN0aXZlID0gdHJ1ZTtcblx0XHRpZiAodGhpcy5fc2Nyb2xsU3B5TWVudSkge1xuXHRcdFx0dGhpcy5fc2Nyb2xsU3B5TWVudS5nZXRJdGVtKHRoaXMucGFyZW50ID8/ICcnKT8uX2FjdGl2YXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0X2RlYWN0aXZhdGUoKTogdm9pZCB7XG5cdFx0dGhpcy5faXNBY3RpdmUgPSBmYWxzZTtcblx0XHRpZiAodGhpcy5fc2Nyb2xsU3B5TWVudSkge1xuXHRcdFx0dGhpcy5fc2Nyb2xsU3B5TWVudS5nZXRJdGVtKHRoaXMucGFyZW50ID8/ICcnKT8uX2RlYWN0aXZhdGUoKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBgdHJ1ZWAsIGlmIHRoZSBhc3NvY2lhdGVkIGZyYWdtZW50IGlzIGFjdGl2ZS5cblx0ICovXG5cdGlzQWN0aXZlKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9pc0FjdGl2ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTY3JvbGxzIHRvIHRoZSBhc3NvY2lhdGVkIGZyYWdtZW50LlxuXHQgKi9cblx0c2Nyb2xsVG8ob3B0aW9ucz86IE5nYlNjcm9sbFRvT3B0aW9ucyk6IHZvaWQge1xuXHRcdHRoaXMuX3Njcm9sbFNweUFQSS5zY3JvbGxUbyh0aGlzLmZyYWdtZW50LCBvcHRpb25zKTtcblx0fVxufVxuXG4vKipcbiAqIEFuIG9wdGlvbmFsIHNjcm9sbCBzcHkgbWVudSBkaXJlY3RpdmUgdG8gYnVpbGQgaGllcmFyY2hpY2FsIG1lbnVzXG4gKiBhbmQgc2ltcGxpZnkgdGhlIFtgTmdiU2Nyb2xsU3B5SXRlbWBdKCMvY29tcG9uZW50cy9zY3JvbGxzcHkvYXBpI05nYlNjcm9sbFNweUl0ZW0pIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogQHNpbmNlIDE1LjEuMFxuICovXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdbbmdiU2Nyb2xsU3B5TWVudV0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JTY3JvbGxTcHlNZW51IGltcGxlbWVudHMgTmdiU2Nyb2xsU3B5UmVmLCBBZnRlclZpZXdJbml0IHtcblx0cHJpdmF0ZSBfc2Nyb2xsU3B5UmVmOiBOZ2JTY3JvbGxTcHlSZWYgPSBpbmplY3QoTmdiU2Nyb2xsU3B5U2VydmljZSk7XG5cdHByaXZhdGUgX2Rlc3Ryb3lSZWYgPSBpbmplY3QoRGVzdHJveVJlZik7XG5cdHByaXZhdGUgX21hcCA9IG5ldyBNYXA8c3RyaW5nLCBOZ2JTY3JvbGxTcHlJdGVtPigpO1xuXHRwcml2YXRlIF9sYXN0QWN0aXZlSXRlbTogTmdiU2Nyb2xsU3B5SXRlbSB8IG51bGwgPSBudWxsO1xuXG5cdEBDb250ZW50Q2hpbGRyZW4oTmdiU2Nyb2xsU3B5SXRlbSwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KSBwcml2YXRlIF9pdGVtczogUXVlcnlMaXN0PE5nYlNjcm9sbFNweUl0ZW0+O1xuXG5cdEBJbnB1dCgnbmdiU2Nyb2xsU3B5TWVudScpIHNldCBzY3JvbGxTcHkoc2Nyb2xsU3B5OiBOZ2JTY3JvbGxTcHkpIHtcblx0XHR0aGlzLl9zY3JvbGxTcHlSZWYgPSBzY3JvbGxTcHk7XG5cdH1cblxuXHRnZXQgYWN0aXZlKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuX3Njcm9sbFNweVJlZi5hY3RpdmU7XG5cdH1cblx0Z2V0IGFjdGl2ZSQoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcblx0XHRyZXR1cm4gdGhpcy5fc2Nyb2xsU3B5UmVmLmFjdGl2ZSQ7XG5cdH1cblx0c2Nyb2xsVG8oZnJhZ21lbnQ6IHN0cmluZywgb3B0aW9ucz86IE5nYlNjcm9sbFRvT3B0aW9ucyk6IHZvaWQge1xuXHRcdHRoaXMuX3Njcm9sbFNweVJlZi5zY3JvbGxUbyhmcmFnbWVudCwgb3B0aW9ucyk7XG5cdH1cblxuXHRnZXRJdGVtKGlkOiBzdHJpbmcpOiBOZ2JTY3JvbGxTcHlJdGVtIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGhpcy5fbWFwLmdldChpZCk7XG5cdH1cblxuXHRuZ0FmdGVyVmlld0luaXQoKSB7XG5cdFx0dGhpcy5faXRlbXMuY2hhbmdlcy5waXBlKHRha2VVbnRpbERlc3Ryb3llZCh0aGlzLl9kZXN0cm95UmVmKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX3JlYnVpbGRNYXAoKSk7XG5cdFx0dGhpcy5fcmVidWlsZE1hcCgpO1xuXG5cdFx0dGhpcy5fc2Nyb2xsU3B5UmVmLmFjdGl2ZSQucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQodGhpcy5fZGVzdHJveVJlZikpLnN1YnNjcmliZSgoYWN0aXZlSWQpID0+IHtcblx0XHRcdHRoaXMuX2xhc3RBY3RpdmVJdGVtPy5fZGVhY3RpdmF0ZSgpO1xuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuX21hcC5nZXQoYWN0aXZlSWQpO1xuXHRcdFx0aWYgKGl0ZW0pIHtcblx0XHRcdFx0aXRlbS5fYWN0aXZhdGUoKTtcblx0XHRcdFx0dGhpcy5fbGFzdEFjdGl2ZUl0ZW0gPSBpdGVtO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfcmVidWlsZE1hcCgpIHtcblx0XHR0aGlzLl9tYXAuY2xlYXIoKTtcblx0XHRmb3IgKGxldCBpdGVtIG9mIHRoaXMuX2l0ZW1zKSB7XG5cdFx0XHR0aGlzLl9tYXAuc2V0KGl0ZW0uZnJhZ21lbnQsIGl0ZW0pO1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIHB1dCBvbiBhIHNjcm9sbGFibGUgY29udGFpbmVyLlxuICpcbiAqIEl0IHdpbGwgaW5zdGFudGlhdGUgYSBbYE5nYlNjcm9sbFNweVNlcnZpY2VgXSgjL2NvbXBvbmVudHMvc2Nyb2xsc3B5L2FwaSNOZ2JTY3JvbGxTcHlTZXJ2aWNlKS5cbiAqXG4gKiBAc2luY2UgMTUuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ1tuZ2JTY3JvbGxTcHldJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0ZXhwb3J0QXM6ICduZ2JTY3JvbGxTcHknLFxuXHRob3N0OiB7XG5cdFx0dGFiaW5kZXg6ICcwJyxcblx0XHRzdHlsZTogJ292ZXJmbG93LXk6IGF1dG8nLFxuXHR9LFxuXHRwcm92aWRlcnM6IFtOZ2JTY3JvbGxTcHlTZXJ2aWNlXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiU2Nyb2xsU3B5IGltcGxlbWVudHMgTmdiU2Nyb2xsU3B5UmVmLCBBZnRlclZpZXdJbml0IHtcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3Njcm9sbEJlaGF2aW9yOiBzdHJpbmc7XG5cblx0cHJpdmF0ZSBfaW5pdGlhbEZyYWdtZW50OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfc2VydmljZSA9IGluamVjdChOZ2JTY3JvbGxTcHlTZXJ2aWNlKTtcblx0cHJpdmF0ZSBfbmF0aXZlRWxlbWVudCA9IGluamVjdDxFbGVtZW50UmVmPEhUTUxFbGVtZW50Pj4oRWxlbWVudFJlZikubmF0aXZlRWxlbWVudDtcblxuXHQvKipcblx0ICogQSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJgIGRldGVjdHMgYSBjaGFuZ2UuXG5cdCAqXG5cdCAqIFNlZSBbYE5nYlNjcm9sbFNweU9wdGlvbnNgXSgjL2NvbXBvbmVudHMvc2Nyb2xsc3B5L2FwaSNOZ2JTY3JvbGxTcHlPcHRpb25zKSBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgKi9cblx0QElucHV0KCkgcHJvY2Vzc0NoYW5nZXM6IE5nYlNjcm9sbFNweVByb2Nlc3NDaGFuZ2VzO1xuXG5cdC8qKlxuXHQgKiBBbiBgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJgIHJvb3QgbWFyZ2luLlxuXHQgKi9cblx0QElucHV0KCkgcm9vdE1hcmdpbjogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUaGUgc2Nyb2xsIGJlaGF2aW9yIGZvciB0aGUgYC5zY3JvbGxUbygpYCBtZXRob2QuXG5cdCAqL1xuXHRASW5wdXQoKSBzY3JvbGxCZWhhdmlvcjogJ2F1dG8nIHwgJ3Ntb290aCc7XG5cblx0LyoqXG5cdCAqIEFuIGBJbnRlcnNlY3Rpb25PYnNlcnZlcmAgdGhyZXNob2xkLlxuXHQgKi9cblx0QElucHV0KCkgdGhyZXNob2xkOiBudW1iZXIgfCBudW1iZXJbXTtcblxuXHRASW5wdXQoKSBzZXQgYWN0aXZlKGZyYWdtZW50OiBzdHJpbmcpIHtcblx0XHR0aGlzLl9pbml0aWFsRnJhZ21lbnQgPSBmcmFnbWVudDtcblx0XHR0aGlzLnNjcm9sbFRvKGZyYWdtZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBbiBldmVudCByYWlzZWQgd2hlbiB0aGUgYWN0aXZlIHNlY3Rpb24gY2hhbmdlcy5cblx0ICpcblx0ICogUGF5bG9hZCBpcyB0aGUgaWQgb2YgdGhlIG5ldyBhY3RpdmUgc2VjdGlvbiwgZW1wdHkgc3RyaW5nIGlmIG5vbmUuXG5cdCAqL1xuXHRAT3V0cHV0KCkgYWN0aXZlQ2hhbmdlID0gdGhpcy5fc2VydmljZS5hY3RpdmUkO1xuXG5cdC8qKlxuXHQgKiBHZXR0ZXIvc2V0dGVyIGZvciB0aGUgY3VycmVudGx5IGFjdGl2ZSBmcmFnbWVudCBpZC5cblx0ICovXG5cdGdldCBhY3RpdmUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5fc2VydmljZS5hY3RpdmU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgY3VycmVudGx5IGFjdGl2ZSBzZWN0aW9uIGlkLlxuXHQgKi9cblx0Z2V0IGFjdGl2ZSQoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcblx0XHRyZXR1cm4gdGhpcy5fc2VydmljZS5hY3RpdmUkO1xuXHR9XG5cblx0bmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuXHRcdHRoaXMuX3NlcnZpY2Uuc3RhcnQoe1xuXHRcdFx0cHJvY2Vzc0NoYW5nZXM6IHRoaXMucHJvY2Vzc0NoYW5nZXMsXG5cdFx0XHRyb290OiB0aGlzLl9uYXRpdmVFbGVtZW50LFxuXHRcdFx0cm9vdE1hcmdpbjogdGhpcy5yb290TWFyZ2luLFxuXHRcdFx0dGhyZXNob2xkOiB0aGlzLnRocmVzaG9sZCxcblx0XHRcdC4uLih0aGlzLl9pbml0aWFsRnJhZ21lbnQgJiYgeyBpbml0aWFsRnJhZ21lbnQ6IHRoaXMuX2luaXRpYWxGcmFnbWVudCB9KSxcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdF9yZWdpc3RlckZyYWdtZW50KGZyYWdtZW50OiBOZ2JTY3JvbGxTcHlGcmFnbWVudCk6IHZvaWQge1xuXHRcdHRoaXMuX3NlcnZpY2Uub2JzZXJ2ZShmcmFnbWVudC5pZCk7XG5cdH1cblxuXHQvKipcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRfdW5yZWdpc3RlckZyYWdtZW50KGZyYWdtZW50OiBOZ2JTY3JvbGxTcHlGcmFnbWVudCk6IHZvaWQge1xuXHRcdHRoaXMuX3NlcnZpY2UudW5vYnNlcnZlKGZyYWdtZW50LmlkKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTY3JvbGxzIHRvIGEgZnJhZ21lbnQgdGhhdCBpcyBpZGVudGlmaWVkIGJ5IHRoZSBgbmdiU2Nyb2xsU3B5RnJhZ21lbnRgIGRpcmVjdGl2ZS5cblx0ICogQW4gaWQgb3IgYW4gZWxlbWVudCByZWZlcmVuY2UgY2FuIGJlIHBhc3NlZC5cblx0ICovXG5cdHNjcm9sbFRvKGZyYWdtZW50OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgb3B0aW9ucz86IE5nYlNjcm9sbFRvT3B0aW9ucyk6IHZvaWQge1xuXHRcdHRoaXMuX3NlcnZpY2Uuc2Nyb2xsVG8oZnJhZ21lbnQsIHtcblx0XHRcdC4uLih0aGlzLnNjcm9sbEJlaGF2aW9yICYmIHsgYmVoYXZpb3I6IHRoaXMuc2Nyb2xsQmVoYXZpb3IgfSksXG5cdFx0XHQuLi5vcHRpb25zLFxuXHRcdH0pO1xuXHR9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gcHV0IG9uIGEgZnJhZ21lbnQgb2JzZXJ2ZWQgaW5zaWRlIGEgc2Nyb2xsc3B5IGNvbnRhaW5lci5cbiAqXG4gKiBAc2luY2UgMTUuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ1tuZ2JTY3JvbGxTcHlGcmFnbWVudF0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0J1tpZF0nOiAnaWQnLFxuXHR9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JTY3JvbGxTcHlGcmFnbWVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXHRwcml2YXRlIF9kZXN0cm95UmVmID0gaW5qZWN0KERlc3Ryb3lSZWYpO1xuXHRwcml2YXRlIF9zY3JvbGxTcHkgPSBpbmplY3QoTmdiU2Nyb2xsU3B5KTtcblxuXHQvKipcblx0ICogVGhlIHVuaXF1ZSBpZCBvZiB0aGUgZnJhZ21lbnQuXG5cdCAqIEl0IG11c3QgYmUgYSBzdHJpbmcgdW5pcXVlIHRvIHRoZSBkb2N1bWVudCwgYXMgaXQgd2lsbCBiZSBzZXQgYXMgdGhlIGlkIG9mIHRoZSBlbGVtZW50LlxuXHQgKi9cblx0QElucHV0KCduZ2JTY3JvbGxTcHlGcmFnbWVudCcpIGlkOiBzdHJpbmc7XG5cblx0bmdBZnRlclZpZXdJbml0KCkge1xuXHRcdHRoaXMuX3Njcm9sbFNweS5fcmVnaXN0ZXJGcmFnbWVudCh0aGlzKTtcblx0XHR0aGlzLl9kZXN0cm95UmVmLm9uRGVzdHJveSgoKSA9PiB0aGlzLl9zY3JvbGxTcHkuX3VucmVnaXN0ZXJGcmFnbWVudCh0aGlzKSk7XG5cdH1cbn1cbiJdfQ==