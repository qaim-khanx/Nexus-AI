import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SystemStatusService, LatentPatternSummary, LatentPattern, CompressionMetric, PatternInsight } from '../../services/system-status.service';

@Component({
  selector: 'app-latent-pattern-detector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './latent-pattern-detector.component.html',
  styles: []
})
export class LatentPatternDetectorComponent implements OnInit {
  latentPatternSummary$: Observable<LatentPatternSummary> | undefined;
  latentPatterns$: Observable<LatentPattern[]> | undefined;
  compressionMetrics$: Observable<CompressionMetric[]> | undefined;
  patternInsights$: Observable<PatternInsight[]> | undefined;

  // Loading states
  isLoadingSummary = true;
  isLoadingPatterns = true;
  isLoadingMetrics = true;
  isLoadingInsights = true;

  Object = Object; // Make Object available in template

  constructor(private systemStatusService: SystemStatusService) {}

  ngOnInit() {
    this.loadLatentPatternData();
  }

  loadLatentPatternData() {
    // Load summary
    this.latentPatternSummary$ = this.systemStatusService.getLatentPatternSummary();
    this.latentPatternSummary$.subscribe({
      next: () => this.isLoadingSummary = false,
      error: () => this.isLoadingSummary = false
    });

    // Load patterns
    this.latentPatterns$ = this.systemStatusService.getLatentPatterns();
    this.latentPatterns$.subscribe({
      next: () => this.isLoadingPatterns = false,
      error: () => this.isLoadingPatterns = false
    });

    // Load compression metrics
    this.compressionMetrics$ = this.systemStatusService.getCompressionMetrics();
    this.compressionMetrics$.subscribe({
      next: () => this.isLoadingMetrics = false,
      error: () => this.isLoadingMetrics = false
    });

    // Load pattern insights
    this.patternInsights$ = this.systemStatusService.getPatternInsights();
    this.patternInsights$.subscribe({
      next: () => this.isLoadingInsights = false,
      error: () => this.isLoadingInsights = false
    });
  }

  getPatternTypeColor(patternType: string): string {
    switch (patternType.toLowerCase()) {
      case 'trend': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'regime': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'anomaly': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'cyclical': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'volatility': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  }

  getMethodColor(method: string): string {
    switch (method.toLowerCase()) {
      case 'pca': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'autoencoder': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'tsne': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'umap': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'text-emerald-400';
    if (confidence >= 0.6) return 'text-amber-400';
    return 'text-red-400';
  }
}
