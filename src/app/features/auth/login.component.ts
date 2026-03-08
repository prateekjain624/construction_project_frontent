import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 class="text-2xl font-bold mb-6 text-center">Construction Dashboard</h2>
        
        <div class="mb-4">
          <button (click)="isLogin = true" 
                  [class.bg-blue-600]="isLogin"
                  [class.bg-gray-300]="!isLogin"
                  class="w-1/2 py-2 text-white rounded-l">
            Login
          </button>
          <button (click)="isLogin = false"
                  [class.bg-blue-600]="!isLogin"
                  [class.bg-gray-300]="isLogin"
                  class="w-1/2 py-2 text-white rounded-r">
            Register
          </button>
        </div>

        <form (ngSubmit)="submit()">
          @if (!isLogin) {
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Name</label>
              <input [(ngModel)]="name" name="name" type="text" required
                     class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          }

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Email</label>
            <input [(ngModel)]="email" name="email" type="email" required
                   class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 mb-2">Password</label>
            <input [(ngModel)]="password" name="password" type="password" required
                   class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          @if (error) {
            <div class="mb-4 text-red-600 text-sm">{{ error }}</div>
          }

          <button type="submit" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">
            {{ isLogin ? 'Login' : 'Register' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = true;
  name = '';
  email = '';
  password = '';
  error = '';

  submit() {
    this.error = '';
    const action = this.isLogin 
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.name, this.email, this.password);

    action.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.error = err.error?.message || 'An error occurred'
    });
  }
}
