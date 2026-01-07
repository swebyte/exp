import { Component, Input, ElementRef, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, stagger } from 'animejs';
import { splitText } from 'animejs/text';

@Component({
  selector: 'app-animated-text',
  standalone: true,
  template: '<span #textElement>{{ text }}</span>',
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class AnimatedTextComponent implements AfterViewInit {
  @Input() text: string = '';

  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  ngAfterViewInit() {
    if (this.isBrowser) {
      const textElement = this.elementRef.nativeElement.querySelector('span');
      if (textElement) {
        // Use splitText to split into characters
        const { chars } = splitText(textElement, {
          chars: true,
        });

        // Animate characters one by one
        animate(chars, {
          opacity: [0, 1],
          translateY: [-20, 0],
          scale: [0, 1],
          duration: 300,
          delay: stagger(50),
          ease: 'out(3)',
        });
      }
    }
  }
}
