import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
      <!-- Background Gradients -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/20 rounded-full blur-[120px] -z-10 opacity-50"></div>
      <div class="absolute bottom-0 right-0 w-[800px] h-[400px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] -z-10 opacity-30"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <!-- Text Content -->
          <div class="max-w-2xl">
            <h1 class="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
              <span class="inline-block animate-word" style="animation-delay: 0.2s">Radically</span>
              <span class="inline-block animate-word" style="animation-delay: 0.4s">&nbsp;better</span>
              <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 inline-block animate-word" style="animation-delay: 0.6s">AI&nbsp;Trading</span>
              <span class="inline-block animate-word" style="animation-delay: 0.8s">&nbsp;stack</span>
            </h1>
            <p class="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
              Stop trading in the dark. Nexus AI provides institutional-grade predictive analytics, real-time signal generation, and automated portfolio management.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <div class="relative">
                <input type="email" placeholder="Enter your email" class="w-full sm:w-64 px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all">
              </div>
              <button class="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 transform">
                Start for free
              </button>
            </div>

            <div class="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>No credit card required</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          <!-- Hero Animation -->
          <div class="relative perspective-1000 group">
            <!-- Floating Elements -->
            <div class="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>

            <!-- Main Dashboard Card style -->
            <div class="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden transform transition-transform duration-700 hover:rotate-y-12 rotate-y-6 hover:scale-105">
              <!-- Header -->
              <div class="bg-gray-50 dark:bg-slate-800/80 px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div class="mx-auto text-xs text-slate-500 dark:text-slate-400 font-mono">nexus-ai-terminal</div>
              </div>

              <!-- Content Mockup -->
              <div class="p-6 space-y-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
                <!-- Chart Area -->
                <div class="h-32 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700/50 relative overflow-hidden">
                  <div class="absolute bottom-0 left-0 right-0 h-24 opacity-10 dark:opacity-20 bg-gradient-to-t from-indigo-500 to-transparent"></div>
                  <svg class="w-full h-full text-indigo-500" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0 80 C 20 70, 40 90, 60 50 S 80 40, 100 20" stroke="currentColor" stroke-width="2" fill="none" />
                  </svg>

                  <!-- Floating Price Tag -->
                  <div class="absolute top-4 right-4 px-3 py-1 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 dark:border-indigo-500/30">
                    +24.5%
                  </div>
                </div>

                <!-- Metrics -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700/50">
                    <div class="text-xs text-slate-500 mb-1">Prediction Confidence</div>
                    <div class="text-lg font-bold text-emerald-500 dark:text-emerald-400">98.2%</div>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700/50">
                    <div class="text-xs text-slate-500 mb-1">Active Signals</div>
                    <div class="text-lg font-bold text-blue-500 dark:text-blue-400">1,245</div>
                  </div>
                </div>

                <!-- Terminal Output -->
                <div class="h-24 bg-slate-900 dark:bg-black rounded-lg p-3 font-mono text-[10px] text-green-400 overflow-hidden leading-relaxed opacity-90 dark:opacity-80 shadow-inner">
                  <div>> Initializing Neural Network...</div>
                  <div>> Loading market data vectors... [Done]</div>
                  <div>> Analyzing latent patterns...</div>
                  <div>> Detected: Bullish divergence on BTC-USD</div>
                  <div class="animate-pulse">> Generating trade signal..._</div>
                </div>
              </div>
            </div>

            <!-- Floating Badge -->
            <div class="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 animate-bounce-slow">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span class="text-xl">🚀</span>
                </div>
                <div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">Total Profit</div>
                  <div class="text-lg font-bold text-slate-900 dark:text-white">+$12,450.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .perspective-1000 {
      perspective: 1000px;
    }
    .rotate-y-6 {
      transform: rotateY(-6deg) rotateX(2deg);
    }
    .hover\\:rotate-y-12:hover {
      transform: rotateY(-12deg) rotateX(4deg) scale(1.02);
    }
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-bounce-slow {
      animation: bounce-slow 3s infinite ease-in-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
      to { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    .animate-word {
      opacity: 0;
      animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
  `]
})
export class HeroComponent {}
