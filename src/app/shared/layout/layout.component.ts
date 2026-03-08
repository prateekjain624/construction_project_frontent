import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="flex flex-col md:flex-row h-screen bg-gray-100">
      <!-- Mobile Header -->
      <div class="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">Construction Dashboard</h1>
        <button (click)="toggleMenu()" class="text-white focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  [attr.d]="menuOpen() ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
          </svg>
        </button>
      </div>

      <!-- Sidebar -->
      <aside [class.hidden]="!menuOpen() && isMobile()" 
             class="w-full md:w-64 bg-gray-800 text-white md:block">
        <div class="p-4 hidden md:block">
          <h1 class="text-2xl font-bold">Construction Dashboard</h1>
        </div>
        <nav class="mt-0 md:mt-8">
          <a routerLink="/dashboard" routerLinkActive="bg-gray-700" 
             (click)="closeMenuOnMobile()"
             class="block px-4 py-3 hover:bg-gray-700 transition">
            📊 Dashboard
          </a>
          <a routerLink="/projects" routerLinkActive="bg-gray-700"
             (click)="closeMenuOnMobile()"
             class="block px-4 py-3 hover:bg-gray-700 transition">
            🏗️ Projects
          </a>
          <a routerLink="/investors" routerLinkActive="bg-gray-700"
             (click)="closeMenuOnMobile()"
             class="block px-4 py-3 hover:bg-gray-700 transition">
            💰 Investors
          </a>
          <a routerLink="/expenses" routerLinkActive="bg-gray-700"
             (click)="closeMenuOnMobile()"
             class="block px-4 py-3 hover:bg-gray-700 transition">
            💸 Expenses
          </a>
          <a routerLink="/payments" routerLinkActive="bg-gray-700"
             (click)="closeMenuOnMobile()"
             class="block px-4 py-3 hover:bg-gray-700 transition">
            💳 Payments
          </a>
        </nav>
        <div class="p-4 mt-4 md:absolute md:bottom-0 md:w-64">
          <button (click)="logout()" 
                  class="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class LayoutComponent {
  private authService = inject(AuthService);
  menuOpen = signal(false);
  isMobile = signal(window.innerWidth < 768);

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < 768);
      if (!this.isMobile()) {
        this.menuOpen.set(false);
      }
    });
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenuOnMobile() {
    if (this.isMobile()) {
      this.menuOpen.set(false);
    }
  }

  logout() {
    this.authService.logout();
  }
}
