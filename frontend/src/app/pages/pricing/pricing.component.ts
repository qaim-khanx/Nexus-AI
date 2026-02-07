import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-[#0b1120] py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-4xl text-center">
          <h2 class="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Pricing</h2>
          <p class="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Institutional-grade AI for everyone.
          </p>
          <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Choose the plan that fits your trading style. From casual investing to algorithmic dominance.
          </p>
        </div>

        <div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">

          <!-- Starter Tier -->
          <div class="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 p-8 ring-1 ring-gray-200 dark:ring-white/10 xl:p-10 transition-all hover:scale-105 duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
            <div>
              <div class="flex items-center justify-between gap-x-4">
                <h3 id="tier-starter" class="text-lg font-semibold leading-8 text-gray-900 dark:text-white">Starter</h3>
              </div>
              <p class="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">Perfect for getting started with AI-assisted trading.</p>
              <p class="mt-6 flex items-baseline gap-x-1">
                <span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">$0</span>
                <span class="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">/month</span>
              </p>
              <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Access to Dashboard
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Basic Market News
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Daily Top 5 Signals
                </li>
                 <li class="flex gap-x-3 text-gray-400 dark:text-gray-600">
                  <svg class="h-6 w-5 flex-none text-gray-300 dark:text-gray-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Automated Trading
                </li>
              </ul>
            </div>
            <a href="#" class="mt-8 block rounded-md bg-indigo-50 dark:bg-slate-800 px-3 py-2 text-center text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400 hover:ring-1 hover:ring-indigo-600/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">Get started for free</a>
          </div>

          <!-- Pro Tier (Most Popular) -->
          <div class="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-800 p-8 ring-1 ring-gray-200 dark:ring-white/10 xl:p-10 relative shadow-[0_0_30px_rgba(99,102,241,0.15)] scale-105 border border-indigo-500/30">
             <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg">
                MOST POPULAR
            </div>
            <div>
              <div class="flex items-center justify-between gap-x-4">
                <h3 id="tier-pro" class="text-lg font-semibold leading-8 text-indigo-600 dark:text-white">Pro Trader</h3>
              </div>
              <p class="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">Unlock the full power of our Multi-Agent System.</p>
              <p class="mt-6 flex items-baseline gap-x-1">
                <span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">$49</span>
                <span class="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">/month</span>
              </p>
              <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Rel-Time Signal Scanning
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Unlimited AI Predictions
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Connect 3 Brokerage Accounts
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Latent Pattern Recognition
                </li>
              </ul>
            </div>
            <a href="#" class="mt-8 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all shadow-indigo-500/30">Start 14-day free trial</a>
          </div>

          <!-- Enterprise Tier -->
          <div class="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 p-8 ring-1 ring-gray-200 dark:ring-white/10 xl:p-10 transition-all hover:scale-105 duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
            <div>
              <div class="flex items-center justify-between gap-x-4">
                <h3 id="tier-enterprise" class="text-lg font-semibold leading-8 text-gray-900 dark:text-white">Institutional</h3>
              </div>
              <p class="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">For funds and high-frequency trading firms.</p>
              <p class="mt-6 flex items-baseline gap-x-1">
                <span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">$299</span>
                <span class="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">/month</span>
              </p>
              <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  API Access
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Custom Risk Models
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Dedicated Support
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  On-premise Deployment Options
                </li>
              </ul>
            </div>
            <a href="#" class="mt-8 block rounded-md bg-indigo-50 dark:bg-slate-800 px-3 py-2 text-center text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400 hover:ring-1 hover:ring-indigo-600/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">Contact sales</a>
          </div>

        </div>
      </div>
    </div>
  `
})
export class PricingComponent {}
