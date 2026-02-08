import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  EnsembleBlenderSummary,
  EnsembleSignalData,
  SignalQualityData,
  EnsemblePerformanceData
} from '../../interfaces/ensemble-blender.interface';

@Component({
  selector: 'app-ensemble-blender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ensemble-blender.component.html',
  styleUrls: ['./ensemble-blender.component.css']
})
export class EnsembleBlenderComponent implements OnInit, OnDestroy {
  // Data properties
  summary: EnsembleBlenderSummary | null = null;
  signals: EnsembleSignalData[] = [];
  qualityMetrics: SignalQualityData | null = null;
  performanceData: EnsemblePerformanceData | null = null;

  // Loading states
  loadingSummary = true;
  loadingSignals = true;
  loadingQuality = true;
  loadingPerformance = true;

  // Error states
  errorSummary = false;
  errorSignals = false;
  errorQuality = false;
  errorPerformance = false;

  // Auto-refresh
  private refreshSubscription: Subscription | null = null;
  private readonly REFRESH_INTERVAL = 30000; // 30 seconds

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAllData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private loadAllData(): void {
    this.loadSummary();
    this.loadSignals();
    this.loadQualityMetrics();
    this.loadPerformanceData();
  }

  private startAutoRefresh(): void {
    this.refreshSubscription = interval(this.REFRESH_INTERVAL)
      .subscribe(() => {
        this.loadAllData();
      });
  }

  private loadSummary(): void {
    this.loadingSummary = true;
    this.errorSummary = false;

    // Demo mode - use mock data
    const useMockData = true;

    if (useMockData) {
      setTimeout(() => {
        this.summary = {
          agent_name: 'Ensemble Signal Blender',
          blend_mode: 'weighted_average',
          current_regime: 'bull',
          total_signals_generated: 1245,
          avg_quality_score: 0.82,
          recent_quality_scores: [0.85, 0.79, 0.83, 0.81, 0.84],
          agent_weights: {},
          regime_history: [],
          performance_metrics: {
            total_signals_blended: 1245,
            avg_contributing_agents: 6.8,
            signal_quality_trend: 'improving',
            regime_adaptation_score: 0.89,
            consistency_score: 0.78,
            agreement_score: 0.82,
            false_positive_reduction: 0.35,
            risk_adjusted_improvement: 0.42
          },
          last_updated: new Date().toISOString()
        };
        this.loadingSummary = false;
      }, 300);
      return;
    }

    this.http.get<EnsembleBlenderSummary>('http://localhost:8001/ensemble-blender')
      .pipe(
        catchError(error => {
          console.error('Error loading ensemble blender summary:', error);
          this.errorSummary = true;
          return of(null);
        })
      )
      .subscribe(data => {
        this.summary = data;
        this.loadingSummary = false;
      });
  }

  private loadSignals(): void {
    this.loadingSignals = true;
    this.errorSignals = false;

    const useMockData = true;
    if (useMockData) {
      setTimeout(() => {
        this.signals = [
          { symbol: 'AAPL', signal_type: 'strong_buy', confidence: 0.89, blended_confidence: 0.92, contributing_agents: ['LSTM Day Trader', 'RL Strategy', 'RAG Event'], blend_mode: 'weighted_average', regime: 'bull', quality_score: 0.88, consistency_score: 0.85, agreement_score: 0.91, timestamp: new Date().toISOString() },
          { symbol: 'NVDA', signal_type: 'buy', confidence: 0.82, blended_confidence: 0.85, contributing_agents: ['Transformer', 'LSTM', 'Pattern Detector'], blend_mode: 'weighted_average', regime: 'bull', quality_score: 0.83, consistency_score: 0.79, agreement_score: 0.86, timestamp: new Date().toISOString() },
          { symbol: 'TSLA', signal_type: 'hold', confidence: 0.65, blended_confidence: 0.68, contributing_agents: ['RL Strategy', 'Anomaly Detector'], blend_mode: 'majority', regime: 'volatile', quality_score: 0.62, consistency_score: 0.58, agreement_score: 0.69, timestamp: new Date().toISOString() },
          { symbol: 'MSFT', signal_type: 'buy', confidence: 0.79, blended_confidence: 0.81, contributing_agents: ['LSTM', 'RAG Event', 'Sentiment'], blend_mode: 'weighted_average', regime: 'bull', quality_score: 0.80, consistency_score: 0.77, agreement_score: 0.83, timestamp: new Date().toISOString() }
        ];
        this.loadingSignals = false;
      }, 350);
      return;
    }

    this.http.get<EnsembleSignalData[]>('http://localhost:8001/ensemble-blender/signals')
      .pipe(
        catchError(error => {
          console.error('Error loading ensemble signals:', error);
          this.errorSignals = true;
          return of([]);
        })
      )
      .subscribe(data => {
        this.signals = data;
        this.loadingSignals = false;
      });
  }

  private loadQualityMetrics(): void {
    this.loadingQuality = true;
    this.errorQuality = false;

    const useMockData = true;
    if (useMockData) {
      setTimeout(() => {
        this.qualityMetrics = {
          consistency_score: 0.78,
          agreement_score: 0.82,
          confidence_variance: 0.15,
          regime_alignment: 0.89,
          historical_accuracy: 0.76,
          overall_quality: 0.81
        };
        this.loadingQuality = false;
      }, 400);
      return;
    }

    this.http.get<SignalQualityData>('http://localhost:8001/ensemble-blender/quality')
      .pipe(
        catchError(error => {
          console.error('Error loading quality metrics:', error);
          this.errorQuality = true;
          return of(null);
        })
      )
      .subscribe(data => {
        this.qualityMetrics = data;
        this.loadingQuality = false;
      });
  }

  private loadPerformanceData(): void {
    this.loadingPerformance = true;
    this.errorPerformance = false;

    const useMockData = true;
    if (useMockData) {
      setTimeout(() => {
        this.performanceData = {
          signal_quality: {
            avg_quality_score: 0.82,
            quality_trend: 'improving',
            high_quality_signals: 112,
            low_quality_signals: 18,
            quality_consistency: 0.85
          },
          blending_effectiveness: {
            avg_contributing_agents: 6.8,
            consensus_rate: 0.78,
            disagreement_rate: 0.22,
            blend_mode_effectiveness: {
              weighted_average: 0.89,
              majority: 0.76,
              max_confidence: 0.82,
              average: 0.71
            }
          },
          regime_adaptation: {
            current_regime: 'bull',
            regime_accuracy: 0.87,
            regime_transitions: 12,
            adaptation_speed: 0.92,
            regime_performance: {
              bull: 0.89,
              bear: 0.78,
              sideways: 0.72,
              volatile: 0.68,
              trending: 0.85
            }
          },
          risk_management: {
            false_positive_reduction: 0.35,
            false_negative_reduction: 0.28,
            risk_adjusted_improvement: 0.42,
            volatility_reduction: 0.31,
            drawdown_improvement: 0.38
          },
          agent_contribution: {
            top_contributors: [
              { agent: 'LSTM Day Trader', contribution: 0.24 },
              { agent: 'RL Strategy Agent', contribution: 0.21 },
              { agent: 'RAG Event Agent', contribution: 0.18 },
              { agent: 'Transformer Agent', contribution: 0.16 }
            ],
            weight_stability: 0.88,
            performance_correlation: 0.82
          },
          last_updated: new Date().toISOString()
        };
        this.loadingPerformance = false;
      }, 450);
      return;
    }

    this.http.get<EnsemblePerformanceData>('http://localhost:8001/ensemble-blender/performance')
      .pipe(
        catchError(error => {
          console.error('Error loading performance data:', error);
          this.errorPerformance = true;
          return of(null);
        })
      )
      .subscribe(data => {
        this.performanceData = data;
        this.loadingPerformance = false;
      });
  }

  refreshData(): void {
    this.loadAllData();
  }

  getSignalTypeColor(signalType: string): string {
    switch (signalType.toLowerCase()) {
      case 'strong_buy': return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      case 'buy': return 'text-emerald-300 bg-emerald-500/5 border border-emerald-500/10';
      case 'hold': return 'text-slate-300 bg-slate-500/10 border border-slate-500/20';
      case 'sell': return 'text-red-300 bg-red-500/5 border border-red-500/10';
      case 'strong_sell': return 'text-red-400 bg-red-500/10 border border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border border-slate-500/20';
    }
  }

  getRegimeColor(regime: string): string {
    switch (regime.toLowerCase()) {
      case 'bull': return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      case 'bear': return 'text-red-400 bg-red-500/10 border border-red-500/20';
      case 'sideways': return 'text-slate-400 bg-slate-500/10 border border-slate-500/20';
      case 'volatile': return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
      case 'trending': return 'text-blue-400 bg-blue-500/10 border border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border border-slate-500/20';
    }
  }

  getBlendModeColor(blendMode: string): string {
    switch (blendMode.toLowerCase()) {
      case 'weighted_average': return 'text-blue-400 bg-blue-500/10 border border-blue-500/20';
      case 'majority': return 'text-purple-400 bg-purple-500/10 border border-purple-500/20';
      case 'max_confidence': return 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
      case 'average': return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border border-slate-500/20';
    }
  }

  getQualityScoreColor(score: number): string {
    if (score >= 0.8) return 'text-emerald-400';
    if (score >= 0.6) return 'text-amber-400';
    return 'text-red-400';
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  formatPercentage(value: number): string {
    if (value == null || isNaN(value)) {
      return 'N/A';
    }
    return (value * 100).toFixed(1) + '%';
  }
}
