import { Attribute, ChangeDetectorRef, ContentChild, ContentChildren, DestroyRef, Directive, ElementRef, EventEmitter, forwardRef, inject, Input, Output, TemplateRef, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isDefined } from '../util/util';
import { NgbNavConfig } from './nav-config';
import * as i0 from "@angular/core";
const isValidNavId = (id) => isDefined(id) && id !== '';
let navCounter = 0;
/**
 * This directive must be used to wrap content to be displayed in the nav.
 *
 * @since 5.2.0
 */
export class NgbNavContent {
    constructor() {
        this.templateRef = inject(TemplateRef);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavContent, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbNavContent, isStandalone: true, selector: "ng-template[ngbNavContent]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavContent, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbNavContent]', standalone: true }]
        }] });
/**
 * This directive applies a specific role on a non-container based ngbNavItem.
 *
 * @since 14.1.0
 */
export class NgbNavItemRole {
    constructor(role) {
        this.role = role;
        this.nav = inject(NgbNav);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavItemRole, deps: [{ token: 'role', attribute: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbNavItemRole, isStandalone: true, selector: "[ngbNavItem]:not(ng-container)", host: { properties: { "attr.role": "role ? role : nav.roles ? 'presentation' : undefined" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavItemRole, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbNavItem]:not(ng-container)',
                    standalone: true,
                    host: {
                        '[attr.role]': `role ? role : nav.roles ? 'presentation' : undefined`,
                    },
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['role']
                }] }] });
/**
 * The directive used to group nav link and related nav content. As well as set nav identifier and some options.
 *
 * @since 5.2.0
 */
export class NgbNavItem {
    constructor() {
        this._nav = inject(NgbNav);
        this._nativeElement = inject(ElementRef).nativeElement;
        /**
         * If `true`, the current nav item is disabled and can't be toggled by user.
         *
         * Nevertheless disabled nav can be selected programmatically via the `.select()` method and the `[activeId]` binding.
         */
        this.disabled = false;
        /**
         * An event emitted when the fade in transition is finished on the related nav content
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the fade out transition is finished on the related nav content
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
    }
    ngOnInit() {
        if (!isDefined(this.domId)) {
            this.domId = `ngb-nav-${navCounter++}`;
        }
    }
    get active() {
        return this._nav.activeId === this.id;
    }
    get id() {
        return isValidNavId(this._id) ? this._id : this.domId;
    }
    get panelDomId() {
        return `${this.domId}-panel`;
    }
    isPanelInDom() {
        return (isDefined(this.destroyOnHide) ? !this.destroyOnHide : !this._nav.destroyOnHide) || this.active;
    }
    /**
     * @internal
     */
    isNgContainer() {
        return this._nativeElement.nodeType === Node.COMMENT_NODE;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavItem, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbNavItem, isStandalone: true, selector: "[ngbNavItem]", inputs: { destroyOnHide: "destroyOnHide", disabled: "disabled", domId: "domId", _id: ["ngbNavItem", "_id"] }, outputs: { shown: "shown", hidden: "hidden" }, host: { classAttribute: "nav-item" }, queries: [{ propertyName: "contentTpl", first: true, predicate: NgbNavContent }], exportAs: ["ngbNavItem"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbNavItem]',
                    exportAs: 'ngbNavItem',
                    standalone: true,
                    host: {
                        class: 'nav-item',
                    },
                }]
        }], propDecorators: { destroyOnHide: [{
                type: Input
            }], disabled: [{
                type: Input
            }], domId: [{
                type: Input
            }], _id: [{
                type: Input,
                args: ['ngbNavItem']
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], contentTpl: [{
                type: ContentChild,
                args: [NgbNavContent, { descendants: false }]
            }] } });
/**
 * A nav directive that helps with implementing tabbed navigation components.
 *
 * @since 5.2.0
 */
export class NgbNav {
    constructor(role) {
        this.role = role;
        this._config = inject(NgbNavConfig);
        this._cd = inject(ChangeDetectorRef);
        this._document = inject(DOCUMENT);
        this._nativeElement = inject(ElementRef).nativeElement;
        this.destroyRef = inject(DestroyRef);
        this._navigatingWithKeyboard = false;
        /**
         * The event emitted after the active nav changes
         * The payload of the event is the newly active nav id
         *
         * If you want to prevent nav change, you should use `(navChange)` event
         */
        this.activeIdChange = new EventEmitter();
        /**
         * If `true`, nav change will be animated.
         *
         * @since 8.0.0
         */
        this.animation = this._config.animation;
        /**
         * If `true`, non-active nav content will be removed from DOM
         * Otherwise it will just be hidden
         */
        this.destroyOnHide = this._config.destroyOnHide;
        /**
         * The orientation of navs.
         *
         * Using `vertical` will also add the `aria-orientation` attribute
         */
        this.orientation = this._config.orientation;
        /**
         * Role attribute generating strategy:
         * - `false` - no role attributes will be generated
         * - `'tablist'` - 'tablist', 'tab' and 'tabpanel' will be generated (default)
         */
        this.roles = this._config.roles;
        /**
         * Keyboard support for nav focus/selection using arrow keys.
         *
         * * `true` - navs will be focused using keyboard arrow keys
         * * `false` - no keyboard support
         * * `'changeWithArrows'` -  nav will be selected using keyboard arrow keys
         *
         * See the [list of available keyboard shortcuts](#/components/nav/overview#keyboard-shortcuts).
         *
         * @since 6.1.0
         */
        this.keyboard = this._config.keyboard;
        /**
         * An event emitted when the fade in transition is finished for one of the items.
         *
         * Payload of the event is the nav id that was just shown.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the fade out transition is finished for one of the items.
         *
         * Payload of the event is the nav id that was just hidden.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.navItemChange$ = new Subject();
        /**
         * The nav change event emitted right before the nav change happens on user click.
         *
         * This event won't be emitted if nav is changed programmatically via `[activeId]` or `.select()`.
         *
         * See [`NgbNavChangeEvent`](#/components/nav/api#NgbNavChangeEvent) for payload details.
         */
        this.navChange = new EventEmitter();
    }
    click(item) {
        if (!item.disabled) {
            this._updateActiveId(item.id);
        }
    }
    onFocusout({ relatedTarget }) {
        if (!this._nativeElement.contains(relatedTarget)) {
            this._navigatingWithKeyboard = false;
        }
    }
    onKeyDown(event) {
        if (this.roles !== 'tablist' || !this.keyboard) {
            return;
        }
        const enabledLinks = this.links.filter((link) => !link.navItem.disabled);
        const { length } = enabledLinks;
        let position = -1;
        enabledLinks.forEach((link, index) => {
            if (link.nativeElement === this._document.activeElement) {
                position = index;
            }
        });
        if (length) {
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    position = (position - 1 + length) % length;
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    position = (position + 1) % length;
                    break;
                case 'Home':
                    position = 0;
                    break;
                case 'End':
                    position = length - 1;
                    break;
            }
            if (this.keyboard === 'changeWithArrows') {
                this.select(enabledLinks[position].navItem.id);
            }
            enabledLinks[position].nativeElement.focus();
            this._navigatingWithKeyboard = true;
            event.preventDefault();
        }
    }
    /**
     * Selects the nav with the given id and shows its associated pane.
     * Any other nav that was previously selected becomes unselected and its associated pane is hidden.
     */
    select(id) {
        this._updateActiveId(id, false);
    }
    ngAfterContentInit() {
        if (!isDefined(this.activeId)) {
            const nextId = this.items.first ? this.items.first.id : null;
            if (isValidNavId(nextId)) {
                this._updateActiveId(nextId, false);
                this._cd.detectChanges();
            }
        }
        this.items.changes
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this._notifyItemChanged(this.activeId));
    }
    ngOnChanges({ activeId }) {
        if (activeId && !activeId.firstChange) {
            this._notifyItemChanged(activeId.currentValue);
        }
    }
    _updateActiveId(nextId, emitNavChange = true) {
        if (this.activeId !== nextId) {
            let defaultPrevented = false;
            if (emitNavChange) {
                this.navChange.emit({
                    activeId: this.activeId,
                    nextId,
                    preventDefault: () => {
                        defaultPrevented = true;
                    },
                });
            }
            if (!defaultPrevented) {
                this.activeId = nextId;
                this.activeIdChange.emit(nextId);
                this._notifyItemChanged(nextId);
            }
        }
    }
    _notifyItemChanged(nextItemId) {
        this.navItemChange$.next(this._getItemById(nextItemId));
    }
    _getItemById(itemId) {
        return (this.items && this.items.find((item) => item.id === itemId)) || null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNav, deps: [{ token: 'role', attribute: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbNav, isStandalone: true, selector: "[ngbNav]", inputs: { activeId: "activeId", animation: "animation", destroyOnHide: "destroyOnHide", orientation: "orientation", roles: "roles", keyboard: "keyboard" }, outputs: { activeIdChange: "activeIdChange", shown: "shown", hidden: "hidden", navChange: "navChange" }, host: { listeners: { "keydown.arrowLeft": "onKeyDown($event)", "keydown.arrowRight": "onKeyDown($event)", "keydown.arrowDown": "onKeyDown($event)", "keydown.arrowUp": "onKeyDown($event)", "keydown.Home": "onKeyDown($event)", "keydown.End": "onKeyDown($event)", "focusout": "onFocusout($event)" }, properties: { "class.flex-column": "orientation === 'vertical'", "attr.aria-orientation": "orientation === 'vertical' && roles === 'tablist' ? 'vertical' : undefined", "attr.role": "role ? role : roles ? 'tablist' : undefined" }, classAttribute: "nav" }, queries: [{ propertyName: "items", predicate: NgbNavItem }, { propertyName: "links", predicate: i0.forwardRef(() => NgbNavLinkBase), descendants: true }], exportAs: ["ngbNav"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNav, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbNav]',
                    exportAs: 'ngbNav',
                    standalone: true,
                    host: {
                        class: 'nav',
                        '[class.flex-column]': `orientation === 'vertical'`,
                        '[attr.aria-orientation]': `orientation === 'vertical' && roles === 'tablist' ? 'vertical' : undefined`,
                        '[attr.role]': `role ? role : roles ? 'tablist' : undefined`,
                        '(keydown.arrowLeft)': 'onKeyDown($event)',
                        '(keydown.arrowRight)': 'onKeyDown($event)',
                        '(keydown.arrowDown)': 'onKeyDown($event)',
                        '(keydown.arrowUp)': 'onKeyDown($event)',
                        '(keydown.Home)': 'onKeyDown($event)',
                        '(keydown.End)': 'onKeyDown($event)',
                        '(focusout)': 'onFocusout($event)',
                    },
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['role']
                }] }], propDecorators: { activeId: [{
                type: Input
            }], activeIdChange: [{
                type: Output
            }], animation: [{
                type: Input
            }], destroyOnHide: [{
                type: Input
            }], orientation: [{
                type: Input
            }], roles: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], items: [{
                type: ContentChildren,
                args: [NgbNavItem]
            }], links: [{
                type: ContentChildren,
                args: [forwardRef(() => NgbNavLinkBase), { descendants: true }]
            }], navChange: [{
                type: Output
            }] } });
export class NgbNavLinkBase {
    constructor(role) {
        this.role = role;
        this.navItem = inject(NgbNavItem);
        this.nav = inject(NgbNav);
        this.nativeElement = inject(ElementRef).nativeElement;
    }
    get tabindex() {
        if (this.nav.keyboard === false) {
            return this.navItem.disabled ? -1 : undefined;
        }
        if (this.nav._navigatingWithKeyboard) {
            return -1;
        }
        return this.navItem.disabled || !this.navItem.active ? -1 : undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavLinkBase, deps: [{ token: 'role', attribute: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbNavLinkBase, isStandalone: true, selector: "[ngbNavLink]", host: { properties: { "id": "navItem.domId", "class.nav-item": "navItem.isNgContainer()", "attr.role": "role ? role : nav.roles ? 'tab' : undefined", "class.active": "navItem.active", "class.disabled": "navItem.disabled", "attr.tabindex": "tabindex", "attr.aria-controls": "navItem.isPanelInDom() ? navItem.panelDomId : null", "attr.aria-selected": "navItem.active", "attr.aria-disabled": "navItem.disabled" }, classAttribute: "nav-link" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavLinkBase, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbNavLink]',
                    standalone: true,
                    host: {
                        '[id]': 'navItem.domId',
                        class: 'nav-link',
                        '[class.nav-item]': 'navItem.isNgContainer()',
                        '[attr.role]': `role ? role : nav.roles ? 'tab' : undefined`,
                        '[class.active]': 'navItem.active',
                        '[class.disabled]': 'navItem.disabled',
                        '[attr.tabindex]': 'tabindex',
                        '[attr.aria-controls]': 'navItem.isPanelInDom() ? navItem.panelDomId : null',
                        '[attr.aria-selected]': 'navItem.active',
                        '[attr.aria-disabled]': 'navItem.disabled',
                    },
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['role']
                }] }] });
/**
 * A directive to mark the nav link when used on a button element.
 */
export class NgbNavLinkButton extends NgbNavLinkBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavLinkButton, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbNavLinkButton, isStandalone: true, selector: "button[ngbNavLink]", host: { attributes: { "type": "button" }, listeners: { "click": "nav.click(navItem)" }, properties: { "disabled": "navItem.disabled" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavLinkButton, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[ngbNavLink]',
                    standalone: true,
                    host: {
                        type: 'button',
                        '[disabled]': 'navItem.disabled',
                        '(click)': 'nav.click(navItem)',
                    },
                }]
        }] });
/**
 * A directive to mark the nav link when used on a link element.
 *
 * @since 5.2.0
 */
export class NgbNavLink extends NgbNavLinkBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavLink, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbNavLink, isStandalone: true, selector: "a[ngbNavLink]", host: { attributes: { "href": "" }, listeners: { "click": "nav.click(navItem); $event.preventDefault()" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbNavLink, decorators: [{
            type: Directive,
            args: [{
                    selector: 'a[ngbNavLink]',
                    standalone: true,
                    host: {
                        href: '',
                        '(click)': 'nav.click(navItem); $event.preventDefault()',
                    },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL25hdi9uYXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVOLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUdOLFdBQVcsR0FDWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7O0FBRTVDLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBTyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUU3RCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFnQm5COzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sYUFBYTtJQUQxQjtRQUVDLGdCQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ2xDOzhHQUZZLGFBQWE7a0dBQWIsYUFBYTs7MkZBQWIsYUFBYTtrQkFEekIsU0FBUzttQkFBQyxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFOztBQUt2RTs7OztHQUlHO0FBUUgsTUFBTSxPQUFPLGNBQWM7SUFHMUIsWUFBc0MsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7UUFGbEQsUUFBRyxHQUFHLE1BQU0sQ0FBQyxNQUFN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QkFBaUIsRUFBRSxVQUFVO3dCQUM3QixzQkFBc0IsRUFBRSxvREFBb0Q7d0JBQzVFLHNCQUFzQixFQUFFLGdCQUFnQjt3QkFDeEMsc0JBQXNCLEVBQUUsa0JBQWtCO3FCQUMxQztpQkFDRDs7MEJBTWEsU0FBUzsyQkFBQyxNQUFNOztBQWE5Qjs7R0FFRztBQVVILE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxjQUFjOzhHQUF2QyxnQkFBZ0I7a0dBQWhCLGdCQUFnQjs7MkZBQWhCLGdCQUFnQjtrQkFUNUIsU0FBUzttQkFBQztvQkFDVixRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFO3dCQUNMLElBQUksRUFBRSxRQUFRO3dCQUNkLFlBQVksRUFBRSxrQkFBa0I7d0JBQ2hDLFNBQVMsRUFBRSxvQkFBb0I7cUJBQy9CO2lCQUNEOztBQUdEOzs7O0dBSUc7QUFTSCxNQUFNLE9BQU8sVUFBVyxTQUFRLGNBQWM7OEdBQWpDLFVBQVU7a0dBQVYsVUFBVTs7MkZBQVYsVUFBVTtrQkFSdEIsU0FBUzttQkFBQztvQkFDVixRQUFRLEVBQUUsZUFBZTtvQkFDekIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLElBQUksRUFBRTt3QkFDTCxJQUFJLEVBQUUsRUFBRTt3QkFDUixTQUFTLEVBQUUsNkNBQTZDO3FCQUN4RDtpQkFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFmdGVyQ29udGVudEluaXQsXG5cdEF0dHJpYnV0ZSxcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbnRlbnRDaGlsZCxcblx0Q29udGVudENoaWxkcmVuLFxuXHREZXN0cm95UmVmLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0Zm9yd2FyZFJlZixcblx0aW5qZWN0LFxuXHRJbnB1dCxcblx0T25DaGFuZ2VzLFxuXHRPbkluaXQsXG5cdE91dHB1dCxcblx0UXVlcnlMaXN0LFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRUZW1wbGF0ZVJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbERlc3Ryb3llZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvcnhqcy1pbnRlcm9wJztcblxuaW1wb3J0IHsgaXNEZWZpbmVkIH0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE5nYk5hdkNvbmZpZyB9IGZyb20gJy4vbmF2LWNvbmZpZyc7XG5cbmNvbnN0IGlzVmFsaWROYXZJZCA9IChpZDogYW55KSA9PiBpc0RlZmluZWQoaWQpICYmIGlkICE9PSAnJztcblxubGV0IG5hdkNvdW50ZXIgPSAwO1xuXG4vKipcbiAqIENvbnRleHQgcGFzc2VkIHRvIHRoZSBuYXYgY29udGVudCB0ZW1wbGF0ZS5cbiAqXG4gKiBTZWUgW3RoaXMgZGVtb10oIy9jb21wb25lbnRzL25hdi9leGFtcGxlcyNrZWVwLWNvbnRlbnQpIGFzIHRoZSBleGFtcGxlLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYk5hdkNvbnRlbnRDb250ZXh0IHtcblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgY3VycmVudCBuYXYgY29udGVudCBpcyB2aXNpYmxlIGFuZCBhY3RpdmVcblx0ICovXG5cdCRpbXBsaWNpdDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBtdXN0IGJlIHVzZWQgdG8gd3JhcCBjb250ZW50IHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgbmF2LlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JOYXZDb250ZW50XScsIHN0YW5kYWxvbmU6IHRydWUgfSlcbmV4cG9ydCBjbGFzcyBOZ2JOYXZDb250ZW50IHtcblx0dGVtcGxhdGVSZWYgPSBpbmplY3QoVGVtcGxhdGVSZWYpO1xufVxuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIGFwcGxpZXMgYSBzcGVjaWZpYyByb2xlIG9uIGEgbm9uLWNvbnRhaW5lciBiYXNlZCBuZ2JOYXZJdGVtLlxuICpcbiAqIEBzaW5jZSAxNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYk5hdkl0ZW1dOm5vdChuZy1jb250YWluZXIpJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdCdbYXR0ci5yb2xlXSc6IGByb2xlID8gcm9sZSA6IG5hdi5yb2xlcyA/ICdwcmVzZW50YXRpb24nIDogdW5kZWZpbmVkYCxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiTmF2SXRlbVJvbGUge1xuXHRuYXYgPSBpbmplY3QoTmdiTmF2KTtcblxuXHRjb25zdHJ1Y3RvcihAQXR0cmlidXRlKCdyb2xlJykgcHVibGljIHJvbGU6IHN0cmluZykge31cbn1cblxuLyoqXG4gKiBUaGUgZGlyZWN0aXZlIHVzZWQgdG8gZ3JvdXAgbmF2IGxpbmsgYW5kIHJlbGF0ZWQgbmF2IGNvbnRlbnQuIEFzIHdlbGwgYXMgc2V0IG5hdiBpZGVudGlmaWVyIGFuZCBzb21lIG9wdGlvbnMuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ1tuZ2JOYXZJdGVtXScsXG5cdGV4cG9ydEFzOiAnbmdiTmF2SXRlbScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHRjbGFzczogJ25hdi1pdGVtJyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiTmF2SXRlbSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cdHByaXZhdGUgX25hdiA9IGluamVjdChOZ2JOYXYpO1xuXHRwcml2YXRlIF9uYXRpdmVFbGVtZW50ID0gaW5qZWN0KEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgbm9uLWFjdGl2ZSBjdXJyZW50IG5hdiBpdGVtIGNvbnRlbnQgd2lsbCBiZSByZW1vdmVkIGZyb20gRE9NXG5cdCAqIE90aGVyd2lzZSBpdCB3aWxsIGp1c3QgYmUgaGlkZGVuXG5cdCAqL1xuXHRASW5wdXQoKSBkZXN0cm95T25IaWRlO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHRoZSBjdXJyZW50IG5hdiBpdGVtIGlzIGRpc2FibGVkIGFuZCBjYW4ndCBiZSB0b2dnbGVkIGJ5IHVzZXIuXG5cdCAqXG5cdCAqIE5ldmVydGhlbGVzcyBkaXNhYmxlZCBuYXYgY2FuIGJlIHNlbGVjdGVkIHByb2dyYW1tYXRpY2FsbHkgdmlhIHRoZSBgLnNlbGVjdCgpYCBtZXRob2QgYW5kIHRoZSBgW2FjdGl2ZUlkXWAgYmluZGluZy5cblx0ICovXG5cdEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqIFRoZSBpZCB1c2VkIGZvciB0aGUgRE9NIGVsZW1lbnRzLlxuXHQgKiBNdXN0IGJlIHVuaXF1ZSBpbnNpZGUgdGhlIGRvY3VtZW50IGluIGNhc2UgeW91IGhhdmUgbXVsdGlwbGUgYG5nYk5hdmBzIG9uIHRoZSBwYWdlLlxuXHQgKlxuXHQgKiBBdXRvZ2VuZXJhdGVkIGFzIGBuZ2ItbmF2LVhYWGAgaWYgbm90IHByb3ZpZGVkLlxuXHQgKi9cblx0QElucHV0KCkgZG9tSWQ6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIGlkIHVzZWQgYXMgYSBtb2RlbCBmb3IgYWN0aXZlIG5hdi5cblx0ICogSXQgY2FuIGJlIGFueXRoaW5nLCBidXQgbXVzdCBiZSB1bmlxdWUgaW5zaWRlIG9uZSBgbmdiTmF2YC5cblx0ICpcblx0ICogVGhlIG9ubHkgbGltaXRhdGlvbiBpcyB0aGF0IGl0IGlzIG5vdCBwb3NzaWJsZSB0byBoYXZlIHRoZSBgJydgIChlbXB0eSBzdHJpbmcpIGFzIGlkLFxuXHQgKiBiZWNhdXNlIGAgbmdiTmF2SXRlbSBgLCBgbmdiTmF2SXRlbT0nJ2AgYW5kIGBbbmdiTmF2SXRlbV09XCInJ1wiYCBhcmUgaW5kaXN0aW5ndWlzaGFibGVcblx0ICovXG5cdEBJbnB1dCgnbmdiTmF2SXRlbScpIF9pZDogYW55O1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGZhZGUgaW4gdHJhbnNpdGlvbiBpcyBmaW5pc2hlZCBvbiB0aGUgcmVsYXRlZCBuYXYgY29udGVudFxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBmYWRlIG91dCB0cmFuc2l0aW9uIGlzIGZpbmlzaGVkIG9uIHRoZSByZWxhdGVkIG5hdiBjb250ZW50XG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuXHRAQ29udGVudENoaWxkKE5nYk5hdkNvbnRlbnQsIHsgZGVzY2VuZGFudHM6IGZhbHNlIH0pIGNvbnRlbnRUcGw/OiBOZ2JOYXZDb250ZW50O1xuXG5cdG5nT25Jbml0KCkge1xuXHRcdGlmICghaXNEZWZpbmVkKHRoaXMuZG9tSWQpKSB7XG5cdFx0XHR0aGlzLmRvbUlkID0gYG5nYi1uYXYtJHtuYXZDb3VudGVyKyt9YDtcblx0XHR9XG5cdH1cblxuXHRnZXQgYWN0aXZlKCkge1xuXHRcdHJldHVybiB0aGlzLl9uYXYuYWN0aXZlSWQgPT09IHRoaXMuaWQ7XG5cdH1cblxuXHRnZXQgaWQoKSB7XG5cdFx0cmV0dXJuIGlzVmFsaWROYXZJZCh0aGlzLl9pZCkgPyB0aGlzLl9pZCA6IHRoaXMuZG9tSWQ7XG5cdH1cblxuXHRnZXQgcGFuZWxEb21JZCgpIHtcblx0XHRyZXR1cm4gYCR7dGhpcy5kb21JZH0tcGFuZWxgO1xuXHR9XG5cblx0aXNQYW5lbEluRG9tKCkge1xuXHRcdHJldHVybiAoaXNEZWZpbmVkKHRoaXMuZGVzdHJveU9uSGlkZSkgPyAhdGhpcy5kZXN0cm95T25IaWRlIDogIXRoaXMuX25hdi5kZXN0cm95T25IaWRlKSB8fCB0aGlzLmFjdGl2ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW50ZXJuYWxcblx0ICovXG5cdGlzTmdDb250YWluZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX25hdGl2ZUVsZW1lbnQubm9kZVR5cGUgPT09IE5vZGUuQ09NTUVOVF9OT0RFO1xuXHR9XG59XG5cbi8qKlxuICogQSBuYXYgZGlyZWN0aXZlIHRoYXQgaGVscHMgd2l0aCBpbXBsZW1lbnRpbmcgdGFiYmVkIG5hdmlnYXRpb24gY29tcG9uZW50cy5cbiAqXG4gKiBAc2luY2UgNS4yLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYk5hdl0nLFxuXHRleHBvcnRBczogJ25nYk5hdicsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHRjbGFzczogJ25hdicsXG5cdFx0J1tjbGFzcy5mbGV4LWNvbHVtbl0nOiBgb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCdgLFxuXHRcdCdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6IGBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyAmJiByb2xlcyA9PT0gJ3RhYmxpc3QnID8gJ3ZlcnRpY2FsJyA6IHVuZGVmaW5lZGAsXG5cdFx0J1thdHRyLnJvbGVdJzogYHJvbGUgPyByb2xlIDogcm9sZXMgPyAndGFibGlzdCcgOiB1bmRlZmluZWRgLFxuXHRcdCcoa2V5ZG93bi5hcnJvd0xlZnQpJzogJ29uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uYXJyb3dSaWdodCknOiAnb25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5hcnJvd0Rvd24pJzogJ29uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uYXJyb3dVcCknOiAnb25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5Ib21lKSc6ICdvbktleURvd24oJGV2ZW50KScsXG5cdFx0JyhrZXlkb3duLkVuZCknOiAnb25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoZm9jdXNvdXQpJzogJ29uRm9jdXNvdXQoJGV2ZW50KScsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYk5hdiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyB7XG5cdHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcmllbnRhdGlvbjogc3RyaW5nO1xuXHRzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcm9sZXM6IGJvb2xlYW4gfCBzdHJpbmc7XG5cblx0cHJpdmF0ZSBfY29uZmlnID0gaW5qZWN0KE5nYk5hdkNvbmZpZyk7XG5cdHByaXZhdGUgX2NkID0gaW5qZWN0KENoYW5nZURldGVjdG9yUmVmKTtcblx0cHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuXHRwcml2YXRlIF9uYXRpdmVFbGVtZW50ID0gaW5qZWN0KEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cblx0ZGVzdHJveVJlZiA9IGluamVjdChEZXN0cm95UmVmKTtcblxuXHRfbmF2aWdhdGluZ1dpdGhLZXlib2FyZCA9IGZhbHNlO1xuXG5cdC8qKlxuXHQgKiBUaGUgaWQgb2YgdGhlIG5hdiB0aGF0IHNob3VsZCBiZSBhY3RpdmVcblx0ICpcblx0ICogWW91IGNvdWxkIGFsc28gdXNlIHRoZSBgLnNlbGVjdCgpYCBtZXRob2QgYW5kIHRoZSBgKG5hdkNoYW5nZSlgIGV2ZW50XG5cdCAqL1xuXHRASW5wdXQoKSBhY3RpdmVJZDogYW55O1xuXG5cdC8qKlxuXHQgKiBUaGUgZXZlbnQgZW1pdHRlZCBhZnRlciB0aGUgYWN0aXZlIG5hdiBjaGFuZ2VzXG5cdCAqIFRoZSBwYXlsb2FkIG9mIHRoZSBldmVudCBpcyB0aGUgbmV3bHkgYWN0aXZlIG5hdiBpZFxuXHQgKlxuXHQgKiBJZiB5b3Ugd2FudCB0byBwcmV2ZW50IG5hdiBjaGFuZ2UsIHlvdSBzaG91bGQgdXNlIGAobmF2Q2hhbmdlKWAgZXZlbnRcblx0ICovXG5cdEBPdXRwdXQoKSBhY3RpdmVJZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIG5hdiBjaGFuZ2Ugd2lsbCBiZSBhbmltYXRlZC5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRASW5wdXQoKSBhbmltYXRpb24gPSB0aGlzLl9jb25maWcuYW5pbWF0aW9uO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIG5vbi1hY3RpdmUgbmF2IGNvbnRlbnQgd2lsbCBiZSByZW1vdmVkIGZyb20gRE9NXG5cdCAqIE90aGVyd2lzZSBpdCB3aWxsIGp1c3QgYmUgaGlkZGVuXG5cdCAqL1xuXHRASW5wdXQoKSBkZXN0cm95T25IaWRlID0gdGhpcy5fY29uZmlnLmRlc3Ryb3lPbkhpZGU7XG5cblx0LyoqXG5cdCAqIFRoZSBvcmllbnRhdGlvbiBvZiBuYXZzLlxuXHQgKlxuXHQgKiBVc2luZyBgdmVydGljYWxgIHdpbGwgYWxzbyBhZGQgdGhlIGBhcmlhLW9yaWVudGF0aW9uYCBhdHRyaWJ1dGVcblx0ICovXG5cdEBJbnB1dCgpIG9yaWVudGF0aW9uID0gdGhpcy5fY29uZmlnLm9yaWVudGF0aW9uO1xuXG5cdC8qKlxuXHQgKiBSb2xlIGF0dHJpYnV0ZSBnZW5lcmF0aW5nIHN0cmF0ZWd5OlxuXHQgKiAtIGBmYWxzZWAgLSBubyByb2xlIGF0dHJpYnV0ZXMgd2lsbCBiZSBnZW5lcmF0ZWRcblx0ICogLSBgJ3RhYmxpc3QnYCAtICd0YWJsaXN0JywgJ3RhYicgYW5kICd0YWJwYW5lbCcgd2lsbCBiZSBnZW5lcmF0ZWQgKGRlZmF1bHQpXG5cdCAqL1xuXHRASW5wdXQoKSByb2xlcyA9IHRoaXMuX2NvbmZpZy5yb2xlcztcblxuXHQvKipcblx0ICogS2V5Ym9hcmQgc3VwcG9ydCBmb3IgbmF2IGZvY3VzL3NlbGVjdGlvbiB1c2luZyBhcnJvdyBrZXlzLlxuXHQgKlxuXHQgKiAqIGB0cnVlYCAtIG5hdnMgd2lsbCBiZSBmb2N1c2VkIHVzaW5nIGtleWJvYXJkIGFycm93IGtleXNcblx0ICogKiBgZmFsc2VgIC0gbm8ga2V5Ym9hcmQgc3VwcG9ydFxuXHQgKiAqIGAnY2hhbmdlV2l0aEFycm93cydgIC0gIG5hdiB3aWxsIGJlIHNlbGVjdGVkIHVzaW5nIGtleWJvYXJkIGFycm93IGtleXNcblx0ICpcblx0ICogU2VlIHRoZSBbbGlzdCBvZiBhdmFpbGFibGUga2V5Ym9hcmQgc2hvcnRjdXRzXSgjL2NvbXBvbmVudHMvbmF2L292ZXJ2aWV3I2tleWJvYXJkLXNob3J0Y3V0cykuXG5cdCAqXG5cdCAqIEBzaW5jZSA2LjEuMFxuXHQgKi9cblx0QElucHV0KCkga2V5Ym9hcmQgPSB0aGlzLl9jb25maWcua2V5Ym9hcmQ7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZmFkZSBpbiB0cmFuc2l0aW9uIGlzIGZpbmlzaGVkIGZvciBvbmUgb2YgdGhlIGl0ZW1zLlxuXHQgKlxuXHQgKiBQYXlsb2FkIG9mIHRoZSBldmVudCBpcyB0aGUgbmF2IGlkIHRoYXQgd2FzIGp1c3Qgc2hvd24uXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZmFkZSBvdXQgdHJhbnNpdGlvbiBpcyBmaW5pc2hlZCBmb3Igb25lIG9mIHRoZSBpdGVtcy5cblx0ICpcblx0ICogUGF5bG9hZCBvZiB0aGUgZXZlbnQgaXMgdGhlIG5hdiBpZCB0aGF0IHdhcyBqdXN0IGhpZGRlbi5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cblx0QENvbnRlbnRDaGlsZHJlbihOZ2JOYXZJdGVtKSBpdGVtczogUXVlcnlMaXN0PE5nYk5hdkl0ZW0+O1xuXHRAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gTmdiTmF2TGlua0Jhc2UpLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pIGxpbmtzOiBRdWVyeUxpc3Q8TmdiTmF2TGlua0Jhc2U+O1xuXG5cdG5hdkl0ZW1DaGFuZ2UkID0gbmV3IFN1YmplY3Q8TmdiTmF2SXRlbSB8IG51bGw+KCk7XG5cblx0Y29uc3RydWN0b3IoQEF0dHJpYnV0ZSgncm9sZScpIHB1YmxpYyByb2xlOiBzdHJpbmcpIHt9XG5cblx0LyoqXG5cdCAqIFRoZSBuYXYgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYmVmb3JlIHRoZSBuYXYgY2hhbmdlIGhhcHBlbnMgb24gdXNlciBjbGljay5cblx0ICpcblx0ICogVGhpcyBldmVudCB3b24ndCBiZSBlbWl0dGVkIGlmIG5hdiBpcyBjaGFuZ2VkIHByb2dyYW1tYXRpY2FsbHkgdmlhIGBbYWN0aXZlSWRdYCBvciBgLnNlbGVjdCgpYC5cblx0ICpcblx0ICogU2VlIFtgTmdiTmF2Q2hhbmdlRXZlbnRgXSgjL2NvbXBvbmVudHMvbmF2L2FwaSNOZ2JOYXZDaGFuZ2VFdmVudCkgZm9yIHBheWxvYWQgZGV0YWlscy5cblx0ICovXG5cdEBPdXRwdXQoKSBuYXZDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYk5hdkNoYW5nZUV2ZW50PigpO1xuXG5cdGNsaWNrKGl0ZW06IE5nYk5hdkl0ZW0pIHtcblx0XHRpZiAoIWl0ZW0uZGlzYWJsZWQpIHtcblx0XHRcdHRoaXMuX3VwZGF0ZUFjdGl2ZUlkKGl0ZW0uaWQpO1xuXHRcdH1cblx0fVxuXG5cdG9uRm9jdXNvdXQoeyByZWxhdGVkVGFyZ2V0IH06IEZvY3VzRXZlbnQpIHtcblx0XHRpZiAoIXRoaXMuX25hdGl2ZUVsZW1lbnQuY29udGFpbnMocmVsYXRlZFRhcmdldCBhcyBIVE1MRWxlbWVudCkpIHtcblx0XHRcdHRoaXMuX25hdmlnYXRpbmdXaXRoS2V5Ym9hcmQgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcblx0XHRpZiAodGhpcy5yb2xlcyAhPT0gJ3RhYmxpc3QnIHx8ICF0aGlzLmtleWJvYXJkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGVuYWJsZWRMaW5rcyA9IHRoaXMubGlua3MuZmlsdGVyKChsaW5rKSA9PiAhbGluay5uYXZJdGVtLmRpc2FibGVkKTtcblx0XHRjb25zdCB7IGxlbmd0aCB9ID0gZW5hYmxlZExpbmtzO1xuXG5cdFx0bGV0IHBvc2l0aW9uID0gLTE7XG5cblx0XHRlbmFibGVkTGlua3MuZm9yRWFjaCgobGluaywgaW5kZXgpID0+IHtcblx0XHRcdGlmIChsaW5rLm5hdGl2ZUVsZW1lbnQgPT09IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcblx0XHRcdFx0cG9zaXRpb24gPSBpbmRleDtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChsZW5ndGgpIHtcblx0XHRcdHN3aXRjaCAoZXZlbnQua2V5KSB7XG5cdFx0XHRcdGNhc2UgJ0Fycm93VXAnOlxuXHRcdFx0XHRjYXNlICdBcnJvd0xlZnQnOlxuXHRcdFx0XHRcdHBvc2l0aW9uID0gKHBvc2l0aW9uIC0gMSArIGxlbmd0aCkgJSBsZW5ndGg7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0Fycm93UmlnaHQnOlxuXHRcdFx0XHRjYXNlICdBcnJvd0Rvd24nOlxuXHRcdFx0XHRcdHBvc2l0aW9uID0gKHBvc2l0aW9uICsgMSkgJSBsZW5ndGg7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0hvbWUnOlxuXHRcdFx0XHRcdHBvc2l0aW9uID0gMDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnRW5kJzpcblx0XHRcdFx0XHRwb3NpdGlvbiA9IGxlbmd0aCAtIDE7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5rZXlib2FyZCA9PT0gJ2NoYW5nZVdpdGhBcnJvd3MnKSB7XG5cdFx0XHRcdHRoaXMuc2VsZWN0KGVuYWJsZWRMaW5rc1twb3NpdGlvbl0ubmF2SXRlbS5pZCk7XG5cdFx0XHR9XG5cdFx0XHRlbmFibGVkTGlua3NbcG9zaXRpb25dLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdHRoaXMuX25hdmlnYXRpbmdXaXRoS2V5Ym9hcmQgPSB0cnVlO1xuXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZWxlY3RzIHRoZSBuYXYgd2l0aCB0aGUgZ2l2ZW4gaWQgYW5kIHNob3dzIGl0cyBhc3NvY2lhdGVkIHBhbmUuXG5cdCAqIEFueSBvdGhlciBuYXYgdGhhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZCBiZWNvbWVzIHVuc2VsZWN0ZWQgYW5kIGl0cyBhc3NvY2lhdGVkIHBhbmUgaXMgaGlkZGVuLlxuXHQgKi9cblx0c2VsZWN0KGlkOiBhbnkpIHtcblx0XHR0aGlzLl91cGRhdGVBY3RpdmVJZChpZCwgZmFsc2UpO1xuXHR9XG5cblx0bmdBZnRlckNvbnRlbnRJbml0KCkge1xuXHRcdGlmICghaXNEZWZpbmVkKHRoaXMuYWN0aXZlSWQpKSB7XG5cdFx0XHRjb25zdCBuZXh0SWQgPSB0aGlzLml0ZW1zLmZpcnN0ID8gdGhpcy5pdGVtcy5maXJzdC5pZCA6IG51bGw7XG5cdFx0XHRpZiAoaXNWYWxpZE5hdklkKG5leHRJZCkpIHtcblx0XHRcdFx0dGhpcy5fdXBkYXRlQWN0aXZlSWQobmV4dElkLCBmYWxzZSk7XG5cdFx0XHRcdHRoaXMuX2NkLmRldGVjdENoYW5nZXMoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLml0ZW1zLmNoYW5nZXNcblx0XHRcdC5waXBlKHRha2VVbnRpbERlc3Ryb3llZCh0aGlzLmRlc3Ryb3lSZWYpKVxuXHRcdFx0LnN1YnNjcmliZSgoKSA9PiB0aGlzLl9ub3RpZnlJdGVtQ2hhbmdlZCh0aGlzLmFjdGl2ZUlkKSk7XG5cdH1cblxuXHRuZ09uQ2hhbmdlcyh7IGFjdGl2ZUlkIH06IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcblx0XHRpZiAoYWN0aXZlSWQgJiYgIWFjdGl2ZUlkLmZpcnN0Q2hhbmdlKSB7XG5cdFx0XHR0aGlzLl9ub3RpZnlJdGVtQ2hhbmdlZChhY3RpdmVJZC5jdXJyZW50VmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3VwZGF0ZUFjdGl2ZUlkKG5leHRJZDogYW55LCBlbWl0TmF2Q2hhbmdlID0gdHJ1ZSkge1xuXHRcdGlmICh0aGlzLmFjdGl2ZUlkICE9PSBuZXh0SWQpIHtcblx0XHRcdGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG5cblx0XHRcdGlmIChlbWl0TmF2Q2hhbmdlKSB7XG5cdFx0XHRcdHRoaXMubmF2Q2hhbmdlLmVtaXQoe1xuXHRcdFx0XHRcdGFjdGl2ZUlkOiB0aGlzLmFjdGl2ZUlkLFxuXHRcdFx0XHRcdG5leHRJZCxcblx0XHRcdFx0XHRwcmV2ZW50RGVmYXVsdDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0ZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghZGVmYXVsdFByZXZlbnRlZCkge1xuXHRcdFx0XHR0aGlzLmFjdGl2ZUlkID0gbmV4dElkO1xuXHRcdFx0XHR0aGlzLmFjdGl2ZUlkQ2hhbmdlLmVtaXQobmV4dElkKTtcblx0XHRcdFx0dGhpcy5fbm90aWZ5SXRlbUNoYW5nZWQobmV4dElkKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9ub3RpZnlJdGVtQ2hhbmdlZChuZXh0SXRlbUlkOiBhbnkpIHtcblx0XHR0aGlzLm5hdkl0ZW1DaGFuZ2UkLm5leHQodGhpcy5fZ2V0SXRlbUJ5SWQobmV4dEl0ZW1JZCkpO1xuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0SXRlbUJ5SWQoaXRlbUlkOiBhbnkpOiBOZ2JOYXZJdGVtIHwgbnVsbCB7XG5cdFx0cmV0dXJuICh0aGlzLml0ZW1zICYmIHRoaXMuaXRlbXMuZmluZCgoaXRlbSkgPT4gaXRlbS5pZCA9PT0gaXRlbUlkKSkgfHwgbnVsbDtcblx0fVxufVxuXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdbbmdiTmF2TGlua10nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0J1tpZF0nOiAnbmF2SXRlbS5kb21JZCcsXG5cdFx0Y2xhc3M6ICduYXYtbGluaycsXG5cdFx0J1tjbGFzcy5uYXYtaXRlbV0nOiAnbmF2SXRlbS5pc05nQ29udGFpbmVyKCknLFxuXHRcdCdbYXR0ci5yb2xlXSc6IGByb2xlID8gcm9sZSA6IG5hdi5yb2xlcyA/ICd0YWInIDogdW5kZWZpbmVkYCxcblx0XHQnW2NsYXNzLmFjdGl2ZV0nOiAnbmF2SXRlbS5hY3RpdmUnLFxuXHRcdCdbY2xhc3MuZGlzYWJsZWRdJzogJ25hdkl0ZW0uZGlzYWJsZWQnLFxuXHRcdCdbYXR0ci50YWJpbmRleF0nOiAndGFiaW5kZXgnLFxuXHRcdCdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICduYXZJdGVtLmlzUGFuZWxJbkRvbSgpID8gbmF2SXRlbS5wYW5lbERvbUlkIDogbnVsbCcsXG5cdFx0J1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ25hdkl0ZW0uYWN0aXZlJyxcblx0XHQnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnbmF2SXRlbS5kaXNhYmxlZCcsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYk5hdkxpbmtCYXNlIHtcblx0bmF2SXRlbSA9IGluamVjdChOZ2JOYXZJdGVtKTtcblx0bmF2ID0gaW5qZWN0KE5nYk5hdik7XG5cdG5hdGl2ZUVsZW1lbnQgPSBpbmplY3QoRWxlbWVudFJlZikubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuXHRjb25zdHJ1Y3RvcihAQXR0cmlidXRlKCdyb2xlJykgcHVibGljIHJvbGU6IHN0cmluZykge31cblxuXHRnZXQgdGFiaW5kZXgoKSB7XG5cdFx0aWYgKHRoaXMubmF2LmtleWJvYXJkID09PSBmYWxzZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMubmF2SXRlbS5kaXNhYmxlZCA/IC0xIDogdW5kZWZpbmVkO1xuXHRcdH1cblx0XHRpZiAodGhpcy5uYXYuX25hdmlnYXRpbmdXaXRoS2V5Ym9hcmQpIHtcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMubmF2SXRlbS5kaXNhYmxlZCB8fCAhdGhpcy5uYXZJdGVtLmFjdGl2ZSA/IC0xIDogdW5kZWZpbmVkO1xuXHR9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWFyayB0aGUgbmF2IGxpbmsgd2hlbiB1c2VkIG9uIGEgYnV0dG9uIGVsZW1lbnQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ2J1dHRvbltuZ2JOYXZMaW5rXScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHR0eXBlOiAnYnV0dG9uJyxcblx0XHQnW2Rpc2FibGVkXSc6ICduYXZJdGVtLmRpc2FibGVkJyxcblx0XHQnKGNsaWNrKSc6ICduYXYuY2xpY2sobmF2SXRlbSknLFxuXHR9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JOYXZMaW5rQnV0dG9uIGV4dGVuZHMgTmdiTmF2TGlua0Jhc2Uge31cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0byBtYXJrIHRoZSBuYXYgbGluayB3aGVuIHVzZWQgb24gYSBsaW5rIGVsZW1lbnQuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ2FbbmdiTmF2TGlua10nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0aHJlZjogJycsXG5cdFx0JyhjbGljayknOiAnbmF2LmNsaWNrKG5hdkl0ZW0pOyAkZXZlbnQucHJldmVudERlZmF1bHQoKScsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYk5hdkxpbmsgZXh0ZW5kcyBOZ2JOYXZMaW5rQmFzZSB7fVxuXG4vKipcbiAqIFRoZSBwYXlsb2FkIG9mIHRoZSBjaGFuZ2UgZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgdGhlIG5hdiBjaGFuZ2UgaGFwcGVucyBvbiB1c2VyIGNsaWNrLlxuICpcbiAqIFRoaXMgZXZlbnQgd29uJ3QgYmUgZW1pdHRlZCBpZiBuYXYgaXMgY2hhbmdlZCBwcm9ncmFtbWF0aWNhbGx5IHZpYSBgW2FjdGl2ZUlkXWAgb3IgYC5zZWxlY3QoKWAuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiTmF2Q2hhbmdlRXZlbnQ8VCA9IGFueT4ge1xuXHQvKipcblx0ICogSWQgb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgbmF2LlxuXHQgKi9cblx0YWN0aXZlSWQ6IFQ7XG5cblx0LyoqXG5cdCAqIElkIG9mIHRoZSBuZXdseSBzZWxlY3RlZCBuYXYuXG5cdCAqL1xuXHRuZXh0SWQ6IFQ7XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRoYXQgd2lsbCBwcmV2ZW50IG5hdiBjaGFuZ2UgaWYgY2FsbGVkLlxuXHQgKi9cblx0cHJldmVudERlZmF1bHQ6ICgpID0+IHZvaWQ7XG59XG4iXX0=