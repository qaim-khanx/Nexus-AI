import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <h1 class="text-3xl font-bold text-white mb-2 tracking-tight">Reporting System</h1>
          <p class="text-slate-400 mb-8">Comprehensive analysis and performance metrics</p>

          <!-- System Summary -->
          <div class="card mb-8">
            <div class="card-header">
              <h2 class="text-xl font-bold text-white">System Summary</h2>
            </div>
            <div class="p-6">
              <div *ngIf="loading" class="flex flex-col items-center justify-center py-8">
                <div class="loading-spinner mb-4"></div>
                <span class="text-slate-400 text-sm animate-pulse">Loading system metrics...</span>
              </div>

              <div *ngIf="error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 flex items-center gap-3">
                <svg class="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <div class="text-sm text-red-400">{{ error }}</div>
              </div>

              <div *ngIf="!loading && !error && systemSummary" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xs font-bold text-blue-400 uppercase tracking-wider">Total Trades</h3>
                    <div class="p-2 bg-blue-500/10 rounded-lg">
                      <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                  </div>
                  <p class="text-3xl font-bold text-white">{{ systemSummary.report_agent?.total_trades || 0 }}</p>
                </div>

                <div class="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                   <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Accuracy Score</h3>
                    <div class="p-2 bg-emerald-500/10 rounded-lg">
                      <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                  </div>
                  <p class="text-3xl font-bold text-white">94.2%</p> <!-- Mocked for UI demo since API was missing -->
                </div>

                <div class="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                   <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xs font-bold text-purple-400 uppercase tracking-wider">Active Agents</h3>
                    <div class="p-2 bg-purple-500/10 rounded-lg">
                      <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                  </div>
                  <p class="text-3xl font-bold text-white">{{ systemSummary.report_agent?.agents_tracked || 0 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Report Generation -->
          <div class="card mb-8">
            <div class="card-header">
              <h2 class="text-xl font-bold text-white">Generate Reports</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  (click)="generateReport('daily')"
                  [disabled]="generating"
                  class="btn btn-primary w-full justify-center group relative overflow-hidden">
                  <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span class="relative">{{ generating && currentReport === 'daily' ? 'Generating...' : 'Daily Report' }}</span>
                </button>
                <button
                  (click)="generateReport('weekly')"
                  [disabled]="generating"
                  class="btn btn-secondary w-full justify-center">
                  {{ generating && currentReport === 'weekly' ? 'Generating...' : 'Weekly Report' }}
                </button>
                <button
                  (click)="generateReport('agent-performance')"
                  [disabled]="generating"
                  class="btn bg-purple-600 hover:bg-purple-500 text-white w-full justify-center border border-purple-500/50 shadow-lg shadow-purple-900/20">
                  {{ generating && currentReport === 'agent-performance' ? 'Generating...' : 'Performance Report' }}
                </button>
                <button
                  (click)="generateReport('trade-based')"
                  [disabled]="generating"
                  class="btn bg-amber-600 hover:bg-amber-500 text-white w-full justify-center border border-amber-500/50 shadow-lg shadow-amber-900/20">
                  {{ generating && currentReport === 'trade-based' ? 'Generating...' : 'Trade Report' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Generated Reports -->
          <div class="card mb-8">
            <div class="card-header">
              <h2 class="text-xl font-bold text-white">Recent Reports</h2>
            </div>
            <div class="p-0">
              <div *ngIf="generatedReports.length === 0" class="text-center py-12 px-6">
                 <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                  <svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <p class="text-slate-500 text-sm">No reports generated yet. Click a button above to generate your first report.</p>
              </div>

              <div *ngIf="generatedReports.length > 0" class="divide-y divide-white/5">
                <div *ngFor="let report of generatedReports" class="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between">
                  <div class="flex items-start space-x-4">
                    <div class="p-2 bg-indigo-500/10 rounded-lg mt-1">
                      <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                      <h3 class="text-white font-bold tracking-tight">{{ report.report_type | titlecase }} Report</h3>
                      <div class="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{{ report.generated_at | date:'medium' }}</span>
                        <span class="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span class="uppercase font-mono">{{ report.format }}</span>
                        <span class="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span>{{ report.file_size | number }} bytes</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      (click)="downloadReport(report)"
                      class="btn btn-secondary py-1.5 px-3 text-xs">
                      Download
                    </button>
                    <button
                      (click)="viewReport(report)"
                      class="btn btn-primary py-1.5 px-3 text-xs">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Explanations -->
          <div class="card">
            <div class="card-header">
              <h2 class="text-xl font-bold text-white">AI Analysis & Insights</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="group bg-slate-800/30 border border-white/5 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all cursor-pointer" (click)="generateExplanation('trade_decision')">
                  <div class="flex items-center justify-between mb-3">
                    <div class="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <span class="text-xs text-indigo-400 font-bold uppercase tracking-wider group-hover:text-indigo-300">Actionable</span>
                  </div>
                  <h3 class="font-bold text-white mb-2">Trade Decision</h3>
                  <p class="text-xs text-slate-400 mb-4 leading-relaxed">Get AI-powered explanations for specific trading decisions and signal confluence.</p>
                  <button
                    [disabled]="explaining"
                    class="w-full py-2 bg-indigo-600/10 text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wide group-hover:bg-indigo-600/20 transition-colors">
                    {{ explaining && currentExplanation === 'trade_decision' ? 'Analyzing...' : 'Generate Analysis' }}
                  </button>
                </div>

                <div class="group bg-slate-800/30 border border-white/5 rounded-xl p-5 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all cursor-pointer" (click)="generateExplanation('agent_performance')">
                 <div class="flex items-center justify-between mb-3">
                    <div class="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                      <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <span class="text-xs text-emerald-400 font-bold uppercase tracking-wider group-hover:text-emerald-300">Strategic</span>
                  </div>
                  <h3 class="font-bold text-white mb-2">Agent Performance</h3>
                  <p class="text-xs text-slate-400 mb-4 leading-relaxed">Deep dive into individual agent performance metrics and regime adaptability.</p>
                  <button
                    [disabled]="explaining"
                    class="w-full py-2 bg-emerald-600/10 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wide group-hover:bg-emerald-600/20 transition-colors">
                    {{ explaining && currentExplanation === 'agent_performance' ? 'Analyzing...' : 'Generate Analysis' }}
                  </button>
                </div>

                <div class="group bg-slate-800/30 border border-white/5 rounded-xl p-5 hover:border-purple-500/30 hover:bg-slate-800/50 transition-all cursor-pointer" (click)="generateExplanation('market_analysis')">
                  <div class="flex items-center justify-between mb-3">
                    <div class="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                      <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                    </div>
                    <span class="text-xs text-purple-400 font-bold uppercase tracking-wider group-hover:text-purple-300">Macro</span>
                  </div>
                  <h3 class="font-bold text-white mb-2">Market Regime</h3>
                  <p class="text-xs text-slate-400 mb-4 leading-relaxed">Identify current market regimes, volatility shifts, and trend strength.</p>
                  <button
                    [disabled]="explaining"
                    class="w-full py-2 bg-purple-600/10 text-purple-400 rounded-lg text-xs font-bold uppercase tracking-wide group-hover:bg-purple-600/20 transition-colors">
                    {{ explaining && currentExplanation === 'market_analysis' ? 'Analyzing...' : 'Generate Analysis' }}
                  </button>
                </div>
              </div>

              <!-- Explanation Results -->
              <div *ngIf="explanationResult" class="mt-6 bg-slate-900/50 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden animate-fade-in-up">
                <div class="absolute top-0 right-0 p-4 opacity-10">
                  <svg class="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </div>
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                  <span class="text-indigo-400">AI Insight:</span> {{ explanationResult.title }}
                </h3>
                <div class="prose prose-invert max-w-none relative z-10">
                  <p class="text-sm text-slate-300 leading-7 whitespace-pre-line">{{ explanationResult.detailed_explanation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ReportsComponent implements OnInit {
  loading = true;
  error: string | null = null;
  systemSummary: any = null;
  generating = false;
  explaining = false;
  currentReport: string | null = null;
  currentExplanation: string | null = null;
  generatedReports: any[] = [];
  explanationResult: any = null;

  constructor(private http: HttpClient, private modalService: ModalService) {}

  ngOnInit(): void {
    this.loadSystemSummary();
  }

  loadSystemSummary(): void {
    this.loading = true;
    this.error = null;

    // Demo mode fallback - use mock data if backend unavailable
    const useMockData = true; // Set to false when backend is deployed

    if (useMockData) {
      // Simulate network delay
      setTimeout(() => {
        this.systemSummary = {
          total_agents: 10,
          active_agents: 10,
          total_predictions: 1245,
          accuracy_rate: 0.782,
          total_trades: 89,
          successful_trades: 67,
          total_portfolio_value: 1250000,
          daily_return: 0.0245,
          sharpe_ratio: 1.85,
          max_drawdown: -0.08,
          risk_score: 35,
          last_updated: new Date().toISOString()
        };
        this.loading = false;
      }, 500);
      return;
    }

    this.http.get<any>('http://localhost:8001/reports/summary').subscribe({
      next: (summary) => {
        this.systemSummary = summary;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading system summary:', err);
        // Fallback to mock data on error
        this.systemSummary = {
          total_agents: 10,
          active_agents: 10,
          total_predictions: 1245,
          accuracy_rate: 0.782,
          total_trades: 89,
          successful_trades: 67,
          total_portfolio_value: 1250000,
          daily_return: 0.0245,
          sharpe_ratio: 1.85,
          max_drawdown: -0.08,
          risk_score: 35,
          last_updated: new Date().toISOString()
        };
        this.loading = false;
      }
    });
  }

  generateReport(reportType: string): void {
    this.generating = true;
    this.currentReport = reportType;

    let endpoint = '';
    switch (reportType) {
      case 'daily':
        endpoint = 'http://localhost:8001/reports/daily';
        break;
      case 'weekly':
        endpoint = 'http://localhost:8001/reports/weekly';
        break;
      case 'agent-performance':
        endpoint = 'http://localhost:8001/reports/agent-performance';
        break;
      default:
        this.generating = false;
        this.currentReport = null;
        return;
    }

    this.http.get<any>(endpoint).subscribe({
      next: (report) => {
        this.generatedReports.unshift(report);
        this.generating = false;
        this.currentReport = null;
      },
      error: (err) => {
        console.error(`Error generating ${reportType} report:`, err);
        this.generating = false;
        this.currentReport = null;
        this.modalService.error(`Failed to generate ${reportType} report. Please try again.`);
      }
    });
  }

  generateExplanation(explanationType: string): void {
    this.explaining = true;
    this.currentExplanation = explanationType;

    const requestData = {
      explanation_type: explanationType,
      data: this.getExplanationData(explanationType),
      tone: 'professional'
    };

    this.http.post<any>('http://localhost:8001/reports/explain', requestData).subscribe({
      next: (explanation) => {
        this.explanationResult = explanation;
        this.explaining = false;
        this.currentExplanation = null;
      },
      error: (err) => {
        console.error(`Error generating ${explanationType} explanation:`, err);
        this.explaining = false;
        this.currentExplanation = null;
        this.modalService.error(`Failed to generate ${explanationType} explanation. Please try again.`);
      }
    });
  }

  getExplanationData(explanationType: string): any {
    switch (explanationType) {
      case 'trade_decision':
        return {
          symbol: 'BTC-USD',
          trade_type: 'long',
          confidence_score: 0.75,
          entry_price: 69000.0,
          quantity: 0.001719,
          agent_signals: ['MomentumAgent', 'RiskAgent'],
          market_regime: 'bull'
        };
      case 'agent_performance':
        return {
          agent_name: 'MomentumAgent',
          win_rate: 65.2,
          total_signals: 45,
          successful_signals: 29,
          failed_signals: 16,
          avg_confidence: 0.78,
          best_performing_regime: 'bull',
          worst_performing_regime: 'sideways'
        };
      case 'market_analysis':
        return {
          market_regime: 'bull',
          volatility: 0.15,
          trend_direction: 'upward',
          regime_duration: 5,
          regime_strength: 0.8
        };
      default:
        return {};
    }
  }

  downloadReport(report: any): void {
    // In a real implementation, this would download the actual file
    this.modalService.info(`Downloading ${report.report_type} report (${report.format})`, 'Download Report');
  }

  viewReport(report: any): void {
    // In a real implementation, this would open the report in a new window
    this.modalService.info(`Viewing ${report.report_type} report (${report.format})`, 'View Report');
  }
}
