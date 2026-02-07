import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SystemStatusService, MetaEvaluationSummary, AgentRanking, RotationDecision, RegimeAnalysis } from '../../services/system-status.service';

@Component({
  selector: 'app-meta-evaluation-agent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meta-evaluation-agent.component.html',
  styles: []
})
export class MetaEvaluationAgentComponent implements OnInit {
  metaEvaluationSummary$: Observable<MetaEvaluationSummary> | undefined;
  agentRankings$: Observable<AgentRanking[]> | undefined;
  rotationDecisions$: Observable<RotationDecision[]> | undefined;
  regimeAnalysis$: Observable<RegimeAnalysis> | undefined;

  // Loading states
  isLoadingSummary = true;
  isLoadingRankings = true;
  isLoadingRotations = true;
  isLoadingRegime = true;

  Object = Object; // Make Object available in template

  constructor(private systemStatusService: SystemStatusService) {}

  ngOnInit() {
    this.loadMetaEvaluationData();
  }

  loadMetaEvaluationData() {
    // Load summary
    this.metaEvaluationSummary$ = this.systemStatusService.getMetaEvaluationSummary();
    this.metaEvaluationSummary$.subscribe({
      next: () => this.isLoadingSummary = false,
      error: () => this.isLoadingSummary = false
    });

    // Load rankings
    this.agentRankings$ = this.systemStatusService.getAgentRankings();
    this.agentRankings$.subscribe({
      next: () => this.isLoadingRankings = false,
      error: () => this.isLoadingRankings = false
    });

    // Load rotations
    this.rotationDecisions$ = this.systemStatusService.getRotationDecisions();
    this.rotationDecisions$.subscribe({
      next: () => this.isLoadingRotations = false,
      error: () => this.isLoadingRotations = false
    });

    // Load regime analysis
    this.regimeAnalysis$ = this.systemStatusService.getRegimeAnalysis();
    this.regimeAnalysis$.subscribe({
      next: () => this.isLoadingRegime = false,
      error: () => this.isLoadingRegime = false
    });
  }

  getRegimeColor(regime: string): string {
    switch (regime?.toLowerCase()) {
      case 'bull': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20';
      case 'bear': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20';
      case 'volatile': return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20';
      case 'trending': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20';
      default: return 'text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-500/10 border border-gray-200 dark:border-slate-500/20';
    }
  }

  getPerformanceColor(score: number): string {
    if (score >= 0.8) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 0.6) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  }

  getRankBadgeColor(rank: number): string {
    if (rank === 1) return 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30';
    if (rank === 2) return 'bg-gray-100 dark:bg-slate-500/20 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-500/30';
    if (rank === 3) return 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30';
    return 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30';
  }
}
