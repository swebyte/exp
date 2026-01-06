import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

interface UserProfile {
  id: number;
  email: string;
  fullname: string;
}

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  private http = inject(HttpClient);
  protected authService = inject(AuthService);

  protected fullname = signal('');
  protected email = signal('');
  protected userId = signal<number | null>(null);
  protected loading = signal(true);
  protected successMessage = signal('');
  protected errorMessage = signal('');

  ngOnInit() {
    this.loadProfileData();
  }

  loadProfileData() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage.set('You must be logged in to view your profile');
      this.loading.set(false);
      return;
    }

    this.userId.set(userId);
    this.loading.set(true);

    this.http.get<UserProfile[]>(`${environment.apiBaseUrl}/users?id=eq.${userId}`).subscribe({
      next: (data) => {
        if (data.length > 0) {
          const user = data[0];
          this.fullname.set(user.fullname || '');
          this.email.set(user.email || '');
        } else {
          this.errorMessage.set('User profile not found');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
        this.errorMessage.set('Failed to load profile data');
        this.loading.set(false);
      },
    });
  }

  saveProfile() {
    this.successMessage.set('');
    this.errorMessage.set('');

    const userId = this.userId();
    if (!userId) {
      this.errorMessage.set('You must be logged in to update your profile');
      return;
    }

    const profileData = {
      fullname: this.fullname(),
      email: this.email(),
    };

    this.http.patch(`${environment.apiBaseUrl}/users?id=eq.${userId}`, profileData).subscribe({
      next: () => {
        this.successMessage.set('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Failed to update profile:', error);
        this.errorMessage.set('Failed to update profile. Please try again.');
      },
    });
  }
}
