
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  ScanSearch,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { runScanner } from '@/ai/flows/scanner-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

// Mock list of symbols for scanning
const SCAN_SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'TATAMOTORS', 'SBIN', 'ADANIENT', 'ZOMATO'];

export default function TradeHunterDashboard() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);

  const startScan = async () => {
    setScanning(true);
    const results = [];
    
    // Simulate real-time scanning for each symbol
    for (const sym of SCAN_SYMBOLS) {
      // In a real app, this data would come from a price API
      const mockData = {
        high: Array.from({length: 30}, () => 100 + Math.random() * 20),
        low: Array.from({length: 30}, () => 90 + Math.random() * 20),
        close: Array.from({length: 30}, () => 95 + Math.random() * 20),
        volume: Array.from({length: 30}, () => 1000 + Math.random() * 5000),
      };

      try {
        const res = await runScanner({ symbol: sym, marketData: mockData });
        results.push(res);
      } catch (e) {
        console.error("Scan error for", sym, e);
      }
    }
    
    setOpportunities(results.sort((a, b) => b.score - a.score));
    setScanning(false);
  };

  useEffect(() => {
    startScan();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">OPPORTUNITIES</h1>
          <p className="text-zinc-500 max-w-md">AI-powered technical scanner identifying high-probability intraday setups.</p>
        </div>
        <Button 
          onClick={startScan} 
          disabled={scanning}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-8 rounded-full shadow-lg shadow-emerald-900/20"
        >
          {scanning ? <Zap className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
          {scanning ? 'SCANNING MARKETS...' : 'SCAN NOW'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#121212] border-zinc-800 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> TOP LONGS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {scanning ? (
               <Skeleton className="h-48 w-full bg-zinc-900" />
             ) : (
                opportunities.filter(o => o.tradeType === 'LONG').slice(0, 3).map((item) => (
                  <TradeCard key={item.symbol} item={item} />
                ))
             )}
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-zinc-800 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-rose-500" /> TOP SHORTS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {scanning ? (
               <Skeleton className="h-48 w-full bg-zinc-900" />
             ) : (
                opportunities.filter(o => o.tradeType === 'SHORT').slice(0, 3).map((item) => (
                  <TradeCard key={item.symbol} item={item} />
                ))
             )}
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-emerald-500/10 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-500" /> RECENT ALERTS
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
               {opportunities.filter(o => o.score >= 80).map(o => (
                  <div key={o.symbol} className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-zinc-500">{o.tradeType} ALERT</p>
                      <p className="font-bold">{o.symbol}</p>
                    </div>
                    <Badge className={cn(o.tradeType === 'LONG' ? "bg-emerald-500" : "bg-rose-500")}>
                      {o.signal}
                    </Badge>
                  </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#121212]">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 text-zinc-500 text-xs font-black uppercase">
            <tr>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Signal</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">LTP</th>
              <th className="px-6 py-4">Entry</th>
              <th className="px-6 py-4">Targets</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {opportunities.map((item) => (
               <tr key={item.symbol} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-lg">{item.symbol}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={cn(
                      "font-black text-[10px]",
                      item.tradeType === 'LONG' ? "border-emerald-500/50 text-emerald-500" : "border-rose-500/50 text-rose-500"
                    )}>
                      {item.signal}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>CONFIDENCE</span>
                        <span>{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-1 bg-zinc-800" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">₹{item.entry.toFixed(2)}</td>
                  <td className="px-6 py-4 font-mono text-zinc-400">₹{item.entry.toFixed(2)}</td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="text-[10px] font-bold text-zinc-500 flex gap-2">
                       <span className="text-emerald-500">T1: ₹{item.target1.toFixed(2)}</span>
                       <span className="text-zinc-300">T2: ₹{item.target2.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="secondary" className="h-8 rounded-full text-xs">
                      DETAILS <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TradeCard({ item }: { item: any }) {
  const isLong = item.tradeType === 'LONG';
  return (
    <div className="group p-4 bg-zinc-900/40 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black italic">{item.symbol}</h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.tradeType} OPPORTUNITY</p>
        </div>
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          isLong ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
        )}>
          {isLong ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase">ENTRY</p>
          <p className="font-mono text-sm">₹{item.entry.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 font-bold uppercase">SIGNAL</p>
          <p className={cn("text-xs font-black", isLong ? "text-emerald-500" : "text-rose-500")}>{item.signal}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-[10px] font-bold text-zinc-400">RR: 1:2.0</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-600">SCORE: {item.score}</span>
      </div>
    </div>
  );
}
