import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  protected authService = inject(AuthService);

  protected firstName = signal('');
  protected lastName = signal('');
  protected email = signal('');
  protected successMessage = signal('');
  protected errorMessage = signal('');

  ngOnInit() {
    // Load user profile data
    this.loadProfileData();
  }

  loadProfileData() {
    // TODO: Load actual profile data from API
    // For now, using placeholder data
    this.firstName.set('John');
    this.lastName.set('Doe');
    this.email.set('john.doe@example.com');
  }

  saveProfile() {
    this.successMessage.set('');
    this.errorMessage.set('');

    // TODO: Implement API call to save profile
    console.log('Saving profile:', {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
    });

    this.successMessage.set('Profile updated successfully!');
  }
}
