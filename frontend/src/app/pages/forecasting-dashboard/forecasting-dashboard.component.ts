import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';
import { SystemStatusService } from '../../services/system-status.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface DayForecast {
  symbol: string;
  horizon: string;
  predicted_price: number;
  current_price?: number;
  confidence: number;
  direction: string;
  signal_strength: string;
  market_regime: string;
  technical_indicators: TechnicalIndicator[];
  volatility_forecast: number;
  volume_forecast: number;
  risk_score: number;
  created_at: string;
  valid_until: string;
}

interface SwingForecast {
  symbol: string;
  horizon: string;
  predicted_price: number;
  current_price?: number;
  confidence: number;
  direction: string;
  signal_strength: string;
  market_regime: string;
  key_events: MarketEvent[];
  macro_factors: MacroFactor[];
  technical_score: number;
  fundamental_score: number;
  sentiment_score: number;
  risk_score: number;
  target_price: number;
  stop_loss: number;
  created_at: string;
  valid_until: string;
}

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: string;
  strength: number;
  timestamp: string;
}

interface MarketEvent {
  event_id: string;
  event_type: string;
  symbol: string;
  impact: string;
  expected_date: string;
  description: string;
  historical_impact: number;
  confidence: number;
}

interface MacroFactor {
  name: string;
  value: number;
  previous_value: number;
  change: number;
  change_percent: number;
  impact_score: number;
  last_updated: string;
}

interface ForecastComparison {
  symbol: string;
  day_forecast: any;
  swing_forecast: any;
  comparison: {
    direction_agreement: boolean;
    confidence_difference: number;
    price_difference: number;
    risk_difference: number;
    recommended_strategy: string;
  };
  generated_at: string;
}

interface ForecastSummary {
  agent_type: string;
  forecast_horizons: string[];
  active_forecasts: number;
  total_forecasts: number;
  recent_forecasts: any[];
  metrics: any;
  last_updated: string;
  market_events?: number;
  macro_indicators?: number;
}

@Component({
  selector: 'app-forecasting-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonComponent],
  templateUrl: './forecasting-dashboard.component.html',
  styleUrls: ['./forecasting-dashboard.component.css']
})
export class ForecastingDashboardComponent implements OnInit, OnDestroy {
  // Data properties
  dayForecasts: DayForecast[] = [];
  swingForecasts: SwingForecast[] = [];
  forecastComparison: ForecastComparison | null = null;
  dayForecastSummary: ForecastSummary | null = null;
  swingForecastSummary: ForecastSummary | null = null;

  // RAG Analysis data
  latestRAGAnalysis: any = null;
  expandedRAGSectors: Set<string> = new Set();

  // API configuration
  apiUrl = 'http://localhost:8001';

  // UI state
  activeTab = 'day-forecasts';
  isLoading = false;
  error: string | null = null;
  autoRefresh = true;
  refreshInterval = 60000; // 1 minute

  // Loading states
  isLoadingSummary = true;
  isLoadingDayForecasts = true;
  isLoadingSwingForecasts = true;
  isLoadingComparison = true;
  isLoadingRAGAnalysis = true;

  // Form data
  selectedSymbol = 'BTC-USD';
  selectedDayHorizon = 'end_of_day';
  selectedSwingHorizon = 'medium_swing';

  // Available options
  symbols: string[] = [];

  // Filter options
  selectedDayFilter = 'all';
  selectedSwingFilter = 'all';
  filterOptions = [
    { value: 'all', label: 'All Signals' },
    { value: 'BUY', label: 'BUY' },
    { value: 'HOLD', label: 'HOLD' },
    { value: 'SELL', label: 'SELL' }
  ];
  dayHorizons = [
    { value: 'intraday', label: 'Intraday (1-4 hours)' },
    { value: 'end_of_day', label: 'End of Day' },
    { value: 'next_day_open', label: 'Next Day Open' },
    { value: 'next_day_close', label: 'Next Day Close' }
  ];
  swingHorizons = [
    { value: 'short_swing', label: 'Short Swing (3-5 days)' },
    { value: 'medium_swing', label: 'Medium Swing (5-7 days)' },
    { value: 'long_swing', label: 'Long Swing (7-10 days)' }
  ];

  // Advanced Forecasting
  advancedForecasts: any[] = [];
  isLoadingAdvanced = false;
  selectedAdvancedFilter = 'all';

  // Expand/Collapse state
  expandedDayForecasts: Set<string> = new Set();
  expandedSwingForecasts: Set<string> = new Set();
  expandedAdvancedForecasts: Set<string> = new Set();

  // Sorting state
  daySortColumn: string = 'symbol';
  daySortDirection: 'asc' | 'desc' = 'asc';
  swingSortColumn: string = 'symbol';
  swingSortDirection: 'asc' | 'desc' = 'asc';
  advancedSortColumn: string = 'symbol';
  advancedSortDirection: 'asc' | 'desc' = 'asc';

  // Subscriptions
  private refreshSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private systemStatusService: SystemStatusService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadManagedSymbols();
    this.loadAllData();
    this.loadGeneratedForecasts();
    this.loadLatestRAGAnalysis();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // --- Helpers ---
  toggleDayForecastExpansion(symbol: string): void {
    if (this.expandedDayForecasts.has(symbol)) {
      this.expandedDayForecasts.delete(symbol);
    } else {
      this.expandedDayForecasts.add(symbol);
    }
  }

  toggleSwingForecastExpansion(symbol: string): void {
    if (this.expandedSwingForecasts.has(symbol)) {
      this.expandedSwingForecasts.delete(symbol);
    } else {
      this.expandedSwingForecasts.add(symbol);
    }
  }

  toggleAdvancedForecastExpansion(symbol: string): void {
    if (this.expandedAdvancedForecasts.has(symbol)) {
      this.expandedAdvancedForecasts.delete(symbol);
    } else {
      this.expandedAdvancedForecasts.add(symbol);
    }
  }

  isDayForecastExpanded(symbol: string): boolean {
    return this.expandedDayForecasts.has(symbol);
  }

  isSwingForecastExpanded(symbol: string): boolean {
    return this.expandedSwingForecasts.has(symbol);
  }

  isAdvancedForecastExpanded(symbol: string): boolean {
    return this.expandedAdvancedForecasts.has(symbol);
  }

  trackBySymbol(index: number, forecast: any): string {
    return forecast.symbol;
  }

  sortDayForecasts(column: string): void {
    if (this.daySortColumn === column) {
      this.daySortDirection = this.daySortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.daySortColumn = column;
      this.daySortDirection = 'asc';
    }
    this.dayForecasts.sort((a, b) => this.compareValues(a, b, column, this.daySortDirection));
  }

  sortSwingForecasts(column: string): void {
    if (this.swingSortColumn === column) {
      this.swingSortDirection = this.swingSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.swingSortColumn = column;
      this.swingSortDirection = 'asc';
    }
    this.swingForecasts.sort((a, b) => this.compareValues(a, b, column, this.swingSortDirection));
  }

  sortAdvancedForecasts(column: string): void {
    if (this.advancedSortColumn === column) {
      this.advancedSortDirection = this.advancedSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.advancedSortColumn = column;
      this.advancedSortDirection = 'asc';
    }
    this.advancedForecasts.sort((a, b) => this.compareValues(a, b, column, this.advancedSortDirection));
  }

  private compareValues(a: any, b: any, column: string, direction: 'asc' | 'desc'): number {
    let aValue: any;
    let bValue: any;

    switch (column) {
      case 'symbol':
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      case 'signal':
        aValue = a.direction || a.final_signal;
        bValue = b.direction || b.final_signal;
        break;
      case 'confidence':
        aValue = a.confidence || a.final_confidence;
        bValue = b.confidence || b.final_confidence;
        break;
      case 'predicted_price':
        aValue = a.predicted_price;
        bValue = b.predicted_price;
        break;
      case 'target_price':
        aValue = a.target_price;
        bValue = b.target_price;
        break;
      case 'risk':
        aValue = a.risk_score;
        bValue = b.risk_score;
        break;
      case 'valid_until':
        aValue = a.valid_until ? new Date(a.valid_until).getTime() : 0;
        bValue = b.valid_until ? new Date(b.valid_until).getTime() : 0;
        break;
      case 'market_regime':
        aValue = a.market_regime;
        bValue = b.market_regime;
        break;
      case 'agents':
        aValue = a.total_agents_contributing || 0;
        bValue = b.total_agents_contributing || 0;
        break;
      default:
        aValue = a[column];
        bValue = b[column];
    }

    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';

    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else {
      comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }

    return direction === 'asc' ? comparison : -comparison;
  }

  getSortIcon(column: string, sortColumn: string, sortDirection: 'asc' | 'desc'): string {
    if (column !== sortColumn) {
      return '';
    }
    return sortDirection === 'asc' ? '▲' : '▼';
  }

  private parseTechnicalIndicators(indicators: any): TechnicalIndicator[] {
    if (!indicators) return [];
    if (Array.isArray(indicators)) return indicators;

    if (typeof indicators === 'string') {
      try {
        const parsed = JSON.parse(indicators);
        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          return this.convertDictToArray(parsed);
        }
        if (Array.isArray(parsed)) return parsed;
        return [];
      } catch (e) {
        console.error('Error parsing technical indicators:', e);
        return [];
      }
    }
    return [];
  }

  private convertDictToArray(dict: any): TechnicalIndicator[] {
    const indicators: TechnicalIndicator[] = [];
    if (dict.rsi !== undefined) {
      indicators.push({
        name: 'RSI',
        value: dict.rsi,
        signal: dict.rsi < 30 ? 'buy' : dict.rsi > 70 ? 'sell' : 'hold',
        strength: Math.abs(dict.rsi - 50) / 50,
        timestamp: new Date().toISOString()
      });
    }
    if (dict.macd !== undefined) {
      indicators.push({
        name: 'MACD',
        value: dict.macd,
        signal: dict.macd > 0 ? 'buy' : dict.macd < -0.5 ? 'sell' : 'hold',
        strength: Math.min(1.0, Math.abs(dict.macd) * 2),
        timestamp: new Date().toISOString()
      });
    }
    if (dict.bollinger_position !== undefined) {
      indicators.push({
        name: 'Bollinger',
        value: dict.bollinger_position,
        signal: dict.bollinger_position < 0.2 ? 'buy' : dict.bollinger_position > 0.8 ? 'sell' : 'hold',
        strength: Math.abs(dict.bollinger_position - 0.5) * 2,
        timestamp: new Date().toISOString()
      });
    }
    if (dict.volume_trend !== undefined) {
      indicators.push({
        name: 'Volume',
        value: dict.volume_trend === 'increasing' ? 1.0 : 0.0,
        signal: dict.volume_trend === 'increasing' ? 'buy' : 'sell',
        strength: 0.7,
        timestamp: new Date().toISOString()
      });
    }
    return indicators;
  }

  private parseJsonField(field: any, defaultValue: any = null): any {
    if (!field) return defaultValue;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        console.error('Error parsing JSON field:', e);
        return defaultValue;
      }
    }
    return field;
  }

  loadManagedSymbols(): void {
    this.http.get<any>('http://localhost:8001/symbols/managed-with-market-data')
      .pipe(
        catchError(error => {
          console.error('Error loading managed symbols:', error);
          this.symbols = ['BTC-USD', 'SOXL', 'NVDA', 'RIVN', 'TSLA', 'SPY', 'META', 'AMD', 'INTC', 'TQQQ'];
          return of(null);
        })
      )
      .subscribe(response => {
        if (response && response.symbols) {
          this.symbols = response.symbols.map((symbol: any) => symbol.symbol);
          if (this.symbols.length > 0 && !this.symbols.includes(this.selectedSymbol)) {
            this.selectedSymbol = this.symbols[0];
          }
        }
      });
  }

  startAutoRefresh(): void {
    if (this.autoRefresh) {
      this.refreshSubscription = interval(this.refreshInterval)
        .subscribe(() => {
          this.loadAllData();
        });
    }
  }

  stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadAllData(): void {
    this.isLoading = true;
    this.error = null;
    this.isLoadingSummary = true;

    this.http.get<ForecastSummary>('http://localhost:8001/forecasting/day-forecast/summary')
      .pipe(catchError(error => {
        console.error('Error loading day forecast summary:', error);
        return of(null);
      }))
      .subscribe(data => {
        this.dayForecastSummary = data;
      });

    this.http.get<ForecastSummary>('http://localhost:8001/forecasting/swing-forecast/summary')
      .pipe(catchError(error => {
        console.error('Error loading swing forecast summary:', error);
        return of(null);
      }))
      .subscribe(data => {
        this.swingForecastSummary = data;
        this.isLoading = false;
        this.isLoadingSummary = false;
      });

    this.loadGeneratedForecasts();
  }

  loadLatestRAGAnalysis(): void {
    this.isLoadingRAGAnalysis = true;
    this.systemStatusService.getLatestRAGAnalysis().subscribe({
      next: (data) => {
        this.latestRAGAnalysis = data;
        this.isLoadingRAGAnalysis = false;
      },
      error: (error) => {
        console.error('Error loading latest RAG analysis:', error);
        this.isLoadingRAGAnalysis = false;
      }
    });
  }

  loadGeneratedForecasts(): void {
    this.http.get<any[]>(`${this.apiUrl}/forecasting/day-forecasts`)
      .pipe(catchError(error => { console.error('Error loading day forecasts from database:', error); return of([]); }))
      .subscribe(forecasts => {
        this.dayForecasts = forecasts.map(forecast => ({
          ...forecast,
          technical_indicators: this.parseTechnicalIndicators(forecast.technical_indicators)
        }));
        this.isLoadingDayForecasts = false;
      });

    this.http.get<any[]>(`${this.apiUrl}/forecasting/swing-forecasts`)
      .pipe(catchError(error => { console.error('Error loading swing forecasts from database:', error); return of([]); }))
      .subscribe(forecasts => {
        this.swingForecasts = forecasts.map(forecast => ({
          ...forecast,
          technical_indicators: this.parseTechnicalIndicators(forecast.technical_indicators),
          key_events: this.parseJsonField(forecast.key_events),
          macro_factors: this.parseJsonField(forecast.macro_factors)
        }));
        this.isLoadingSwingForecasts = false;
      });

    this.http.get<any>(`${this.apiUrl}/forecasting/advanced-forecasts`)
      .pipe(catchError(error => { console.error('Error loading advanced forecasts from database:', error); return of([]); }))
      .subscribe(response => {
        let forecasts = [];
        if (response && response.forecasts && Array.isArray(response.forecasts)) {
          forecasts = response.forecasts;
        } else if (Array.isArray(response)) {
          forecasts = response;
        }

        this.advancedForecasts = forecasts.map((forecast: any) => ({
          ...forecast,
          agent_contributions: this.parseJsonField(forecast.agent_contributions, []),
          latent_patterns: this.parseJsonField(forecast.latent_patterns, []),
          signal_distribution: this.parseJsonField(forecast.signal_distribution, {}),
          ensemble_signal: this.parseJsonField(forecast.ensemble_signal, null),
          rag_analysis: this.parseJsonField(forecast.rag_analysis, null),
          rl_recommendation: this.parseJsonField(forecast.rl_recommendation, null),
          meta_evaluation: this.parseJsonField(forecast.meta_evaluation, null)
        }));
      });

    const savedComparison = localStorage.getItem('forecastComparison');
    if (savedComparison) {
      try {
        this.forecastComparison = JSON.parse(savedComparison);
      } catch (e) {
        console.error('Error parsing saved forecast comparison:', e);
      }
    }
    this.isLoadingComparison = false;
  }

  saveGeneratedForecasts(): void {
    if (this.dayForecasts.length > 0) {
      this.http.post(`${this.apiUrl}/forecasting/day-forecasts/save`, this.dayForecasts)
        .pipe(catchError(error => { console.error('Error saving day forecasts to database:', error); return of(null); }))
        .subscribe();
    }
    if (this.swingForecasts.length > 0) {
      this.http.post(`${this.apiUrl}/forecasting/swing-forecasts/save`, this.swingForecasts)
        .pipe(catchError(error => { console.error('Error saving swing forecasts to database:', error); return of(null); }))
        .subscribe();
    }
    if (this.forecastComparison) {
      localStorage.setItem('forecastComparison', JSON.stringify(this.forecastComparison));
    }
  }

  getSignalStrength(confidence: number): string {
    if (confidence >= 0.8) return 'Strong';
    if (confidence >= 0.6) return 'Medium';
    if (confidence >= 0.4) return 'Weak';
    return 'Very Weak';
  }

  getPriceChange(currentPrice: number | undefined | null, predictedPrice: number | undefined | null): number {
    if (!currentPrice || !predictedPrice) return 0;
    return ((predictedPrice - currentPrice) / currentPrice) * 100;
  }

  get filteredDayForecasts(): DayForecast[] {
    if (this.selectedDayFilter === 'all') return this.dayForecasts;
    return this.dayForecasts.filter(forecast => forecast.direction.toUpperCase() === this.selectedDayFilter);
  }

  get filteredSwingForecasts(): SwingForecast[] {
    if (this.selectedSwingFilter === 'all') return this.swingForecasts;
    return this.swingForecasts.filter(forecast => forecast.direction.toUpperCase() === this.selectedSwingFilter);
  }

  get filteredAdvancedForecasts(): any[] {
    if (this.selectedAdvancedFilter === 'all') return this.advancedForecasts;
    return this.advancedForecasts.filter(forecast => forecast.final_signal === this.selectedAdvancedFilter);
  }

  getSignalCount(forecasts: any[], signal: string): number {
    if (!forecasts || forecasts.length === 0) return 0;
    return forecasts.filter(forecast =>
      (forecast.direction?.toUpperCase() === signal) || (forecast.final_signal === signal)
    ).length;
  }

  generateForecasts(): void {
    this.isLoading = true;
    this.isLoadingDayForecasts = true;
    this.isLoadingSwingForecasts = true;
    this.error = null;

    const dayForecast$ = this.http.get<any>(`http://localhost:8001/forecasting/day-forecast?symbol=${this.selectedSymbol}&horizon=${this.selectedDayHorizon}`);
    const swingForecast$ = this.http.get<any>(`http://localhost:8001/forecasting/swing-forecast?symbol=${this.selectedSwingHorizon}&horizon=${this.selectedSwingHorizon}`);

    forkJoin([dayForecast$, swingForecast$])
      .pipe(catchError(error => {
        console.error('Error generating forecasts:', error);
        return of([null, null]);
      }))
      .subscribe(([dayResult, swingResult]) => {
        this.isLoading = false;
        this.isLoadingDayForecasts = false;
        this.isLoadingSwingForecasts = false;

        if (dayResult) this.dayForecasts = [dayResult];
        if (swingResult) this.swingForecasts = [swingResult];

        this.saveGeneratedForecasts();
        this.loadForecastComparison();
      });
  }

  generateForecastsForAllSymbols(): void {
    this.isLoading = true;
    this.isLoadingDayForecasts = true;
    this.isLoadingSwingForecasts = true;
    this.error = null;

    this.http.get<any>('http://localhost:8001/forecasting/generate-all-forecasts')
      .pipe(catchError(error => {
          console.error('Error generating forecasts for all symbols:', error);
          this.error = 'Failed to generate forecasts for all symbols';
          this.isLoading = false;
          this.isLoadingDayForecasts = false;
          this.isLoadingSwingForecasts = false;
          return of(null);
      }))
      .subscribe(response => {
        this.isLoading = false;
        this.isLoadingDayForecasts = false;
        this.isLoadingSwingForecasts = false;

        if (response) {
          const dayForecasts: DayForecast[] = [];
          const swingForecasts: SwingForecast[] = [];

          response.results.forEach((result: any) => {
            if (result.status === 'success') {
              if (result.day_forecast) {
                const dayForecast = result.day_forecast;
                dayForecasts.push({
                  symbol: dayForecast.symbol,
                  horizon: dayForecast.horizon,
                  predicted_price: dayForecast.target_price,
                  current_price: dayForecast.current_price,
                  confidence: dayForecast.confidence,
                  direction: dayForecast.signal_type.toUpperCase(),
                  signal_strength: this.getSignalStrength(dayForecast.confidence),
                  market_regime: 'normal',
                  technical_indicators: [],
                  volatility_forecast: dayForecast.volatility_prediction,
                  volume_forecast: dayForecast.volume_prediction,
                  risk_score: dayForecast.risk_score,
                  created_at: dayForecast.timestamp,
                  valid_until: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
                });
              }
              if (result.swing_forecast) {
                const swingForecast = result.swing_forecast;
                swingForecasts.push({
                  symbol: swingForecast.symbol,
                  horizon: swingForecast.horizon,
                  predicted_price: swingForecast.target_price,
                  current_price: 0,
                  confidence: swingForecast.confidence,
                  direction: swingForecast.signal_type.toUpperCase(),
                  signal_strength: this.getSignalStrength(swingForecast.confidence),
                  market_regime: 'normal',
                  key_events: [],
                  macro_factors: [],
                  technical_score: 0.7,
                  fundamental_score: 0.6,
                  sentiment_score: 0.5,
                  risk_score: swingForecast.risk_score,
                  target_price: swingForecast.target_price,
                  stop_loss: swingForecast.stop_loss,
                  created_at: swingForecast.timestamp,
                  valid_until: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
                });
              }
            }
          });

          this.dayForecasts = dayForecasts;
          this.swingForecasts = swingForecasts;
          this.saveGeneratedForecasts();
        }
      });
  }

  loadForecastComparison(): void {
    if (this.dayForecasts.length > 0 && this.swingForecasts.length > 0) {
      const symbol = this.selectedSymbol;
      const dayForecast = this.dayForecasts.find(f => f.symbol === symbol);
      const swingForecast = this.swingForecasts.find(f => f.symbol === symbol);

      if (dayForecast && swingForecast) {
        this.isLoadingComparison = true;
        this.http.post<any>('http://localhost:8001/forecasting/compare-forecasts', { day_forecast: dayForecast, swing_forecast: swingForecast })
          .pipe(catchError(error => { console.error('Error comparing forecasts:', error); this.isLoadingComparison = false; return of(null); }))
          .subscribe(comparison => {
            if (comparison) this.forecastComparison = comparison;
            this.isLoadingComparison = false;
          });
      }
    }
  }

  // --- Helper Methods ---

  formatCurrency(value: number | undefined | null): string {
    if (value === undefined || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  formatPercent(value: number | undefined | null): string {
    if (value === undefined || value === null) return '0%';
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
  }

  formatNumber(value: number | undefined | null, digits: number = 0): string {
    if (value === undefined || value === null) return '0';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  }

  getTimeRemaining(validUntil: string): string {
    if (!validUntil) return '';
    const now = new Date().getTime();
    const end = new Date(validUntil).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'text-emerald-400';
    if (confidence >= 0.6) return 'text-emerald-300';
    if (confidence >= 0.4) return 'text-amber-400';
    return 'text-red-400';
  }

  getRiskColor(risk: number): string {
    if (risk < 0.3) return 'text-emerald-400';
    if (risk < 0.6) return 'text-amber-400';
    return 'text-red-400';
  }

  formatTimestamp(timestamp: string): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  }

  getSectorIcon(sector: string): string {
    switch (sector?.toLowerCase()) {
      case 'technology': return '💻';
      case 'finance': return '💰';
      case 'healthcare': return '🏥';
      case 'retail': return '🛒';
      default: return '📊';
    }
  }

  formatMarkdown(text: string): SafeHtml {
    if (!text) return '';
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n- /g, '<br>• ');

    // @ts-ignore
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  isRAGSectorExpanded(sector: string): boolean {
    return this.expandedRAGSectors.has(sector);
  }

  toggleRAGSectorExpansion(sector: string): void {
    if (this.expandedRAGSectors.has(sector)) {
      this.expandedRAGSectors.delete(sector);
    } else {
      this.expandedRAGSectors.add(sector);
    }
  }
}
