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
