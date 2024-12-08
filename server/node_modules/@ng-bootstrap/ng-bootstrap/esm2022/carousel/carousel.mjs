import { afterNextRender, AfterRenderPhase, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, DestroyRef, Directive, ElementRef, EventEmitter, inject, Injector, Input, NgZone, Output, PLATFORM_ID, TemplateRef, ViewEncapsulation, } from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { NgbCarouselConfig } from './carousel-config';
import { BehaviorSubject, combineLatest, NEVER, timer, zip } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, take } from 'rxjs/operators';
import { ngbCompleteTransition, ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCarouselTransitionIn, ngbCarouselTransitionOut, NgbSlideEventDirection, } from './carousel-transition';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as i0 from "@angular/core";
let nextId = 0;
let carouselId = 0;
/**
 * A directive that wraps the individual carousel slide.
 */
export class NgbSlide {
    constructor() {
        this.templateRef = inject(TemplateRef);
        /**
         * Slide id that must be unique for the entire document.
         *
         * If not provided, will be generated in the `ngb-slide-xx` format.
         */
        this.id = `ngb-slide-${nextId++}`;
        /**
         * An event emitted when the slide transition is finished
         *
         * @since 8.0.0
         */
        this.slid = new EventEmitter();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbSlide, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.2", type: NgbSlide, isStandalone: true, selector: "ng-template[ngbSlide]", inputs: { id: "id" }, outputs: { slid: "slid" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbSlide, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbSlide]', standalone: true }]
        }], propDecorators: { id: [{
                type: Input
            }], slid: [{
                type: Output
            }] } });
/**
 * Carousel is a component to easily create and control slideshows.
 *
 * Allows to set intervals, change the way user interacts with the slides and provides a programmatic API.
 */
export class NgbCarousel {
    constructor() {
        this.NgbSlideEventSource = NgbSlideEventSource;
        this._config = inject(NgbCarouselConfig);
        this._platformId = inject(PLATFORM_ID);
        this._ngZone = inject(NgZone);
        this._cd = inject(ChangeDetectorRef);
        this._container = inject(ElementRef);
        this._destroyRef = inject(DestroyRef);
        this._injector = inject(Injector);
        this._interval$ = new BehaviorSubject(this._config.interval);
        this._mouseHover$ = new BehaviorSubject(false);
        this._focused$ = new BehaviorSubject(false);
        this._pauseOnHover$ = new BehaviorSubject(this._config.pauseOnHover);
        this._pauseOnFocus$ = new BehaviorSubject(this._config.pauseOnFocus);
        this._pause$ = new BehaviorSubject(false);
        this._wrap$ = new BehaviorSubject(this._config.wrap);
        this.id = `ngb-carousel-${carouselId++}`;
        /**
         * A flag to enable/disable the animations.
         *
         * @since 8.0.0
         */
        this.animation = this._config.animation;
        /**
         * If `true`, allows to interact with carousel using keyboard 'arrow left' and 'arrow right'.
         */
        this.keyboard = this._config.keyboard;
        /**
         * If `true`, 'previous' and 'next' navigation arrows will be visible on the slide.
         *
         * @since 2.2.0
         */
        this.showNavigationArrows = this._config.showNavigationArrows;
        /**
         * If `true`, navigation indicators at the bottom of the slide will be visible.
         *
         * @since 2.2.0
         */
        this.showNavigationIndicators = this._config.showNavigationIndicators;
        /**
         * An event emitted just before the slide transition starts.
         *
         * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
         */
        this.slide = new EventEmitter();
        /**
         * An event emitted right after the slide transition is completed.
         *
         * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
         *
         * @since 8.0.0
         */
        this.slid = new EventEmitter();
        /*
         * Keep the ids of the panels currently transitionning
         * in order to allow only the transition revertion
         */
        this._transitionIds = null;
    }
    /**
     * Time in milliseconds before the next slide is shown.
     */
    set interval(value) {
        this._interval$.next(value);
    }
    get interval() {
        return this._interval$.value;
    }
    /**
     * If `true`, will 'wrap' the carousel by switching from the last slide back to the first.
     */
    set wrap(value) {
        this._wrap$.next(value);
    }
    get wrap() {
        return this._wrap$.value;
    }
    /**
     * If `true`, will pause slide switching when mouse cursor hovers the slide.
     *
     * @since 2.2.0
     */
    set pauseOnHover(value) {
        this._pauseOnHover$.next(value);
    }
    get pauseOnHover() {
        return this._pauseOnHover$.value;
    }
    /**
     * If `true`, will pause slide switching when the focus is inside the carousel.
     */
    set pauseOnFocus(value) {
        this._pauseOnFocus$.next(value);
    }
    get pauseOnFocus() {
        return this._pauseOnFocus$.value;
    }
    set mouseHover(value) {
        this._mouseHover$.next(value);
    }
    get mouseHover() {
        return this._mouseHover$.value;
    }
    set focused(value) {
        this._focused$.next(value);
    }
    get focused() {
        return this._focused$.value;
    }
    arrowLeft() {
        this.focus();
        this.prev(NgbSlideEventSource.ARROW_LEFT);
    }
    arrowRight() {
        this.focus();
        this.next(NgbSlideEventSource.ARROW_RIGHT);
    }
    ngAfterContentInit() {
        // setInterval() doesn't play well with SSR and protractor,
        // so we should run it in the browser and outside Angular
        if (isPlatformBrowser(this._platformId)) {
            this._ngZone.runOutsideAngular(() => {
                const hasNextSlide$ = combineLatest([
                    this.slide.pipe(map((slideEvent) => slideEvent.current), startWith(this.activeId)),
                    this._wrap$,
                    this.slides.changes.pipe(startWith(null)),
                ]).pipe(map(([currentSlideId, wrap]) => {
                    const slideArr = this.slides.toArray();
                    const currentSlideIdx = this._getSlideIdxById(currentSlideId);
                    return wrap ? slideArr.length > 1 : currentSlideIdx < slideArr.length - 1;
                }), distinctUntilChanged());
                combineLatest([
                    this._pause$,
                    this._pauseOnHover$,
                    this._mouseHover$,
                    this._pauseOnFocus$,
                    this._focused$,
                    this._interval$,
                    hasNextSlide$,
                ])
                    .pipe(map(([pause, pauseOnHover, mouseHover, pauseOnFocus, focused, interval, hasNextSlide]) => pause || (pauseOnHover && mouseHover) || (pauseOnFocus && focused) || !hasNextSlide ? 0 : interval), distinctUntilChanged(), switchMap((interval) => (interval > 0 ? timer(interval, interval) : NEVER)), takeUntilDestroyed(this._destroyRef))
                    .subscribe(() => this._ngZone.run(() => this.next(NgbSlideEventSource.TIMER)));
            });
        }
        this.slides.changes.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
            this._transitionIds?.forEach((id) => ngbCompleteTransition(this._getSlideElement(id)));
            this._transitionIds = null;
            this._cd.markForCheck();
            // The following code need to be done asynchronously, after the dom becomes stable,
            // otherwise all changes will be undone.
            afterNextRender(() => {
                for (const { id } of this.slides) {
                    const element = this._getSlideElement(id);
                    if (id === this.activeId) {
                        element.classList.add('active');
                    }
                    else {
                        element.classList.remove('active');
                    }
                }
            }, { phase: AfterRenderPhase.MixedReadWrite, injector: this._injector });
        });
    }
    ngAfterContentChecked() {
        let activeSlide = this._getSlideById(this.activeId);
        this.activeId = activeSlide ? activeSlide.id : this.slides.length ? this.slides.first.id : '';
    }
    ngAfterViewInit() {
        // Initialize the 'active' class (not managed by the template)
        if (this.activeId) {
            const element = this._getSlideElement(this.activeId);
            if (element) {
                element.classList.add('active');
            }
        }
    }
    /**
     * Navigates to a slide with the specified identifier.
     */
    select(slideId, source) {
        this._cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId), source);
    }
    /**
     * Navigates to the previous slide.
     */
    prev(source) {
        this._cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.END, source);
    }
    /**
     * Navigates to the next slide.
     */
    next(source) {
        this._cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.START, source);
    }
    /**
     * Pauses cycling through the slides.
     */
    pause() {
        this._pause$.next(true);
    }
    /**
     * Restarts cycling through the slides from start to end.
     */
    cycle() {
        this._pause$.next(false);
    }
    /**
     * Set the focus on the carousel.
     */
    focus() {
        this._container.nativeElement.focus();
    }
    _cycleToSelected(slideIdx, direction, source) {
        const transitionIds = this._transitionIds;
        if (transitionIds && (transitionIds[0] !== slideIdx || transitionIds[1] !== this.activeId)) {
            // Revert prevented
            return;
        }
        let selectedSlide = this._getSlideById(slideIdx);
        if (selectedSlide && selectedSlide.id !== this.activeId) {
            this._transitionIds = [this.activeId, slideIdx];
            this.slide.emit({
                prev: this.activeId,
                current: selectedSlide.id,
                direction: direction,
                paused: this._pause$.value,
                source,
            });
            const options = {
                animation: this.animation,
                runningTransition: 'stop',
                context: { direction },
            };
            const transitions = [];
            const activeSlide = this._getSlideById(this.activeId);
            if (activeSlide) {
                const activeSlideTransition = ngbRunTransition(this._ngZone, this._getSlideElement(activeSlide.id), ngbCarouselTransitionOut, options);
                activeSlideTransition.subscribe(() => {
                    activeSlide.slid.emit({ isShown: false, direction, source });
                });
                transitions.push(activeSlideTransition);
            }
            const previousId = this.activeId;
            this.activeId = selectedSlide.id;
            const nextSlide = this._getSlideById(this.activeId);
            const transition = ngbRunTransition(this._ngZone, this._getSlideElement(selectedSlide.id), ngbCarouselTransitionIn, options);
            transition.subscribe(() => {
                nextSlide?.slid.emit({ isShown: true, direction, source });
            });
            transitions.push(transition);
            zip(...transitions)
                .pipe(take(1))
                .subscribe(() => {
                this._transitionIds = null;
                this.slid.emit({
                    prev: previousId,
                    current: selectedSlide.id,
                    direction: direction,
                    paused: this._pause$.value,
                    source,
                });
            });
        }
        // we get here after the interval fires or any external API call like next(), prev() or select()
        this._cd.markForCheck();
    }
    _getSlideEventDirection(currentActiveSlideId, nextActiveSlideId) {
        const currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
        const nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);
        return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.END : NgbSlideEventDirection.START;
    }
    _getSlideById(slideId) {
        return this.slides.find((slide) => slide.id === slideId) || null;
    }
    _getSlideIdxById(slideId) {
        const slide = this._getSlideById(slideId);
        return slide != null ? this.slides.toArray().indexOf(slide) : -1;
    }
    _getNextSlide(currentSlideId) {
        const slideArr = this.slides.toArray();
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        const isLastSlide = currentSlideIdx === slideArr.length - 1;
        return isLastSlide
            ? this.wrap
                ? slideArr[0].id
                : slideArr[slideArr.length - 1].id
            : slideArr[currentSlideIdx + 1].id;
    }
    _getPrevSlide(currentSlideId) {
        const slideArr = this.slides.toArray();
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        const isFirstSlide = currentSlideIdx === 0;
        return isFirstSlide
            ? this.wrap
                ? slideArr[slideArr.length - 1].id
                : slideArr[0].id
            : slideArr[currentSlideIdx - 1].id;
    }
    _getSlideElement(slideId) {
        return this._container.nativeElement.querySelector(`#slide-${slideId}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbCarousel, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.2", type: NgbCarousel, isStandalone: true, selector: "ngb-carousel", inputs: { animation: "animation", activeId: "activeId", interval: "interval", wrap: "wrap", keyboard: "keyboard", pauseOnHover: "pauseOnHover", pauseOnFocus: "pauseOnFocus", showNavigationArrows: "showNavigationArrows", showNavigationIndicators: "showNavigationIndicators" }, outputs: { slide: "slide", slid: "slid" }, host: { attributes: { "tabIndex": "0" }, listeners: { "keydown.arrowLeft": "keyboard && arrowLeft()", "keydown.arrowRight": "keyboard && arrowRight()", "mouseenter": "mouseHover = true", "mouseleave": "mouseHover = false", "focusin": "focused = true", "focusout": "focused = false" }, properties: { "style.display": "\"block\"", "attr.aria-activedescendant": "'slide-' + activeId" }, classAttribute: "carousel slide" }, queries: [{ propertyName: "slides", predicate: NgbSlide }], exportAs: ["ngbCarousel"], ngImport: i0, template: `
		<div class="carousel-indicators" [class.visually-hidden]="!showNavigationIndicators" role="tablist">
			@for (slide of slides; track slide) {
				<button
					type="button"
					data-bs-target
					[class.active]="slide.id === activeId"
					role="tab"
					[attr.aria-labelledby]="'slide-' + slide.id"
					[attr.aria-controls]="'slide-' + slide.id"
					[attr.aria-selected]="slide.id === activeId"
					(click)="focus(); select(slide.id, NgbSlideEventSource.INDICATOR)"
				></button>
			}
		</div>
		<div class="carousel-inner">
			@for (slide of slides; track slide; let i = $index; let c = $count) {
				<div class="carousel-item" [id]="'slide-' + slide.id" role="tabpanel">
					<span
						class="visually-hidden"
						i18n="Currently selected slide number read by screen reader@@ngb.carousel.slide-number"
					>
						Slide {{ i + 1 }} of {{ c }}
					</span>
					<ng-template [ngTemplateOutlet]="slide.templateRef" />
				</div>
			}
		</div>
		@if (showNavigationArrows) {
			<button
				class="carousel-control-prev"
				type="button"
				(click)="arrowLeft()"
				[attr.aria-labelledby]="id + '-previous'"
			>
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden" i18n="@@ngb.carousel.previous" [id]="id + '-previous'">Previous</span>
			</button>
			<button class="carousel-control-next" type="button" (click)="arrowRight()" [attr.aria-labelledby]="id + '-next'">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden" i18n="@@ngb.carousel.next" [id]="id + '-next'">Next</span>
			</button>
		}
	`, isInline: true, dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.2", ngImport: i0, type: NgbCarousel, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-carousel',
                    exportAs: 'ngbCarousel',
                    standalone: true,
                    imports: [NgTemplateOutlet],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'carousel slide',
                        '[style.display]': '"block"',
                        tabIndex: '0',
                        '(keydown.arrowLeft)': 'keyboard && arrowLeft()',
                        '(keydown.arrowRight)': 'keyboard && arrowRight()',
                        '(mouseenter)': 'mouseHover = true',
                        '(mouseleave)': 'mouseHover = false',
                        '(focusin)': 'focused = true',
                        '(focusout)': 'focused = false',
                        '[attr.aria-activedescendant]': `'slide-' + activeId`,
                    },
                    template: `
		<div class="carousel-indicators" [class.visually-hidden]="!showNavigationIndicators" role="tablist">
			@for (slide of slides; track slide) {
				<button
					type="button"
					data-bs-target
					[class.active]="slide.id === activeId"
					role="tab"
					[attr.aria-labelledby]="'slide-' + slide.id"
					[attr.aria-controls]="'slide-' + slide.id"
					[attr.aria-selected]="slide.id === activeId"
					(click)="focus(); select(slide.id, NgbSlideEventSource.INDICATOR)"
				></button>
			}
		</div>
		<div class="carousel-inner">
			@for (slide of slides; track slide; let i = $index; let c = $count) {
				<div class="carousel-item" [id]="'slide-' + slide.id" role="tabpanel">
					<span
						class="visually-hidden"
						i18n="Currently selected slide number read by screen reader@@ngb.carousel.slide-number"
					>
						Slide {{ i + 1 }} of {{ c }}
					</span>
					<ng-template [ngTemplateOutlet]="slide.templateRef" />
				</div>
			}
		</div>
		@if (showNavigationArrows) {
			<button
				class="carousel-control-prev"
				type="button"
				(click)="arrowLeft()"
				[attr.aria-labelledby]="id + '-previous'"
			>
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden" i18n="@@ngb.carousel.previous" [id]="id + '-previous'">Previous</span>
			</button>
			<button class="carousel-control-next" type="button" (click)="arrowRight()" [attr.aria-labelledby]="id + '-next'">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden" i18n="@@ngb.carousel.next" [id]="id + '-next'">Next</span>
			</button>
		}
	`,
                }]
        }], propDecorators: { slides: [{
                type: ContentChildren,
                args: [NgbSlide]
            }], animation: [{
                type: Input
            }], activeId: [{
                type: Input
            }], interval: [{
                type: Input
            }], wrap: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], pauseOnHover: [{
                type: Input
            }], pauseOnFocus: [{
                type: Input
            }], showNavigationArrows: [{
                type: Input
            }], showNavigationIndicators: [{
                type: Input
            }], slide: [{
                type: Output
            }], slid: [{
                type: Output
            }] } });
export var NgbSlideEventSource;
(function (NgbSlideEventSource) {
    NgbSlideEventSource["TIMER"] = "timer";
    NgbSlideEventSource["ARROW_LEFT"] = "arrowLeft";
    NgbSlideEventSource["ARROW_RIGHT"] = "arrowRight";
    NgbSlideEventSource["INDICATOR"] = "indicator";
})(NgbSlideEventSource || (NgbSlideEventSource = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2Fyb3VzZWwvY2Fyb3VzZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdOLGVBQWUsRUFDZixnQkFBZ0IsRUFFaEIsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFdBQVcsRUFFWCxXQUFXLEVBQ1gsaUJBQWlCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXRFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXRELE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBYyxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RixPQUFPLEVBQUUscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQXdCLE1BQU0sa0NBQWtDLENBQUM7QUFDakgsT0FBTyxFQUVOLHVCQUF1QixFQUN2Qix3QkFBd0IsRUFDeEIsc0JBQXNCLEdBQ3RCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7O0FBRWhFLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNmLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUVuQjs7R0FFRztBQUVILE1BQU0sT0FBTyxRQUFRO0lBRHJCO1FBRUMsZ0JBQVcs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TEQsV0FBWSxtQkFBbUI7SUFDOUIsc0NBQWUsQ0FBQTtJQUNmLCtDQUF3QixDQUFBO0lBQ3hCLGlEQUEwQixDQUFBO0lBQzFCLDhDQUF1QixDQUFBO0FBQ3hCLENBQUMsRUFMVyxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBSzlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QWZ0ZXJDb250ZW50Q2hlY2tlZCxcblx0QWZ0ZXJDb250ZW50SW5pdCxcblx0YWZ0ZXJOZXh0UmVuZGVyLFxuXHRBZnRlclJlbmRlclBoYXNlLFxuXHRBZnRlclZpZXdJbml0LFxuXHRDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbXBvbmVudCxcblx0Q29udGVudENoaWxkcmVuLFxuXHREZXN0cm95UmVmLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0aW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T3V0cHV0LFxuXHRQTEFURk9STV9JRCxcblx0UXVlcnlMaXN0LFxuXHRUZW1wbGF0ZVJlZixcblx0Vmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIsIE5nVGVtcGxhdGVPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBOZ2JDYXJvdXNlbENvbmZpZyB9IGZyb20gJy4vY2Fyb3VzZWwtY29uZmlnJztcblxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBORVZFUiwgT2JzZXJ2YWJsZSwgdGltZXIsIHppcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCwgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBuZ2JDb21wbGV0ZVRyYW5zaXRpb24sIG5nYlJ1blRyYW5zaXRpb24sIE5nYlRyYW5zaXRpb25PcHRpb25zIH0gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHtcblx0TmdiQ2Fyb3VzZWxDdHgsXG5cdG5nYkNhcm91c2VsVHJhbnNpdGlvbkluLFxuXHRuZ2JDYXJvdXNlbFRyYW5zaXRpb25PdXQsXG5cdE5nYlNsaWRlRXZlbnREaXJlY3Rpb24sXG59IGZyb20gJy4vY2Fyb3VzZWwtdHJhbnNpdGlvbic7XG5pbXBvcnQgeyB0YWtlVW50aWxEZXN0cm95ZWQgfSBmcm9tICdAYW5ndWxhci9jb3JlL3J4anMtaW50ZXJvcCc7XG5cbmxldCBuZXh0SWQgPSAwO1xubGV0IGNhcm91c2VsSWQgPSAwO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgdGhlIGluZGl2aWR1YWwgY2Fyb3VzZWwgc2xpZGUuXG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlNsaWRlXScsIHN0YW5kYWxvbmU6IHRydWUgfSlcbmV4cG9ydCBjbGFzcyBOZ2JTbGlkZSB7XG5cdHRlbXBsYXRlUmVmID0gaW5qZWN0KFRlbXBsYXRlUmVmKTtcblxuXHQvKipcblx0ICogU2xpZGUgaWQgdGhhdCBtdXN0IGJlIHVuaXF1ZSBmb3IgdGhlIGVudGlyZSBkb2N1bWVudC5cblx0ICpcblx0ICogSWYgbm90IHByb3ZpZGVkLCB3aWxsIGJlIGdlbmVyYXRlZCBpbiB0aGUgYG5nYi1zbGlkZS14eGAgZm9ybWF0LlxuXHQgKi9cblx0QElucHV0KCkgaWQgPSBgbmdiLXNsaWRlLSR7bmV4dElkKyt9YDtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGZpbmlzaGVkXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIHNsaWQgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYlNpbmdsZVNsaWRlRXZlbnQ+KCk7XG59XG5cbi8qKlxuICogQ2Fyb3VzZWwgaXMgYSBjb21wb25lbnQgdG8gZWFzaWx5IGNyZWF0ZSBhbmQgY29udHJvbCBzbGlkZXNob3dzLlxuICpcbiAqIEFsbG93cyB0byBzZXQgaW50ZXJ2YWxzLCBjaGFuZ2UgdGhlIHdheSB1c2VyIGludGVyYWN0cyB3aXRoIHRoZSBzbGlkZXMgYW5kIHByb3ZpZGVzIGEgcHJvZ3JhbW1hdGljIEFQSS5cbiAqL1xuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLWNhcm91c2VsJyxcblx0ZXhwb3J0QXM6ICduZ2JDYXJvdXNlbCcsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGltcG9ydHM6IFtOZ1RlbXBsYXRlT3V0bGV0XSxcblx0Y2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG5cdGhvc3Q6IHtcblx0XHRjbGFzczogJ2Nhcm91c2VsIHNsaWRlJyxcblx0XHQnW3N0eWxlLmRpc3BsYXldJzogJ1wiYmxvY2tcIicsXG5cdFx0dGFiSW5kZXg6ICcwJyxcblx0XHQnKGtleWRvd24uYXJyb3dMZWZ0KSc6ICdrZXlib2FyZCAmJiBhcnJvd0xlZnQoKScsXG5cdFx0JyhrZXlkb3duLmFycm93UmlnaHQpJzogJ2tleWJvYXJkICYmIGFycm93UmlnaHQoKScsXG5cdFx0Jyhtb3VzZWVudGVyKSc6ICdtb3VzZUhvdmVyID0gdHJ1ZScsXG5cdFx0Jyhtb3VzZWxlYXZlKSc6ICdtb3VzZUhvdmVyID0gZmFsc2UnLFxuXHRcdCcoZm9jdXNpbiknOiAnZm9jdXNlZCA9IHRydWUnLFxuXHRcdCcoZm9jdXNvdXQpJzogJ2ZvY3VzZWQgPSBmYWxzZScsXG5cdFx0J1thdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF0nOiBgJ3NsaWRlLScgKyBhY3RpdmVJZGAsXG5cdH0sXG5cdHRlbXBsYXRlOiBgXG5cdFx0PGRpdiBjbGFzcz1cImNhcm91c2VsLWluZGljYXRvcnNcIiBbY2xhc3MudmlzdWFsbHktaGlkZGVuXT1cIiFzaG93TmF2aWdhdGlvbkluZGljYXRvcnNcIiByb2xlPVwidGFibGlzdFwiPlxuXHRcdFx0QGZvciAoc2xpZGUgb2Ygc2xpZGVzOyB0cmFjayBzbGlkZSkge1xuXHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHRcdFx0ZGF0YS1icy10YXJnZXRcblx0XHRcdFx0XHRbY2xhc3MuYWN0aXZlXT1cInNsaWRlLmlkID09PSBhY3RpdmVJZFwiXG5cdFx0XHRcdFx0cm9sZT1cInRhYlwiXG5cdFx0XHRcdFx0W2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cIidzbGlkZS0nICsgc2xpZGUuaWRcIlxuXHRcdFx0XHRcdFthdHRyLmFyaWEtY29udHJvbHNdPVwiJ3NsaWRlLScgKyBzbGlkZS5pZFwiXG5cdFx0XHRcdFx0W2F0dHIuYXJpYS1zZWxlY3RlZF09XCJzbGlkZS5pZCA9PT0gYWN0aXZlSWRcIlxuXHRcdFx0XHRcdChjbGljayk9XCJmb2N1cygpOyBzZWxlY3Qoc2xpZGUuaWQsIE5nYlNsaWRlRXZlbnRTb3VyY2UuSU5ESUNBVE9SKVwiXG5cdFx0XHRcdD48L2J1dHRvbj5cblx0XHRcdH1cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IGNsYXNzPVwiY2Fyb3VzZWwtaW5uZXJcIj5cblx0XHRcdEBmb3IgKHNsaWRlIG9mIHNsaWRlczsgdHJhY2sgc2xpZGU7IGxldCBpID0gJGluZGV4OyBsZXQgYyA9ICRjb3VudCkge1xuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2Fyb3VzZWwtaXRlbVwiIFtpZF09XCInc2xpZGUtJyArIHNsaWRlLmlkXCIgcm9sZT1cInRhYnBhbmVsXCI+XG5cdFx0XHRcdFx0PHNwYW5cblx0XHRcdFx0XHRcdGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCJcblx0XHRcdFx0XHRcdGkxOG49XCJDdXJyZW50bHkgc2VsZWN0ZWQgc2xpZGUgbnVtYmVyIHJlYWQgYnkgc2NyZWVuIHJlYWRlckBAbmdiLmNhcm91c2VsLnNsaWRlLW51bWJlclwiXG5cdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0U2xpZGUge3sgaSArIDEgfX0gb2Yge3sgYyB9fVxuXHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHQ8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwic2xpZGUudGVtcGxhdGVSZWZcIiAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdH1cblx0XHQ8L2Rpdj5cblx0XHRAaWYgKHNob3dOYXZpZ2F0aW9uQXJyb3dzKSB7XG5cdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdGNsYXNzPVwiY2Fyb3VzZWwtY29udHJvbC1wcmV2XCJcblx0XHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHRcdChjbGljayk9XCJhcnJvd0xlZnQoKVwiXG5cdFx0XHRcdFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJpZCArICctcHJldmlvdXMnXCJcblx0XHRcdD5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLXByZXYtaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIiBpMThuPVwiQEBuZ2IuY2Fyb3VzZWwucHJldmlvdXNcIiBbaWRdPVwiaWQgKyAnLXByZXZpb3VzJ1wiPlByZXZpb3VzPC9zcGFuPlxuXHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8YnV0dG9uIGNsYXNzPVwiY2Fyb3VzZWwtY29udHJvbC1uZXh0XCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJhcnJvd1JpZ2h0KClcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiaWQgKyAnLW5leHQnXCI+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2Fyb3VzZWwtY29udHJvbC1uZXh0LWljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCIgaTE4bj1cIkBAbmdiLmNhcm91c2VsLm5leHRcIiBbaWRdPVwiaWQgKyAnLW5leHQnXCI+TmV4dDwvc3Bhbj5cblx0XHRcdDwvYnV0dG9uPlxuXHRcdH1cblx0YCxcbn0pXG5leHBvcnQgY2xhc3MgTmdiQ2Fyb3VzZWwgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0IHtcblx0QENvbnRlbnRDaGlsZHJlbihOZ2JTbGlkZSkgc2xpZGVzOiBRdWVyeUxpc3Q8TmdiU2xpZGU+O1xuXG5cdHB1YmxpYyBOZ2JTbGlkZUV2ZW50U291cmNlID0gTmdiU2xpZGVFdmVudFNvdXJjZTtcblxuXHRwcml2YXRlIF9jb25maWcgPSBpbmplY3QoTmdiQ2Fyb3VzZWxDb25maWcpO1xuXHRwcml2YXRlIF9wbGF0Zm9ybUlkID0gaW5qZWN0KFBMQVRGT1JNX0lEKTtcblx0cHJpdmF0ZSBfbmdab25lID0gaW5qZWN0KE5nWm9uZSk7XG5cdHByaXZhdGUgX2NkID0gaW5qZWN0KENoYW5nZURldGVjdG9yUmVmKTtcblx0cHJpdmF0ZSBfY29udGFpbmVyID0gaW5qZWN0KEVsZW1lbnRSZWYpO1xuXHRwcml2YXRlIF9kZXN0cm95UmVmID0gaW5qZWN0KERlc3Ryb3lSZWYpO1xuXHRwcml2YXRlIF9pbmplY3RvciA9IGluamVjdChJbmplY3Rvcik7XG5cblx0cHJpdmF0ZSBfaW50ZXJ2YWwkID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0aGlzLl9jb25maWcuaW50ZXJ2YWwpO1xuXHRwcml2YXRlIF9tb3VzZUhvdmVyJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuXHRwcml2YXRlIF9mb2N1c2VkJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuXHRwcml2YXRlIF9wYXVzZU9uSG92ZXIkID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0aGlzLl9jb25maWcucGF1c2VPbkhvdmVyKTtcblx0cHJpdmF0ZSBfcGF1c2VPbkZvY3VzJCA9IG5ldyBCZWhhdmlvclN1YmplY3QodGhpcy5fY29uZmlnLnBhdXNlT25Gb2N1cyk7XG5cdHByaXZhdGUgX3BhdXNlJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuXHRwcml2YXRlIF93cmFwJCA9IG5ldyBCZWhhdmlvclN1YmplY3QodGhpcy5fY29uZmlnLndyYXApO1xuXG5cdGlkID0gYG5nYi1jYXJvdXNlbC0ke2Nhcm91c2VsSWQrK31gO1xuXG5cdC8qKlxuXHQgKiBBIGZsYWcgdG8gZW5hYmxlL2Rpc2FibGUgdGhlIGFuaW1hdGlvbnMuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QElucHV0KCkgYW5pbWF0aW9uID0gdGhpcy5fY29uZmlnLmFuaW1hdGlvbjtcblxuXHQvKipcblx0ICogVGhlIHNsaWRlIGlkIHRoYXQgc2hvdWxkIGJlIGRpc3BsYXllZCAqKmluaXRpYWxseSoqLlxuXHQgKlxuXHQgKiBGb3Igc3Vic2VxdWVudCBpbnRlcmFjdGlvbnMgdXNlIG1ldGhvZHMgYHNlbGVjdCgpYCwgYG5leHQoKWAsIGV0Yy4gYW5kIHRoZSBgKHNsaWRlKWAgb3V0cHV0LlxuXHQgKi9cblx0QElucHV0KCkgYWN0aXZlSWQ6IHN0cmluZztcblxuXHQvKipcblx0ICogVGltZSBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIHRoZSBuZXh0IHNsaWRlIGlzIHNob3duLlxuXHQgKi9cblx0QElucHV0KClcblx0c2V0IGludGVydmFsKHZhbHVlOiBudW1iZXIpIHtcblx0XHR0aGlzLl9pbnRlcnZhbCQubmV4dCh2YWx1ZSk7XG5cdH1cblxuXHRnZXQgaW50ZXJ2YWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2ludGVydmFsJC52YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHdpbGwgJ3dyYXAnIHRoZSBjYXJvdXNlbCBieSBzd2l0Y2hpbmcgZnJvbSB0aGUgbGFzdCBzbGlkZSBiYWNrIHRvIHRoZSBmaXJzdC5cblx0ICovXG5cdEBJbnB1dCgpXG5cdHNldCB3cmFwKHZhbHVlOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fd3JhcCQubmV4dCh2YWx1ZSk7XG5cdH1cblxuXHRnZXQgd3JhcCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fd3JhcCQudmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogSWYgYHRydWVgLCBhbGxvd3MgdG8gaW50ZXJhY3Qgd2l0aCBjYXJvdXNlbCB1c2luZyBrZXlib2FyZCAnYXJyb3cgbGVmdCcgYW5kICdhcnJvdyByaWdodCcuXG5cdCAqL1xuXHRASW5wdXQoKSBrZXlib2FyZCA9IHRoaXMuX2NvbmZpZy5rZXlib2FyZDtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3aWxsIHBhdXNlIHNsaWRlIHN3aXRjaGluZyB3aGVuIG1vdXNlIGN1cnNvciBob3ZlcnMgdGhlIHNsaWRlLlxuXHQgKlxuXHQgKiBAc2luY2UgMi4yLjBcblx0ICovXG5cdEBJbnB1dCgpXG5cdHNldCBwYXVzZU9uSG92ZXIodmFsdWU6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9wYXVzZU9uSG92ZXIkLm5leHQodmFsdWUpO1xuXHR9XG5cblx0Z2V0IHBhdXNlT25Ib3ZlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5fcGF1c2VPbkhvdmVyJC52YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHdpbGwgcGF1c2Ugc2xpZGUgc3dpdGNoaW5nIHdoZW4gdGhlIGZvY3VzIGlzIGluc2lkZSB0aGUgY2Fyb3VzZWwuXG5cdCAqL1xuXHRASW5wdXQoKVxuXHRzZXQgcGF1c2VPbkZvY3VzKHZhbHVlOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fcGF1c2VPbkZvY3VzJC5uZXh0KHZhbHVlKTtcblx0fVxuXG5cdGdldCBwYXVzZU9uRm9jdXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3BhdXNlT25Gb2N1cyQudmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogSWYgYHRydWVgLCAncHJldmlvdXMnIGFuZCAnbmV4dCcgbmF2aWdhdGlvbiBhcnJvd3Mgd2lsbCBiZSB2aXNpYmxlIG9uIHRoZSBzbGlkZS5cblx0ICpcblx0ICogQHNpbmNlIDIuMi4wXG5cdCAqL1xuXHRASW5wdXQoKSBzaG93TmF2aWdhdGlvbkFycm93cyA9IHRoaXMuX2NvbmZpZy5zaG93TmF2aWdhdGlvbkFycm93cztcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCBuYXZpZ2F0aW9uIGluZGljYXRvcnMgYXQgdGhlIGJvdHRvbSBvZiB0aGUgc2xpZGUgd2lsbCBiZSB2aXNpYmxlLlxuXHQgKlxuXHQgKiBAc2luY2UgMi4yLjBcblx0ICovXG5cdEBJbnB1dCgpIHNob3dOYXZpZ2F0aW9uSW5kaWNhdG9ycyA9IHRoaXMuX2NvbmZpZy5zaG93TmF2aWdhdGlvbkluZGljYXRvcnM7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGVtaXR0ZWQganVzdCBiZWZvcmUgdGhlIHNsaWRlIHRyYW5zaXRpb24gc3RhcnRzLlxuXHQgKlxuXHQgKiBTZWUgW2BOZ2JTbGlkZUV2ZW50YF0oIy9jb21wb25lbnRzL2Nhcm91c2VsL2FwaSNOZ2JTbGlkZUV2ZW50KSBmb3IgcGF5bG9hZCBkZXRhaWxzLlxuXHQgKi9cblx0QE91dHB1dCgpIHNsaWRlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JTbGlkZUV2ZW50PigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHJpZ2h0IGFmdGVyIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZC5cblx0ICpcblx0ICogU2VlIFtgTmdiU2xpZGVFdmVudGBdKCMvY29tcG9uZW50cy9jYXJvdXNlbC9hcGkjTmdiU2xpZGVFdmVudCkgZm9yIHBheWxvYWQgZGV0YWlscy5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRAT3V0cHV0KCkgc2xpZCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiU2xpZGVFdmVudD4oKTtcblxuXHQvKlxuXHQgKiBLZWVwIHRoZSBpZHMgb2YgdGhlIHBhbmVscyBjdXJyZW50bHkgdHJhbnNpdGlvbm5pbmdcblx0ICogaW4gb3JkZXIgdG8gYWxsb3cgb25seSB0aGUgdHJhbnNpdGlvbiByZXZlcnRpb25cblx0ICovXG5cdHByaXZhdGUgX3RyYW5zaXRpb25JZHM6IFtzdHJpbmcsIHN0cmluZ10gfCBudWxsID0gbnVsbDtcblxuXHRzZXQgbW91c2VIb3Zlcih2YWx1ZTogYm9vbGVhbikge1xuXHRcdHRoaXMuX21vdXNlSG92ZXIkLm5leHQodmFsdWUpO1xuXHR9XG5cblx0Z2V0IG1vdXNlSG92ZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX21vdXNlSG92ZXIkLnZhbHVlO1xuXHR9XG5cblx0c2V0IGZvY3VzZWQodmFsdWU6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9mb2N1c2VkJC5uZXh0KHZhbHVlKTtcblx0fVxuXG5cdGdldCBmb2N1c2VkKCkge1xuXHRcdHJldHVybiB0aGlzLl9mb2N1c2VkJC52YWx1ZTtcblx0fVxuXG5cdGFycm93TGVmdCgpIHtcblx0XHR0aGlzLmZvY3VzKCk7XG5cdFx0dGhpcy5wcmV2KE5nYlNsaWRlRXZlbnRTb3VyY2UuQVJST1dfTEVGVCk7XG5cdH1cblxuXHRhcnJvd1JpZ2h0KCkge1xuXHRcdHRoaXMuZm9jdXMoKTtcblx0XHR0aGlzLm5leHQoTmdiU2xpZGVFdmVudFNvdXJjZS5BUlJPV19SSUdIVCk7XG5cdH1cblxuXHRuZ0FmdGVyQ29udGVudEluaXQoKSB7XG5cdFx0Ly8gc2V0SW50ZXJ2YWwoKSBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoIFNTUiBhbmQgcHJvdHJhY3Rvcixcblx0XHQvLyBzbyB3ZSBzaG91bGQgcnVuIGl0IGluIHRoZSBicm93c2VyIGFuZCBvdXRzaWRlIEFuZ3VsYXJcblx0XHRpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5fcGxhdGZvcm1JZCkpIHtcblx0XHRcdHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGhhc05leHRTbGlkZSQgPSBjb21iaW5lTGF0ZXN0KFtcblx0XHRcdFx0XHR0aGlzLnNsaWRlLnBpcGUoXG5cdFx0XHRcdFx0XHRtYXAoKHNsaWRlRXZlbnQpID0+IHNsaWRlRXZlbnQuY3VycmVudCksXG5cdFx0XHRcdFx0XHRzdGFydFdpdGgodGhpcy5hY3RpdmVJZCksXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHR0aGlzLl93cmFwJCxcblx0XHRcdFx0XHR0aGlzLnNsaWRlcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKSxcblx0XHRcdFx0XSkucGlwZShcblx0XHRcdFx0XHRtYXAoKFtjdXJyZW50U2xpZGVJZCwgd3JhcF0pID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IHNsaWRlQXJyID0gdGhpcy5zbGlkZXMudG9BcnJheSgpO1xuXHRcdFx0XHRcdFx0Y29uc3QgY3VycmVudFNsaWRlSWR4ID0gdGhpcy5fZ2V0U2xpZGVJZHhCeUlkKGN1cnJlbnRTbGlkZUlkKTtcblx0XHRcdFx0XHRcdHJldHVybiB3cmFwID8gc2xpZGVBcnIubGVuZ3RoID4gMSA6IGN1cnJlbnRTbGlkZUlkeCA8IHNsaWRlQXJyLmxlbmd0aCAtIDE7XG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0ZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29tYmluZUxhdGVzdChbXG5cdFx0XHRcdFx0dGhpcy5fcGF1c2UkLFxuXHRcdFx0XHRcdHRoaXMuX3BhdXNlT25Ib3ZlciQsXG5cdFx0XHRcdFx0dGhpcy5fbW91c2VIb3ZlciQsXG5cdFx0XHRcdFx0dGhpcy5fcGF1c2VPbkZvY3VzJCxcblx0XHRcdFx0XHR0aGlzLl9mb2N1c2VkJCxcblx0XHRcdFx0XHR0aGlzLl9pbnRlcnZhbCQsXG5cdFx0XHRcdFx0aGFzTmV4dFNsaWRlJCxcblx0XHRcdFx0XSlcblx0XHRcdFx0XHQucGlwZShcblx0XHRcdFx0XHRcdG1hcChcblx0XHRcdFx0XHRcdFx0KFtwYXVzZSwgcGF1c2VPbkhvdmVyLCBtb3VzZUhvdmVyLCBwYXVzZU9uRm9jdXMsIGZvY3VzZWQsIGludGVydmFsLCBoYXNOZXh0U2xpZGVdOiBbXG5cdFx0XHRcdFx0XHRcdFx0Ym9vbGVhbixcblx0XHRcdFx0XHRcdFx0XHRib29sZWFuLFxuXHRcdFx0XHRcdFx0XHRcdGJvb2xlYW4sXG5cdFx0XHRcdFx0XHRcdFx0Ym9vbGVhbixcblx0XHRcdFx0XHRcdFx0XHRib29sZWFuLFxuXHRcdFx0XHRcdFx0XHRcdG51bWJlcixcblx0XHRcdFx0XHRcdFx0XHRib29sZWFuLFxuXHRcdFx0XHRcdFx0XHRdKSA9PlxuXHRcdFx0XHRcdFx0XHRcdHBhdXNlIHx8IChwYXVzZU9uSG92ZXIgJiYgbW91c2VIb3ZlcikgfHwgKHBhdXNlT25Gb2N1cyAmJiBmb2N1c2VkKSB8fCAhaGFzTmV4dFNsaWRlID8gMCA6IGludGVydmFsLFxuXHRcdFx0XHRcdFx0KSxcblxuXHRcdFx0XHRcdFx0ZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcblx0XHRcdFx0XHRcdHN3aXRjaE1hcCgoaW50ZXJ2YWwpID0+IChpbnRlcnZhbCA+IDAgPyB0aW1lcihpbnRlcnZhbCwgaW50ZXJ2YWwpIDogTkVWRVIpKSxcblx0XHRcdFx0XHRcdHRha2VVbnRpbERlc3Ryb3llZCh0aGlzLl9kZXN0cm95UmVmKSxcblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0LnN1YnNjcmliZSgoKSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMubmV4dChOZ2JTbGlkZUV2ZW50U291cmNlLlRJTUVSKSkpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5zbGlkZXMuY2hhbmdlcy5waXBlKHRha2VVbnRpbERlc3Ryb3llZCh0aGlzLl9kZXN0cm95UmVmKSkuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuX3RyYW5zaXRpb25JZHM/LmZvckVhY2goKGlkKSA9PiBuZ2JDb21wbGV0ZVRyYW5zaXRpb24odGhpcy5fZ2V0U2xpZGVFbGVtZW50KGlkKSkpO1xuXHRcdFx0dGhpcy5fdHJhbnNpdGlvbklkcyA9IG51bGw7XG5cblx0XHRcdHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuXG5cdFx0XHQvLyBUaGUgZm9sbG93aW5nIGNvZGUgbmVlZCB0byBiZSBkb25lIGFzeW5jaHJvbm91c2x5LCBhZnRlciB0aGUgZG9tIGJlY29tZXMgc3RhYmxlLFxuXHRcdFx0Ly8gb3RoZXJ3aXNlIGFsbCBjaGFuZ2VzIHdpbGwgYmUgdW5kb25lLlxuXHRcdFx0YWZ0ZXJOZXh0UmVuZGVyKFxuXHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCB7IGlkIH0gb2YgdGhpcy5zbGlkZXMpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9nZXRTbGlkZUVsZW1lbnQoaWQpO1xuXHRcdFx0XHRcdFx0aWYgKGlkID09PSB0aGlzLmFjdGl2ZUlkKSB7XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0eyBwaGFzZTogQWZ0ZXJSZW5kZXJQaGFzZS5NaXhlZFJlYWRXcml0ZSwgaW5qZWN0b3I6IHRoaXMuX2luamVjdG9yIH0sXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHR9XG5cblx0bmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuXHRcdGxldCBhY3RpdmVTbGlkZSA9IHRoaXMuX2dldFNsaWRlQnlJZCh0aGlzLmFjdGl2ZUlkKTtcblx0XHR0aGlzLmFjdGl2ZUlkID0gYWN0aXZlU2xpZGUgPyBhY3RpdmVTbGlkZS5pZCA6IHRoaXMuc2xpZGVzLmxlbmd0aCA/IHRoaXMuc2xpZGVzLmZpcnN0LmlkIDogJyc7XG5cdH1cblxuXHRuZ0FmdGVyVmlld0luaXQoKSB7XG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgJ2FjdGl2ZScgY2xhc3MgKG5vdCBtYW5hZ2VkIGJ5IHRoZSB0ZW1wbGF0ZSlcblx0XHRpZiAodGhpcy5hY3RpdmVJZCkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IHRoaXMuX2dldFNsaWRlRWxlbWVudCh0aGlzLmFjdGl2ZUlkKTtcblx0XHRcdGlmIChlbGVtZW50KSB7XG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyB0byBhIHNsaWRlIHdpdGggdGhlIHNwZWNpZmllZCBpZGVudGlmaWVyLlxuXHQgKi9cblx0c2VsZWN0KHNsaWRlSWQ6IHN0cmluZywgc291cmNlPzogTmdiU2xpZGVFdmVudFNvdXJjZSkge1xuXHRcdHRoaXMuX2N5Y2xlVG9TZWxlY3RlZChzbGlkZUlkLCB0aGlzLl9nZXRTbGlkZUV2ZW50RGlyZWN0aW9uKHRoaXMuYWN0aXZlSWQsIHNsaWRlSWQpLCBzb3VyY2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyB0byB0aGUgcHJldmlvdXMgc2xpZGUuXG5cdCAqL1xuXHRwcmV2KHNvdXJjZT86IE5nYlNsaWRlRXZlbnRTb3VyY2UpIHtcblx0XHR0aGlzLl9jeWNsZVRvU2VsZWN0ZWQodGhpcy5fZ2V0UHJldlNsaWRlKHRoaXMuYWN0aXZlSWQpLCBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLkVORCwgc291cmNlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgdG8gdGhlIG5leHQgc2xpZGUuXG5cdCAqL1xuXHRuZXh0KHNvdXJjZT86IE5nYlNsaWRlRXZlbnRTb3VyY2UpIHtcblx0XHR0aGlzLl9jeWNsZVRvU2VsZWN0ZWQodGhpcy5fZ2V0TmV4dFNsaWRlKHRoaXMuYWN0aXZlSWQpLCBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLlNUQVJULCBzb3VyY2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBhdXNlcyBjeWNsaW5nIHRocm91Z2ggdGhlIHNsaWRlcy5cblx0ICovXG5cdHBhdXNlKCkge1xuXHRcdHRoaXMuX3BhdXNlJC5uZXh0KHRydWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlc3RhcnRzIGN5Y2xpbmcgdGhyb3VnaCB0aGUgc2xpZGVzIGZyb20gc3RhcnQgdG8gZW5kLlxuXHQgKi9cblx0Y3ljbGUoKSB7XG5cdFx0dGhpcy5fcGF1c2UkLm5leHQoZmFsc2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgZm9jdXMgb24gdGhlIGNhcm91c2VsLlxuXHQgKi9cblx0Zm9jdXMoKSB7XG5cdFx0dGhpcy5fY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblx0fVxuXG5cdHByaXZhdGUgX2N5Y2xlVG9TZWxlY3RlZChzbGlkZUlkeDogc3RyaW5nLCBkaXJlY3Rpb246IE5nYlNsaWRlRXZlbnREaXJlY3Rpb24sIHNvdXJjZT86IE5nYlNsaWRlRXZlbnRTb3VyY2UpIHtcblx0XHRjb25zdCB0cmFuc2l0aW9uSWRzID0gdGhpcy5fdHJhbnNpdGlvbklkcztcblx0XHRpZiAodHJhbnNpdGlvbklkcyAmJiAodHJhbnNpdGlvbklkc1swXSAhPT0gc2xpZGVJZHggfHwgdHJhbnNpdGlvbklkc1sxXSAhPT0gdGhpcy5hY3RpdmVJZCkpIHtcblx0XHRcdC8vIFJldmVydCBwcmV2ZW50ZWRcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgc2VsZWN0ZWRTbGlkZSA9IHRoaXMuX2dldFNsaWRlQnlJZChzbGlkZUlkeCk7XG5cdFx0aWYgKHNlbGVjdGVkU2xpZGUgJiYgc2VsZWN0ZWRTbGlkZS5pZCAhPT0gdGhpcy5hY3RpdmVJZCkge1xuXHRcdFx0dGhpcy5fdHJhbnNpdGlvbklkcyA9IFt0aGlzLmFjdGl2ZUlkLCBzbGlkZUlkeF07XG5cdFx0XHR0aGlzLnNsaWRlLmVtaXQoe1xuXHRcdFx0XHRwcmV2OiB0aGlzLmFjdGl2ZUlkLFxuXHRcdFx0XHRjdXJyZW50OiBzZWxlY3RlZFNsaWRlLmlkLFxuXHRcdFx0XHRkaXJlY3Rpb246IGRpcmVjdGlvbixcblx0XHRcdFx0cGF1c2VkOiB0aGlzLl9wYXVzZSQudmFsdWUsXG5cdFx0XHRcdHNvdXJjZSxcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zdCBvcHRpb25zOiBOZ2JUcmFuc2l0aW9uT3B0aW9uczxOZ2JDYXJvdXNlbEN0eD4gPSB7XG5cdFx0XHRcdGFuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sXG5cdFx0XHRcdHJ1bm5pbmdUcmFuc2l0aW9uOiAnc3RvcCcsXG5cdFx0XHRcdGNvbnRleHQ6IHsgZGlyZWN0aW9uIH0sXG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB0cmFuc2l0aW9uczogQXJyYXk8T2JzZXJ2YWJsZTxhbnk+PiA9IFtdO1xuXHRcdFx0Y29uc3QgYWN0aXZlU2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQodGhpcy5hY3RpdmVJZCk7XG5cdFx0XHRpZiAoYWN0aXZlU2xpZGUpIHtcblx0XHRcdFx0Y29uc3QgYWN0aXZlU2xpZGVUcmFuc2l0aW9uID0gbmdiUnVuVHJhbnNpdGlvbihcblx0XHRcdFx0XHR0aGlzLl9uZ1pvbmUsXG5cdFx0XHRcdFx0dGhpcy5fZ2V0U2xpZGVFbGVtZW50KGFjdGl2ZVNsaWRlLmlkKSxcblx0XHRcdFx0XHRuZ2JDYXJvdXNlbFRyYW5zaXRpb25PdXQsXG5cdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0KTtcblx0XHRcdFx0YWN0aXZlU2xpZGVUcmFuc2l0aW9uLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRcdFx0YWN0aXZlU2xpZGUuc2xpZC5lbWl0KHsgaXNTaG93bjogZmFsc2UsIGRpcmVjdGlvbiwgc291cmNlIH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dHJhbnNpdGlvbnMucHVzaChhY3RpdmVTbGlkZVRyYW5zaXRpb24pO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBwcmV2aW91c0lkID0gdGhpcy5hY3RpdmVJZDtcblx0XHRcdHRoaXMuYWN0aXZlSWQgPSBzZWxlY3RlZFNsaWRlLmlkO1xuXHRcdFx0Y29uc3QgbmV4dFNsaWRlID0gdGhpcy5fZ2V0U2xpZGVCeUlkKHRoaXMuYWN0aXZlSWQpO1xuXHRcdFx0Y29uc3QgdHJhbnNpdGlvbiA9IG5nYlJ1blRyYW5zaXRpb24oXG5cdFx0XHRcdHRoaXMuX25nWm9uZSxcblx0XHRcdFx0dGhpcy5fZ2V0U2xpZGVFbGVtZW50KHNlbGVjdGVkU2xpZGUuaWQpLFxuXHRcdFx0XHRuZ2JDYXJvdXNlbFRyYW5zaXRpb25Jbixcblx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdCk7XG5cdFx0XHR0cmFuc2l0aW9uLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRcdG5leHRTbGlkZT8uc2xpZC5lbWl0KHsgaXNTaG93bjogdHJ1ZSwgZGlyZWN0aW9uLCBzb3VyY2UgfSk7XG5cdFx0XHR9KTtcblx0XHRcdHRyYW5zaXRpb25zLnB1c2godHJhbnNpdGlvbik7XG5cblx0XHRcdHppcCguLi50cmFuc2l0aW9ucylcblx0XHRcdFx0LnBpcGUodGFrZSgxKSlcblx0XHRcdFx0LnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fdHJhbnNpdGlvbklkcyA9IG51bGw7XG5cdFx0XHRcdFx0dGhpcy5zbGlkLmVtaXQoe1xuXHRcdFx0XHRcdFx0cHJldjogcHJldmlvdXNJZCxcblx0XHRcdFx0XHRcdGN1cnJlbnQ6IHNlbGVjdGVkU2xpZGUhLmlkLFxuXHRcdFx0XHRcdFx0ZGlyZWN0aW9uOiBkaXJlY3Rpb24sXG5cdFx0XHRcdFx0XHRwYXVzZWQ6IHRoaXMuX3BhdXNlJC52YWx1ZSxcblx0XHRcdFx0XHRcdHNvdXJjZSxcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gd2UgZ2V0IGhlcmUgYWZ0ZXIgdGhlIGludGVydmFsIGZpcmVzIG9yIGFueSBleHRlcm5hbCBBUEkgY2FsbCBsaWtlIG5leHQoKSwgcHJldigpIG9yIHNlbGVjdCgpXG5cdFx0dGhpcy5fY2QubWFya0ZvckNoZWNrKCk7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRTbGlkZUV2ZW50RGlyZWN0aW9uKGN1cnJlbnRBY3RpdmVTbGlkZUlkOiBzdHJpbmcsIG5leHRBY3RpdmVTbGlkZUlkOiBzdHJpbmcpOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uIHtcblx0XHRjb25zdCBjdXJyZW50QWN0aXZlU2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQoY3VycmVudEFjdGl2ZVNsaWRlSWQpO1xuXHRcdGNvbnN0IG5leHRBY3RpdmVTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChuZXh0QWN0aXZlU2xpZGVJZCk7XG5cblx0XHRyZXR1cm4gY3VycmVudEFjdGl2ZVNsaWRlSWR4ID4gbmV4dEFjdGl2ZVNsaWRlSWR4ID8gTmdiU2xpZGVFdmVudERpcmVjdGlvbi5FTkQgOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLlNUQVJUO1xuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0U2xpZGVCeUlkKHNsaWRlSWQ6IHN0cmluZyk6IE5nYlNsaWRlIHwgbnVsbCB7XG5cdFx0cmV0dXJuIHRoaXMuc2xpZGVzLmZpbmQoKHNsaWRlKSA9PiBzbGlkZS5pZCA9PT0gc2xpZGVJZCkgfHwgbnVsbDtcblx0fVxuXG5cdHByaXZhdGUgX2dldFNsaWRlSWR4QnlJZChzbGlkZUlkOiBzdHJpbmcpOiBudW1iZXIge1xuXHRcdGNvbnN0IHNsaWRlID0gdGhpcy5fZ2V0U2xpZGVCeUlkKHNsaWRlSWQpO1xuXHRcdHJldHVybiBzbGlkZSAhPSBudWxsID8gdGhpcy5zbGlkZXMudG9BcnJheSgpLmluZGV4T2Yoc2xpZGUpIDogLTE7XG5cdH1cblxuXHRwcml2YXRlIF9nZXROZXh0U2xpZGUoY3VycmVudFNsaWRlSWQ6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0Y29uc3Qgc2xpZGVBcnIgPSB0aGlzLnNsaWRlcy50b0FycmF5KCk7XG5cdFx0Y29uc3QgY3VycmVudFNsaWRlSWR4ID0gdGhpcy5fZ2V0U2xpZGVJZHhCeUlkKGN1cnJlbnRTbGlkZUlkKTtcblx0XHRjb25zdCBpc0xhc3RTbGlkZSA9IGN1cnJlbnRTbGlkZUlkeCA9PT0gc2xpZGVBcnIubGVuZ3RoIC0gMTtcblxuXHRcdHJldHVybiBpc0xhc3RTbGlkZVxuXHRcdFx0PyB0aGlzLndyYXBcblx0XHRcdFx0PyBzbGlkZUFyclswXS5pZFxuXHRcdFx0XHQ6IHNsaWRlQXJyW3NsaWRlQXJyLmxlbmd0aCAtIDFdLmlkXG5cdFx0XHQ6IHNsaWRlQXJyW2N1cnJlbnRTbGlkZUlkeCArIDFdLmlkO1xuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0UHJldlNsaWRlKGN1cnJlbnRTbGlkZUlkOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdGNvbnN0IHNsaWRlQXJyID0gdGhpcy5zbGlkZXMudG9BcnJheSgpO1xuXHRcdGNvbnN0IGN1cnJlbnRTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChjdXJyZW50U2xpZGVJZCk7XG5cdFx0Y29uc3QgaXNGaXJzdFNsaWRlID0gY3VycmVudFNsaWRlSWR4ID09PSAwO1xuXG5cdFx0cmV0dXJuIGlzRmlyc3RTbGlkZVxuXHRcdFx0PyB0aGlzLndyYXBcblx0XHRcdFx0PyBzbGlkZUFycltzbGlkZUFyci5sZW5ndGggLSAxXS5pZFxuXHRcdFx0XHQ6IHNsaWRlQXJyWzBdLmlkXG5cdFx0XHQ6IHNsaWRlQXJyW2N1cnJlbnRTbGlkZUlkeCAtIDFdLmlkO1xuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0U2xpZGVFbGVtZW50KHNsaWRlSWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcblx0XHRyZXR1cm4gdGhpcy5fY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihgI3NsaWRlLSR7c2xpZGVJZH1gKTtcblx0fVxufVxuXG4vKipcbiAqIEEgc2xpZGUgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYWZ0ZXIgdGhlIHNsaWRlIHRyYW5zaXRpb24gaXMgY29tcGxldGVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlNsaWRlRXZlbnQge1xuXHQvKipcblx0ICogVGhlIHByZXZpb3VzIHNsaWRlIGlkLlxuXHQgKi9cblx0cHJldjogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUaGUgY3VycmVudCBzbGlkZSBpZC5cblx0ICovXG5cdGN1cnJlbnQ6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIHNsaWRlIGV2ZW50IGRpcmVjdGlvbi5cblx0ICpcblx0ICogPHNwYW4gY2xhc3M9XCJiYWRnZSBiZy1pbmZvIHRleHQtZGFya1wiPnNpbmNlIDEyLjAuMDwvc3Bhbj4gUG9zc2libGUgdmFsdWVzIGFyZSBgJ3N0YXJ0JyB8ICdlbmQnYC5cblx0ICpcblx0ICogPHNwYW4gY2xhc3M9XCJiYWRnZSBiZy1zZWNvbmRhcnlcIj5iZWZvcmUgMTIuMC4wPC9zcGFuPiBQb3NzaWJsZSB2YWx1ZXMgd2VyZSBgJ2xlZnQnIHwgJ3JpZ2h0J2AuXG5cdCAqL1xuXHRkaXJlY3Rpb246IE5nYlNsaWRlRXZlbnREaXJlY3Rpb247XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgdGhlIHBhdXNlKCkgbWV0aG9kIHdhcyBjYWxsZWQgKGFuZCBubyBjeWNsZSgpIGNhbGwgd2FzIGRvbmUgYWZ0ZXJ3YXJkcykuXG5cdCAqXG5cdCAqIEBzaW5jZSA1LjEuMFxuXHQgKi9cblx0cGF1c2VkOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBTb3VyY2UgdHJpZ2dlcmluZyB0aGUgc2xpZGUgY2hhbmdlIGV2ZW50LlxuXHQgKlxuXHQgKiBQb3NzaWJsZSB2YWx1ZXMgYXJlIGAndGltZXInIHwgJ2Fycm93TGVmdCcgfCAnYXJyb3dSaWdodCcgfCAnaW5kaWNhdG9yJ2Bcblx0ICpcblx0ICogQHNpbmNlIDUuMS4wXG5cdCAqL1xuXHRzb3VyY2U/OiBOZ2JTbGlkZUV2ZW50U291cmNlO1xufVxuXG4vKipcbiAqIEEgc2xpZGUgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYWZ0ZXIgdGhlIHNsaWRlIHRyYW5zaXRpb24gaXMgY29tcGxldGVkLlxuICpcbiAqIEBzaW5jZSA4LjAuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlNpbmdsZVNsaWRlRXZlbnQge1xuXHQvKipcblx0ICogdHJ1ZSBpZiB0aGUgc2xpZGUgaXMgc2hvd24sIGZhbHNlIG90aGVyd2lzZVxuXHQgKi9cblx0aXNTaG93bjogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhlIHNsaWRlIGV2ZW50IGRpcmVjdGlvbi5cblx0ICpcblx0ICogPHNwYW4gY2xhc3M9XCJiYWRnZSBiZy1pbmZvIHRleHQtZGFya1wiPnNpbmNlIDEyLjAuMDwvc3Bhbj4gUG9zc2libGUgdmFsdWVzIGFyZSBgJ3N0YXJ0JyB8ICdlbmQnYC5cblx0ICpcblx0ICogPHNwYW4gY2xhc3M9XCJiYWRnZSBiZy1zZWNvbmRhcnlcIj5iZWZvcmUgMTIuMC4wPC9zcGFuPiBQb3NzaWJsZSB2YWx1ZXMgd2VyZSBgJ2xlZnQnIHwgJ3JpZ2h0J2AuXG5cdCAqL1xuXHRkaXJlY3Rpb246IE5nYlNsaWRlRXZlbnREaXJlY3Rpb247XG5cblx0LyoqXG5cdCAqIFNvdXJjZSB0cmlnZ2VyaW5nIHRoZSBzbGlkZSBjaGFuZ2UgZXZlbnQuXG5cdCAqXG5cdCAqIFBvc3NpYmxlIHZhbHVlcyBhcmUgYCd0aW1lcicgfCAnYXJyb3dMZWZ0JyB8ICdhcnJvd1JpZ2h0JyB8ICdpbmRpY2F0b3InYFxuXHQgKlxuXHQgKi9cblx0c291cmNlPzogTmdiU2xpZGVFdmVudFNvdXJjZTtcbn1cblxuZXhwb3J0IGVudW0gTmdiU2xpZGVFdmVudFNvdXJjZSB7XG5cdFRJTUVSID0gJ3RpbWVyJyxcblx0QVJST1dfTEVGVCA9ICdhcnJvd0xlZnQnLFxuXHRBUlJPV19SSUdIVCA9ICdhcnJvd1JpZ2h0Jyxcblx0SU5ESUNBVE9SID0gJ2luZGljYXRvcicsXG59XG4iXX0=