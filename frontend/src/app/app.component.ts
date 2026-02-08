import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SystemStatusService } from './services/system-status.service';
import { ModalComponent } from './shared/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-300 flex flex-col transition-colors duration-300">
      <!-- Demo Info Banner -->
      <div class="demo-banner bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-2 px-4 text-center text-sm font-medium shadow-lg">
        <div class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <span>🚀 <strong>Live Demo</strong> - Explore all features with simulated data. No signup required!</span>
        </div>
      </div>

      <!-- Header - Sticky & Glassmorphism -->
      <app-header></app-header>

      <!-- Main Content -->
      <main class="flex-1 w-full">
        <div class="animate-fade-in-up">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <app-footer></app-footer>

      <!-- Global Modal -->
      <app-modal></app-modal>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'AI Market Analysis System';

  constructor(private systemStatusService: SystemStatusService) {}

  ngOnInit() {
    // Initialize system status monitoring
    this.systemStatusService.startPolling();
  }
}
