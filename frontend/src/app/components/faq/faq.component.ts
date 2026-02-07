import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-slate-900/50 border-t border-b border-white/5 relative overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[80px] -z-10"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[80px] -z-10"></div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p class="text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about Nexus AI and how it transforms your trading workflow.
          </p>
        </div>

        <div class="space-y-4">
          <div *ngFor="let faq of faqs; let i = index"
               class="border border-white/5 rounded-lg bg-slate-800/20 hover:bg-slate-800/40 transition-colors overflow-hidden">
            <button (click)="toggleFaq(i)" class="w-full flex items-center justify-between p-6 text-left focus:outline-none">
              <span class="text-lg font-medium text-slate-200">{{ faq.question }}</span>
              <svg class="w-5 h-5 text-indigo-400 transform transition-transform duration-300"
                   [class.rotate-180]="faq.isOpen"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div class="px-6 pb-6 text-slate-400 leading-relaxed"
                 [class.hidden]="!faq.isOpen"
                 [@fadeIn]>
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class FaqComponent {
  faqs = [
    {
      question: 'How does Nexus AI predict market movements?',
      answer: 'Nexus AI utilizes a multi-agent reinforcement learning system combined with advanced transformer models to analyze millions of data points across price action, sentiment, and macroeconomic indicators in real-time.',
      isOpen: false
    },
    {
      question: 'Is the data provided in real-time?',
      answer: 'Yes, our system processes market data with sub-millisecond latency. The dashboard updates automatically via WebSocket connections to ensure you always have the latest information.',
      isOpen: false
    },
    {
      question: 'Can I automate my trading strategies?',
      answer: 'Absolutely. Using our Execution Agent, you can set specific parameters and risk limits, allowing the AI to execute trades on your behalf with precision and discipline.',
      isOpen: false
    },
    {
      question: 'What assets are supported?',
      answer: 'Currently, Nexus AI supports major US equities, cryptocurrencies (BTC, ETH, SOL), and select commodities. We are continuously expanding our coverage based on user demand.',
      isOpen: false
    },
    {
      question: 'How is risk managed?',
      answer: 'Risk management is built into the core. Our Risk Agent continuously monitors portfolio exposure, volatility, and drawdown, automatically adjusting positions to stay within your defined risk tolerance.',
      isOpen: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
