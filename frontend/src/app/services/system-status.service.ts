import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, switchMap, startWith, map, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

// Core Interfaces
export interface SystemStatus {
  is_running: boolean;
  uptime_seconds: number;
  total_predictions: number;
  successful_predictions: number;
  failed_predictions: number;
  data_quality_score: number;
  last_update: string;
  agent_status: any;
  active_symbols: string[];
  active_agents: string[];
  advanced_features: any;
}

export interface AgentStatus {
  name: string;
  agent_name: string;
  status: string;
  predictions: number;
  total_predictions: number;
  accuracy: number;
  confidence: number;
  last_prediction: string;
}

export interface Prediction {
  agent_name: string;
  signal_type: string;
  confidence: number;
  asset_symbol: string;
  timestamp: string;
  reasoning: string;
  metadata: any;
}

// Holdings Interface (simplified from portfolio)

export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_percent: number;
  weight: number;
  status: string;
  cost_basis: number;
}

// Simplified interfaces for other components (to avoid compilation errors)
export interface ABTestSummary {
  active_tests: number;
  completed_tests: number;
  success_rate: number;
  last_updated: string;
  active_experiments: number;
  completed_experiments: number;
  overall_conversion_rate: number;
  total_participants: number;
  avg_experiment_duration: number;
  top_performing_variant: string;
}

export interface ABTestResult {
  test_id: string;
  test_name: string;
  variant: string;
  performance: number;
  confidence: number;
  status: string;
}

export interface AgentMonitorSummary {
  total_agents: number;
  active_agents: number;
  monitoring_enabled: boolean;
  last_health_check: string;
  system_load: number;
  memory_usage: number;
  cpu_usage: number;
  last_updated: string;
  healthy_agents: number;
  avg_accuracy: number;
  avg_sharpe_ratio: number;
  online_learning_enabled: boolean;
  total_feedback_samples: number;
  agents_needing_attention: number;
  avg_win_rate: number;
}

export interface RiskAlert {
  id: string;
  level: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
}

export interface AgentPerformanceMetrics {
  agent_name: string;
  performance_score: number;
  accuracy: number;
  response_time: number;
  error_rate: number;
  last_updated: string;
  last_prediction_time: string;
  correct_predictions: number;
  total_predictions: number;
  sharpe_ratio: number;
  avg_confidence: number;
  win_rate: number;
  health_score: number;
  performance_trend: string;
}

export interface AgentFeedback {
  agent_name: string;
  feedback_type: string;
  message: string;
  timestamp: string;
  predicted_signal: string;
  actual_outcome: string;
  feedback_score: number;
}

export interface OnlineLearningStatus {
  enabled: boolean;
  learning_rate: number;
  last_update: string;
  total_updates: number;
  agent_name: string;
  model_type: string;
  model_accuracy: number;
  training_samples: number;
  is_training: boolean;
}

export interface AgentRouterSummary {
  total_routes: number;
  active_routes: number;
  routing_enabled: boolean;
  last_route_update: string;
  routing_accuracy: number;
  last_updated: string;
  total_routing_decisions: number;
  current_regime: string;
  regime_confidence: number;
  active_routing_strategy: string;
  avg_agent_weight: number;
  last_decision_time: string;
}

export interface MarketRegime {
  current_regime: string;
  confidence: number;
  regime_duration: number;
  last_change: string;
  regime_type: string;
  volatility_level: number;
  trend_strength: number;
  market_sentiment: string;
  transition_probability: number;
}

export interface AgentWeight {
  agent_name: string;
  weight: number;
  performance: number;
  last_updated: string;
  reason: string;
  regime_fit: number;
}

export interface RoutingDecision {
  timestamp: string;
  agent_name: string;
  symbol: string;
  decision: string;
  confidence: number;
  decision_id: string;
  market_regime: any;
  routing_strategy: string;
  active_agents: any[];
  risk_level: string;
}

export interface ExecutionAgentSummary {
  total_orders: number;
  filled_orders: number;
  pending_orders: number;
  total_volume: number;
  execution_enabled: boolean;
  last_execution: string;
  success_rate: number;
  avg_execution_time: number;
  last_updated: string;
  execution_success_rate: number;
  active_orders: number;
  active_strategies: number;
}

export interface Order {
  order_id: string;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  status: string;
  timestamp: string;
}

export interface Position {
  symbol: string;
  quantity: number;
  average_price: number;
  market_value: number;
  unrealized_pnl: number;
  timestamp: string;
}

export interface ExecutionStrategy {
  strategy_name: string;
  enabled: boolean;
  performance: number;
  last_used: string;
}

export interface RiskAnalysis {
  overall_risk_score: number;
  market_risk: any;
  liquidity_risk: number;
  last_updated: string;
  total_risk: number;
  risk_metrics: RiskMetrics;
}

export interface RiskMetrics {
  var_95: number;
  var_99: number;
  max_drawdown: number;
  sharpe_ratio: number;
  beta: number;
}

export interface MarketRisk {
  volatility: number;
  correlation: number;
  sector_concentration: number;
  geographic_concentration: number;
  market_regime: string;
}

export interface RiskAlert {
  alert_id: string;
  severity: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  type: string;
}

export interface AnalyticsResponse {
  total_predictions: number;
  accuracy_rate: number;
  success_rate: number;
  last_updated: string;
  agent_performance: any[];
  market_trends: any;
  system_analytics: any;
}

export interface MarketTrends {
  trend_direction: string;
  trend_strength: number;
  trend_duration: number;
  last_updated: string;
}

export interface SystemAnalytics {
  system_load: number;
  response_time: number;
  error_rate: number;
  uptime: number;
}

export interface MetaEvaluationSummary {
  total_evaluations: number;
  active_evaluations: number;
  evaluation_accuracy: number;
  last_evaluation: string;
  regime_analysis_enabled: boolean;
  last_updated: string;
  performance_summary: any;
  current_regime: string;
  recent_rotations: any[];
}

export interface AgentRanking {
  agent_name: string;
  rank: number;
  score: number;
  regime: string;
  last_updated: string;
  composite_score: number;
  accuracy: number;
  sharpe_ratio: number;
  win_rate: number;
  response_time: number;
}

export interface RotationDecision {
  timestamp: string;
  from_agent: string;
  to_agent: string;
  symbol: string;
  reason: string;
  confidence: number;
  regime: string;
  created_at: string;
  expected_improvement: number;
}

export interface RegimeAnalysis {
  current_regime: string;
  regime_confidence: number;
  regime_duration: number;
  transition_probability: number;
  last_updated: string;
  regime: string;
  confidence: number;
  volatility: number;
  trend_strength: number;
  trend_direction: string;
  volume_ratio: number;
}

export interface LatentPatternSummary {
  total_patterns: number;
  active_patterns: number;
  pattern_accuracy: number;
  compression_ratio: number;
  last_analysis: string;
  analysis_enabled: boolean;
  last_updated: string;
  pattern_counts: { [key: string]: number };
  compression_metrics: any[];
  recent_insights: any[];
}

export interface LatentPattern {
  pattern_id: string;
  pattern_type: string;
  confidence: number;
  frequency: number;
  last_seen: string;
  description: string;
  explained_variance: number;
  latent_dimensions: any[];
  compression_method: string;
}

export interface CompressionMetric {
  method: string;
  compression_ratio: number;
  reconstruction_error: number;
  computation_time: number;
  last_updated: string;
  explained_variance: number;
  processing_time: number;
}

export interface PatternInsight {
  insight_id: string;
  pattern_type: string;
  insight_text: string;
  confidence: number;
  impact_score: number;
  timestamp: string;
  recommendations: string[];
  description: string;
  market_implications: string[];
}

export interface RLStrategyAgentSummary {
  total_episodes: number;
  current_episode: number;
  training_status: string;
  model_performance: number;
  last_training: string;
  actions_taken: number;
  rewards_earned: number;
  exploration_rate: number;
  last_updated: string;
  algorithm: string;
  is_trained: boolean;
  training_episodes: number;
  model_accuracy: number;
  performance_metrics: any;
  training_metrics: any;
}

export interface RAGEventAgentSummary {
  total_documents: number;
  vector_db_size: number;
  last_news_update: string;
  rag_accuracy: number;
  llm_enabled: boolean;
  active_sources: number;
  total_queries: number;
  avg_response_time: number;
  avg_confidence: number;
  last_updated: string;
}

export interface NewsDocument {
  doc_id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  category: string;
  tags: string[];
  similarity_score: number | null;
  timestamp: string;
  ingested_at: string;
}

export interface RAGAnalysis {
  query: string;
  relevant_docs: NewsDocument[];
  llm_response: string;
  confidence: number;
  reasoning: string;
  analysis_type: string;
  response_time_ms: number;
  created_at: string;
}

export interface RAGPerformance {
  metrics: {
    query_processing_rate: {
      value: number;
      unit: string;
      timestamp: string;
    };
    llm_confidence_score: {
      value: number;
      unit: string;
      timestamp: string;
    };
    document_retrieval_success: {
      value: number;
      unit: string;
      timestamp: string;
    };
    avg_response_time: {
      value: number;
      unit: string;
      timestamp: string;
    };
    rag_accuracy: {
      value: number;
      unit: string;
      timestamp: string;
    };
  };
  last_updated: string;
}

@Injectable({
  providedIn: 'root'
})
export class SystemStatusService {
  private apiUrl = environment.apiUrl;
  // Demo mode enabled for public showcase - visitors can explore all features
  private demoMode = true;
  private systemStatusSubject = new BehaviorSubject<SystemStatus | null>(null);
  private agentsStatusSubject = new BehaviorSubject<AgentStatus[]>([]);
  private predictionsSubject = new BehaviorSubject<Prediction[]>([]);

  public systemStatus$ = this.systemStatusSubject.asObservable();
  public agentsStatus$ = this.agentsStatusSubject.asObservable();
  public predictions$ = this.predictionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Core System Methods
  getSystemStatus(): Observable<SystemStatus> {
    if (this.demoMode) {
      return of({
        is_running: true,
        uptime_seconds: 124560,
        total_predictions: 15423,
        successful_predictions: 14201,
        failed_predictions: 1222,
        data_quality_score: 0.98,
        last_update: new Date().toISOString(),
        agent_status: {
          'RL Strategy Agent': 'active',
          'Meta-Evaluation Agent': 'active',
          'RAG Event Agent': 'active',
          'Risk Manager': 'active'
        },
        active_symbols: ['BTC-USD', 'ETH-USD', 'AAPL', 'TSLA', 'NVDA'],
        active_agents: ['RL Strategy', 'Meta-Evaluation', 'RAG Event'],
        advanced_features: {
          deep_learning: { enabled: true, models: ['LSTM-Attention', 'Transformer-XL'], performance_metrics: { accuracy: 0.89 } },
          realtime_feeds: { enabled: true, feed_types: ['Websocket', 'REST'], status: { connection: 'stable' } },
          ab_testing: { enabled: true, active_tests: 3, completed_tests: 12 }
        }
      });
    }

    return this.http.get<any>(`${this.apiUrl}/status`).pipe(
      map(response => ({
        is_running: response.status === 'online',
        uptime_seconds: response.uptime_seconds || 0,
        total_predictions: response.total_predictions || 0,
        successful_predictions: response.successful_predictions || 0,
        failed_predictions: response.failed_predictions || 0,
        data_quality_score: response.data_quality || 0,
        last_update: response.timestamp || new Date().toISOString(),
        agent_status: response.agent_status || {},
        active_symbols: response.active_symbols || [],
        active_agents: response.active_agents || [],
        advanced_features: response.advanced_features || {
          deep_learning: { enabled: false, models: [], performance_metrics: {} },
          realtime_feeds: { enabled: false, feed_types: [], status: {} },
          ab_testing: { enabled: false, active_tests: 0, completed_tests: 0 }
        }
      })),
      catchError(error => {
        console.error('Error getting system status:', error);
        return of({
          is_running: false,
          uptime_seconds: 0,
          total_predictions: 0,
          successful_predictions: 0,
          failed_predictions: 0,
          data_quality_score: 0,
          last_update: new Date().toISOString(),
          agent_status: {},
          active_symbols: [],
          active_agents: [],
          advanced_features: {
            deep_learning: { enabled: false, models: [], performance_metrics: {} },
            realtime_feeds: { enabled: false, feed_types: [], status: {} },
            ab_testing: { enabled: false, active_tests: 0, completed_tests: 0 }
          }
        });
      })
    );
  }

  getAgentsStatus(): Observable<AgentStatus[]> {
    return this.http.get<AgentStatus[]>(`${this.apiUrl}/agents/status`);
  }

  getPredictions(limit?: number): Observable<Prediction[]> {
    const url = limit ? `${this.apiUrl}/predictions?limit=${limit}` : `${this.apiUrl}/predictions?limit=50`;
    return this.http.get<Prediction[]>(url);
  }

  // Polling and Refresh Methods
  startPolling(): void {
    // Auto-refresh system status every 30 seconds
    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.getSystemStatus())
    ).subscribe(status => {
      this.systemStatusSubject.next(status);
    });
  }

  refreshSystemStatus(): Observable<SystemStatus> {
    return this.getSystemStatus();
  }

  // Holdings Methods (moved from portfolio)
  getTopHoldings(): Observable<PortfolioHolding[]> {
    if (this.demoMode) {
      return of([
        { symbol: 'NVDA', name: 'NVIDIA Corp', quantity: 150, avg_price: 450.20, current_price: 777.50, market_value: 116625, unrealized_pnl: 49095, unrealized_pnl_percent: 72.7, weight: 15.4, status: 'active', cost_basis: 67530 },
        { symbol: 'BTC-USD', name: 'Bitcoin', quantity: 2.5, avg_price: 42000, current_price: 65000, market_value: 162500, unrealized_pnl: 57500, unrealized_pnl_percent: 54.7, weight: 21.5, status: 'active', cost_basis: 105000 },
        { symbol: 'TSLA', name: 'Tesla Inc', quantity: 200, avg_price: 185.50, current_price: 245.30, market_value: 49060, unrealized_pnl: 11960, unrealized_pnl_percent: 32.2, weight: 6.5, status: 'monitoring', cost_basis: 37100 },
        { symbol: 'ETH-USD', name: 'Ethereum', quantity: 15, avg_price: 2200, current_price: 3500, market_value: 52500, unrealized_pnl: 19500, unrealized_pnl_percent: 59.1, weight: 6.9, status: 'active', cost_basis: 33000 },
        { symbol: 'AMD', name: 'Advanced Micro Devices', quantity: 300, avg_price: 95.40, current_price: 175.20, market_value: 52560, unrealized_pnl: 23940, unrealized_pnl_percent: 83.6, weight: 6.9, status: 'active', cost_basis: 28620 }
      ]);
    }
    return this.http.get<any>(`${this.apiUrl}/symbols/managed-with-market-data`).pipe(
      map((symbols: any[]) => symbols.slice(0, 10).map(symbol => ({
        symbol: symbol.symbol,
        name: symbol.name,
        quantity: 100, // Default quantity for display
        avg_price: symbol.initial_price || symbol.current_price || 0,
        current_price: symbol.current_price || 0,
        market_value: (symbol.current_price || 0) * 100,
        unrealized_pnl: 0, // Default PnL for display
        unrealized_pnl_percent: 0, // Default PnL % for display
        weight: 0, // Default weight
        status: 'active',
        cost_basis: (symbol.initial_price || symbol.current_price || 0) * 100
      })))
    );
  }

  getSignalSummary(): Observable<any> {
    if (this.demoMode) {
      return of({
        buy_signals: 14,
        sell_signals: 5,
        hold_signals: 8,
        total_signals: 27
      });
    }
    return this.http.get<any[]>(`${this.apiUrl}/predictions?limit=100`).pipe(
      map((predictions: any[]) => {
        const buySignals = predictions.filter(p => p.signal_type?.toLowerCase().includes('buy')).length;
        const sellSignals = predictions.filter(p => p.signal_type?.toLowerCase().includes('sell')).length;
        const holdSignals = predictions.filter(p => p.signal_type?.toLowerCase().includes('hold')).length;

        return {
          buy_signals: buySignals,
          sell_signals: sellSignals,
          hold_signals: holdSignals,
          total_signals: predictions.length
        };
      })
    );
  }

  getMarketIndices(): Observable<any[]> {
    return of([
      { name: 'S&P 500', value: 4567.89, change: 0.85 },
      { name: 'NASDAQ', value: 14234.56, change: 1.25 },
      { name: 'DOW', value: 34567.89, change: 0.45 },
      { name: 'VIX', value: 18.45, change: -2.15 }
    ]);
  }

  getSectorPerformance(): Observable<any[]> {
    return of([
      { name: 'Technology', performance: 2.15 },
      { name: 'Healthcare', performance: 1.85 },
      { name: 'Financials', performance: 0.95 },
      { name: 'Energy', performance: -0.65 },
      { name: 'Consumer', performance: 1.45 },
      { name: 'Industrials', performance: 0.75 }
    ]);
  }

  getSymbols(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/symbols`);
  }

  getManagedSymbolsWithMarketData(): Observable<any> {
    if (this.demoMode) {
      return of({
        symbols: [
          { symbol: 'BTC-USD', name: 'Bitcoin', current_price: 65230.50, change_percent: 4.2, pnl: 12500, weight: 15.5, status: 'active' },
          { symbol: 'ETH-USD', name: 'Ethereum', current_price: 3450.20, change_percent: 3.8, pnl: 4200, weight: 10.2, status: 'active' },
          { symbol: 'NVDA', name: 'NVIDIA Corp', current_price: 880.45, change_percent: 2.5, pnl: 8500, weight: 12.8, status: 'active' },
          { symbol: 'TSLA', name: 'Tesla Inc', current_price: 175.30, change_percent: -1.2, pnl: -1200, weight: 5.5, status: 'monitoring' },
          { symbol: 'AMD', name: 'Advanced Micro Devices', current_price: 180.20, change_percent: 1.8, pnl: 2300, weight: 6.2, status: 'active' },
          { symbol: 'MSFT', name: 'Microsoft Corp', current_price: 420.10, change_percent: 0.9, pnl: 3400, weight: 8.5, status: 'active' },
          { symbol: 'AAPL', name: 'Apple Inc', current_price: 172.50, change_percent: -0.5, pnl: -500, weight: 7.2, status: 'monitoring' },
          { symbol: 'GOOGL', name: 'Alphabet Inc', current_price: 150.80, change_percent: 1.1, pnl: 1800, weight: 6.8, status: 'active' }
        ]
      });
    }
    return this.http.get<any>(`${this.apiUrl}/symbols/managed-with-market-data`);
  }

  // Mock methods for other components to avoid compilation errors
  getABTestingSummary(): Observable<ABTestSummary> {
    return this.http.get<any>(`${this.apiUrl}/ab-testing`).pipe(
      map(response => ({
        active_tests: response.active_tests || 0,
        completed_tests: response.completed_tests || 0,
        success_rate: response.success_rate || 0,
        last_updated: response.last_updated || new Date().toISOString(),
        active_experiments: response.active_experiments || 0,
        completed_experiments: response.completed_experiments || 0,
        overall_conversion_rate: response.overall_conversion_rate || 0,
        total_participants: response.total_participants || 0,
        avg_experiment_duration: response.avg_experiment_duration || 0,
        top_performing_variant: response.top_performing_variant || 'None'
      })),
      catchError(error => {
        console.error('Error getting A/B testing summary:', error);
        return of({
          active_tests: 0,
          completed_tests: 0,
          success_rate: 0,
          last_updated: new Date().toISOString(),
          active_experiments: 0,
          completed_experiments: 0,
          overall_conversion_rate: 0,
          total_participants: 0,
          avg_experiment_duration: 0,
          top_performing_variant: 'None'
        });
      })
    );
  }

  getABTestingPerformance(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ab-testing/performance`).pipe(
      map(response => response || { active_experiments: [], experiments: [] }),
      catchError(error => {
        console.error('Error getting A/B testing performance:', error);
        return of({ active_experiments: [], experiments: [] });
      })
    );
  }

  getAgentMonitorSummary(): Observable<AgentMonitorSummary> {
    if (this.demoMode) {
      return of({
        total_agents: 8,
        active_agents: 6,
        monitoring_enabled: true,
        last_health_check: new Date().toISOString(),
        system_load: 42,
        memory_usage: 65,
        cpu_usage: 38,
        last_updated: new Date().toISOString(),
        healthy_agents: 6,
        avg_accuracy: 0.87,
        avg_sharpe_ratio: 2.15,
        online_learning_enabled: true,
        total_feedback_samples: 12450,
        agents_needing_attention: 0,
        avg_win_rate: 0.68
      });
    }
    return this.http.get<any>(`${this.apiUrl}/agent-monitor`).pipe(
      map(response => ({
        total_agents: response.total_agents || 0,
        active_agents: response.active_agents || 0,
        monitoring_enabled: response.monitoring_enabled || false,
        last_health_check: response.last_health_check || new Date().toISOString(),
        system_load: response.system_load || 0,
        memory_usage: response.memory_usage || 0,
        cpu_usage: response.cpu_usage || 0,
        last_updated: response.last_updated || new Date().toISOString(),
        healthy_agents: response.healthy_agents || 0,
        avg_accuracy: response.avg_accuracy || 0,
        avg_sharpe_ratio: response.avg_sharpe_ratio || 0,
        online_learning_enabled: response.online_learning_enabled || false,
        total_feedback_samples: response.total_feedback_samples || 0,
        agents_needing_attention: response.agents_needing_attention || 0,
        avg_win_rate: response.avg_win_rate || 0
      })),
      catchError(error => {
        console.error('Error getting agent monitor summary:', error);
        return of({
          total_agents: 0,
          active_agents: 0,
          monitoring_enabled: false,
          last_health_check: new Date().toISOString(),
          system_load: 0,
          memory_usage: 0,
          cpu_usage: 0,
          last_updated: new Date().toISOString(),
          healthy_agents: 0,
          avg_accuracy: 0,
          avg_sharpe_ratio: 0,
          online_learning_enabled: false,
          total_feedback_samples: 0,
          agents_needing_attention: 0,
          avg_win_rate: 0
        });
      })
    );
  }

  getAgentPerformanceMetrics(): Observable<AgentPerformanceMetrics[]> {
    if (this.demoMode) {
      return of([
        {
          agent_name: 'RL Strategy',
          performance_score: 92,
          accuracy: 0.89,
          response_time: 145,
          error_rate: 0.01,
          last_updated: new Date().toISOString(),
          last_prediction_time: new Date().toISOString(),
          correct_predictions: 4250,
          total_predictions: 4775,
          sharpe_ratio: 2.45,
          avg_confidence: 0.88,
          win_rate: 0.72,
          health_score: 98,
          performance_trend: 'up'
        },
        {
          agent_name: 'Meta-Evaluation',
          performance_score: 95,
          accuracy: 0.94,
          response_time: 120,
          error_rate: 0.005,
          last_updated: new Date().toISOString(),
          last_prediction_time: new Date().toISOString(),
          correct_predictions: 15400,
          total_predictions: 16383,
          sharpe_ratio: 3.12,
          avg_confidence: 0.92,
          win_rate: 0.85,
          health_score: 99,
          performance_trend: 'stable'
        },
        {
          agent_name: 'RAG Event',
          performance_score: 88,
          accuracy: 0.85,
          response_time: 210,
          error_rate: 0.02,
          last_updated: new Date().toISOString(),
          last_prediction_time: new Date().toISOString(),
          correct_predictions: 2100,
          total_predictions: 2470,
          sharpe_ratio: 1.85,
          avg_confidence: 0.82,
          win_rate: 0.65,
          health_score: 95,
          performance_trend: 'up'
        }
      ]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/agent-monitor/performance`).pipe(
      map(response => response || []),
      catchError(error => {
        console.error('Error getting agent performance metrics:', error);
        return of([]);
      })
    );
  }

  getRiskAnalysis(): Observable<RiskAnalysis> {
    if (this.demoMode) {
      return of({
        overall_risk_score: 35,
        market_risk: { volatility: 0.18 },
        liquidity_risk: 0.12,
        last_updated: new Date().toISOString(),
        total_risk: 0.25,
        risk_metrics: {
          var_95: 0.04,
          var_99: 0.06,
          max_drawdown: 0.08,
          sharpe_ratio: 2.15,
          beta: 0.85
        }
      });
    }
    return this.http.get<any>(`${this.apiUrl}/risk-analysis`).pipe(
      map(response => ({
        overall_risk_score: response.overall_risk_score || 0,
        market_risk: response.market_risk || { volatility: 0 },
        liquidity_risk: response.liquidity_risk || 0,
        last_updated: response.last_updated || new Date().toISOString(),
        total_risk: response.total_risk || 0,
        risk_metrics: {
          var_95: response.risk_metrics?.var_95 || 0,
          var_99: response.risk_metrics?.var_99 || 0,
          max_drawdown: response.risk_metrics?.max_drawdown || 0,
          sharpe_ratio: response.risk_metrics?.sharpe_ratio || 0,
          beta: response.risk_metrics?.beta || 1.0
        }
      })),
      catchError(error => {
        console.error('Error getting risk analysis:', error);
        return of({
          overall_risk_score: 0,
          market_risk: { volatility: 0 },
          liquidity_risk: 0,
          last_updated: new Date().toISOString(),
          total_risk: 0,
          risk_metrics: {
            var_95: 0,
            var_99: 0,
            max_drawdown: 0,
            sharpe_ratio: 0,
            beta: 1.0
          }
        });
      })
    );
  }

  getAgentRouterSummary(): Observable<AgentRouterSummary> {
    if (this.demoMode) {
      return of({
        total_routes: 15420,
        active_routes: 25,
        routing_enabled: true,
        last_route_update: new Date().toISOString(),
        routing_accuracy: 0.92,
        last_updated: new Date().toISOString(),
        total_routing_decisions: 45210,
        current_regime: 'bull_trend',
        regime_confidence: 0.88,
        active_routing_strategy: 'adaptive_ensemble',
        avg_agent_weight: 0.75,
        last_decision_time: new Date().toISOString()
      });
    }
    // For now, return a summary based on market regime data
    // This can be enhanced when more comprehensive router summary endpoint is available
    return this.getMarketRegime().pipe(
      map(regime => ({
        total_routes: 25,
        active_routes: 20,
        routing_enabled: true,
        last_route_update: new Date().toISOString(),
        routing_accuracy: regime.confidence || 0.75,
        last_updated: regime.last_change || new Date().toISOString(),
        total_routing_decisions: 0, // Will be populated when decisions endpoint has data
        current_regime: regime.regime_type || 'neutral',
        regime_confidence: regime.confidence || 0.75,
        active_routing_strategy: 'adaptive',
        avg_agent_weight: 0.65,
        last_decision_time: new Date().toISOString()
      })),
      catchError(error => {
        console.error('Error getting agent router summary:', error);
        return of({
          total_routes: 0,
          active_routes: 0,
          routing_enabled: false,
          last_route_update: new Date().toISOString(),
          routing_accuracy: 0,
          last_updated: new Date().toISOString(),
          total_routing_decisions: 0,
          current_regime: 'neutral',
          regime_confidence: 0,
          active_routing_strategy: 'none',
          avg_agent_weight: 0,
          last_decision_time: new Date().toISOString()
        });
      })
    );
  }

  getMarketRegime(): Observable<MarketRegime> {
    if (this.demoMode) {
      return of({
        current_regime: 'bull_trend',
        confidence: 0.88,
        regime_duration: 14,
        last_change: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        regime_type: 'bull_trend',
        volatility_level: 0.45,
        trend_strength: 0.82,
        market_sentiment: 'optimistic',
        transition_probability: 0.15
      });
    }
    return this.http.get<any>(`${this.apiUrl}/agent-router/regime`).pipe(
      map(response => ({
        current_regime: response.regime_type || 'neutral',
        confidence: response.confidence || 0.5,
        regime_duration: response.regime_duration || 0,
        last_change: response.last_updated || new Date().toISOString(),
        regime_type: response.regime_type || 'neutral',
        volatility_level: response.volatility_level || 0.2,
        trend_strength: response.trend_strength || 0.3,
        market_sentiment: response.market_sentiment || 'neutral',
        transition_probability: response.transition_probability || 0.1
      })),
      catchError(error => {
        console.error('Error getting market regime:', error);
        return of({
          current_regime: 'neutral',
          confidence: 0.5,
          regime_duration: 0,
          last_change: new Date().toISOString(),
          regime_type: 'neutral',
          volatility_level: 0.2,
          trend_strength: 0.3,
          market_sentiment: 'neutral',
          transition_probability: 0.1,
          last_updated: new Date().toISOString()
        });
      })
    );
  }

  getOnlineLearningStatus(): Observable<OnlineLearningStatus[]> {
    if (this.demoMode) {
      return of([
        {
          agent_name: 'RL Strategy',
          model_type: 'PPO-Transformer',
          model_accuracy: 0.89,
          training_samples: 45000,
          is_training: true,
          enabled: true,
          learning_rate: 0.0003,
          last_update: new Date().toISOString(),
          total_updates: 1420
        },
        {
          agent_name: 'Meta-Evaluation',
          model_type: 'Gradient Boosting',
          model_accuracy: 0.94,
          training_samples: 125000,
          is_training: false,
          enabled: true,
          learning_rate: 0.01,
          last_update: new Date().toISOString(),
          total_updates: 560
        },
        {
          agent_name: 'RAG Event',
          model_type: 'BERT-Large',
          model_accuracy: 0.85,
          training_samples: 8900,
          is_training: true,
          enabled: true,
          learning_rate: 0.001,
          last_update: new Date().toISOString(),
          total_updates: 230
        }
      ]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/agent-monitor/online-learning`).pipe(
      map(response => response || []),
      catchError(error => {
        console.error('Error getting online learning status:', error);
        return of([]);
      })
    );
  }

  getAgentFeedback(): Observable<AgentFeedback[]> {
    if (this.demoMode) {
      return of([
        {
          agent_name: 'RL Strategy',
          feedback_type: 'profit',
          message: 'Profit target reached (+2.5%)',
          timestamp: new Date().toISOString(),
          predicted_signal: 'BUY',
          actual_outcome: 'PROFIT',
          feedback_score: 1.0
        },
        {
          agent_name: 'RAG Event',
          feedback_type: 'accuracy',
          message: 'Sentiment alignment confirmed',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          predicted_signal: 'HOLD',
          actual_outcome: 'STABLE',
          feedback_score: 0.95
        },
        {
          agent_name: 'Meta-Evaluation',
          feedback_type: 'correction',
          message: 'Weight adjustment successful',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          predicted_signal: 'ROTATE',
          actual_outcome: 'OPTIMIZATION',
          feedback_score: 0.85
        }
      ]);
    }
    return this.http.get<AgentFeedback[]>(`${this.apiUrl}/agent-monitor/feedback`).pipe(
      catchError(error => {
        console.error('Error fetching agent feedback:', error);
        return of([]);
      })
    );
  }

  getRiskMetrics(): Observable<RiskMetrics> {
    if (this.demoMode) {
      return of({
        var_95: 0.045,
        var_99: 0.068,
        max_drawdown: 0.12,
        sharpe_ratio: 2.45,
        beta: 0.85
      });
    }
    return this.http.get<any>(`${this.apiUrl}/risk-analysis/metrics`).pipe(
      map(response => ({
        var_95: response.var_95 || 0,
        var_99: response.var_99 || 0,
        max_drawdown: response.max_drawdown || 0,
        sharpe_ratio: response.sharpe_ratio || 0,
        beta: response.beta || 1.0
      })),
      catchError(error => {
        console.error('Error getting risk metrics:', error);
        return of({
          var_95: 0,
          var_99: 0,
          max_drawdown: 0,
          sharpe_ratio: 0,
          beta: 1.0
        });
      })
    );
  }

  getMarketRisk(): Observable<MarketRisk> {
    if (this.demoMode) {
      return of({
        volatility: 0.18,
        correlation: 0.65,
        sector_concentration: 0.25,
        geographic_concentration: 0.15,
        market_regime: 'bull_trend'
      });
    }
    return this.http.get<any>(`${this.apiUrl}/risk-analysis/market`).pipe(
      map(response => ({
        volatility: response.volatility || 0,
        correlation: response.correlation || 0,
        sector_concentration: response.sector_concentration || 0,
        geographic_concentration: response.geographic_concentration || 0,
        market_regime: response.market_regime || 'neutral'
      })),
      catchError(error => {
        console.error('Error getting market risk:', error);
        return of({
          volatility: 0,
          correlation: 0,
          sector_concentration: 0,
          geographic_concentration: 0,
          market_regime: 'neutral'
        });
      })
    );
  }

  getAnalytics(): Observable<AnalyticsResponse> {
    if (this.demoMode) {
      return of({
        total_predictions: 15423,
        accuracy_rate: 0.89,
        success_rate: 0.92,
        last_updated: new Date().toISOString(),
        agent_performance: [],
        market_trends: { trend_direction: 'up', trend_strength: 0.85, trend_duration: 14, last_updated: new Date().toISOString() },
        system_analytics: {
          avg_response_time: 125,
          system_load: 0.45,
          system_reliability: 0.999,
          total_uptime_hours: 345
        }
      });
    }
    return this.http.get<any>(`${this.apiUrl}/status`).pipe(
      map(response => ({
        total_predictions: response.total_predictions || 0,
        accuracy_rate: response.data_quality_score || 0,
        success_rate: response.total_predictions > 0 ? (response.successful_predictions / response.total_predictions) : 0,
        last_updated: response.timestamp || new Date().toISOString(),
        agent_performance: response.agent_status || [],
        market_trends: { trend_direction: 'up' },
        system_analytics: {
          avg_response_time: 125,
          system_load: 0.65,
          system_reliability: 0.98,
          total_uptime_hours: response.uptime_seconds ? (response.uptime_seconds / 3600) : 0
        }
      })),
      catchError(error => {
        console.error('Error getting analytics:', error);
        return of({
          total_predictions: 0,
          accuracy_rate: 0,
          success_rate: 0,
          last_updated: new Date().toISOString(),
          agent_performance: [],
          market_trends: { trend_direction: 'up' },
          system_analytics: {
            avg_response_time: 125,
            system_load: 0.65,
            system_reliability: 0.98,
            total_uptime_hours: 0
          }
        });
      })
    );
  }

  getAgentPerformance(): Observable<AgentPerformanceMetrics[]> {
    return of([]);
  }

  getMarketTrends(): Observable<MarketTrends> {
    return of({
      trend_direction: 'up',
      trend_strength: 0.75,
      trend_duration: 14,
      last_updated: new Date().toISOString()
    });
  }

  getSystemMetrics(): Observable<SystemAnalytics> {
    return of({
      system_load: 0.65,
      response_time: 125,
      error_rate: 0.02,
      uptime: 0.99
    });
  }

  getLatentPatterns(pattern_type?: string, limit: number = 50): Observable<LatentPattern[]> {
    if (this.demoMode) {
      return of([
        {
          pattern_id: 'LP-2024-001',
          pattern_type: 'Triangles',
          confidence: 0.89,
          frequency: 15,
          last_seen: new Date().toISOString(),
          description: 'Ascending Triangle detected in high volatility regime',
          explained_variance: 0.75,
          latent_dimensions: [0.1, 0.4, -0.2],
          compression_method: 'Autoencoder'
        },
        {
          pattern_id: 'LP-2024-002',
          pattern_type: 'Head & Shoulders',
          confidence: 0.92,
          frequency: 8,
          last_seen: new Date(Date.now() - 3600000).toISOString(),
          description: 'Inverse Head & Shoulders signaling reversal',
          explained_variance: 0.82,
          latent_dimensions: [0.3, -0.1, 0.5],
          compression_method: 'PCA'
        },
        {
          pattern_id: 'LP-2024-003',
          pattern_type: 'Flags',
          confidence: 0.85,
          frequency: 22,
          last_seen: new Date(Date.now() - 7200000).toISOString(),
          description: 'Bull Flag consolidation before breakout',
          explained_variance: 0.68,
          latent_dimensions: [-0.2, 0.3, 0.1],
          compression_method: 't-SNE'
        }
      ]);
    }
    const params = new URLSearchParams();
    if (pattern_type) params.append('pattern_type', pattern_type);
    params.append('limit', limit.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return this.http.get<LatentPattern[]>(`${this.apiUrl}/latent-pattern-detector/patterns${queryString}`).pipe(
      catchError(error => {
        console.error('Error getting latent patterns:', error);
        return of([]);
      })
    );
  }

  getPatternInsights(pattern_type?: string, limit: number = 10): Observable<PatternInsight[]> {
    if (this.demoMode) {
      return of([
        {
          insight_id: 'INS-001',
          pattern_type: 'Triangles',
          insight_text: 'High probability of bullish breakout in Tech sector',
          confidence: 0.88,
          impact_score: 0.75,
          timestamp: new Date().toISOString(),
          recommendations: ['Increase exposure to XLK', 'Monitor volume spikes'],
          description: 'Correlated triangle patterns observed across multiple tech tickers',
          market_implications: ['Potential 5% upside in short term']
        },
        {
          insight_id: 'INS-002',
          pattern_type: 'Volatility',
          insight_text: 'Volatility compression suggests imminent large move',
          confidence: 0.91,
          impact_score: 0.85,
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          recommendations: ['Hedge with options', 'Tighten stop losses'],
          description: 'Bollinger Band squeeze detected on major indices',
          market_implications: ['Expect increased volatility within 24 hours']
        }
      ]);
    }
    const params = new URLSearchParams();
    if (pattern_type) params.append('pattern_type', pattern_type);
    params.append('limit', limit.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return this.http.get<PatternInsight[]>(`${this.apiUrl}/latent-pattern-detector/insights${queryString}`).pipe(
      catchError(error => {
        console.error('Error getting pattern insights:', error);
        return of([]);
      })
    );
  }

  getAgentRankings(regime?: string): Observable<AgentRanking[]> {
    if (this.demoMode) {
      return of([
        {
          agent_name: 'Meta-Evaluation',
          rank: 1,
          score: 0.95,
          regime: 'bull_trend',
          last_updated: new Date().toISOString(),
          composite_score: 95,
          accuracy: 0.94,
          sharpe_ratio: 3.12,
          win_rate: 0.85,
          response_time: 120
        },
        {
          agent_name: 'RL Strategy',
          rank: 2,
          score: 0.92,
          regime: 'bull_trend',
          last_updated: new Date().toISOString(),
          composite_score: 92,
          accuracy: 0.89,
          sharpe_ratio: 2.45,
          win_rate: 0.72,
          response_time: 145
        },
        {
          agent_name: 'RAG Event',
          rank: 3,
          score: 0.88,
          regime: 'bull_trend',
          last_updated: new Date().toISOString(),
          composite_score: 88,
          accuracy: 0.85,
          sharpe_ratio: 1.85,
          win_rate: 0.65,
          response_time: 210
        }
      ]);
    }
    const regimeParam = regime ? `?regime=${regime}` : '';
    return this.http.get<AgentRanking[]>(`${this.apiUrl}/meta-evaluation/rankings${regimeParam}`).pipe(
      catchError(error => {
        console.error('Error getting agent rankings:', error);
        return of([]);
      })
    );
  }

  getRotationDecisions(limit: number = 10): Observable<RotationDecision[]> {
    if (this.demoMode) {
      return of([
        {
          timestamp: new Date().toISOString(),
          from_agent: 'RAG Event',
          to_agent: 'RL Strategy',
          symbol: 'NVDA',
          reason: 'Regime shift to high volatility favors RL adaptation',
          confidence: 0.89,
          regime: 'volatile',
          created_at: new Date().toISOString(),
          expected_improvement: 0.12
        },
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          from_agent: 'Momentum',
          to_agent: 'Meta-Evaluation',
          symbol: 'BTC-USD',
          reason: 'Trend exhaustion detected, shifting to ensemble',
          confidence: 0.92,
          regime: 'neutral',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          expected_improvement: 0.08
        }
      ]);
    }
    return this.http.get<RotationDecision[]>(`${this.apiUrl}/meta-evaluation-agent/rotations?limit=${limit}`).pipe(
      catchError(error => {
        console.error('Error getting rotation decisions:', error);
        return of([]);
      })
    );
  }

  getLatentPatternSummary(): Observable<LatentPatternSummary> {
    if (this.demoMode) {
      return of({
        total_patterns: 124,
        active_patterns: 18,
        pattern_accuracy: 0.82,
        compression_ratio: 4.5,
        last_analysis: new Date().toISOString(),
        analysis_enabled: true,
        last_updated: new Date().toISOString(),
        pattern_counts: { 'Triangles': 45, 'Head & Shoulders': 12, 'Flags': 28, 'Wedges': 39 },
        compression_metrics: [],
        recent_insights: []
      });
    }
    return this.http.get<LatentPatternSummary>(`${this.apiUrl}/latent-pattern-detector`).pipe(
      catchError(error => {
        console.error('Error getting Latent Pattern summary:', error);
        return of({
          total_patterns: 0,
          active_patterns: 0,
          pattern_accuracy: 0.0,
          compression_ratio: 0.0,
          last_analysis: new Date().toISOString(),
          analysis_enabled: true,
          last_updated: new Date().toISOString(),
          pattern_counts: {},
          compression_metrics: [],
          recent_insights: []
        });
      })
    );
  }

  getRLStrategyAgentSummary(): Observable<RLStrategyAgentSummary> {
    if (this.demoMode) {
      return of({
        total_episodes: 1540,
        current_episode: 1541,
        training_status: 'active',
        model_performance: 0.94,
        last_training: new Date().toISOString(),
        actions_taken: 45200,
        rewards_earned: 12500,
        exploration_rate: 0.05,
        last_updated: new Date().toISOString(),
        algorithm: 'PPO-Transformer',
        is_trained: true,
        training_episodes: 2000,
        model_accuracy: 0.89,
        performance_metrics: { total_return: 24.5, sharpe_ratio: 2.1, max_drawdown: 0.08, win_rate: 0.68 },
        training_metrics: { avg_episode_reward: 12.5, best_episode_reward: 18.2, exploration_rate: 0.05, experience_buffer_size: 10000 }
      });
    }
    return this.http.get<RLStrategyAgentSummary>(`${this.apiUrl}/rl-strategy-agent`).pipe(
      catchError(error => {
        console.error('Error getting RL Strategy Agent summary:', error);
        return of({
          total_episodes: 0,
          current_episode: 0,
          training_status: 'not_started',
          model_performance: 0.0,
          last_training: new Date().toISOString(),
          actions_taken: 0,
          rewards_earned: 0,
          exploration_rate: 0.1,
          last_updated: new Date().toISOString(),
          algorithm: 'PPO',
          is_trained: false,
          training_episodes: 0,
          model_accuracy: 0.0,
          performance_metrics: { total_return: 0.0, sharpe_ratio: 0.0, max_drawdown: 0.0, win_rate: 0.0 },
          training_metrics: { avg_episode_reward: 0.0, best_episode_reward: 0.0, exploration_rate: 0.1, experience_buffer_size: 0 }
        });
      })
    );
  }

  getRAGEventAgentSummary(): Observable<RAGEventAgentSummary> {
    if (this.demoMode) {
      return of({
        total_documents: 4520,
        vector_db_size: 12500,
        last_news_update: new Date().toISOString(),
        rag_accuracy: 0.88,
        llm_enabled: true,
        active_sources: 12,
        total_queries: 1450,
        avg_response_time: 350,
        avg_confidence: 0.92,
        last_updated: new Date().toISOString()
      });
    }
    return this.http.get<RAGEventAgentSummary>(`${this.apiUrl}/rag-event-agent/summary`).pipe(
      catchError(error => {
        console.error('Error getting RAG summary:', error);
        return of({
          total_documents: 0,
          vector_db_size: 0,
          last_news_update: new Date().toISOString(),
          rag_accuracy: 0,
          llm_enabled: false,
          active_sources: 0,
          total_queries: 0,
          avg_response_time: 0,
          avg_confidence: 0,
          last_updated: new Date().toISOString()
        });
      })
    );
  }

  getMetaEvaluationSummary(): Observable<MetaEvaluationSummary> {
    if (this.demoMode) {
      return of({
        total_evaluations: 1542,
        active_evaluations: 8,
        evaluation_accuracy: 0.94,
        last_evaluation: new Date().toISOString(),
        regime_analysis_enabled: true,
        last_updated: new Date().toISOString(),
        performance_summary: { avg_accuracy: 0.89, total_agents: 6 },
        current_regime: 'bull_trend',
        recent_rotations: []
      });
    }
    return this.http.get<MetaEvaluationSummary>(`${this.apiUrl}/meta-evaluation-agent`).pipe(
      catchError(error => {
        console.error('Error getting Meta-Evaluation summary:', error);
        return of({
          total_evaluations: 0,
          active_evaluations: 0,
          evaluation_accuracy: 0.0,
          last_evaluation: new Date().toISOString(),
          regime_analysis_enabled: true,
          last_updated: new Date().toISOString(),
          performance_summary: { avg_accuracy: 0.0, total_agents: 0 },
          current_regime: 'neutral',
          recent_rotations: []
        });
      })
    );
  }

  getRAGDocuments(): Observable<NewsDocument[]> {
    return this.http.get<NewsDocument[]>(`${this.apiUrl}/rag-event-agent/documents`).pipe(
      catchError(error => {
        console.error('Error getting RAG documents:', error);
        return of([]);
      })
    );
  }

  getRAGAnalysis(): Observable<RAGAnalysis> {
    if (this.demoMode) {
      return of({
        query: 'Impact of recent inflation data on tech sector',
        relevant_docs: [
          {
            doc_id: 'DOC-001',
            title: 'CPI Report Shows Cooling Inflation',
            content: 'Consumer prices rose less than expected...',
            source: 'Financial Times',
            url: 'https://example.com/cpi',
            category: 'Economy',
            tags: ['inflation', 'fed'],
            similarity_score: 0.92,
            timestamp: new Date().toISOString(),
            ingested_at: new Date().toISOString()
          },
          {
            doc_id: 'DOC-002',
            title: 'Tech Stocks Rally on Rate Cut Hopes',
            content: 'Technology sector surges as yields drop...',
            source: 'Bloomberg',
            url: 'https://example.com/tech-rally',
            category: 'Markets',
            tags: ['tech', 'rates'],
            similarity_score: 0.88,
            timestamp: new Date().toISOString(),
            ingested_at: new Date().toISOString()
          }
        ],
        llm_response: 'Based on the provided documents, the cooling inflation data is a positive catalyst for the tech sector. Lower inflation expectations increase the likelihood of Federal Reserve rate cuts, which disproportionately benefits growth stocks with distant cash flows. We observe a strong correlation between drop in 10-year yields and Nasdaq outperformance.',
        confidence: 0.94,
        reasoning: 'Multi-source confirmation of bullish macro tailwinds for technology assets.',
        analysis_type: 'sector_impact',
        response_time_ms: 1250,
        created_at: new Date().toISOString()
      });
    }
    return this.http.get<RAGAnalysis>(`${this.apiUrl}/rag-event-agent/analysis`).pipe(
      catchError(error => {
        console.error('Error getting RAG analysis:', error);
        return of({
          query: 'No analysis available',
          relevant_docs: [],
          llm_response: 'No LLM response available',
          confidence: 0,
          reasoning: 'No reasoning available',
          analysis_type: 'none',
          response_time_ms: 0,
          created_at: new Date().toISOString()
        });
      })
    );
  }

  getRAGPerformance(): Observable<RAGPerformance> {
    return this.http.get<RAGPerformance>(`${this.apiUrl}/rag-event-agent/performance`).pipe(
      catchError(error => {
        console.error('Error getting RAG performance:', error);
        return of({
          metrics: {
            query_processing_rate: { value: 0, unit: 'queries/min', timestamp: new Date().toISOString() },
            llm_confidence_score: { value: 0, unit: 'score', timestamp: new Date().toISOString() },
            document_retrieval_success: { value: 0, unit: 'rate', timestamp: new Date().toISOString() },
            avg_response_time: { value: 0, unit: 'ms', timestamp: new Date().toISOString() },
            rag_accuracy: { value: 0, unit: 'score', timestamp: new Date().toISOString() }
          },
          last_updated: new Date().toISOString()
        });
      })
    );
  }

  getSectorAnalysis(sector: string): Observable<RAGAnalysis> {
    return this.http.get<RAGAnalysis>(`${this.apiUrl}/rag-event-agent/sector-analysis/${sector}`).pipe(
      catchError(error => {
        console.error(`Error getting ${sector} sector analysis:`, error);
        return of({
          query: `No ${sector} analysis available`,
          sector: sector,
          relevant_docs: [],
          llm_response: `No ${sector} LLM response available`,
          confidence: 0,
          reasoning: `No ${sector} reasoning available`,
          analysis_type: `${sector}_impact`,
          response_time_ms: 0,
          created_at: new Date().toISOString()
        });
      })
    );
  }

  getLatestRAGAnalysis(): Observable<{success: boolean, sector_analyses: any, last_updated: string}> {
    return this.http.get<{success: boolean, sector_analyses: any, last_updated: string}>(`${this.apiUrl}/rag-event-agent/latest-analysis`).pipe(
      catchError(error => {
        console.error('Error getting latest RAG analysis:', error);
        return of({
          success: false,
          sector_analyses: {},
          last_updated: new Date().toISOString()
        });
      })
    );
  }

  getRLTrainingStatus(): Observable<any> {
    if (this.demoMode) {
      return of({
        status: 'training',
        current_step: 15420,
        total_steps: 1000000,
        loss: 0.045,
        entropy: 0.12,
        learning_rate: 0.0003,
        last_updated: new Date().toISOString()
      });
    }
    return this.http.get<any>(`${this.apiUrl}/rl-strategy-agent/training-status`).pipe(
      catchError(error => {
        console.error('Error getting RL training status:', error);
        return of({});
      })
    );
  }

  getRLPerformance(): Observable<any> {
    if (this.demoMode) {
      return of({
        total_profit: 24500,
        win_rate: 0.68,
        sharpe_ratio: 2.1,
        max_drawdown: 0.08,
        total_trades: 452,
        avg_trade_profit: 54.2,
        last_updated: new Date().toISOString()
      });
    }
    return this.http.get<any>(`${this.apiUrl}/rl-strategy-agent/performance`).pipe(
      catchError(error => {
        console.error('Error getting RL performance:', error);
        return of({});
      })
    );
  }

  getRLActions(): Observable<any[]> {
    if (this.demoMode) {
      return of([
        { action: 'BUY', symbol: 'NVDA', quantity: 15, price: 777.50, timestamp: new Date().toISOString(), reason: 'Momentum signal confirmation' },
        { action: 'SELL', symbol: 'TSLA', quantity: 10, price: 245.30, timestamp: new Date(Date.now() - 3600000).toISOString(), reason: 'Profit target reached' },
        { action: 'HOLD', symbol: 'BTC-USD', quantity: 0, price: 65000, timestamp: new Date(Date.now() - 7200000).toISOString(), reason: 'Trend continuation likely' }
      ]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/rl-strategy-agent/actions`).pipe(
      catchError(error => {
        console.error('Error getting RL actions:', error);
        return of([]);
      })
    );
  }

  getAgentWeights(): Observable<any[]> {
    if (this.demoMode) {
      return of([
        { agent_name: 'RL Strategy', weight: 0.45 },
        { agent_name: 'Meta-Evaluation', weight: 0.30 },
        { agent_name: 'RAG Event', weight: 0.25 }
      ]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/agent-router/weights`).pipe(
      catchError(error => {
        console.error('Error getting agent weights:', error);
        return of([]);
      })
    );
  }

  getRoutingDecisions(limit: number = 10): Observable<any[]> {
    return this.getRotationDecisions(limit);
  }

  getExecutionAgentSummary(): Observable<any> {
    if (this.demoMode) {
      return of({
        active_orders: 5,
        executed_orders_today: 142,
        total_volume: 4500000,
        avg_slippage: 0.0001,
        execution_efficiency: 0.98,
        last_updated: new Date().toISOString()
      });
    }
    return this.http.get<any>(`${this.apiUrl}/execution-agent/summary`).pipe(
      catchError(error => {
        console.error('Error getting execution agent summary:', error);
        return of({});
      })
    );
  }

  getCompressionMetrics(): Observable<any> {
    if (this.demoMode) {
      return of({
        compression_ratio: 4.5,
        original_size: 10240,
        compressed_size: 2275,
        method: 'Autoencoder',
        last_updated: new Date().toISOString()
      });
    }
    return this.http.get<any>(`${this.apiUrl}/latent-pattern-detector/metrics`).pipe(
      catchError(error => {
        console.error('Error getting compression metrics:', error);
        return of({});
      })
    );
  }

  getRegimeAnalysis(): Observable<any> {
    // Alias for getRAGAnalysis or specific regime endpoint
    return this.getRAGAnalysis();
  }

  getRiskAlerts(): Observable<RiskAlert[]> {
    if (this.demoMode) {
      return of([
        { id: '1', level: 'high', message: 'Volatility spike detected in Tech Sector', timestamp: new Date().toISOString() },
        { id: '2', level: 'medium', message: 'Liquidity thin on weekend trading', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', level: 'low', message: 'Portfolio beta deviation > 5%', timestamp: new Date(Date.now() - 7200000).toISOString() }
      ] as any[]);
    }
    return this.http.get<RiskAlert[]>(`${this.apiUrl}/risk-analysis/alerts`).pipe(
      catchError(error => {
        console.error('Error getting risk alerts:', error);
        return of([]);
      })
    );
  }
}
