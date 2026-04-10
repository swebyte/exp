import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('matrixCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  private isBrowser = isPlatformBrowser(this.platformId);
  private animFrameId: number | null = null;
  private scrollObserver: IntersectionObserver | null = null;
  private resizeHandler: (() => void) | null = null;

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    this.initMatrix();
    this.initScrollAnimations();
  }

  private initMatrix() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CHARS =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF<>{}[]/\\|*#';
    const SIZE = 14;

    let drops: number[] = [];

    const syncSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cols = Math.floor(canvas.width / SIZE);
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -80));
    };
    syncSize();

    this.resizeHandler = syncSize;
    window.addEventListener('resize', this.resizeHandler);

    let frame = 0;
    const FRAME_SKIP = 3; // update every 3rd frame (~20fps)

    const tick = () => {
      this.animFrameId = requestAnimationFrame(tick);
      frame++;
      if (frame % FRAME_SKIP !== 0) return;

      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${SIZE}px "Courier New", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * SIZE;
        const y = drops[i] * SIZE;

        const rng = Math.random();
        if (rng > 0.97) {
          ctx.fillStyle = '#CCFFCC'; // bright head
        } else if (rng > 0.55) {
          ctx.fillStyle = '#00FF41'; // vivid green
        } else {
          ctx.fillStyle = '#005518'; // dim trail
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    tick();
  }

  private initScrollAnimations() {
    const elements = this.el.nativeElement.querySelectorAll('[data-animate]');

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach((el: Element) => this.scrollObserver!.observe(el));
  }

  ngOnDestroy() {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    this.scrollObserver?.disconnect();
  }
}
