
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Target, Zap, Shield, BarChart3, TrendingUp, ChevronRight } from 'lucide-react';
import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-1.5 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Next-Gen NSE Scanner</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic animate-in fade-in slide-in-from-bottom-6 duration-1000">
            TRADE<span className="text-emerald-500">HUNTER</span> PRO
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Identify high-probability intraday setups with professional technical scoring, real-time alerts, and advanced journaling.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg h-16 px-10 rounded-full shadow-2xl shadow-emerald-500/20">
              <Link href="/tradehunter">
                LAUNCH TERMINAL <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-bold h-16 px-10 rounded-full">
              <Link href="/tradehunter/journal">VIEW YOUR JOURNAL</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-900">
        <FeatureItem 
          icon={<TrendingUp className="h-8 w-8 text-emerald-500" />}
          title="Intraday Scanner"
          desc="Proprietary scoring engine analyzing RSI, MACD, and VWAP for explosive breakouts."
        />
        <FeatureItem 
          icon={<Shield className="h-8 w-8 text-blue-500" />}
          title="Risk Management"
          desc="Integrated SL/Target calculation with customizable risk-per-trade protocols."
        />
        <FeatureItem 
          icon={<BarChart3 className="h-8 w-8 text-amber-500" />}
          title="Trade Journal"
          desc="Professional execution tracking with P&L analysis and strategy win-rate insights."
        />
      </section>
      
      <footer className="py-12 border-t border-zinc-900 text-center text-zinc-600 text-xs font-medium">
        <p>© 2025 TRADEHUNTER PRO • NSE INTRADAY ANALYTICS ENGINE</p>
      </footer>
    </main>
  );
}

function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="space-y-4">
      <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold italic tracking-tight">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}
