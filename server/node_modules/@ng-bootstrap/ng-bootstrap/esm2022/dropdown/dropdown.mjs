import { afterNextRender, afterRender, AfterRenderPhase, ChangeDetectorRef, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, inject, Injector, Input, NgZone, Output, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ngbPositioning } from '../util/positioning';
import { addPopperOffset } from '../util/positioning-util';
import { ngbAutoClose } from '../util/autoclose';
import { NgbDropdownConfig } from './dropdown-config';
import { FOCUSABLE_ELEMENTS_SELECTOR } from '../util/focus-trap';
import { getActiveElement } from '../util/util';
import * as i0 from "@angular/core";
/**
 * A directive you should put on a dropdown item to enable keyboard navigation.
 * Arrow keys will move focus between items marked with this directive.
 *
 * @since 4.1.0
 */
export class NgbDropdownItem {
    constructor() {
        this._disabled = false;
        this.nativeElement = inject(ElementRef).nativeElement;
        this.tabindex = 0;
    }
    set disabled(value) {
        this._disabled = value === '' || value === true; // accept an empty attribute as true
    }
    get disabled() {
        return this._disabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownItem, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbDropdownItem, isStandalone: true, selector: "[ngbDropdownItem]", inputs: { tabindex: "tabindex", disabled: "disabled" }, host: { properties: { "class.disabled": "disabled", "tabIndex": "disabled ? -1 : tabindex" }, classAttribute: "dropdown-item" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownItem]',
                    standalone: true,
                    host: {
                        class: 'dropdown-item',
                        '[class.disabled]': 'disabled',
                        '[tabIndex]': 'disabled ? -1 : tabindex',
                    },
                }]
        }], propDecorators: { tabindex: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });
/**
 * A directive that will be applied if dropdown item is a button.
 * It will only set the disabled property.
 */
export class NgbDropdownButtonItem {
    constructor() {
        this.item = inject(NgbDropdownItem);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownButtonItem, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbDropdownButtonItem, isStandalone: true, selector: "button[ngbDropdownItem]", host: { properties: { "disabled": "item.disabled" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownButtonItem, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[ngbDropdownItem]',
                    standalone: true,
                    host: { '[disabled]': 'item.disabled' },
                }]
        }] });
/**
 * A directive that wraps dropdown menu content and dropdown items.
 */
export class NgbDropdownMenu {
    constructor() {
        this.dropdown = inject(NgbDropdown);
        this.nativeElement = inject(ElementRef).nativeElement;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownMenu, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbDropdownMenu, isStandalone: true, selector: "[ngbDropdownMenu]", host: { listeners: { "keydown.ArrowUp": "dropdown.onKeyDown($event)", "keydown.ArrowDown": "dropdown.onKeyDown($event)", "keydown.Home": "dropdown.onKeyDown($event)", "keydown.End": "dropdown.onKeyDown($event)", "keydown.Enter": "dropdown.onKeyDown($event)", "keydown.Space": "dropdown.onKeyDown($event)", "keydown.Tab": "dropdown.onKeyDown($event)", "keydown.Shift.Tab": "dropdown.onKeyDown($event)" }, properties: { "class.show": "dropdown.isOpen()" }, classAttribute: "dropdown-menu" }, queries: [{ propertyName: "menuItems", predicate: NgbDropdownItem }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownMenu, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownMenu]',
                    standalone: true,
                    host: {
                        class: 'dropdown-menu',
                        '[class.show]': 'dropdown.isOpen()',
                        '(keydown.ArrowUp)': 'dropdown.onKeyDown($event)',
                        '(keydown.ArrowDown)': 'dropdown.onKeyDown($event)',
                        '(keydown.Home)': 'dropdown.onKeyDown($event)',
                        '(keydown.End)': 'dropdown.onKeyDown($event)',
                        '(keydown.Enter)': 'dropdown.onKeyDown($event)',
                        '(keydown.Space)': 'dropdown.onKeyDown($event)',
                        '(keydown.Tab)': 'dropdown.onKeyDown($event)',
                        '(keydown.Shift.Tab)': 'dropdown.onKeyDown($event)',
                    },
                }]
        }], propDecorators: { menuItems: [{
                type: ContentChildren,
                args: [NgbDropdownItem]
            }] } });
/**
 * A directive to mark an element to which dropdown menu will be anchored.
 *
 * This is a simple version of the `NgbDropdownToggle` directive.
 * It plays the same role, but doesn't listen to click events to toggle dropdown menu thus enabling support
 * for events other than click.
 *
 * @since 1.1.0
 */
export class NgbDropdownAnchor {
    constructor() {
        this.dropdown = inject(NgbDropdown);
        this.nativeElement = inject(ElementRef).nativeElement;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownAnchor, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbDropdownAnchor, isStandalone: true, selector: "[ngbDropdownAnchor]", host: { properties: { "class.show": "dropdown.isOpen()", "attr.aria-expanded": "dropdown.isOpen()" }, classAttribute: "dropdown-toggle" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownAnchor, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownAnchor]',
                    standalone: true,
                    host: {
                        class: 'dropdown-toggle',
                        '[class.show]': 'dropdown.isOpen()',
                        '[attr.aria-expanded]': 'dropdown.isOpen()',
                    },
                }]
        }] });
/**
 * A directive to mark an element that will toggle dropdown via the `click` event.
 *
 * You can also use `NgbDropdownAnchor` as an alternative.
 */
export class NgbDropdownToggle extends NgbDropdownAnchor {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownToggle, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbDropdownToggle, isStandalone: true, selector: "[ngbDropdownToggle]", host: { listeners: { "click": "dropdown.toggle()", "keydown.ArrowUp": "dropdown.onKeyDown($event)", "keydown.ArrowDown": "dropdown.onKeyDown($event)", "keydown.Home": "dropdown.onKeyDown($event)", "keydown.End": "dropdown.onKeyDown($event)", "keydown.Tab": "dropdown.onKeyDown($event)", "keydown.Shift.Tab": "dropdown.onKeyDown($event)" }, properties: { "class.show": "dropdown.isOpen()", "attr.aria-expanded": "dropdown.isOpen()" }, classAttribute: "dropdown-toggle" }, providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle) }], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdownToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownToggle]',
                    standalone: true,
                    host: {
                        class: 'dropdown-toggle',
                        '[class.show]': 'dropdown.isOpen()',
                        '[attr.aria-expanded]': 'dropdown.isOpen()',
                        '(click)': 'dropdown.toggle()',
                        '(keydown.ArrowUp)': 'dropdown.onKeyDown($event)',
                        '(keydown.ArrowDown)': 'dropdown.onKeyDown($event)',
                        '(keydown.Home)': 'dropdown.onKeyDown($event)',
                        '(keydown.End)': 'dropdown.onKeyDown($event)',
                        '(keydown.Tab)': 'dropdown.onKeyDown($event)',
                        '(keydown.Shift.Tab)': 'dropdown.onKeyDown($event)',
                    },
                    providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle) }],
                }]
        }] });
/**
 * A directive that provides contextual overlays for displaying lists of links and more.
 */
export class NgbDropdown {
    constructor() {
        this._changeDetector = inject(ChangeDetectorRef);
        this._config = inject(NgbDropdownConfig);
        this._document = inject(DOCUMENT);
        this._injector = inject(Injector);
        this._ngZone = inject(NgZone);
        this._nativeElement = inject(ElementRef).nativeElement;
        this._destroyCloseHandlers$ = new Subject();
        this._bodyContainer = null;
        this._positioning = ngbPositioning();
        /**
         * Indicates whether the dropdown should be closed when clicking one of dropdown items or pressing ESC.
         *
         * * `true` - the dropdown will close on both outside and inside (menu) clicks.
         * * `false` - the dropdown can only be closed manually via `close()` or `toggle()` methods.
         * * `"inside"` - the dropdown will close on inside menu clicks, but not outside clicks.
         * * `"outside"` - the dropdown will close only on the outside clicks and not on menu clicks.
         */
        this.autoClose = this._config.autoClose;
        /**
         * Defines whether or not the dropdown menu is opened initially.
         */
        this._open = false;
        /**
         * The preferred placement of the dropdown, among the [possible values](#/guides/positioning#api).
         *
         * The default order of preference is `"bottom-start bottom-end top-start top-end"`
         *
         * Please see the [positioning overview](#/positioning) for more details.
         */
        this.placement = this._config.placement;
        /**
         * Allows to change default Popper options when positioning the dropdown.
         * Receives current popper options and returns modified ones.
         *
         * @since 13.1.0
         */
        this.popperOptions = this._config.popperOptions;
        /**
         * A selector specifying the element the dropdown should be appended to.
         * Currently only supports "body".
         *
         * @since 4.1.0
         */
        this.container = this._config.container;
        /**
         * An event fired when the dropdown is opened or closed.
         *
         * The event payload is a `boolean`:
         * * `true` - the dropdown was opened
         * * `false` - the dropdown was closed
         */
        this.openChange = new EventEmitter();
    }
    ngOnInit() {
        if (!this.display) {
            this.display = this._nativeElement.closest('.navbar') ? 'static' : 'dynamic';
        }
    }
    ngAfterContentInit() {
        afterNextRender(() => {
            this._applyPlacementClasses();
            if (this._open) {
                this._setCloseHandlers();
            }
        }, { phase: AfterRenderPhase.Write, injector: this._injector });
    }
    ngOnChanges(changes) {
        if (changes.container && this._open) {
            this._applyContainer(this.container);
        }
        if (changes.placement && !changes.placement.firstChange) {
            this._positioning.setOptions({
                hostElement: this._anchor.nativeElement,
                targetElement: this._bodyContainer || this._menu.nativeElement,
                placement: this.placement,
            });
            this._applyPlacementClasses();
        }
        if (changes.dropdownClass) {
            const { currentValue, previousValue } = changes.dropdownClass;
            this._applyCustomDropdownClass(currentValue, previousValue);
        }
        if (changes.autoClose && this._open) {
            this.autoClose = changes.autoClose.currentValue;
            this._setCloseHandlers();
        }
    }
    /**
     * Checks if the dropdown menu is open.
     */
    isOpen() {
        return this._open;
    }
    /**
     * Opens the dropdown menu.
     */
    open() {
        if (!this._open) {
            this._open = true;
            this._applyContainer(this.container);
            this.openChange.emit(true);
            this._setCloseHandlers();
            if (this._anchor) {
                this._anchor.nativeElement.focus();
                if (this.display === 'dynamic') {
                    this._ngZone.runOutsideAngular(() => {
                        this._positioning.createPopper({
                            hostElement: this._anchor.nativeElement,
                            targetElement: this._bodyContainer || this._menu.nativeElement,
                            placement: this.placement,
                            updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 2])(options)),
                        });
                        this._applyPlacementClasses();
                        this._afterRenderRef = afterRender(() => {
                            this._positionMenu();
                        }, { phase: AfterRenderPhase.Write, injector: this._injector });
                    });
                }
            }
        }
    }
    _setCloseHandlers() {
        this._destroyCloseHandlers$.next(); // destroy any existing close handlers
        ngbAutoClose(this._ngZone, this._document, this.autoClose, (source) => {
            this.close();
            if (source === 0 /* SOURCE.ESCAPE */) {
                this._anchor.nativeElement.focus();
            }
        }, this._destroyCloseHandlers$, this._menu ? [this._menu.nativeElement] : [], this._anchor ? [this._anchor.nativeElement] : [], '.dropdown-item,.dropdown-divider');
    }
    /**
     * Closes the dropdown menu.
     */
    close() {
        if (this._open) {
            this._open = false;
            this._resetContainer();
            this._positioning.destroy();
            this._afterRenderRef?.destroy();
            this._destroyCloseHandlers$.next();
            this.openChange.emit(false);
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Toggles the dropdown menu.
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    ngOnDestroy() {
        this.close();
    }
    onKeyDown(event) {
        const { key } = event;
        const itemElements = this._getMenuElements();
        let position = -1;
        let itemElement = null;
        const isEventFromToggle = this._isEventFromToggle(event);
        if (!isEventFromToggle && itemElements.length) {
            itemElements.forEach((item, index) => {
                if (item.contains(event.target)) {
                    itemElement = item;
                }
                if (item === getActiveElement(this._document)) {
                    position = index;
                }
            });
        }
        // closing on Enter / Space
        if (key === ' ' || key === 'Enter') {
            if (itemElement && (this.autoClose === true || this.autoClose === 'inside')) {
                // Item is either a button or a link, so click will be triggered by the browser on Enter or Space.
                // So we have to register a one-time click handler that will fire after any user defined click handlers
                // to close the dropdown
                fromEvent(itemElement, 'click')
                    .pipe(take(1))
                    .subscribe(() => this.close());
            }
            return;
        }
        if (key === 'Tab') {
            if (event.target && this.isOpen() && this.autoClose) {
                if (this._anchor.nativeElement === event.target) {
                    if (this.container === 'body' && !event.shiftKey) {
                        /* This case is special: user is using [Tab] from the anchor/toggle.
               User expects the next focusable element in the dropdown menu to get focus.
               But the menu is not a sibling to anchor/toggle, it is at the end of the body.
               Trick is to synchronously focus the menu element, and let the [keydown.Tab] go
               so that browser will focus the proper element (first one focusable in the menu) */
                        this._menu.nativeElement.setAttribute('tabindex', '0');
                        this._menu.nativeElement.focus();
                        this._menu.nativeElement.removeAttribute('tabindex');
                    }
                    else if (event.shiftKey) {
                        this.close();
                    }
                    return;
                }
                else if (this.container === 'body') {
                    const focusableElements = this._menu.nativeElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
                    if (event.shiftKey && event.target === focusableElements[0]) {
                        this._anchor.nativeElement.focus();
                        event.preventDefault();
                    }
                    else if (!event.shiftKey && event.target === focusableElements[focusableElements.length - 1]) {
                        this._anchor.nativeElement.focus();
                        this.close();
                    }
                }
                else {
                    fromEvent(event.target, 'focusout')
                        .pipe(take(1))
                        .subscribe(({ relatedTarget }) => {
                        if (!this._nativeElement.contains(relatedTarget)) {
                            this.close();
                        }
                    });
                }
            }
            return;
        }
        // opening / navigating
        if (isEventFromToggle || itemElement) {
            this.open();
            if (itemElements.length) {
                switch (key) {
                    case 'ArrowDown':
                        position = Math.min(position + 1, itemElements.length - 1);
                        break;
                    case 'ArrowUp':
                        if (this._isDropup() && position === -1) {
                            position = itemElements.length - 1;
                            break;
                        }
                        position = Math.max(position - 1, 0);
                        break;
                    case 'Home':
                        position = 0;
                        break;
                    case 'End':
                        position = itemElements.length - 1;
                        break;
                }
                itemElements[position].focus();
            }
            event.preventDefault();
        }
    }
    _isDropup() {
        return this._nativeElement.classList.contains('dropup');
    }
    _isEventFromToggle(event) {
        return this._anchor.nativeElement.contains(event.target);
    }
    _getMenuElements() {
        return this._menu
            ? this._menu.menuItems.filter(({ disabled }) => !disabled).map(({ nativeElement }) => nativeElement)
            : [];
    }
    _positionMenu() {
        const menu = this._menu;
        if (this.isOpen() && menu) {
            if (this.display === 'dynamic') {
                this._positioning.update();
                this._applyPlacementClasses();
            }
            else {
                this._applyPlacementClasses(this._getFirstPlacement(this.placement));
            }
        }
    }
    _getFirstPlacement(placement) {
        return Array.isArray(placement) ? placement[0] : placement.split(' ')[0];
    }
    _resetContainer() {
        if (this._menu) {
            this._nativeElement.appendChild(this._menu.nativeElement);
        }
        if (this._bodyContainer) {
            this._document.body.removeChild(this._bodyContainer);
            this._bodyContainer = null;
        }
    }
    _applyContainer(container = null) {
        this._resetContainer();
        if (container === 'body') {
            const dropdownMenuElement = this._menu.nativeElement;
            const bodyContainer = (this._bodyContainer = this._bodyContainer || this._document.createElement('div'));
            // Override some styles to have the positioning working
            bodyContainer.style.position = 'absolute';
            dropdownMenuElement.style.position = 'static';
            bodyContainer.style.zIndex = '1055';
            bodyContainer.appendChild(dropdownMenuElement);
            this._document.body.appendChild(bodyContainer);
        }
        this._applyCustomDropdownClass(this.dropdownClass);
    }
    _applyCustomDropdownClass(newClass, oldClass) {
        const targetElement = this.container === 'body' ? this._bodyContainer : this._nativeElement;
        if (targetElement) {
            if (oldClass) {
                targetElement.classList.remove(oldClass);
            }
            if (newClass) {
                targetElement.classList.add(newClass);
            }
        }
    }
    _applyPlacementClasses(placement) {
        if (this._menu) {
            if (!placement) {
                placement = this._getFirstPlacement(this.placement);
            }
            // remove the current placement classes
            this._nativeElement.classList.remove('dropup', 'dropdown');
            if (this.display === 'static') {
                this._menu.nativeElement.setAttribute('data-bs-popper', 'static');
            }
            else {
                this._menu.nativeElement.removeAttribute('data-bs-popper');
            }
            /*
             * apply the new placement
             * in case of top use up-arrow or down-arrow otherwise
             */
            const dropdownClass = placement.search('^top') !== -1 ? 'dropup' : 'dropdown';
            this._nativeElement.classList.add(dropdownClass);
            if (this._bodyContainer) {
                this._bodyContainer.classList.remove('dropup', 'dropdown');
                this._bodyContainer.classList.add(dropdownClass);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdown, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbDropdown, isStandalone: true, selector: "[ngbDropdown]", inputs: { autoClose: "autoClose", dropdownClass: "dropdownClass", _open: ["open", "_open"], placement: "placement", popperOptions: "popperOptions", container: "container", display: "display" }, outputs: { openChange: "openChange" }, host: { properties: { "class.show": "isOpen()" } }, queries: [{ propertyName: "_menu", first: true, predicate: NgbDropdownMenu, descendants: true }, { propertyName: "_anchor", first: true, predicate: NgbDropdownAnchor, descendants: true }], exportAs: ["ngbDropdown"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbDropdown, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdown]',
                    exportAs: 'ngbDropdown',
                    standalone: true,
                    host: { '[class.show]': 'isOpen()' },
                }]
        }], propDecorators: { _menu: [{
                type: ContentChild,
                args: [NgbDropdownMenu, { static: false }]
            }], _anchor: [{
                type: ContentChild,
                args: [NgbDropdownAnchor, { static: false }]
            }], autoClose: [{
                type: Input
            }], dropdownClass: [{
                type: Input
            }], _open: [{
                type: Input,
                args: ['open']
            }], placement: [{
                type: Input
            }], popperOptions: [{
                type: Input
            }], container: [{
                type: Input
            }], display: [{
                type: Input
            }], openChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZHJvcGRvd24vZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVOLGVBQWUsRUFDZixXQUFXLEVBQ1gsZ0JBQWdCLEVBRWhCLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxHQUdOLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEMsT0FBTyxFQUFFLGNBQWMsRUFBNkIsTUFBTSxxQkFBcUIsQ0FBQztBQUNoRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLFlBQVksRUFBVSxNQUFNLG1CQUFtQixDQUFDO0FBRXpELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7QUFFaEQ7Ozs7O0dBS0c7QUFVSCxNQUFNLE9BQU8sZUFBZTtJQVQ1QjtRQVlTLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFMUIsa0JBQWEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBNEIsQ0FBQztRQUV2RCxhQUFRLEdBQW9CLENBQUMsQ0FBQztLQVV2QztJQVJBLElBQ0ksUUFBUSxDQUFDLEtBQWM7UUFDMUIsSUFBSSxD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QUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRTtpQkFDcEM7OEJBa0IwRCxLQUFLO3NCQUE5RCxZQUFZO3VCQUFDLGVBQWUsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0JBQ1ksT0FBTztzQkFBbEUsWUFBWTt1QkFBQyxpQkFBaUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0JBVXpDLFNBQVM7c0JBQWpCLEtBQUs7Z0JBWUcsYUFBYTtzQkFBckIsS0FBSztnQkFLUyxLQUFLO3NCQUFuQixLQUFLO3VCQUFDLE1BQU07Z0JBU0osU0FBUztzQkFBakIsS0FBSztnQkFRRyxhQUFhO3NCQUFyQixLQUFLO2dCQVFHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBVUcsT0FBTztzQkFBZixLQUFLO2dCQVNJLFVBQVU7c0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBZnRlckNvbnRlbnRJbml0LFxuXHRhZnRlck5leHRSZW5kZXIsXG5cdGFmdGVyUmVuZGVyLFxuXHRBZnRlclJlbmRlclBoYXNlLFxuXHRBZnRlclJlbmRlclJlZixcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbnRlbnRDaGlsZCxcblx0Q29udGVudENoaWxkcmVuLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0Zm9yd2FyZFJlZixcblx0aW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25DaGFuZ2VzLFxuXHRPbkRlc3Ryb3ksXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRRdWVyeUxpc3QsXG5cdFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBuZ2JQb3NpdGlvbmluZywgUGxhY2VtZW50LCBQbGFjZW1lbnRBcnJheSB9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHsgYWRkUG9wcGVyT2Zmc2V0IH0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZy11dGlsJztcbmltcG9ydCB7IG5nYkF1dG9DbG9zZSwgU09VUkNFIH0gZnJvbSAnLi4vdXRpbC9hdXRvY2xvc2UnO1xuXG5pbXBvcnQgeyBOZ2JEcm9wZG93bkNvbmZpZyB9IGZyb20gJy4vZHJvcGRvd24tY29uZmlnJztcbmltcG9ydCB7IEZPQ1VTQUJMRV9FTEVNRU5UU19TRUxFQ1RPUiB9IGZyb20gJy4uL3V0aWwvZm9jdXMtdHJhcCc7XG5pbXBvcnQgeyBnZXRBY3RpdmVFbGVtZW50IH0gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB5b3Ugc2hvdWxkIHB1dCBvbiBhIGRyb3Bkb3duIGl0ZW0gdG8gZW5hYmxlIGtleWJvYXJkIG5hdmlnYXRpb24uXG4gKiBBcnJvdyBrZXlzIHdpbGwgbW92ZSBmb2N1cyBiZXR3ZWVuIGl0ZW1zIG1hcmtlZCB3aXRoIHRoaXMgZGlyZWN0aXZlLlxuICpcbiAqIEBzaW5jZSA0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdbbmdiRHJvcGRvd25JdGVtXScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHRjbGFzczogJ2Ryb3Bkb3duLWl0ZW0nLFxuXHRcdCdbY2xhc3MuZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcblx0XHQnW3RhYkluZGV4XSc6ICdkaXNhYmxlZCA/IC0xIDogdGFiaW5kZXgnLFxuXHR9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bkl0ZW0ge1xuXHRzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IGJvb2xlYW4gfCAnJztcblxuXHRwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG5cdG5hdGl2ZUVsZW1lbnQgPSBpbmplY3QoRWxlbWVudFJlZikubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuXHRASW5wdXQoKSB0YWJpbmRleDogc3RyaW5nIHwgbnVtYmVyID0gMDtcblxuXHRASW5wdXQoKVxuXHRzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9kaXNhYmxlZCA9IDxhbnk+dmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSB0cnVlOyAvLyBhY2NlcHQgYW4gZW1wdHkgYXR0cmlidXRlIGFzIHRydWVcblx0fVxuXG5cdGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG5cdH1cbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IHdpbGwgYmUgYXBwbGllZCBpZiBkcm9wZG93biBpdGVtIGlzIGEgYnV0dG9uLlxuICogSXQgd2lsbCBvbmx5IHNldCB0aGUgZGlzYWJsZWQgcHJvcGVydHkuXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ2J1dHRvbltuZ2JEcm9wZG93bkl0ZW1dJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDogeyAnW2Rpc2FibGVkXSc6ICdpdGVtLmRpc2FibGVkJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bkJ1dHRvbkl0ZW0ge1xuXHRpdGVtID0gaW5qZWN0KE5nYkRyb3Bkb3duSXRlbSk7XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCB3cmFwcyBkcm9wZG93biBtZW51IGNvbnRlbnQgYW5kIGRyb3Bkb3duIGl0ZW1zLlxuICovXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdbbmdiRHJvcGRvd25NZW51XScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHRjbGFzczogJ2Ryb3Bkb3duLW1lbnUnLFxuXHRcdCdbY2xhc3Muc2hvd10nOiAnZHJvcGRvd24uaXNPcGVuKCknLFxuXHRcdCcoa2V5ZG93bi5BcnJvd1VwKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG5cdFx0JyhrZXlkb3duLkFycm93RG93biknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5Ib21lKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG5cdFx0JyhrZXlkb3duLkVuZCknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5FbnRlciknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5TcGFjZSknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5UYWIpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uU2hpZnQuVGFiKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duTWVudSB7XG5cdGRyb3Bkb3duID0gaW5qZWN0KE5nYkRyb3Bkb3duKTtcblx0bmF0aXZlRWxlbWVudCA9IGluamVjdChFbGVtZW50UmVmKS5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG5cdEBDb250ZW50Q2hpbGRyZW4oTmdiRHJvcGRvd25JdGVtKSBtZW51SXRlbXM6IFF1ZXJ5TGlzdDxOZ2JEcm9wZG93bkl0ZW0+O1xufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hcmsgYW4gZWxlbWVudCB0byB3aGljaCBkcm9wZG93biBtZW51IHdpbGwgYmUgYW5jaG9yZWQuXG4gKlxuICogVGhpcyBpcyBhIHNpbXBsZSB2ZXJzaW9uIG9mIHRoZSBgTmdiRHJvcGRvd25Ub2dnbGVgIGRpcmVjdGl2ZS5cbiAqIEl0IHBsYXlzIHRoZSBzYW1lIHJvbGUsIGJ1dCBkb2Vzbid0IGxpc3RlbiB0byBjbGljayBldmVudHMgdG8gdG9nZ2xlIGRyb3Bkb3duIG1lbnUgdGh1cyBlbmFibGluZyBzdXBwb3J0XG4gKiBmb3IgZXZlbnRzIG90aGVyIHRoYW4gY2xpY2suXG4gKlxuICogQHNpbmNlIDEuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ1tuZ2JEcm9wZG93bkFuY2hvcl0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0Y2xhc3M6ICdkcm9wZG93bi10b2dnbGUnLFxuXHRcdCdbY2xhc3Muc2hvd10nOiAnZHJvcGRvd24uaXNPcGVuKCknLFxuXHRcdCdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdkcm9wZG93bi5pc09wZW4oKScsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duQW5jaG9yIHtcblx0ZHJvcGRvd24gPSBpbmplY3QoTmdiRHJvcGRvd24pO1xuXHRuYXRpdmVFbGVtZW50ID0gaW5qZWN0KEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWFyayBhbiBlbGVtZW50IHRoYXQgd2lsbCB0b2dnbGUgZHJvcGRvd24gdmlhIHRoZSBgY2xpY2tgIGV2ZW50LlxuICpcbiAqIFlvdSBjYW4gYWxzbyB1c2UgYE5nYkRyb3Bkb3duQW5jaG9yYCBhcyBhbiBhbHRlcm5hdGl2ZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duVG9nZ2xlXScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHRjbGFzczogJ2Ryb3Bkb3duLXRvZ2dsZScsXG5cdFx0J1tjbGFzcy5zaG93XSc6ICdkcm9wZG93bi5pc09wZW4oKScsXG5cdFx0J1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2Ryb3Bkb3duLmlzT3BlbigpJyxcblx0XHQnKGNsaWNrKSc6ICdkcm9wZG93bi50b2dnbGUoKScsXG5cdFx0JyhrZXlkb3duLkFycm93VXApJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uQXJyb3dEb3duKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG5cdFx0JyhrZXlkb3duLkhvbWUpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uRW5kKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG5cdFx0JyhrZXlkb3duLlRhYiknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5TaGlmdC5UYWIpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0fSxcblx0cHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOZ2JEcm9wZG93bkFuY2hvciwgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiRHJvcGRvd25Ub2dnbGUpIH1dLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93blRvZ2dsZSBleHRlbmRzIE5nYkRyb3Bkb3duQW5jaG9yIHt9XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBwcm92aWRlcyBjb250ZXh0dWFsIG92ZXJsYXlzIGZvciBkaXNwbGF5aW5nIGxpc3RzIG9mIGxpbmtzIGFuZCBtb3JlLlxuICovXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdbbmdiRHJvcGRvd25dJyxcblx0ZXhwb3J0QXM6ICduZ2JEcm9wZG93bicsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHsgJ1tjbGFzcy5zaG93XSc6ICdpc09wZW4oKScgfSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd24gaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9DbG9zZTogYm9vbGVhbiB8IHN0cmluZztcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc3BsYXk6IHN0cmluZztcblxuXHRwcml2YXRlIF9jaGFuZ2VEZXRlY3RvciA9IGluamVjdChDaGFuZ2VEZXRlY3RvclJlZik7XG5cdHByaXZhdGUgX2NvbmZpZyA9IGluamVjdChOZ2JEcm9wZG93bkNvbmZpZyk7XG5cdHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcblx0cHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXHRwcml2YXRlIF9uZ1pvbmUgPSBpbmplY3QoTmdab25lKTtcblx0cHJpdmF0ZSBfbmF0aXZlRWxlbWVudCA9IGluamVjdChFbGVtZW50UmVmKS5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG5cdHByaXZhdGUgX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cdHByaXZhdGUgX2FmdGVyUmVuZGVyUmVmOiBBZnRlclJlbmRlclJlZiB8IHVuZGVmaW5lZDtcblx0cHJpdmF0ZSBfYm9keUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuXHRwcml2YXRlIF9wb3NpdGlvbmluZyA9IG5nYlBvc2l0aW9uaW5nKCk7XG5cblx0QENvbnRlbnRDaGlsZChOZ2JEcm9wZG93bk1lbnUsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIF9tZW51OiBOZ2JEcm9wZG93bk1lbnU7XG5cdEBDb250ZW50Q2hpbGQoTmdiRHJvcGRvd25BbmNob3IsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIF9hbmNob3I6IE5nYkRyb3Bkb3duQW5jaG9yO1xuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZHJvcGRvd24gc2hvdWxkIGJlIGNsb3NlZCB3aGVuIGNsaWNraW5nIG9uZSBvZiBkcm9wZG93biBpdGVtcyBvciBwcmVzc2luZyBFU0MuXG5cdCAqXG5cdCAqICogYHRydWVgIC0gdGhlIGRyb3Bkb3duIHdpbGwgY2xvc2Ugb24gYm90aCBvdXRzaWRlIGFuZCBpbnNpZGUgKG1lbnUpIGNsaWNrcy5cblx0ICogKiBgZmFsc2VgIC0gdGhlIGRyb3Bkb3duIGNhbiBvbmx5IGJlIGNsb3NlZCBtYW51YWxseSB2aWEgYGNsb3NlKClgIG9yIGB0b2dnbGUoKWAgbWV0aG9kcy5cblx0ICogKiBgXCJpbnNpZGVcImAgLSB0aGUgZHJvcGRvd24gd2lsbCBjbG9zZSBvbiBpbnNpZGUgbWVudSBjbGlja3MsIGJ1dCBub3Qgb3V0c2lkZSBjbGlja3MuXG5cdCAqICogYFwib3V0c2lkZVwiYCAtIHRoZSBkcm9wZG93biB3aWxsIGNsb3NlIG9ubHkgb24gdGhlIG91dHNpZGUgY2xpY2tzIGFuZCBub3Qgb24gbWVudSBjbGlja3MuXG5cdCAqL1xuXHRASW5wdXQoKSBhdXRvQ2xvc2UgPSB0aGlzLl9jb25maWcuYXV0b0Nsb3NlO1xuXG5cdC8qKlxuXHQgKiBBIGN1c3RvbSBjbGFzcyB0aGF0IGlzIGFwcGxpZWQgb25seSB0byB0aGUgYG5nYkRyb3Bkb3duTWVudWAgcGFyZW50IGVsZW1lbnQuXG5cdCAqICogSW4gY2FzZSBvZiB0aGUgaW5saW5lIGRyb3Bkb3duIGl0IHdpbGwgYmUgdGhlIGA8ZGl2IG5nYkRyb3Bkb3duPmBcblx0ICogKiBJbiBjYXNlIG9mIHRoZSBkcm9wZG93biB3aXRoICBgY29udGFpbmVyPVwiYm9keVwiYCBpdCB3aWxsIGJlIHRoZSBgPGRpdiBjbGFzcz1cImRyb3Bkb3duXCI+YCBhdHRhY2hlZCB0byB0aGUgYDxib2R5PmBcblx0ICpcblx0ICogVXNlZnVsIG1haW5seSB3aGVuIGRyb3Bkb3duIGlzIGF0dGFjaGVkIHRvIHRoZSBib2R5LlxuXHQgKiBJZiB0aGUgZHJvcGRvd24gaXMgaW5saW5lIGp1c3QgdXNlIGA8ZGl2IG5nYkRyb3Bkb3duIGNsYXNzPVwiY3VzdG9tLWNsYXNzXCI+YCBpbnN0ZWFkLlxuXHQgKlxuXHQgKiBAc2luY2UgOS4xLjBcblx0ICovXG5cdEBJbnB1dCgpIGRyb3Bkb3duQ2xhc3M6IHN0cmluZztcblxuXHQvKipcblx0ICogRGVmaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgZHJvcGRvd24gbWVudSBpcyBvcGVuZWQgaW5pdGlhbGx5LlxuXHQgKi9cblx0QElucHV0KCdvcGVuJykgX29wZW4gPSBmYWxzZTtcblxuXHQvKipcblx0ICogVGhlIHByZWZlcnJlZCBwbGFjZW1lbnQgb2YgdGhlIGRyb3Bkb3duLCBhbW9uZyB0aGUgW3Bvc3NpYmxlIHZhbHVlc10oIy9ndWlkZXMvcG9zaXRpb25pbmcjYXBpKS5cblx0ICpcblx0ICogVGhlIGRlZmF1bHQgb3JkZXIgb2YgcHJlZmVyZW5jZSBpcyBgXCJib3R0b20tc3RhcnQgYm90dG9tLWVuZCB0b3Atc3RhcnQgdG9wLWVuZFwiYFxuXHQgKlxuXHQgKiBQbGVhc2Ugc2VlIHRoZSBbcG9zaXRpb25pbmcgb3ZlcnZpZXddKCMvcG9zaXRpb25pbmcpIGZvciBtb3JlIGRldGFpbHMuXG5cdCAqL1xuXHRASW5wdXQoKSBwbGFjZW1lbnQgPSB0aGlzLl9jb25maWcucGxhY2VtZW50O1xuXG5cdC8qKlxuXHQgKiBBbGxvd3MgdG8gY2hhbmdlIGRlZmF1bHQgUG9wcGVyIG9wdGlvbnMgd2hlbiBwb3NpdGlvbmluZyB0aGUgZHJvcGRvd24uXG5cdCAqIFJlY2VpdmVzIGN1cnJlbnQgcG9wcGVyIG9wdGlvbnMgYW5kIHJldHVybnMgbW9kaWZpZWQgb25lcy5cblx0ICpcblx0ICogQHNpbmNlIDEzLjEuMFxuXHQgKi9cblx0QElucHV0KCkgcG9wcGVyT3B0aW9ucyA9IHRoaXMuX2NvbmZpZy5wb3BwZXJPcHRpb25zO1xuXG5cdC8qKlxuXHQgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIGRyb3Bkb3duIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cblx0ICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgXCJib2R5XCIuXG5cdCAqXG5cdCAqIEBzaW5jZSA0LjEuMFxuXHQgKi9cblx0QElucHV0KCkgY29udGFpbmVyOiBudWxsIHwgJ2JvZHknID0gdGhpcy5fY29uZmlnLmNvbnRhaW5lcjtcblxuXHQvKipcblx0ICogRW5hYmxlIG9yIGRpc2FibGUgdGhlIGR5bmFtaWMgcG9zaXRpb25pbmcuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIGR5bmFtaWMgdW5sZXNzIHRoZSBkcm9wZG93biBpcyB1c2VkXG5cdCAqIGluc2lkZSBhIEJvb3RzdHJhcCBuYXZiYXIuIElmIHlvdSBuZWVkIGN1c3RvbSBwbGFjZW1lbnQgZm9yIGEgZHJvcGRvd24gaW4gYSBuYXZiYXIsIHNldCBpdCB0b1xuXHQgKiBkeW5hbWljIGV4cGxpY2l0bHkuIFNlZSB0aGUgW3Bvc2l0aW9uaW5nIG9mIGRyb3Bkb3duXSgjL3Bvc2l0aW9uaW5nI2Ryb3Bkb3duKVxuXHQgKiBhbmQgdGhlIFtuYXZiYXIgZGVtb10oLyMvY29tcG9uZW50cy9kcm9wZG93bi9leGFtcGxlcyNuYXZiYXIpIGZvciBtb3JlIGRldGFpbHMuXG5cdCAqXG5cdCAqIEBzaW5jZSA0LjIuMFxuXHQgKi9cblx0QElucHV0KCkgZGlzcGxheTogJ2R5bmFtaWMnIHwgJ3N0YXRpYyc7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gdGhlIGRyb3Bkb3duIGlzIG9wZW5lZCBvciBjbG9zZWQuXG5cdCAqXG5cdCAqIFRoZSBldmVudCBwYXlsb2FkIGlzIGEgYGJvb2xlYW5gOlxuXHQgKiAqIGB0cnVlYCAtIHRoZSBkcm9wZG93biB3YXMgb3BlbmVkXG5cdCAqICogYGZhbHNlYCAtIHRoZSBkcm9wZG93biB3YXMgY2xvc2VkXG5cdCAqL1xuXHRAT3V0cHV0KCkgb3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuXHRuZ09uSW5pdCgpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMuZGlzcGxheSkge1xuXHRcdFx0dGhpcy5kaXNwbGF5ID0gdGhpcy5fbmF0aXZlRWxlbWVudC5jbG9zZXN0KCcubmF2YmFyJykgPyAnc3RhdGljJyA6ICdkeW5hbWljJztcblx0XHR9XG5cdH1cblxuXHRuZ0FmdGVyQ29udGVudEluaXQoKSB7XG5cdFx0YWZ0ZXJOZXh0UmVuZGVyKFxuXHRcdFx0KCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9hcHBseVBsYWNlbWVudENsYXNzZXMoKTtcblx0XHRcdFx0aWYgKHRoaXMuX29wZW4pIHtcblx0XHRcdFx0XHR0aGlzLl9zZXRDbG9zZUhhbmRsZXJzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR7IHBoYXNlOiBBZnRlclJlbmRlclBoYXNlLldyaXRlLCBpbmplY3RvcjogdGhpcy5faW5qZWN0b3IgfSxcblx0XHQpO1xuXHR9XG5cblx0bmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuXHRcdGlmIChjaGFuZ2VzLmNvbnRhaW5lciAmJiB0aGlzLl9vcGVuKSB7XG5cdFx0XHR0aGlzLl9hcHBseUNvbnRhaW5lcih0aGlzLmNvbnRhaW5lcik7XG5cdFx0fVxuXG5cdFx0aWYgKGNoYW5nZXMucGxhY2VtZW50ICYmICFjaGFuZ2VzLnBsYWNlbWVudC5maXJzdENoYW5nZSkge1xuXHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuc2V0T3B0aW9ucyh7XG5cdFx0XHRcdGhvc3RFbGVtZW50OiB0aGlzLl9hbmNob3IubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0dGFyZ2V0RWxlbWVudDogdGhpcy5fYm9keUNvbnRhaW5lciB8fCB0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdHBsYWNlbWVudDogdGhpcy5wbGFjZW1lbnQsXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuXHRcdH1cblxuXHRcdGlmIChjaGFuZ2VzLmRyb3Bkb3duQ2xhc3MpIHtcblx0XHRcdGNvbnN0IHsgY3VycmVudFZhbHVlLCBwcmV2aW91c1ZhbHVlIH0gPSBjaGFuZ2VzLmRyb3Bkb3duQ2xhc3M7XG5cdFx0XHR0aGlzLl9hcHBseUN1c3RvbURyb3Bkb3duQ2xhc3MoY3VycmVudFZhbHVlLCBwcmV2aW91c1ZhbHVlKTtcblx0XHR9XG5cblx0XHRpZiAoY2hhbmdlcy5hdXRvQ2xvc2UgJiYgdGhpcy5fb3Blbikge1xuXHRcdFx0dGhpcy5hdXRvQ2xvc2UgPSBjaGFuZ2VzLmF1dG9DbG9zZS5jdXJyZW50VmFsdWU7XG5cdFx0XHR0aGlzLl9zZXRDbG9zZUhhbmRsZXJzKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZHJvcGRvd24gbWVudSBpcyBvcGVuLlxuXHQgKi9cblx0aXNPcGVuKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9vcGVuO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW5zIHRoZSBkcm9wZG93biBtZW51LlxuXHQgKi9cblx0b3BlbigpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMuX29wZW4pIHtcblx0XHRcdHRoaXMuX29wZW4gPSB0cnVlO1xuXHRcdFx0dGhpcy5fYXBwbHlDb250YWluZXIodGhpcy5jb250YWluZXIpO1xuXHRcdFx0dGhpcy5vcGVuQ2hhbmdlLmVtaXQodHJ1ZSk7XG5cdFx0XHR0aGlzLl9zZXRDbG9zZUhhbmRsZXJzKCk7XG5cdFx0XHRpZiAodGhpcy5fYW5jaG9yKSB7XG5cdFx0XHRcdHRoaXMuX2FuY2hvci5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG5cdFx0XHRcdGlmICh0aGlzLmRpc3BsYXkgPT09ICdkeW5hbWljJykge1xuXHRcdFx0XHRcdHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl9wb3NpdGlvbmluZy5jcmVhdGVQb3BwZXIoe1xuXHRcdFx0XHRcdFx0XHRob3N0RWxlbWVudDogdGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdHRhcmdldEVsZW1lbnQ6IHRoaXMuX2JvZHlDb250YWluZXIgfHwgdGhpcy5fbWVudS5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XHRcdFx0XHRwbGFjZW1lbnQ6IHRoaXMucGxhY2VtZW50LFxuXHRcdFx0XHRcdFx0XHR1cGRhdGVQb3BwZXJPcHRpb25zOiAob3B0aW9ucykgPT4gdGhpcy5wb3BwZXJPcHRpb25zKGFkZFBvcHBlck9mZnNldChbMCwgMl0pKG9wdGlvbnMpKSxcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0dGhpcy5fYXBwbHlQbGFjZW1lbnRDbGFzc2VzKCk7XG5cdFx0XHRcdFx0XHR0aGlzLl9hZnRlclJlbmRlclJlZiA9IGFmdGVyUmVuZGVyKFxuXHRcdFx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fcG9zaXRpb25NZW51KCk7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHsgcGhhc2U6IEFmdGVyUmVuZGVyUGhhc2UuV3JpdGUsIGluamVjdG9yOiB0aGlzLl9pbmplY3RvciB9LFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3NldENsb3NlSGFuZGxlcnMoKSB7XG5cdFx0dGhpcy5fZGVzdHJveUNsb3NlSGFuZGxlcnMkLm5leHQoKTsgLy8gZGVzdHJveSBhbnkgZXhpc3RpbmcgY2xvc2UgaGFuZGxlcnNcblxuXHRcdG5nYkF1dG9DbG9zZShcblx0XHRcdHRoaXMuX25nWm9uZSxcblx0XHRcdHRoaXMuX2RvY3VtZW50LFxuXHRcdFx0dGhpcy5hdXRvQ2xvc2UsXG5cdFx0XHQoc291cmNlOiBTT1VSQ0UpID0+IHtcblx0XHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdFx0XHRpZiAoc291cmNlID09PSBTT1VSQ0UuRVNDQVBFKSB7XG5cdFx0XHRcdFx0dGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHRoaXMuX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJCxcblx0XHRcdHRoaXMuX21lbnUgPyBbdGhpcy5fbWVudS5uYXRpdmVFbGVtZW50XSA6IFtdLFxuXHRcdFx0dGhpcy5fYW5jaG9yID8gW3RoaXMuX2FuY2hvci5uYXRpdmVFbGVtZW50XSA6IFtdLFxuXHRcdFx0Jy5kcm9wZG93bi1pdGVtLC5kcm9wZG93bi1kaXZpZGVyJyxcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlcyB0aGUgZHJvcGRvd24gbWVudS5cblx0ICovXG5cdGNsb3NlKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLl9vcGVuKSB7XG5cdFx0XHR0aGlzLl9vcGVuID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9yZXNldENvbnRhaW5lcigpO1xuXHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuZGVzdHJveSgpO1xuXHRcdFx0dGhpcy5fYWZ0ZXJSZW5kZXJSZWY/LmRlc3Ryb3koKTtcblx0XHRcdHRoaXMuX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJC5uZXh0KCk7XG5cdFx0XHR0aGlzLm9wZW5DaGFuZ2UuZW1pdChmYWxzZSk7XG5cdFx0XHR0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyB0aGUgZHJvcGRvd24gbWVudS5cblx0ICovXG5cdHRvZ2dsZSgpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm9wZW4oKTtcblx0XHR9XG5cdH1cblxuXHRuZ09uRGVzdHJveSgpIHtcblx0XHR0aGlzLmNsb3NlKCk7XG5cdH1cblxuXHRvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcblx0XHRjb25zdCB7IGtleSB9ID0gZXZlbnQ7XG5cdFx0Y29uc3QgaXRlbUVsZW1lbnRzID0gdGhpcy5fZ2V0TWVudUVsZW1lbnRzKCk7XG5cblx0XHRsZXQgcG9zaXRpb24gPSAtMTtcblx0XHRsZXQgaXRlbUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cdFx0Y29uc3QgaXNFdmVudEZyb21Ub2dnbGUgPSB0aGlzLl9pc0V2ZW50RnJvbVRvZ2dsZShldmVudCk7XG5cblx0XHRpZiAoIWlzRXZlbnRGcm9tVG9nZ2xlICYmIGl0ZW1FbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdGl0ZW1FbGVtZW50cy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuXHRcdFx0XHRpZiAoaXRlbS5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpKSB7XG5cdFx0XHRcdFx0aXRlbUVsZW1lbnQgPSBpdGVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpdGVtID09PSBnZXRBY3RpdmVFbGVtZW50KHRoaXMuX2RvY3VtZW50KSkge1xuXHRcdFx0XHRcdHBvc2l0aW9uID0gaW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIGNsb3Npbmcgb24gRW50ZXIgLyBTcGFjZVxuXHRcdGlmIChrZXkgPT09ICcgJyB8fCBrZXkgPT09ICdFbnRlcicpIHtcblx0XHRcdGlmIChpdGVtRWxlbWVudCAmJiAodGhpcy5hdXRvQ2xvc2UgPT09IHRydWUgfHwgdGhpcy5hdXRvQ2xvc2UgPT09ICdpbnNpZGUnKSkge1xuXHRcdFx0XHQvLyBJdGVtIGlzIGVpdGhlciBhIGJ1dHRvbiBvciBhIGxpbmssIHNvIGNsaWNrIHdpbGwgYmUgdHJpZ2dlcmVkIGJ5IHRoZSBicm93c2VyIG9uIEVudGVyIG9yIFNwYWNlLlxuXHRcdFx0XHQvLyBTbyB3ZSBoYXZlIHRvIHJlZ2lzdGVyIGEgb25lLXRpbWUgY2xpY2sgaGFuZGxlciB0aGF0IHdpbGwgZmlyZSBhZnRlciBhbnkgdXNlciBkZWZpbmVkIGNsaWNrIGhhbmRsZXJzXG5cdFx0XHRcdC8vIHRvIGNsb3NlIHRoZSBkcm9wZG93blxuXHRcdFx0XHRmcm9tRXZlbnQoaXRlbUVsZW1lbnQsICdjbGljaycpXG5cdFx0XHRcdFx0LnBpcGUodGFrZSgxKSlcblx0XHRcdFx0XHQuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2UoKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGtleSA9PT0gJ1RhYicpIHtcblx0XHRcdGlmIChldmVudC50YXJnZXQgJiYgdGhpcy5pc09wZW4oKSAmJiB0aGlzLmF1dG9DbG9zZSkge1xuXHRcdFx0XHRpZiAodGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQgPT09IGV2ZW50LnRhcmdldCkge1xuXHRcdFx0XHRcdGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknICYmICFldmVudC5zaGlmdEtleSkge1xuXHRcdFx0XHRcdFx0LyogVGhpcyBjYXNlIGlzIHNwZWNpYWw6IHVzZXIgaXMgdXNpbmcgW1RhYl0gZnJvbSB0aGUgYW5jaG9yL3RvZ2dsZS5cbiAgICAgICAgICAgICAgIFVzZXIgZXhwZWN0cyB0aGUgbmV4dCBmb2N1c2FibGUgZWxlbWVudCBpbiB0aGUgZHJvcGRvd24gbWVudSB0byBnZXQgZm9jdXMuXG4gICAgICAgICAgICAgICBCdXQgdGhlIG1lbnUgaXMgbm90IGEgc2libGluZyB0byBhbmNob3IvdG9nZ2xlLCBpdCBpcyBhdCB0aGUgZW5kIG9mIHRoZSBib2R5LlxuICAgICAgICAgICAgICAgVHJpY2sgaXMgdG8gc3luY2hyb25vdXNseSBmb2N1cyB0aGUgbWVudSBlbGVtZW50LCBhbmQgbGV0IHRoZSBba2V5ZG93bi5UYWJdIGdvXG4gICAgICAgICAgICAgICBzbyB0aGF0IGJyb3dzZXIgd2lsbCBmb2N1cyB0aGUgcHJvcGVyIGVsZW1lbnQgKGZpcnN0IG9uZSBmb2N1c2FibGUgaW4gdGhlIG1lbnUpICovXG5cdFx0XHRcdFx0XHR0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG5cdFx0XHRcdFx0XHR0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHRcdHRoaXMuX21lbnUubmF0aXZlRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChldmVudC5zaGlmdEtleSkge1xuXHRcdFx0XHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuXHRcdFx0XHRcdGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gdGhpcy5fbWVudS5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoRk9DVVNBQkxFX0VMRU1FTlRTX1NFTEVDVE9SKTtcblx0XHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkgJiYgZXZlbnQudGFyZ2V0ID09PSBmb2N1c2FibGVFbGVtZW50c1swXSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICghZXZlbnQuc2hpZnRLZXkgJiYgZXZlbnQudGFyZ2V0ID09PSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZnJvbUV2ZW50PEZvY3VzRXZlbnQ+KGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCwgJ2ZvY3Vzb3V0Jylcblx0XHRcdFx0XHRcdC5waXBlKHRha2UoMSkpXG5cdFx0XHRcdFx0XHQuc3Vic2NyaWJlKCh7IHJlbGF0ZWRUYXJnZXQgfSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXRoaXMuX25hdGl2ZUVsZW1lbnQuY29udGFpbnMocmVsYXRlZFRhcmdldCBhcyBIVE1MRWxlbWVudCkpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gb3BlbmluZyAvIG5hdmlnYXRpbmdcblx0XHRpZiAoaXNFdmVudEZyb21Ub2dnbGUgfHwgaXRlbUVsZW1lbnQpIHtcblx0XHRcdHRoaXMub3BlbigpO1xuXG5cdFx0XHRpZiAoaXRlbUVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0XHRcdGNhc2UgJ0Fycm93RG93bic6XG5cdFx0XHRcdFx0XHRwb3NpdGlvbiA9IE1hdGgubWluKHBvc2l0aW9uICsgMSwgaXRlbUVsZW1lbnRzLmxlbmd0aCAtIDEpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnQXJyb3dVcCc6XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5faXNEcm9wdXAoKSAmJiBwb3NpdGlvbiA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0cG9zaXRpb24gPSBpdGVtRWxlbWVudHMubGVuZ3RoIC0gMTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRwb3NpdGlvbiA9IE1hdGgubWF4KHBvc2l0aW9uIC0gMSwgMCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdIb21lJzpcblx0XHRcdFx0XHRcdHBvc2l0aW9uID0gMDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ0VuZCc6XG5cdFx0XHRcdFx0XHRwb3NpdGlvbiA9IGl0ZW1FbGVtZW50cy5sZW5ndGggLSAxO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0aXRlbUVsZW1lbnRzW3Bvc2l0aW9uXS5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9pc0Ryb3B1cCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fbmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Ryb3B1cCcpO1xuXHR9XG5cblx0cHJpdmF0ZSBfaXNFdmVudEZyb21Ub2dnbGUoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcblx0XHRyZXR1cm4gdGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KTtcblx0fVxuXG5cdHByaXZhdGUgX2dldE1lbnVFbGVtZW50cygpOiBIVE1MRWxlbWVudFtdIHtcblx0XHRyZXR1cm4gdGhpcy5fbWVudVxuXHRcdFx0PyB0aGlzLl9tZW51Lm1lbnVJdGVtcy5maWx0ZXIoKHsgZGlzYWJsZWQgfSkgPT4gIWRpc2FibGVkKS5tYXAoKHsgbmF0aXZlRWxlbWVudCB9KSA9PiBuYXRpdmVFbGVtZW50KVxuXHRcdFx0OiBbXTtcblx0fVxuXG5cdHByaXZhdGUgX3Bvc2l0aW9uTWVudSgpIHtcblx0XHRjb25zdCBtZW51ID0gdGhpcy5fbWVudTtcblx0XHRpZiAodGhpcy5pc09wZW4oKSAmJiBtZW51KSB7XG5cdFx0XHRpZiAodGhpcy5kaXNwbGF5ID09PSAnZHluYW1pYycpIHtcblx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCk7XG5cdFx0XHRcdHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fYXBwbHlQbGFjZW1lbnRDbGFzc2VzKHRoaXMuX2dldEZpcnN0UGxhY2VtZW50KHRoaXMucGxhY2VtZW50KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0Rmlyc3RQbGFjZW1lbnQocGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSk6IFBsYWNlbWVudCB7XG5cdFx0cmV0dXJuIEFycmF5LmlzQXJyYXkocGxhY2VtZW50KSA/IHBsYWNlbWVudFswXSA6IChwbGFjZW1lbnQuc3BsaXQoJyAnKVswXSBhcyBQbGFjZW1lbnQpO1xuXHR9XG5cblx0cHJpdmF0ZSBfcmVzZXRDb250YWluZXIoKSB7XG5cdFx0aWYgKHRoaXMuX21lbnUpIHtcblx0XHRcdHRoaXMuX25hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fbWVudS5uYXRpdmVFbGVtZW50KTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuX2JvZHlDb250YWluZXIpIHtcblx0XHRcdHRoaXMuX2RvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5fYm9keUNvbnRhaW5lcik7XG5cdFx0XHR0aGlzLl9ib2R5Q29udGFpbmVyID0gbnVsbDtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9hcHBseUNvbnRhaW5lcihjb250YWluZXI6IG51bGwgfCAnYm9keScgPSBudWxsKSB7XG5cdFx0dGhpcy5fcmVzZXRDb250YWluZXIoKTtcblx0XHRpZiAoY29udGFpbmVyID09PSAnYm9keScpIHtcblx0XHRcdGNvbnN0IGRyb3Bkb3duTWVudUVsZW1lbnQgPSB0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQ7XG5cdFx0XHRjb25zdCBib2R5Q29udGFpbmVyID0gKHRoaXMuX2JvZHlDb250YWluZXIgPSB0aGlzLl9ib2R5Q29udGFpbmVyIHx8IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcblxuXHRcdFx0Ly8gT3ZlcnJpZGUgc29tZSBzdHlsZXMgdG8gaGF2ZSB0aGUgcG9zaXRpb25pbmcgd29ya2luZ1xuXHRcdFx0Ym9keUNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdFx0XHRkcm9wZG93bk1lbnVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3N0YXRpYyc7XG5cdFx0XHRib2R5Q29udGFpbmVyLnN0eWxlLnpJbmRleCA9ICcxMDU1JztcblxuXHRcdFx0Ym9keUNvbnRhaW5lci5hcHBlbmRDaGlsZChkcm9wZG93bk1lbnVFbGVtZW50KTtcblx0XHRcdHRoaXMuX2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYm9keUNvbnRhaW5lcik7XG5cdFx0fVxuXG5cdFx0dGhpcy5fYXBwbHlDdXN0b21Ecm9wZG93bkNsYXNzKHRoaXMuZHJvcGRvd25DbGFzcyk7XG5cdH1cblxuXHRwcml2YXRlIF9hcHBseUN1c3RvbURyb3Bkb3duQ2xhc3MobmV3Q2xhc3M6IHN0cmluZywgb2xkQ2xhc3M/OiBzdHJpbmcpIHtcblx0XHRjb25zdCB0YXJnZXRFbGVtZW50ID0gdGhpcy5jb250YWluZXIgPT09ICdib2R5JyA/IHRoaXMuX2JvZHlDb250YWluZXIgOiB0aGlzLl9uYXRpdmVFbGVtZW50O1xuXHRcdGlmICh0YXJnZXRFbGVtZW50KSB7XG5cdFx0XHRpZiAob2xkQ2xhc3MpIHtcblx0XHRcdFx0dGFyZ2V0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKG9sZENsYXNzKTtcblx0XHRcdH1cblx0XHRcdGlmIChuZXdDbGFzcykge1xuXHRcdFx0XHR0YXJnZXRFbGVtZW50LmNsYXNzTGlzdC5hZGQobmV3Q2xhc3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2FwcGx5UGxhY2VtZW50Q2xhc3NlcyhwbGFjZW1lbnQ/OiBQbGFjZW1lbnQgfCBudWxsKSB7XG5cdFx0aWYgKHRoaXMuX21lbnUpIHtcblx0XHRcdGlmICghcGxhY2VtZW50KSB7XG5cdFx0XHRcdHBsYWNlbWVudCA9IHRoaXMuX2dldEZpcnN0UGxhY2VtZW50KHRoaXMucGxhY2VtZW50KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcmVtb3ZlIHRoZSBjdXJyZW50IHBsYWNlbWVudCBjbGFzc2VzXG5cdFx0XHR0aGlzLl9uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3B1cCcsICdkcm9wZG93bicpO1xuXHRcdFx0aWYgKHRoaXMuZGlzcGxheSA9PT0gJ3N0YXRpYycpIHtcblx0XHRcdFx0dGhpcy5fbWVudS5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1icy1wb3BwZXInLCAnc3RhdGljJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWJzLXBvcHBlcicpO1xuXHRcdFx0fVxuXG5cdFx0XHQvKlxuXHRcdFx0ICogYXBwbHkgdGhlIG5ldyBwbGFjZW1lbnRcblx0XHRcdCAqIGluIGNhc2Ugb2YgdG9wIHVzZSB1cC1hcnJvdyBvciBkb3duLWFycm93IG90aGVyd2lzZVxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBkcm9wZG93bkNsYXNzID0gcGxhY2VtZW50LnNlYXJjaCgnXnRvcCcpICE9PSAtMSA/ICdkcm9wdXAnIDogJ2Ryb3Bkb3duJztcblx0XHRcdHRoaXMuX25hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChkcm9wZG93bkNsYXNzKTtcblxuXHRcdFx0aWYgKHRoaXMuX2JvZHlDb250YWluZXIpIHtcblx0XHRcdFx0dGhpcy5fYm9keUNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wdXAnLCAnZHJvcGRvd24nKTtcblx0XHRcdFx0dGhpcy5fYm9keUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGRyb3Bkb3duQ2xhc3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIl19