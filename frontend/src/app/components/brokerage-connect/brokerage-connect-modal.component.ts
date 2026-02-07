import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-brokerage-connect-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" (click)="close.emit()"></div>

      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-white/10"
             [@modalAnimation]>

          <!-- Header -->
          <div class="bg-gray-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
            <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-2" id="modal-title">
              <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Connect Brokerage
            </h3>
            <button (click)="close.emit()" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-4 py-5 sm:p-6" *ngIf="!isConnecting && !isConnected">
            <p class="text-sm text-gray-500 dark:text-slate-400 mb-4">
              Select your brokerage to securely connect your portfolio.
            </p>

            <div class="grid grid-cols-2 gap-3">
              <button *ngFor="let broker of brokers" (click)="connect(broker)"
                class="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-200 group">
                <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span class="text-lg">{{ broker.icon }}</span>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ broker.name }}</span>
              </button>
            </div>

            <div class="mt-6 text-center">
                <p class="text-xs text-gray-400 dark:text-slate-500">
                    <span class="flex items-center justify-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        Bank-level 256-bit encryption
                    </span>
                </p>
            </div>
          </div>

          <!-- Connecting State -->
          <div class="px-4 py-12 sm:p-12 text-center" *ngIf="isConnecting">
            <div class="inline-block relative w-16 h-16 mb-4">
                <div class="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full"></div>
                <div class="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Connecting to {{ selectedBroker?.name }}...</h3>
            <p class="text-sm text-gray-500 dark:text-slate-400">Verifying credentials and synchronizing portfolio data.</p>
          </div>

          <!-- Success State -->
          <div class="px-4 py-12 sm:p-12 text-center" *ngIf="isConnected">
             <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20 mb-4 animate-bounce-short">
                <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Successfully Connected!</h3>
            <p class="text-sm text-gray-500 dark:text-slate-400 mb-6">
                Your {{ selectedBroker?.name }} portfolio has been synced.
            </p>
            <button (click)="finish()" class="w-full inline-flex justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
                Go to Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ],
  styles: [`
    .animate-bounce-short {
        animation: bounce-short 1s;
    }
    @keyframes bounce-short {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-25%); }
    }
  `]
})
export class BrokerageConnectModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() connected = new EventEmitter<void>();

  isConnecting = false;
  isConnected = false;
  selectedBroker: any = null;

  brokers = [
    { name: 'Robinhood', icon: '🏹' },
    { name: 'E*TRADE', icon: '📈' },
    { name: 'Charles Schwab', icon: '💎' },
    { name: 'Fidelity', icon: '🏛️' },
    { name: 'Coinbase', icon: '🪙' },
    { name: 'Binance', icon: '🔶' }
  ];

  connect(broker: any) {
    this.selectedBroker = broker;
    this.isConnecting = true;

    // Simulate connection delay
    setTimeout(() => {
        this.isConnecting = false;
        this.isConnected = true;
    }, 2500);
  }

  finish() {
    this.connected.emit();
    this.close.emit();
  }
}
