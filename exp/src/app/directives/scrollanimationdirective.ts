import { Directive, ElementRef, NgZone, Renderer2, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appScrollAnimation]'
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
    @Input() threshold: number | number[] = [0.4, 0.8];

  private observer: IntersectionObserver ;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.initIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initIntersectionObserver() {
    const options = {
      threshold: this.threshold
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, 'visible');
        } else {
          // this.renderer.removeClass(this.el.nativeElement, 'visible');
        }
      });
    };

    // Use NgZone.runOutsideAngular to avoid change detection during scrolling
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(callback, options);
      this.observer.observe(this.el.nativeElement);
    });
  }
}
