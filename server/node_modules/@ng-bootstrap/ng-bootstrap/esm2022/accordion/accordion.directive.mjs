import { ChangeDetectorRef, ContentChild, ContentChildren, DestroyRef, Directive, ElementRef, EventEmitter, inject, Input, Output, TemplateRef, ViewContainerRef, } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbAccordionConfig } from './accordion-config';
import { NgbCollapse } from '../collapse/collapse';
import { isString } from '../util/util';
import * as i0 from "@angular/core";
import * as i1 from "../collapse/collapse";
let nextId = 0;
/**
 * A directive that wraps the content of an accordion item's collapsible body.
 *
 * The actual content is provided in a child `ng-template` element.
 * Depending on the state of the accordion, the template will be either inserted or removed from the DOM.
 *
 * @since 14.1.0
 */
export class NgbAccordionBody {
    constructor() {
        this._vcr = inject(ViewContainerRef);
        this._element = inject((ElementRef)).nativeElement;
        this._item = inject(NgbAccordionItem);
        this._viewRef = null;
    }
    ngAfterContentChecked() {
        if (this._bodyTpl) {
            if (this._item._shouldBeInDOM) {
                this._createViewIfNotExists();
            }
            else {
                this._destroyViewIfExists();
            }
        }
    }
    ngOnDestroy() {
        this._destroyViewIfExists();
    }
    _destroyViewIfExists() {
        this._viewRef?.destroy();
        this._viewRef = null;
    }
    _createViewIfNotExists() {
        if (!this._viewRef) {
            this._viewRef = this._vcr.createEmbeddedView(this._bodyTpl);
            this._viewRef.detectChanges();
            for (const node of this._viewRef.rootNodes) {
                this._element.appendChild(node);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionBody, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbAccordionBody, isStandalone: true, selector: "[ngbAccordionBody]", host: { classAttribute: "accordion-body" }, queries: [{ propertyName: "_bodyTpl", first: true, predicate: TemplateRef, descendants: true, static: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionBody, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbAccordionBody]',
                    standalone: true,
                    host: {
                        class: 'accordion-body',
                    },
                }]
        }], propDecorators: { _bodyTpl: [{
                type: ContentChild,
                args: [TemplateRef, { static: true }]
            }] } });
/**
 * A directive that wraps the collapsible item's content of the accordion.
 *
 * Internally it reuses the [`NgbCollapse` directive](#/components/collapse)
 *
 * @since 14.1.0
 */
export class NgbAccordionCollapse {
    constructor() {
        this.item = inject(NgbAccordionItem);
        this.ngbCollapse = inject(NgbCollapse);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionCollapse, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbAccordionCollapse, isStandalone: true, selector: "[ngbAccordionCollapse]", host: { attributes: { "role": "region" }, properties: { "id": "item.collapseId", "attr.aria-labelledby": "item.toggleId" }, classAttribute: "accordion-collapse" }, exportAs: ["ngbAccordionCollapse"], hostDirectives: [{ directive: i1.NgbCollapse }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionCollapse, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'ngbAccordionCollapse',
                    standalone: true,
                    selector: '[ngbAccordionCollapse]',
                    host: {
                        role: 'region',
                        class: 'accordion-collapse',
                        '[id]': 'item.collapseId',
                        '[attr.aria-labelledby]': 'item.toggleId',
                    },
                    hostDirectives: [NgbCollapse],
                }]
        }] });
/**
 * A directive to put on a toggling element inside the accordion item's header.
 * It will register click handlers that toggle the associated panel and will handle accessibility attributes.
 *
 * This directive is used internally by the [`NgbAccordionButton` directive](#/components/accordion/api#NgbAccordionButton).
 *
 * @since 14.1.0
 */
export class NgbAccordionToggle {
    constructor() {
        this.item = inject(NgbAccordionItem);
        this.accordion = inject(NgbAccordionDirective);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionToggle, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbAccordionToggle, isStandalone: true, selector: "[ngbAccordionToggle]", host: { listeners: { "click": "!item.disabled && accordion.toggle(item.id)" }, properties: { "id": "item.toggleId", "class.collapsed": "item.collapsed", "attr.aria-controls": "item.collapseId", "attr.aria-expanded": "!item.collapsed" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbAccordionToggle]',
                    standalone: true,
                    host: {
                        '[id]': 'item.toggleId',
                        '[class.collapsed]': 'item.collapsed',
                        '[attr.aria-controls]': 'item.collapseId',
                        '[attr.aria-expanded]': '!item.collapsed',
                        '(click)': '!item.disabled && accordion.toggle(item.id)',
                    },
                }]
        }] });
/**
 * A directive to put on a button element inside an accordion item's header.
 *
 * If you want a custom markup for the header, you can also use the [`NgbAccordionToggle` directive](#/components/accordion/api#NgbAccordionToggle).
 *
 * @since 14.1.0
 */
export class NgbAccordionButton {
    constructor() {
        this.item = inject(NgbAccordionItem);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionButton, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbAccordionButton, isStandalone: true, selector: "button[ngbAccordionButton]", host: { attributes: { "type": "button" }, properties: { "disabled": "item.disabled" }, classAttribute: "accordion-button" }, hostDirectives: [{ directive: NgbAccordionToggle }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionButton, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[ngbAccordionButton]',
                    standalone: true,
                    host: {
                        '[disabled]': 'item.disabled',
                        class: 'accordion-button',
                        type: 'button',
                    },
                    hostDirectives: [NgbAccordionToggle],
                }]
        }] });
/**
 * A directive that wraps an accordion item's header.
 *
 * @since 14.1.0
 */
export class NgbAccordionHeader {
    constructor() {
        this.item = inject(NgbAccordionItem);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionHeader, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbAccordionHeader, isStandalone: true, selector: "[ngbAccordionHeader]", host: { attributes: { "role": "heading" }, properties: { "class.collapsed": "item.collapsed" }, classAttribute: "accordion-header" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionHeader, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbAccordionHeader]',
                    standalone: true,
                    host: {
                        role: 'heading',
                        class: 'accordion-header',
                        '[class.collapsed]': 'item.collapsed',
                    },
                }]
        }] });
/**
 * A directive that wraps an accordion item: a toggleable header + body that collapses.
 *
 * You can get hold of the `NgbAccordionItem` instance in the template with `#item="ngbAccordionItem"`.
 * It allows to check if the item is collapsed or not, toggle the collapse state, etc.
 *
 * Every accordion item has a string ID that is automatically generated in the `ngb-accordion-item-XX` format, unless provided explicitly.
 *
 * @since 14.1.0
 */
export class NgbAccordionItem {
    constructor() {
        this._accordion = inject(NgbAccordionDirective);
        this._cd = inject(ChangeDetectorRef);
        this._destroyRef = inject(DestroyRef);
        this._collapsed = true;
        this._id = `ngb-accordion-item-${nextId++}`;
        this._collapseAnimationRunning = false;
        /**
         * If `true`, the accordion item will be disabled.
         * It won't react to user's clicks, but still will be toggelable programmatically.
         */
        this.disabled = false;
        /**
         * Event emitted before the expanding animation starts. It has no payload.
         *
         * @since 15.1.0
         */
        this.show = new EventEmitter();
        /**
         * Event emitted when the expanding animation is finished. It has no payload.
         */
        this.shown = new EventEmitter();
        /**
         * Event emitted before the collapsing animation starts. It has no payload.
         *
         * @since 15.1.0
         */
        this.hide = new EventEmitter();
        /**
         * Event emitted when the collapsing animation is finished and before the content is removed from DOM.
         * It has no payload.
         */
        this.hidden = new EventEmitter();
    }
    /**
     * Sets the custom ID of the accordion item. It must be unique for the document.
     *
     * @param id The ID of the accordion item, must be a non-empty string
     */
    set id(id) {
        if (isString(id) && id !== '') {
            this._id = id;
        }
    }
    /**
     * If `true`, the content of the accordion item's body will be removed from the DOM. It will be just hidden otherwise.
     *
     * This property can also be set up on the parent [`NgbAccordion` directive](#/components/accordion/api#NgbAccordionDirective).
     */
    set destroyOnHide(destroyOnHide) {
        this._destroyOnHide = destroyOnHide;
    }
    get destroyOnHide() {
        return this._destroyOnHide === undefined ? this._accordion.destroyOnHide : this._destroyOnHide;
    }
    /**
     *	If `true`, the accordion item will be collapsed. Otherwise, it will be expanded.
     *
     * @param collapsed New state of the accordion item.
     */
    set collapsed(collapsed) {
        if (collapsed) {
            this.collapse();
        }
        else {
            this.expand();
        }
    }
    get collapsed() {
        return this._collapsed;
    }
    get id() {
        return `${this._id}`;
    }
    get toggleId() {
        return `${this.id}-toggle`;
    }
    get collapseId() {
        return `${this.id}-collapse`;
    }
    get _shouldBeInDOM() {
        return !this.collapsed || this._collapseAnimationRunning || !this.destroyOnHide;
    }
    ngAfterContentInit() {
        const { ngbCollapse } = this._collapse;
        // we need to disable the animation for the first init
        ngbCollapse.animation = false;
        ngbCollapse.collapsed = this.collapsed;
        // we set the animation to the default of the accordion
        ngbCollapse.animation = this._accordion.animation;
        // event forwarding from 'ngbCollapse' to 'ngbAccordion'
        ngbCollapse.hidden.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
            // when the animation finishes we can remove the template from DOM
            this._collapseAnimationRunning = false;
            this.hidden.emit();
            this._accordion.hidden.emit(this.id);
        });
        ngbCollapse.shown.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
            this.shown.emit();
            this._accordion.shown.emit(this.id);
        });
    }
    /**
     * Toggles an accordion item.
     */
    toggle() {
        this.collapsed = !this.collapsed;
    }
    /**
     * Expands an accordion item.
     */
    expand() {
        if (this.collapsed) {
            // checking if accordion allows to expand the panel in respect to 'closeOthers' flag
            if (!this._accordion._ensureCanExpand(this)) {
                return;
            }
            this._collapsed = false;
            // need if the accordion is used inside a component having OnPush change detection strategy
            this._cd.markForCheck();
            // we need force CD to get template into DOM before starting animation to calculate its height correctly
            // this will synchronously put the item body into DOM, because `this._collapsed` was flipped to `false`
            this._cd.detectChanges();
            // firing events before starting animations
            this.show.emit();
            this._accordion.show.emit(this.id);
            // we also need to make sure 'animation' flag is up-to- date
            this._collapse.ngbCollapse.animation = this._accordion.animation;
            this._collapse.ngbCollapse.collapsed = false;
        }
    }
    /**
     * Collapses an accordion item.
     */
    collapse() {
        if (!this.collapsed) {
            this._collapsed = true;
            this._collapseAnimationRunning = true;
            // need if the accordion is used inside a component having OnPush change detection strategy
            this._cd.markForCheck();
            // firing events before starting animations
            this.hide.emit();
            this._accordion.hide.emit(this.id);
            // we also need to make sure 'animation' flag is up-to- date
            this._collapse.ngbCollapse.animation = this._accordion.animation;
            this._collapse.ngbCollapse.collapsed = true;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionItem, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbAccordionItem, isStandalone: true, selector: "[ngbAccordionItem]", inputs: { id: ["ngbAccordionItem", "id"], destroyOnHide: "destroyOnHide", disabled: "disabled", collapsed: "collapsed" }, outputs: { show: "show", shown: "shown", hide: "hide", hidden: "hidden" }, host: { properties: { "id": "id" }, classAttribute: "accordion-item" }, queries: [{ propertyName: "_collapse", first: true, predicate: NgbAccordionCollapse, descendants: true, static: true }], exportAs: ["ngbAccordionItem"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbAccordionItem]',
                    exportAs: 'ngbAccordionItem',
                    standalone: true,
                    host: {
                        '[id]': 'id',
                        class: 'accordion-item',
                    },
                }]
        }], propDecorators: { _collapse: [{
                type: ContentChild,
                args: [NgbAccordionCollapse, { static: true }]
            }], id: [{
                type: Input,
                args: ['ngbAccordionItem']
            }], destroyOnHide: [{
                type: Input
            }], disabled: [{
                type: Input
            }], collapsed: [{
                type: Input
            }], show: [{
                type: Output
            }], shown: [{
                type: Output
            }], hide: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
/**
 * Accordion is a stack of cards that have a header and collapsible body.
 *
 * This directive is a container for these items and provides an API to handle them.
 *
 * @since 14.1.0
 */
export class NgbAccordionDirective {
    constructor() {
        this._config = inject(NgbAccordionConfig);
        this._anItemWasAlreadyExpandedDuringInitialisation = false;
        /**
         * If `true`, accordion will be animated.
         */
        this.animation = this._config.animation;
        /**
         * If `true`, only one item at the time can stay open.
         */
        this.closeOthers = this._config.closeOthers;
        /**
         * If `true`, the content of the accordion items body will be removed from the DOM. It will be just hidden otherwise.
         *
         * This property can be overwritten at the [`NgbAccordionItem`](#/components/accordion/api#NgbAccordionItem) level
         */
        this.destroyOnHide = this._config.destroyOnHide;
        /**
         * Event emitted before expanding animation starts. The payload is the id of shown accordion item.
         *
         * @since 15.1.0
         */
        this.show = new EventEmitter();
        /**
         * Event emitted when the expanding animation is finished. The payload is the id of shown accordion item.
         */
        this.shown = new EventEmitter();
        /**
         * Event emitted before the collapsing animation starts. The payload is the id of hidden accordion item.
         *
         * @since 15.1.0
         */
        this.hide = new EventEmitter();
        /**
         * Event emitted when the collapsing animation is finished and before the content is removed from DOM.
         * The payload is the id of hidden accordion item.
         */
        this.hidden = new EventEmitter();
    }
    /**
     * Toggles an item with the given id.
     *
     * It will toggle an item, even if it is disabled.
     *
     * @param itemId The id of the item to toggle.
     */
    toggle(itemId) {
        this._getItem(itemId)?.toggle();
    }
    /**
     * Expands an item with the given id.
     *
     * If `closeOthers` is `true`, it will collapse other panels.
     *
     * @param itemId The id of the item to expand.
     */
    expand(itemId) {
        this._getItem(itemId)?.expand();
    }
    /**
     * Expands all items.
     *
     * If `closeOthers` is `true` and all items are closed, it will open the first one. Otherwise, it will keep the opened one.
     */
    expandAll() {
        if (this._items) {
            if (this.closeOthers) {
                // we check if there is an item open and if it is not we can expand the first item
                // (otherwise we toggle nothing)
                if (!this._items.find((item) => !item.collapsed)) {
                    this._items.first.expand();
                }
            }
            else {
                this._items.forEach((item) => item.expand());
            }
        }
    }
    /**
     * Collapses an item with the given id.
     *
     * Has no effect if the `itemId` does not correspond to any item.
     *
     * @param itemId The id of the item to collapse.
     */
    collapse(itemId) {
        this._getItem(itemId)?.collapse();
    }
    /**
     * Collapses all items.
     */
    collapseAll() {
        this._items?.forEach((item) => item.collapse());
    }
    /**
     * Checks if an item with the given id is expanded.
     *
     * If the `itemId` does not correspond to any item, it returns `false`.
     *
     * @param itemId The id of the item to check.
     */
    isExpanded(itemId) {
        const item = this._getItem(itemId);
        return item ? !item.collapsed : false;
    }
    /**
     * It checks, if the item can be expanded in the current state of the accordion.
     * With `closeOthers` there can be only one expanded item at a time.
     *
     * @internal
     */
    _ensureCanExpand(toExpand) {
        if (!this.closeOthers) {
            return true;
        }
        // special case during the initialization of the [collapse]="false" inputs
        // `this._items` QueryList is not yet initialized, but we need to ensure only one item can be expanded at a time
        if (!this._items) {
            if (!this._anItemWasAlreadyExpandedDuringInitialisation) {
                this._anItemWasAlreadyExpandedDuringInitialisation = true;
                return true;
            }
            return false;
        }
        // if there is an expanded item, we need to collapse it first
        this._items.find((item) => !item.collapsed && toExpand !== item)?.collapse();
        return true;
    }
    _getItem(itemId) {
        return this._items?.find((item) => item.id === itemId);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbAccordionDirective, isStandalone: true, selector: "[ngbAccordion]", inputs: { animation: "animation", closeOthers: "closeOthers", destroyOnHide: "destroyOnHide" }, outputs: { show: "show", shown: "shown", hide: "hide", hidden: "hidden" }, host: { classAttribute: "accordion" }, queries: [{ propertyName: "_items", predicate: NgbAccordionItem }], exportAs: ["ngbAccordion"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbAccordionDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbAccordion]',
                    standalone: true,
                    exportAs: 'ngbAccordion',
                    host: {
                        class: 'accordion',
                    },
                }]
        }], propDecorators: { _items: [{
                type: ContentChildren,
                args: [NgbAccordionItem, { descendants: false }]
            }], animation: [{
                type: Input
            }], closeOthers: [{
                type: Input
            }], destroyOnHide: [{
                type: Input
            }], show: [{
                type: Output
            }], shown: [{
                type: Output
            }], hide: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hY2NvcmRpb24vYWNjb3JkaW9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR04saUJBQWlCLEVBQ2pCLFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLFNBQVMsRUFDVCxVQUFVLEVBRVYsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUwsTUFBTSxFQUVOLFdBQVcsRUFDWCxnQkFBZ0IsR0FDaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDeEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7OztBQUV4QyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZjs7Ozs7OztHQU9HO0FBUUgsTUFBTSxPQUFPLGdCQUFnQjtJQVA3QjtRQVFTLFNBQUksR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNoQyxhQUFRLEdBQUcsTUFBTSxDQUFDLENBQUEsVUFBdUIsQ0FBQSxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQ3pELFVBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVqQyxhQUFRLEdBQWdDLElBQUksQ0FBQztLQWdDckQ7SUE1QkEscUJBQXFCO1FBQ3BCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDL0IsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLElBQUksQ0FB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QUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELENBQUM7OEdBbEpXLHFCQUFxQjtrR0FBckIscUJBQXFCLG1UQUloQixnQkFBZ0I7OzJGQUpyQixxQkFBcUI7a0JBUmpDLFNBQVM7bUJBQUM7b0JBQ1YsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFFBQVEsRUFBRSxjQUFjO29CQUN4QixJQUFJLEVBQUU7d0JBQ0wsS0FBSyxFQUFFLFdBQVc7cUJBQ2xCO2lCQUNEOzhCQUttRSxNQUFNO3NCQUF4RSxlQUFlO3VCQUFDLGdCQUFnQixFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRTtnQkFJaEQsU0FBUztzQkFBakIsS0FBSztnQkFLRyxXQUFXO3NCQUFuQixLQUFLO2dCQU1HLGFBQWE7c0JBQXJCLEtBQUs7Z0JBT0ksSUFBSTtzQkFBYixNQUFNO2dCQUtHLEtBQUs7c0JBQWQsTUFBTTtnQkFPRyxJQUFJO3NCQUFiLE1BQU07Z0JBTUcsTUFBTTtzQkFBZixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QWZ0ZXJDb250ZW50Q2hlY2tlZCxcblx0QWZ0ZXJDb250ZW50SW5pdCxcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbnRlbnRDaGlsZCxcblx0Q29udGVudENoaWxkcmVuLFxuXHREZXN0cm95UmVmLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEVtYmVkZGVkVmlld1JlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRpbmplY3QsXG5cdElucHV0LFxuXHRPbkRlc3Ryb3ksXG5cdE91dHB1dCxcblx0UXVlcnlMaXN0LFxuXHRUZW1wbGF0ZVJlZixcblx0Vmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0YWtlVW50aWxEZXN0cm95ZWQgfSBmcm9tICdAYW5ndWxhci9jb3JlL3J4anMtaW50ZXJvcCc7XG5pbXBvcnQgeyBOZ2JBY2NvcmRpb25Db25maWcgfSBmcm9tICcuL2FjY29yZGlvbi1jb25maWcnO1xuaW1wb3J0IHsgTmdiQ29sbGFwc2UgfSBmcm9tICcuLi9jb2xsYXBzZS9jb2xsYXBzZSc7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgdGhlIGNvbnRlbnQgb2YgYW4gYWNjb3JkaW9uIGl0ZW0ncyBjb2xsYXBzaWJsZSBib2R5LlxuICpcbiAqIFRoZSBhY3R1YWwgY29udGVudCBpcyBwcm92aWRlZCBpbiBhIGNoaWxkIGBuZy10ZW1wbGF0ZWAgZWxlbWVudC5cbiAqIERlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2YgdGhlIGFjY29yZGlvbiwgdGhlIHRlbXBsYXRlIHdpbGwgYmUgZWl0aGVyIGluc2VydGVkIG9yIHJlbW92ZWQgZnJvbSB0aGUgRE9NLlxuICpcbiAqIEBzaW5jZSAxNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkFjY29yZGlvbkJvZHldJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdGNsYXNzOiAnYWNjb3JkaW9uLWJvZHknLFxuXHR9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JBY2NvcmRpb25Cb2R5IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95IHtcblx0cHJpdmF0ZSBfdmNyID0gaW5qZWN0KFZpZXdDb250YWluZXJSZWYpO1xuXHRwcml2YXRlIF9lbGVtZW50ID0gaW5qZWN0KEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KS5uYXRpdmVFbGVtZW50O1xuXHRwcml2YXRlIF9pdGVtID0gaW5qZWN0KE5nYkFjY29yZGlvbkl0ZW0pO1xuXG5cdHByaXZhdGUgX3ZpZXdSZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cblx0QENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZiwgeyBzdGF0aWM6IHRydWUgfSkgcHJpdmF0ZSBfYm9keVRwbDogVGVtcGxhdGVSZWY8YW55PjtcblxuXHRuZ0FmdGVyQ29udGVudENoZWNrZWQoKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX2JvZHlUcGwpIHtcblx0XHRcdGlmICh0aGlzLl9pdGVtLl9zaG91bGRCZUluRE9NKSB7XG5cdFx0XHRcdHRoaXMuX2NyZWF0ZVZpZXdJZk5vdEV4aXN0cygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fZGVzdHJveVZpZXdJZkV4aXN0cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG5nT25EZXN0cm95KCk6IHZvaWQge1xuXHRcdHRoaXMuX2Rlc3Ryb3lWaWV3SWZFeGlzdHMoKTtcblx0fVxuXG5cdHByaXZhdGUgX2Rlc3Ryb3lWaWV3SWZFeGlzdHMoKTogdm9pZCB7XG5cdFx0dGhpcy5fdmlld1JlZj8uZGVzdHJveSgpO1xuXHRcdHRoaXMuX3ZpZXdSZWYgPSBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBfY3JlYXRlVmlld0lmTm90RXhpc3RzKCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5fdmlld1JlZikge1xuXHRcdFx0dGhpcy5fdmlld1JlZiA9IHRoaXMuX3Zjci5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy5fYm9keVRwbCk7XG5cdFx0XHR0aGlzLl92aWV3UmVmLmRldGVjdENoYW5nZXMoKTtcblx0XHRcdGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLl92aWV3UmVmLnJvb3ROb2Rlcykge1xuXHRcdFx0XHR0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKG5vZGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgdGhlIGNvbGxhcHNpYmxlIGl0ZW0ncyBjb250ZW50IG9mIHRoZSBhY2NvcmRpb24uXG4gKlxuICogSW50ZXJuYWxseSBpdCByZXVzZXMgdGhlIFtgTmdiQ29sbGFwc2VgIGRpcmVjdGl2ZV0oIy9jb21wb25lbnRzL2NvbGxhcHNlKVxuICpcbiAqIEBzaW5jZSAxNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdGV4cG9ydEFzOiAnbmdiQWNjb3JkaW9uQ29sbGFwc2UnLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRzZWxlY3RvcjogJ1tuZ2JBY2NvcmRpb25Db2xsYXBzZV0nLFxuXHRob3N0OiB7XG5cdFx0cm9sZTogJ3JlZ2lvbicsXG5cdFx0Y2xhc3M6ICdhY2NvcmRpb24tY29sbGFwc2UnLFxuXHRcdCdbaWRdJzogJ2l0ZW0uY29sbGFwc2VJZCcsXG5cdFx0J1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnaXRlbS50b2dnbGVJZCcsXG5cdH0sXG5cdGhvc3REaXJlY3RpdmVzOiBbTmdiQ29sbGFwc2VdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JBY2NvcmRpb25Db2xsYXBzZSB7XG5cdGl0ZW0gPSBpbmplY3QoTmdiQWNjb3JkaW9uSXRlbSk7XG5cdG5nYkNvbGxhcHNlID0gaW5qZWN0KE5nYkNvbGxhcHNlKTtcbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0byBwdXQgb24gYSB0b2dnbGluZyBlbGVtZW50IGluc2lkZSB0aGUgYWNjb3JkaW9uIGl0ZW0ncyBoZWFkZXIuXG4gKiBJdCB3aWxsIHJlZ2lzdGVyIGNsaWNrIGhhbmRsZXJzIHRoYXQgdG9nZ2xlIHRoZSBhc3NvY2lhdGVkIHBhbmVsIGFuZCB3aWxsIGhhbmRsZSBhY2Nlc3NpYmlsaXR5IGF0dHJpYnV0ZXMuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBbYE5nYkFjY29yZGlvbkJ1dHRvbmAgZGlyZWN0aXZlXSgjL2NvbXBvbmVudHMvYWNjb3JkaW9uL2FwaSNOZ2JBY2NvcmRpb25CdXR0b24pLlxuICpcbiAqIEBzaW5jZSAxNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkFjY29yZGlvblRvZ2dsZV0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0J1tpZF0nOiAnaXRlbS50b2dnbGVJZCcsXG5cdFx0J1tjbGFzcy5jb2xsYXBzZWRdJzogJ2l0ZW0uY29sbGFwc2VkJyxcblx0XHQnW2F0dHIuYXJpYS1jb250cm9sc10nOiAnaXRlbS5jb2xsYXBzZUlkJyxcblx0XHQnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnIWl0ZW0uY29sbGFwc2VkJyxcblx0XHQnKGNsaWNrKSc6ICchaXRlbS5kaXNhYmxlZCAmJiBhY2NvcmRpb24udG9nZ2xlKGl0ZW0uaWQpJyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiQWNjb3JkaW9uVG9nZ2xlIHtcblx0aXRlbSA9IGluamVjdChOZ2JBY2NvcmRpb25JdGVtKTtcblx0YWNjb3JkaW9uID0gaW5qZWN0KE5nYkFjY29yZGlvbkRpcmVjdGl2ZSk7XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gcHV0IG9uIGEgYnV0dG9uIGVsZW1lbnQgaW5zaWRlIGFuIGFjY29yZGlvbiBpdGVtJ3MgaGVhZGVyLlxuICpcbiAqIElmIHlvdSB3YW50IGEgY3VzdG9tIG1hcmt1cCBmb3IgdGhlIGhlYWRlciwgeW91IGNhbiBhbHNvIHVzZSB0aGUgW2BOZ2JBY2NvcmRpb25Ub2dnbGVgIGRpcmVjdGl2ZV0oIy9jb21wb25lbnRzL2FjY29yZGlvbi9hcGkjTmdiQWNjb3JkaW9uVG9nZ2xlKS5cbiAqXG4gKiBAc2luY2UgMTQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ2J1dHRvbltuZ2JBY2NvcmRpb25CdXR0b25dJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdCdbZGlzYWJsZWRdJzogJ2l0ZW0uZGlzYWJsZWQnLFxuXHRcdGNsYXNzOiAnYWNjb3JkaW9uLWJ1dHRvbicsXG5cdFx0dHlwZTogJ2J1dHRvbicsXG5cdH0sXG5cdGhvc3REaXJlY3RpdmVzOiBbTmdiQWNjb3JkaW9uVG9nZ2xlXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiQWNjb3JkaW9uQnV0dG9uIHtcblx0aXRlbSA9IGluamVjdChOZ2JBY2NvcmRpb25JdGVtKTtcbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IHdyYXBzIGFuIGFjY29yZGlvbiBpdGVtJ3MgaGVhZGVyLlxuICpcbiAqIEBzaW5jZSAxNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkFjY29yZGlvbkhlYWRlcl0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0cm9sZTogJ2hlYWRpbmcnLFxuXHRcdGNsYXNzOiAnYWNjb3JkaW9uLWhlYWRlcicsXG5cdFx0J1tjbGFzcy5jb2xsYXBzZWRdJzogJ2l0ZW0uY29sbGFwc2VkJyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiQWNjb3JkaW9uSGVhZGVyIHtcblx0aXRlbSA9IGluamVjdChOZ2JBY2NvcmRpb25JdGVtKTtcbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IHdyYXBzIGFuIGFjY29yZGlvbiBpdGVtOiBhIHRvZ2dsZWFibGUgaGVhZGVyICsgYm9keSB0aGF0IGNvbGxhcHNlcy5cbiAqXG4gKiBZb3UgY2FuIGdldCBob2xkIG9mIHRoZSBgTmdiQWNjb3JkaW9uSXRlbWAgaW5zdGFuY2UgaW4gdGhlIHRlbXBsYXRlIHdpdGggYCNpdGVtPVwibmdiQWNjb3JkaW9uSXRlbVwiYC5cbiAqIEl0IGFsbG93cyB0byBjaGVjayBpZiB0aGUgaXRlbSBpcyBjb2xsYXBzZWQgb3Igbm90LCB0b2dnbGUgdGhlIGNvbGxhcHNlIHN0YXRlLCBldGMuXG4gKlxuICogRXZlcnkgYWNjb3JkaW9uIGl0ZW0gaGFzIGEgc3RyaW5nIElEIHRoYXQgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgaW4gdGhlIGBuZ2ItYWNjb3JkaW9uLWl0ZW0tWFhgIGZvcm1hdCwgdW5sZXNzIHByb3ZpZGVkIGV4cGxpY2l0bHkuXG4gKlxuICogQHNpbmNlIDE0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdbbmdiQWNjb3JkaW9uSXRlbV0nLFxuXHRleHBvcnRBczogJ25nYkFjY29yZGlvbkl0ZW0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0J1tpZF0nOiAnaWQnLFxuXHRcdGNsYXNzOiAnYWNjb3JkaW9uLWl0ZW0nLFxuXHR9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JBY2NvcmRpb25JdGVtIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG5cdHByaXZhdGUgX2FjY29yZGlvbiA9IGluamVjdChOZ2JBY2NvcmRpb25EaXJlY3RpdmUpO1xuXHRwcml2YXRlIF9jZCA9IGluamVjdChDaGFuZ2VEZXRlY3RvclJlZik7XG5cdHByaXZhdGUgX2Rlc3Ryb3lSZWYgPSBpbmplY3QoRGVzdHJveVJlZik7XG5cblx0cHJpdmF0ZSBfY29sbGFwc2VkID0gdHJ1ZTtcblx0cHJpdmF0ZSBfaWQgPSBgbmdiLWFjY29yZGlvbi1pdGVtLSR7bmV4dElkKyt9YDtcblx0cHJpdmF0ZSBfZGVzdHJveU9uSGlkZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuXHRwcml2YXRlIF9jb2xsYXBzZUFuaW1hdGlvblJ1bm5pbmcgPSBmYWxzZTtcblxuXHRAQ29udGVudENoaWxkKE5nYkFjY29yZGlvbkNvbGxhcHNlLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIF9jb2xsYXBzZTogTmdiQWNjb3JkaW9uQ29sbGFwc2U7XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGN1c3RvbSBJRCBvZiB0aGUgYWNjb3JkaW9uIGl0ZW0uIEl0IG11c3QgYmUgdW5pcXVlIGZvciB0aGUgZG9jdW1lbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSBpZCBUaGUgSUQgb2YgdGhlIGFjY29yZGlvbiBpdGVtLCBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZ1xuXHQgKi9cblx0QElucHV0KCduZ2JBY2NvcmRpb25JdGVtJykgc2V0IGlkKGlkOiBzdHJpbmcpIHtcblx0XHRpZiAoaXNTdHJpbmcoaWQpICYmIGlkICE9PSAnJykge1xuXHRcdFx0dGhpcy5faWQgPSBpZDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB0aGUgY29udGVudCBvZiB0aGUgYWNjb3JkaW9uIGl0ZW0ncyBib2R5IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBET00uIEl0IHdpbGwgYmUganVzdCBoaWRkZW4gb3RoZXJ3aXNlLlxuXHQgKlxuXHQgKiBUaGlzIHByb3BlcnR5IGNhbiBhbHNvIGJlIHNldCB1cCBvbiB0aGUgcGFyZW50IFtgTmdiQWNjb3JkaW9uYCBkaXJlY3RpdmVdKCMvY29tcG9uZW50cy9hY2NvcmRpb24vYXBpI05nYkFjY29yZGlvbkRpcmVjdGl2ZSkuXG5cdCAqL1xuXHRASW5wdXQoKSBzZXQgZGVzdHJveU9uSGlkZShkZXN0cm95T25IaWRlOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fZGVzdHJveU9uSGlkZSA9IGRlc3Ryb3lPbkhpZGU7XG5cdH1cblxuXHRnZXQgZGVzdHJveU9uSGlkZSgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fZGVzdHJveU9uSGlkZSA9PT0gdW5kZWZpbmVkID8gdGhpcy5fYWNjb3JkaW9uLmRlc3Ryb3lPbkhpZGUgOiB0aGlzLl9kZXN0cm95T25IaWRlITtcblx0fVxuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHRoZSBhY2NvcmRpb24gaXRlbSB3aWxsIGJlIGRpc2FibGVkLlxuXHQgKiBJdCB3b24ndCByZWFjdCB0byB1c2VyJ3MgY2xpY2tzLCBidXQgc3RpbGwgd2lsbCBiZSB0b2dnZWxhYmxlIHByb2dyYW1tYXRpY2FsbHkuXG5cdCAqL1xuXHRASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuXG5cdC8qKlxuXHQgKlx0SWYgYHRydWVgLCB0aGUgYWNjb3JkaW9uIGl0ZW0gd2lsbCBiZSBjb2xsYXBzZWQuIE90aGVyd2lzZSwgaXQgd2lsbCBiZSBleHBhbmRlZC5cblx0ICpcblx0ICogQHBhcmFtIGNvbGxhcHNlZCBOZXcgc3RhdGUgb2YgdGhlIGFjY29yZGlvbiBpdGVtLlxuXHQgKi9cblx0QElucHV0KCkgc2V0IGNvbGxhcHNlZChjb2xsYXBzZWQ6IGJvb2xlYW4pIHtcblx0XHRpZiAoY29sbGFwc2VkKSB7XG5cdFx0XHR0aGlzLmNvbGxhcHNlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZXhwYW5kKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEV2ZW50IGVtaXR0ZWQgYmVmb3JlIHRoZSBleHBhbmRpbmcgYW5pbWF0aW9uIHN0YXJ0cy4gSXQgaGFzIG5vIHBheWxvYWQuXG5cdCAqXG5cdCAqIEBzaW5jZSAxNS4xLjBcblx0ICovXG5cdEBPdXRwdXQoKSBzaG93ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cdC8qKlxuXHQgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGV4cGFuZGluZyBhbmltYXRpb24gaXMgZmluaXNoZWQuIEl0IGhhcyBubyBwYXlsb2FkLlxuXHQgKi9cblx0QE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cdC8qKlxuXHQgKiBFdmVudCBlbWl0dGVkIGJlZm9yZSB0aGUgY29sbGFwc2luZyBhbmltYXRpb24gc3RhcnRzLiBJdCBoYXMgbm8gcGF5bG9hZC5cblx0ICpcblx0ICogQHNpbmNlIDE1LjEuMFxuXHQgKi9cblx0QE91dHB1dCgpIGhpZGUgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblx0LyoqXG5cdCAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY29sbGFwc2luZyBhbmltYXRpb24gaXMgZmluaXNoZWQgYW5kIGJlZm9yZSB0aGUgY29udGVudCBpcyByZW1vdmVkIGZyb20gRE9NLlxuXHQgKiBJdCBoYXMgbm8gcGF5bG9hZC5cblx0ICovXG5cdEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblx0Z2V0IGNvbGxhcHNlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fY29sbGFwc2VkO1xuXHR9XG5cblx0Z2V0IGlkKCkge1xuXHRcdHJldHVybiBgJHt0aGlzLl9pZH1gO1xuXHR9XG5cblx0Z2V0IHRvZ2dsZUlkKCkge1xuXHRcdHJldHVybiBgJHt0aGlzLmlkfS10b2dnbGVgO1xuXHR9XG5cblx0Z2V0IGNvbGxhcHNlSWQoKSB7XG5cdFx0cmV0dXJuIGAke3RoaXMuaWR9LWNvbGxhcHNlYDtcblx0fVxuXG5cdGdldCBfc2hvdWxkQmVJbkRPTSgpIHtcblx0XHRyZXR1cm4gIXRoaXMuY29sbGFwc2VkIHx8IHRoaXMuX2NvbGxhcHNlQW5pbWF0aW9uUnVubmluZyB8fCAhdGhpcy5kZXN0cm95T25IaWRlO1xuXHR9XG5cblx0bmdBZnRlckNvbnRlbnRJbml0KCkge1xuXHRcdGNvbnN0IHsgbmdiQ29sbGFwc2UgfSA9IHRoaXMuX2NvbGxhcHNlO1xuXHRcdC8vIHdlIG5lZWQgdG8gZGlzYWJsZSB0aGUgYW5pbWF0aW9uIGZvciB0aGUgZmlyc3QgaW5pdFxuXHRcdG5nYkNvbGxhcHNlLmFuaW1hdGlvbiA9IGZhbHNlO1xuXHRcdG5nYkNvbGxhcHNlLmNvbGxhcHNlZCA9IHRoaXMuY29sbGFwc2VkO1xuXHRcdC8vIHdlIHNldCB0aGUgYW5pbWF0aW9uIHRvIHRoZSBkZWZhdWx0IG9mIHRoZSBhY2NvcmRpb25cblx0XHRuZ2JDb2xsYXBzZS5hbmltYXRpb24gPSB0aGlzLl9hY2NvcmRpb24uYW5pbWF0aW9uO1xuXHRcdC8vIGV2ZW50IGZvcndhcmRpbmcgZnJvbSAnbmdiQ29sbGFwc2UnIHRvICduZ2JBY2NvcmRpb24nXG5cdFx0bmdiQ29sbGFwc2UuaGlkZGVuLnBpcGUodGFrZVVudGlsRGVzdHJveWVkKHRoaXMuX2Rlc3Ryb3lSZWYpKS5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0Ly8gd2hlbiB0aGUgYW5pbWF0aW9uIGZpbmlzaGVzIHdlIGNhbiByZW1vdmUgdGhlIHRlbXBsYXRlIGZyb20gRE9NXG5cdFx0XHR0aGlzLl9jb2xsYXBzZUFuaW1hdGlvblJ1bm5pbmcgPSBmYWxzZTtcblx0XHRcdHRoaXMuaGlkZGVuLmVtaXQoKTtcblx0XHRcdHRoaXMuX2FjY29yZGlvbi5oaWRkZW4uZW1pdCh0aGlzLmlkKTtcblx0XHR9KTtcblx0XHRuZ2JDb2xsYXBzZS5zaG93bi5waXBlKHRha2VVbnRpbERlc3Ryb3llZCh0aGlzLl9kZXN0cm95UmVmKSkuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuc2hvd24uZW1pdCgpO1xuXHRcdFx0dGhpcy5fYWNjb3JkaW9uLnNob3duLmVtaXQodGhpcy5pZCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyBhbiBhY2NvcmRpb24gaXRlbS5cblx0ICovXG5cdHRvZ2dsZSgpIHtcblx0XHR0aGlzLmNvbGxhcHNlZCA9ICF0aGlzLmNvbGxhcHNlZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBFeHBhbmRzIGFuIGFjY29yZGlvbiBpdGVtLlxuXHQgKi9cblx0ZXhwYW5kKCkge1xuXHRcdGlmICh0aGlzLmNvbGxhcHNlZCkge1xuXHRcdFx0Ly8gY2hlY2tpbmcgaWYgYWNjb3JkaW9uIGFsbG93cyB0byBleHBhbmQgdGhlIHBhbmVsIGluIHJlc3BlY3QgdG8gJ2Nsb3NlT3RoZXJzJyBmbGFnXG5cdFx0XHRpZiAoIXRoaXMuX2FjY29yZGlvbi5fZW5zdXJlQ2FuRXhwYW5kKHRoaXMpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fY29sbGFwc2VkID0gZmFsc2U7XG5cblx0XHRcdC8vIG5lZWQgaWYgdGhlIGFjY29yZGlvbiBpcyB1c2VkIGluc2lkZSBhIGNvbXBvbmVudCBoYXZpbmcgT25QdXNoIGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3lcblx0XHRcdHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuXG5cdFx0XHQvLyB3ZSBuZWVkIGZvcmNlIENEIHRvIGdldCB0ZW1wbGF0ZSBpbnRvIERPTSBiZWZvcmUgc3RhcnRpbmcgYW5pbWF0aW9uIHRvIGNhbGN1bGF0ZSBpdHMgaGVpZ2h0IGNvcnJlY3RseVxuXHRcdFx0Ly8gdGhpcyB3aWxsIHN5bmNocm9ub3VzbHkgcHV0IHRoZSBpdGVtIGJvZHkgaW50byBET00sIGJlY2F1c2UgYHRoaXMuX2NvbGxhcHNlZGAgd2FzIGZsaXBwZWQgdG8gYGZhbHNlYFxuXHRcdFx0dGhpcy5fY2QuZGV0ZWN0Q2hhbmdlcygpO1xuXG5cdFx0XHQvLyBmaXJpbmcgZXZlbnRzIGJlZm9yZSBzdGFydGluZyBhbmltYXRpb25zXG5cdFx0XHR0aGlzLnNob3cuZW1pdCgpO1xuXHRcdFx0dGhpcy5fYWNjb3JkaW9uLnNob3cuZW1pdCh0aGlzLmlkKTtcblxuXHRcdFx0Ly8gd2UgYWxzbyBuZWVkIHRvIG1ha2Ugc3VyZSAnYW5pbWF0aW9uJyBmbGFnIGlzIHVwLXRvLSBkYXRlXG5cdFx0XHR0aGlzLl9jb2xsYXBzZS5uZ2JDb2xsYXBzZS5hbmltYXRpb24gPSB0aGlzLl9hY2NvcmRpb24uYW5pbWF0aW9uO1xuXHRcdFx0dGhpcy5fY29sbGFwc2UubmdiQ29sbGFwc2UuY29sbGFwc2VkID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENvbGxhcHNlcyBhbiBhY2NvcmRpb24gaXRlbS5cblx0ICovXG5cdGNvbGxhcHNlKCkge1xuXHRcdGlmICghdGhpcy5jb2xsYXBzZWQpIHtcblx0XHRcdHRoaXMuX2NvbGxhcHNlZCA9IHRydWU7XG5cdFx0XHR0aGlzLl9jb2xsYXBzZUFuaW1hdGlvblJ1bm5pbmcgPSB0cnVlO1xuXG5cdFx0XHQvLyBuZWVkIGlmIHRoZSBhY2NvcmRpb24gaXMgdXNlZCBpbnNpZGUgYSBjb21wb25lbnQgaGF2aW5nIE9uUHVzaCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5XG5cdFx0XHR0aGlzLl9jZC5tYXJrRm9yQ2hlY2soKTtcblxuXHRcdFx0Ly8gZmlyaW5nIGV2ZW50cyBiZWZvcmUgc3RhcnRpbmcgYW5pbWF0aW9uc1xuXHRcdFx0dGhpcy5oaWRlLmVtaXQoKTtcblx0XHRcdHRoaXMuX2FjY29yZGlvbi5oaWRlLmVtaXQodGhpcy5pZCk7XG5cblx0XHRcdC8vIHdlIGFsc28gbmVlZCB0byBtYWtlIHN1cmUgJ2FuaW1hdGlvbicgZmxhZyBpcyB1cC10by0gZGF0ZVxuXHRcdFx0dGhpcy5fY29sbGFwc2UubmdiQ29sbGFwc2UuYW5pbWF0aW9uID0gdGhpcy5fYWNjb3JkaW9uLmFuaW1hdGlvbjtcblx0XHRcdHRoaXMuX2NvbGxhcHNlLm5nYkNvbGxhcHNlLmNvbGxhcHNlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQWNjb3JkaW9uIGlzIGEgc3RhY2sgb2YgY2FyZHMgdGhhdCBoYXZlIGEgaGVhZGVyIGFuZCBjb2xsYXBzaWJsZSBib2R5LlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIGEgY29udGFpbmVyIGZvciB0aGVzZSBpdGVtcyBhbmQgcHJvdmlkZXMgYW4gQVBJIHRvIGhhbmRsZSB0aGVtLlxuICpcbiAqIEBzaW5jZSAxNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkFjY29yZGlvbl0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRleHBvcnRBczogJ25nYkFjY29yZGlvbicsXG5cdGhvc3Q6IHtcblx0XHRjbGFzczogJ2FjY29yZGlvbicsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvbkRpcmVjdGl2ZSB7XG5cdHByaXZhdGUgX2NvbmZpZyA9IGluamVjdChOZ2JBY2NvcmRpb25Db25maWcpO1xuXHRwcml2YXRlIF9hbkl0ZW1XYXNBbHJlYWR5RXhwYW5kZWREdXJpbmdJbml0aWFsaXNhdGlvbiA9IGZhbHNlO1xuXG5cdEBDb250ZW50Q2hpbGRyZW4oTmdiQWNjb3JkaW9uSXRlbSwgeyBkZXNjZW5kYW50czogZmFsc2UgfSkgcHJpdmF0ZSBfaXRlbXM/OiBRdWVyeUxpc3Q8TmdiQWNjb3JkaW9uSXRlbT47XG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIGFjY29yZGlvbiB3aWxsIGJlIGFuaW1hdGVkLlxuXHQgKi9cblx0QElucHV0KCkgYW5pbWF0aW9uID0gdGhpcy5fY29uZmlnLmFuaW1hdGlvbjtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCBvbmx5IG9uZSBpdGVtIGF0IHRoZSB0aW1lIGNhbiBzdGF5IG9wZW4uXG5cdCAqL1xuXHRASW5wdXQoKSBjbG9zZU90aGVycyA9IHRoaXMuX2NvbmZpZy5jbG9zZU90aGVycztcblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgdGhlIGNvbnRlbnQgb2YgdGhlIGFjY29yZGlvbiBpdGVtcyBib2R5IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBET00uIEl0IHdpbGwgYmUganVzdCBoaWRkZW4gb3RoZXJ3aXNlLlxuXHQgKlxuXHQgKiBUaGlzIHByb3BlcnR5IGNhbiBiZSBvdmVyd3JpdHRlbiBhdCB0aGUgW2BOZ2JBY2NvcmRpb25JdGVtYF0oIy9jb21wb25lbnRzL2FjY29yZGlvbi9hcGkjTmdiQWNjb3JkaW9uSXRlbSkgbGV2ZWxcblx0ICovXG5cdEBJbnB1dCgpIGRlc3Ryb3lPbkhpZGUgPSB0aGlzLl9jb25maWcuZGVzdHJveU9uSGlkZTtcblxuXHQvKipcblx0ICogRXZlbnQgZW1pdHRlZCBiZWZvcmUgZXhwYW5kaW5nIGFuaW1hdGlvbiBzdGFydHMuIFRoZSBwYXlsb2FkIGlzIHRoZSBpZCBvZiBzaG93biBhY2NvcmRpb24gaXRlbS5cblx0ICpcblx0ICogQHNpbmNlIDE1LjEuMFxuXHQgKi9cblx0QE91dHB1dCgpIHNob3cgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuXHQvKipcblx0ICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBleHBhbmRpbmcgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBUaGUgcGF5bG9hZCBpcyB0aGUgaWQgb2Ygc2hvd24gYWNjb3JkaW9uIGl0ZW0uXG5cdCAqL1xuXHRAT3V0cHV0KCkgc2hvd24gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuXHQvKipcblx0ICogRXZlbnQgZW1pdHRlZCBiZWZvcmUgdGhlIGNvbGxhcHNpbmcgYW5pbWF0aW9uIHN0YXJ0cy4gVGhlIHBheWxvYWQgaXMgdGhlIGlkIG9mIGhpZGRlbiBhY2NvcmRpb24gaXRlbS5cblx0ICpcblx0ICogQHNpbmNlIDE1LjEuMFxuXHQgKi9cblx0QE91dHB1dCgpIGhpZGUgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuXHQvKipcblx0ICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjb2xsYXBzaW5nIGFuaW1hdGlvbiBpcyBmaW5pc2hlZCBhbmQgYmVmb3JlIHRoZSBjb250ZW50IGlzIHJlbW92ZWQgZnJvbSBET00uXG5cdCAqIFRoZSBwYXlsb2FkIGlzIHRoZSBpZCBvZiBoaWRkZW4gYWNjb3JkaW9uIGl0ZW0uXG5cdCAqL1xuXHRAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgYW4gaXRlbSB3aXRoIHRoZSBnaXZlbiBpZC5cblx0ICpcblx0ICogSXQgd2lsbCB0b2dnbGUgYW4gaXRlbSwgZXZlbiBpZiBpdCBpcyBkaXNhYmxlZC5cblx0ICpcblx0ICogQHBhcmFtIGl0ZW1JZCBUaGUgaWQgb2YgdGhlIGl0ZW0gdG8gdG9nZ2xlLlxuXHQgKi9cblx0dG9nZ2xlKGl0ZW1JZDogc3RyaW5nKSB7XG5cdFx0dGhpcy5fZ2V0SXRlbShpdGVtSWQpPy50b2dnbGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFeHBhbmRzIGFuIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gaWQuXG5cdCAqXG5cdCAqIElmIGBjbG9zZU90aGVyc2AgaXMgYHRydWVgLCBpdCB3aWxsIGNvbGxhcHNlIG90aGVyIHBhbmVscy5cblx0ICpcblx0ICogQHBhcmFtIGl0ZW1JZCBUaGUgaWQgb2YgdGhlIGl0ZW0gdG8gZXhwYW5kLlxuXHQgKi9cblx0ZXhwYW5kKGl0ZW1JZDogc3RyaW5nKSB7XG5cdFx0dGhpcy5fZ2V0SXRlbShpdGVtSWQpPy5leHBhbmQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFeHBhbmRzIGFsbCBpdGVtcy5cblx0ICpcblx0ICogSWYgYGNsb3NlT3RoZXJzYCBpcyBgdHJ1ZWAgYW5kIGFsbCBpdGVtcyBhcmUgY2xvc2VkLCBpdCB3aWxsIG9wZW4gdGhlIGZpcnN0IG9uZS4gT3RoZXJ3aXNlLCBpdCB3aWxsIGtlZXAgdGhlIG9wZW5lZCBvbmUuXG5cdCAqL1xuXHRleHBhbmRBbGwoKSB7XG5cdFx0aWYgKHRoaXMuX2l0ZW1zKSB7XG5cdFx0XHRpZiAodGhpcy5jbG9zZU90aGVycykge1xuXHRcdFx0XHQvLyB3ZSBjaGVjayBpZiB0aGVyZSBpcyBhbiBpdGVtIG9wZW4gYW5kIGlmIGl0IGlzIG5vdCB3ZSBjYW4gZXhwYW5kIHRoZSBmaXJzdCBpdGVtXG5cdFx0XHRcdC8vIChvdGhlcndpc2Ugd2UgdG9nZ2xlIG5vdGhpbmcpXG5cdFx0XHRcdGlmICghdGhpcy5faXRlbXMuZmluZCgoaXRlbSkgPT4gIWl0ZW0uY29sbGFwc2VkKSkge1xuXHRcdFx0XHRcdHRoaXMuX2l0ZW1zLmZpcnN0LmV4cGFuZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLmV4cGFuZCgpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ29sbGFwc2VzIGFuIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gaWQuXG5cdCAqXG5cdCAqIEhhcyBubyBlZmZlY3QgaWYgdGhlIGBpdGVtSWRgIGRvZXMgbm90IGNvcnJlc3BvbmQgdG8gYW55IGl0ZW0uXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtSWQgVGhlIGlkIG9mIHRoZSBpdGVtIHRvIGNvbGxhcHNlLlxuXHQgKi9cblx0Y29sbGFwc2UoaXRlbUlkOiBzdHJpbmcpIHtcblx0XHR0aGlzLl9nZXRJdGVtKGl0ZW1JZCk/LmNvbGxhcHNlKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ29sbGFwc2VzIGFsbCBpdGVtcy5cblx0ICovXG5cdGNvbGxhcHNlQWxsKCkge1xuXHRcdHRoaXMuX2l0ZW1zPy5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLmNvbGxhcHNlKCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiBhbiBpdGVtIHdpdGggdGhlIGdpdmVuIGlkIGlzIGV4cGFuZGVkLlxuXHQgKlxuXHQgKiBJZiB0aGUgYGl0ZW1JZGAgZG9lcyBub3QgY29ycmVzcG9uZCB0byBhbnkgaXRlbSwgaXQgcmV0dXJucyBgZmFsc2VgLlxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlbUlkIFRoZSBpZCBvZiB0aGUgaXRlbSB0byBjaGVjay5cblx0ICovXG5cdGlzRXhwYW5kZWQoaXRlbUlkOiBzdHJpbmcpIHtcblx0XHRjb25zdCBpdGVtID0gdGhpcy5fZ2V0SXRlbShpdGVtSWQpO1xuXHRcdHJldHVybiBpdGVtID8gIWl0ZW0uY29sbGFwc2VkIDogZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogSXQgY2hlY2tzLCBpZiB0aGUgaXRlbSBjYW4gYmUgZXhwYW5kZWQgaW4gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGFjY29yZGlvbi5cblx0ICogV2l0aCBgY2xvc2VPdGhlcnNgIHRoZXJlIGNhbiBiZSBvbmx5IG9uZSBleHBhbmRlZCBpdGVtIGF0IGEgdGltZS5cblx0ICpcblx0ICogQGludGVybmFsXG5cdCAqL1xuXHRfZW5zdXJlQ2FuRXhwYW5kKHRvRXhwYW5kOiBOZ2JBY2NvcmRpb25JdGVtKSB7XG5cdFx0aWYgKCF0aGlzLmNsb3NlT3RoZXJzKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBzcGVjaWFsIGNhc2UgZHVyaW5nIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgW2NvbGxhcHNlXT1cImZhbHNlXCIgaW5wdXRzXG5cdFx0Ly8gYHRoaXMuX2l0ZW1zYCBRdWVyeUxpc3QgaXMgbm90IHlldCBpbml0aWFsaXplZCwgYnV0IHdlIG5lZWQgdG8gZW5zdXJlIG9ubHkgb25lIGl0ZW0gY2FuIGJlIGV4cGFuZGVkIGF0IGEgdGltZVxuXHRcdGlmICghdGhpcy5faXRlbXMpIHtcblx0XHRcdGlmICghdGhpcy5fYW5JdGVtV2FzQWxyZWFkeUV4cGFuZGVkRHVyaW5nSW5pdGlhbGlzYXRpb24pIHtcblx0XHRcdFx0dGhpcy5fYW5JdGVtV2FzQWxyZWFkeUV4cGFuZGVkRHVyaW5nSW5pdGlhbGlzYXRpb24gPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBhbiBleHBhbmRlZCBpdGVtLCB3ZSBuZWVkIHRvIGNvbGxhcHNlIGl0IGZpcnN0XG5cdFx0dGhpcy5faXRlbXMuZmluZCgoaXRlbSkgPT4gIWl0ZW0uY29sbGFwc2VkICYmIHRvRXhwYW5kICE9PSBpdGVtKT8uY29sbGFwc2UoKTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0SXRlbShpdGVtSWQ6IHN0cmluZyk6IE5nYkFjY29yZGlvbkl0ZW0gfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiB0aGlzLl9pdGVtcz8uZmluZCgoaXRlbSkgPT4gaXRlbS5pZCA9PT0gaXRlbUlkKTtcblx0fVxufVxuIl19