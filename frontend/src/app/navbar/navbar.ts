import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login';
import { AnimatedTextComponent } from '../animated-text/animated-text';
import { AuthService } from '../services/auth.service';

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
