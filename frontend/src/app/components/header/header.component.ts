import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SystemStatusService } from '../../services/system-status.service';
import { ThemeService } from '../../services/theme.service';
import { BrokerageConnectModalComponent } from '../brokerage-connect/brokerage-connect-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BrokerageConnectModalComponent],
  template: `
    <header class="bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 sticky top-0 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Desktop Navigation -->
          <div class="flex items-center gap-8">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer" routerLink="/">
              <div class="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" class="opacity-50"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" class="text-gray-900 dark:text-white"></path>
                </svg>
              </div>
              <h1 class="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none hidden sm:block">NEXUS<span class="text-indigo-500">AI</span></h1>
            </div>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center space-x-1">
              <div class="relative group">
                <button class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                  Overview
                  <svg class="w-4 h-4 text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <!-- Dropdown -->
                <div class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                  <div class="py-1">
                    <a routerLink="/dashboard" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Dashboard</a>
                    <a routerLink="/pricing" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Pricing Plans</a>
                    <a routerLink="/system-status" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">System Health</a>
                    <a routerLink="/predictions" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Market Predictions</a>
                    <a routerLink="/agents" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Agent Network</a>
                  </div>
                </div>
              </div>

              <div class="relative group">
                <button class="px-3 py-2 pb-[9px] text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                  Trading
                  <svg class="w-4 h-4 text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div class="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                  <div class="py-1">
                    <a routerLink="/forecasting-dashboard" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Forecast Dashboard</a>
                    <a routerLink="/ticker-discovery" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Market Opportunity Scanner</a>
                    <a routerLink="/reports" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Intelligence Reports</a>
                    <a routerLink="/symbol-management" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Portfolio Universe</a>
                  </div>
                </div>
              </div>

               <div class="relative group">
                <button class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                  Analytics
                  <svg class="w-4 h-4 text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div class="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                  <div class="py-1">
                    <a routerLink="/analytics" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Deep Analytics</a>
                    <a routerLink="/risk-analysis" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Risk Intelligence</a>
                    <a routerLink="/ab-testing" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Strategy Optimization Lab</a>
                  </div>
                </div>
              </div>

              <div class="relative group">
                <button class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                  AI Agents
                  <svg class="w-4 h-4 text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div class="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                  <div class="py-1">
                    <a routerLink="/agent-monitor" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Agent Command Center</a>
                    <a routerLink="/agent-router" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Task Routing Engine</a>
                    <a routerLink="/execution-agent" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Trade Execution Core</a>
                    <a routerLink="/rag-event-agent" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Market Event Synthesizer</a>
                    <a routerLink="/rl-strategy-agent" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Alpha Strategy Engine</a>
                    <a routerLink="/meta-evaluation-agent" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Performance Auditor</a>
                    <a routerLink="/latent-pattern-detector" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Deep Pattern Recognizer</a>
                    <a routerLink="/ensemble-blender" class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">Consensus Signal Matrix</a>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <!-- Right Buttons -->
          <div class="flex items-center gap-4">
             <!-- Status -->
             <div class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-white/5">
                <div class="relative flex h-2.5 w-2.5">
                  <span *ngIf="systemStatus === 'Online'" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span [class]="getStatusIndicatorClass()"></span>
                </div>
                <span class="text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">{{ systemStatus }}</span>
            </div>

            <!-- Theme Toggle -->
            <button (click)="themeService.toggleTheme()" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-colors focus:outline-none" aria-label="Toggle Theme">
              <svg *ngIf="(themeService.isDarkMode$ | async)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <svg *ngIf="!(themeService.isDarkMode$ | async)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>

            <div class="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

            <button *ngIf="!isConnected" (click)="showBrokerageModal = true" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400/50 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              Connect Brokerage
            </button>

             <button *ngIf="isConnected" class="hidden sm:flex px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold transition-all border border-emerald-500/20 items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Trading Active
            </button>
          </div>
        </div>
      </div>

      <!-- Brokerage Modal -->
      <app-brokerage-connect-modal *ngIf="showBrokerageModal" (close)="onModalClose()" (connected)="onConnected()"></app-brokerage-connect-modal>
    </header>
  `,
  styles: []
})
export class HeaderComponent implements OnInit, OnDestroy {
  systemStatus = 'Online';
  refreshInterval: any;
  showBrokerageModal = false;
  isConnected = false;

  constructor(
    private systemStatusService: SystemStatusService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.refreshInterval = setInterval(() => {
        // Mock update
    }, 30000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  onModalClose() {
    this.showBrokerageModal = false;
  }

  onConnected() {
    this.isConnected = true;
    this.showBrokerageModal = false;
  }

  getStatusIndicatorClass(): string {
    const baseClass = 'relative inline-flex rounded-full h-2.5 w-2.5';
    switch (this.systemStatus) {
      case 'Online': return `${baseClass} bg-emerald-500`;
      case 'Offline': return `${baseClass} bg-red-500`;
      case 'Warning': return `${baseClass} bg-amber-500`;
      default: return `${baseClass} bg-slate-500`;
    }
  }
}
