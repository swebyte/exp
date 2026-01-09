import { Component, inject, signal, OnDestroy } from '@angular/core';
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
  private modalService = inject(NgbModal);
  protected authService = inject(AuthService);
  private router = inject(Router);
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
