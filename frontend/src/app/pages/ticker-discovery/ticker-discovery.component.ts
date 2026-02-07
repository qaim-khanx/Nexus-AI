import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
  selector: 'app-ticker-discovery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen">
      <!-- Header -->
      <div class="bg-[#111827]/50 border-b border-white/5 backdrop-blur-md sticky top-0 z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-white tracking-tight">Ticker Discovery</h1>
                <p class="mt-1 text-slate-400">Market Scanner & Strategic Opportunity Ranker</p>
              </div>
              <div class="flex items-center space-x-4">
                <button (click)="scanMarket()"
                        [disabled]="scanning"
                        class="btn btn-primary flex items-center gap-2">
                  <span *ngIf="!scanning">Scan Market</span>
                  <span *ngIf="scanning">Scanning...</span>
                  <svg *ngIf="scanning" class="animate-spin h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </button>
                <div class="text-right">
                  <div class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Last Updated</div>
                  <div class="text-sm font-medium text-slate-300 font-mono">{{ lastUpdated | date:'mediumTime' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5 backdrop-blur-sm">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-xs font-bold text-blue-400 uppercase tracking-wider">Total Scanned</p>
                <p class="text-2xl font-bold text-white">{{ scannerSummary?.total_scanned || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-sm">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                  <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Triggers Found</p>
                <p class="text-2xl font-bold text-white">{{ scannerSummary?.triggers_found || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-amber-900/10 border border-amber-500/20 rounded-xl p-5 backdrop-blur-sm">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                  <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-xs font-bold text-amber-400 uppercase tracking-wider">High Priority</p>
                <p class="text-2xl font-bold text-white">{{ scannerSummary?.high_priority || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-purple-900/10 border border-purple-500/20 rounded-xl p-5 backdrop-blur-sm">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-xs font-bold text-purple-400 uppercase tracking-wider">Avg Confidence</p>
                <p class="text-2xl font-bold text-white">{{ (scannerSummary?.avg_confidence || 0) | number:'1.1-1' }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="card mb-8">
          <div class="card-header">
             <h3 class="text-xl font-bold text-white tracking-tight">System Status</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-slate-800/30 border border-white/5 rounded-xl p-5">
                <h4 class="font-bold text-white mb-2">Market Scanner Integration</h4>
                <p class="text-sm text-slate-400 mb-4 leading-relaxed">
                  Scans the market universe for opportunities based on various triggers like volatility, volume, momentum, and breakout patterns.
                </p>
                <div class="flex space-x-6 text-xs text-slate-400 font-mono border-t border-white/5 pt-3">
                  <div>SCANNED: <span class="text-white">{{ scannerSummary?.total_scanned || 0 }}</span></div>
                  <div>TRIGGERS: <span class="text-white">{{ scannerSummary?.triggers_found || 0 }}</span></div>
                  <div>PRIORITY: <span class="text-white">{{ scannerSummary?.high_priority || 0 }}</span></div>
                </div>
              </div>

              <div class="bg-slate-800/30 border border-white/5 rounded-xl p-5">
                <h4 class="font-bold text-white mb-2">Opportunity Ranker AI</h4>
                <p class="text-sm text-slate-400 mb-4 leading-relaxed">
                  Ranks ticker opportunities based on multiple criteria including Sharpe ratio, confidence, risk-adjusted return, and technical strength.
                </p>
                <div class="flex space-x-6 text-xs text-slate-400 font-mono border-t border-white/5 pt-3">
                  <div>RANKED: <span class="text-white">{{ rankerSummary?.total_ranked || 0 }}</span></div>
                  <div>SCORE: <span class="text-white">{{ (rankerSummary?.avg_score || 0) | number:'1.2-2' }}</span></div>
                  <div>CONF: <span class="text-white">{{ (rankerSummary?.avg_confidence || 0) | number:'1.1-1' }}%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Discovered Tickers Section -->
        <div *ngIf="discoveredTickers.length > 0" class="animate-fade-in-up">
          <div class="card">
            <div class="card-header">
              <div class="flex justify-between items-center w-full">
                <div>
                  <h3 class="text-xl font-bold text-white tracking-tight">Discovered Opportunities</h3>
                  <p class="text-xs text-slate-400 uppercase tracking-widest mt-1">Live Feed</p>
                </div>
                <button (click)="toggleHistory()"
                        class="btn btn-secondary text-xs">
                  <span *ngIf="!showHistory">Show History</span>
                  <span *ngIf="showHistory">Hide History</span>
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="table">
                <thead class="table-header">
                  <tr>
                    <th class="table-header-cell">Symbol</th>
                    <th class="table-header-cell">Trigger</th>
                    <th class="table-header-cell">Priority</th>
                    <th class="table-header-cell">Confidence</th>
                    <th class="table-header-cell">Score</th>
                    <th class="table-header-cell">Analysis</th>
                    <th class="table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr *ngFor="let ticker of discoveredTickers" class="table-row">
                    <td class="table-cell">
                      <span class="text-sm font-bold text-indigo-400">{{ ticker.symbol }}</span>
                    </td>
                    <td class="table-cell">
                      <span class="text-xs font-medium text-slate-300 px-2 py-1 bg-slate-800 rounded border border-white/10 uppercase">{{ ticker.trigger }}</span>
                    </td>
                    <td class="table-cell">
                      <span class="status-indicator"
                            [ngClass]="ticker.priority === 'high' ? 'status-error' : (ticker.priority === 'medium' ? 'status-warning' : 'status-idle')">
                        {{ ticker.priority }}
                      </span>
                    </td>
                    <td class="table-cell font-mono text-slate-300">
                      {{ (ticker.confidence * 100) | number:'1.0-0' }}%
                    </td>
                    <td class="table-cell font-mono text-slate-300">
                      {{ ticker.score }}
                    </td>
                    <td class="table-cell max-w-xs truncate text-slate-400 text-xs">
                       {{ ticker.description }}
                    </td>
                    <td class="table-cell">
                            <button (click)="addToPortfolio(ticker)"
                                      [disabled]="addingToPortfolio[ticker.symbol] || isInPortfolio(ticker.symbol)"
                                      class="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all border border-transparent"
                                      [class]="isInPortfolio(ticker.symbol)
                                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default'
                                                  : addingToPortfolio[ticker.symbol]
                                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20'">
                                <span *ngIf="addingToPortfolio[ticker.symbol]">Adding...</span>
                                <span *ngIf="!addingToPortfolio[ticker.symbol] && !isInPortfolio(ticker.symbol)">Add to Portfolio</span>
                                <span *ngIf="isInPortfolio(ticker.symbol)">In Portfolio</span>
                              </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- History Section -->
        <div *ngIf="showHistory && scanHistory.length > 0" class="mt-8 animate-fade-in-up">
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-bold text-white">Discovery History</h3>
              <p class="text-xs text-slate-400 uppercase tracking-widest mt-1">Previous Scan Logs</p>
            </div>
            <div class="overflow-x-auto">
              <table class="table">
                <thead class="table-header">
                  <tr>
                    <th class="table-header-cell">Date/Time</th>
                    <th class="table-header-cell">Total Scanned</th>
                    <th class="table-header-cell">Triggers Found</th>
                    <th class="table-header-cell">High Priority</th>
                    <th class="table-header-cell">Avg Confidence</th>
                    <th class="table-header-cell">Status</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr *ngFor="let scan of scanHistory" class="table-row">
                    <td class="table-cell font-mono text-slate-400">
                      {{ scan.timestamp | date:'MMM d, h:mm:ss a' }}
                    </td>
                    <td class="table-cell font-mono">
                      {{ scan.total_scanned }}
                    </td>
                    <td class="table-cell font-mono">
                      {{ scan.triggers_found }}
                    </td>
                    <td class="table-cell font-mono text-amber-400">
                      {{ scan.high_priority }}
                    </td>
                    <td class="table-cell font-mono">
                      {{ scan.avg_confidence | number:'1.1-1' }}%
                    </td>
                    <td class="table-cell">
                      <span class="status-indicator status-active">
                        {{ scan.status || 'Completed' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex flex-col items-center justify-center py-20">
          <div class="loading-spinner mb-4"></div>
          <span class="text-slate-400 text-sm animate-pulse">Initializing market scanner...</span>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 mt-6">
          <svg class="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-red-400">{{ error }}</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TickerDiscoveryComponent implements OnInit, OnDestroy {
  scannerSummary: any = null;
  rankerSummary: any = null;
  discoveredTickers: any[] = [];
  loading = true;
  scanning = false;
  error: string | null = null;
  lastUpdated: Date = new Date();
  addingToPortfolio: { [key: string]: boolean } = {};
  portfolioSymbols: string[] = [];
  showHistory: boolean = false;
  scanHistory: any[] = [];

  private refreshSubscription: Subscription = new Subscription();

  constructor(private http: HttpClient, private modalService: ModalService) {}

  ngOnInit() {
    this.loadData();
    this.loadDiscoveredTickers();
    this.loadPortfolioSymbols();

    // Refresh data every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadData();
      this.loadDiscoveredTickers();
      this.loadPortfolioSymbols();
    });
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }

  loadData() {
    this.loading = true;
    this.error = null;

    // Load scanner summary
    this.http.get<any>('http://localhost:8001/ticker-discovery/scanner-summary').subscribe({
      next: (data) => {
        this.scannerSummary = data;
        this.lastUpdated = new Date();
      },
      error: (err) => {
        console.error('Error loading scanner summary:', err);
        // this.error = 'Failed to load scanner summary'; // Optional: Be less aggressive with error showing
      }
    });

    // Load ranker summary
    this.http.get<any>('http://localhost:8001/ticker-discovery/ranker-summary').subscribe({
      next: (data) => {
        this.rankerSummary = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading ranker summary:', err);
        this.loading = false;
      }
    });
  }

  scanMarket() {
    this.scanning = true;
    this.error = null; // Clear any previous errors
    this.http.post<any>('http://localhost:8001/ticker-discovery/scan-market', {}).subscribe({
      next: (data) => {
        this.scanning = false;
        this.lastUpdated = new Date();
        // Reload data after scan including discovered tickers
        this.loadData();
        this.loadDiscoveredTickers();
      },
      error: (err) => {
        console.error('Error scanning market:', err);
        this.scanning = false;
        this.error = 'Failed to scan market';
      }
    });
  }

  loadDiscoveredTickers() {
    this.http.get<any>('http://localhost:8001/ticker-discovery/scan-details').subscribe({
      next: (data) => {
        this.discoveredTickers = data.discovered_tickers || [];
      },
      error: (err) => {
        console.error('Error loading discovered tickers:', err);
      }
    });
  }

  loadPortfolioSymbols() {
    this.http.get<any>('http://localhost:8001/api/symbols').subscribe({
      next: (response) => {
        const symbols = response.symbols || [];
        this.portfolioSymbols = symbols.map((s: any) => s.symbol?.toUpperCase()).filter(Boolean);
      },
      error: (err) => {
        console.error('Error loading portfolio symbols:', err);
      }
    });
  }

  isInPortfolio(symbol: string): boolean {
    return this.portfolioSymbols.includes(symbol?.toUpperCase());
  }

  addToPortfolio(ticker: any) {
    const symbol = ticker.symbol?.toUpperCase();
    if (!symbol || this.isInPortfolio(symbol) || this.addingToPortfolio[symbol]) {
      return;
    }

    this.addingToPortfolio[symbol] = true;

    const symbolData = {
      symbol: symbol,
      name: this.getSymbolName(ticker),
      sector: ticker.sector || 'Technology',
      industry: ticker.industry || 'General'
    };

    this.http.post<any>('http://localhost:8001/symbols/add-from-discovery', symbolData).subscribe({
      next: (response) => {
        this.addingToPortfolio[symbol] = false;
        if (response.success) {
          // Add to portfolio symbols list
          this.portfolioSymbols.push(symbol);
          console.log(`✅ Successfully added ${symbol} to symbol management`);
          // Show user confirmation with modal
          const message = `${symbol} added to Symbol Management. Check Portfolio Management page to see it.`;
          this.modalService.success(message, 'Symbol Added');
        }
      },
      error: (err) => {
        console.error(`Error adding ${symbol} to portfolio:`, err);
        this.addingToPortfolio[symbol] = false;
        const errorMessage = `Failed to add ${symbol} to portfolio: ${err.error?.detail || 'Unknown error'}`;
        this.modalService.error(errorMessage, 'Failed to Add Symbol');
      }
    });
  }

  private getSymbolName(ticker: any): string {
    return ticker.name || ticker.symbol || `${ticker.symbol} Corporation`;
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.showHistory && this.scanHistory.length === 0) {
      this.loadScanHistory();
    }
  }

  loadScanHistory() {
    this.http.get<any>('http://localhost:8001/ticker-discovery/history').subscribe({
      next: (history) => {
        this.scanHistory = history || [];
        console.log('📋 Loaded ticker discovery history:', this.scanHistory);
      },
      error: (err) => {
        console.error('Error loading scan history:', err);
      }
    });
  }
}
