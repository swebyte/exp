import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';

@Component({
  selector: 'app-iframe',
  imports: [],
  templateUrl: './iframe.html',
  styleUrl: './iframe.scss',
})
export class IframeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('embed', { static: true }) iframeRef!: ElementRef<HTMLIFrameElement>;

  buttonLabel = 'Enter fullscreen';

  private boundUpdate = this.updateButton.bind(this);

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    // Listen for fullscreen changes on the document
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('fullscreenchange', this.boundUpdate);
      document.addEventListener('webkitfullscreenchange', this.boundUpdate as EventListener);
      document.addEventListener('mozfullscreenchange', this.boundUpdate as EventListener);
    });
    this.updateButton();
  }

  ngOnDestroy(): void {
    document.removeEventListener('fullscreenchange', this.boundUpdate);
    document.removeEventListener('webkitfullscreenchange', this.boundUpdate as EventListener);
    document.removeEventListener('mozfullscreenchange', this.boundUpdate as EventListener);
  }

  private updateButton(): void {
    const isFs = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement
    );
    this.ngZone.run(() => (this.buttonLabel = isFs ? 'Exit fullscreen' : 'Enter fullscreen'));
  }

  async toggleFullscreen(): Promise<void> {
    const doc: any = document;
    const iframeEl = this.iframeRef?.nativeElement;
    try {
      if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement) {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) (doc as any).webkitExitFullscreen();
      } else {
        if (!iframeEl) return;
        if (iframeEl.requestFullscreen) await iframeEl.requestFullscreen();
        else if ((iframeEl as any).webkitRequestFullscreen)
          (iframeEl as any).webkitRequestFullscreen();
        else if ((iframeEl as any).mozRequestFullScreen) (iframeEl as any).mozRequestFullScreen();
      }
    } catch (e) {
      // If requesting fullscreen on cross-origin iframe fails, fall back to making the wrapper fullscreen
      try {
        const wrapper = this.iframeRef.nativeElement.parentElement as any;
        if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement) {
          if (doc.exitFullscreen) await doc.exitFullscreen();
        } else {
          if (wrapper.requestFullscreen) await wrapper.requestFullscreen();
          else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
        }
      } catch (err) {
        console.error('Fullscreen toggle failed', err);
      }
    }
  }
}
