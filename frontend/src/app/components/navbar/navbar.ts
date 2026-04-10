import { Component, inject, signal, OnDestroy, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { NgbCollapse, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login';
import { AnimatedTextComponent } from '../animated-text/animated-text';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgbCollapse, AnimatedTextComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  isMenuCollapsed = true;
  isScrolled = signal(false);

  private modalService = inject(NgbModal);
  protected authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.isBrowser) {
      this.isScrolled.set(window.scrollY > 20);
    }
  }

  private _routerSub = this.router.events.subscribe((ev) => {
    if (ev instanceof NavigationEnd) {
      // Close the mobile menu when navigation finishes on small screens
      if (typeof window !== 'undefined' && window.innerWidth < 992) {
        this.isMenuCollapsed = true;
      }
    }
  });

  ngOnDestroy(): void {
    this._routerSub?.unsubscribe();
  }

  openLogin() {
    const modalRef = this.modalService.open(LoginComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        console.log('Login successful:', result);
      },
      (reason) => {
        console.log('Login dismissed');
      }
    );
  }

  logout() {
    this.authService.logout();
    console.log('User logged out');
  }
}
