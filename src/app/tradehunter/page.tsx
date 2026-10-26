'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Bell,
  Search,
  Plus,
  Wifi,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { runScanner } from '@/ai/flows/scanner-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const INITIAL_SCAN_SYMBOLS = ['RELIANCE', 'TCS', 'ZOMATO', 'PARADEEP', 'SBIN'];

export default function TradeHunterDashboard() {
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanList, setScanList] = useState<string[]>(INITIAL_SCAN_SYMBOLS);
  const [searchSymbol, setSearchSymbol] = useState('');

  /**
   * Run scanner sequentially for each symbol.
   * Parallel execution of multiple server actions often causes 'Failed to fetch' 
   * errors due to environment limits or browser session locking.
   */
  const startScan = async () => {
    setScanning(true);
    const results = [];
    
    try {
        // Sequentially scan to avoid network congestion and server action bottlenecks
        for (const sym of scanList) {
            const res = await runScanner({ symbol: sym });
            results.push(res);
        }
        setOpportunities(results.sort((a, b) => b.score - a.score));
    } catch (e) {
        console.error("Scanner execution error:", e);
        toast({ 
            variant: 'destructive', 
            title: "Live Sync Failed", 
            description: "Market data synchronization encountered a network error. Using local cache." 
        });
    } finally {
        setScanning(false);
    }
  };

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = searchSymbol.toUpperCase().trim();
    if (!sym) return;
    
    if (scanList.includes(sym)) {
        toast({ title: "Already Scanning", description: `${sym} is already in your dashboard.` });
        return;
    }

    setScanList(prev => [sym, ...prev]);
    setSearchSymbol('');
    toast({ title: "Live Tracking Initialized", description: `${sym} added to NSE Grounded Scanner.` });
    
    // Small delay to ensure state update before re-scanning
    setTimeout(startScan, 100);
  };

  useEffect(() => {
    startScan();
    // Auto-sync grounded data every 60 seconds
    const interval = setInterval(startScan, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="h-3 w-3 text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 tracking-[0.2em]">LIVE DATA GROUNDING ENABLED</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic">SCANNER TERMINAL</h1>
          <p className="text-zinc-500 max-w-md">Quant technical scoring grounded in real-time session levels.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
            <form onSubmit={handleAddSymbol} className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
                <Input 
                    value={searchSymbol}
                    onChange={(e) => setSearchSymbol(e.target.value)}
                    placeholder="Search Share (e.g. RELIANCE)" 
                    className="bg-zinc-900 border-zinc-800 pl-11 rounded-full h-12 focus:ring-emerald-500 text-sm font-bold"
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full hover:bg-emerald-500/20 h-10 w-10">
                    <Plus className="h-4 w-4" />
                </Button>
            </form>

            <Button 
                onClick={startScan} 
                disabled={scanning}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black h-12 px-8 rounded-full shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
            >
                {scanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
                {scanning ? 'SYNCING...' : 'LIVE REFRESH'}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#121212] border-zinc-800 shadow-2xl">
          <CardHeader className="pb-2 border-b border-zinc-800/50 mb-4">
            <CardTitle className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-emerald-500" /> PROBABLE LONGS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {scanning && opportunities.length === 0 ? (
               <Skeleton className="h-48 w-full bg-zinc-900" />
             ) : (
                opportunities.filter(o => o.tradeType === 'LONG').slice(0, 3).map((item) => (
                  <TradeCard key={item.symbol} item={item} />
                ))
             )}
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-zinc-800 shadow-2xl">
          <CardHeader className="pb-2 border-b border-zinc-800/50 mb-4">
            <CardTitle className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingDown className="h-3 w-3 text-rose-500" /> PROBABLE SHORTS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {scanning && opportunities.length === 0 ? (
               <Skeleton className="h-48 w-full bg-zinc-900" />
             ) : (
                opportunities.filter(o => o.tradeType === 'SHORT').slice(0, 3).map((item) => (
                  <TradeCard key={item.symbol} item={item} />
                ))
             )}
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-emerald-500/10 shadow-2xl">
          <CardHeader className="pb-2 border-b border-zinc-800/50 mb-4">
            <CardTitle className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Bell className="h-3 w-3 text-amber-500" /> LIVE ALERTS
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
               {opportunities.filter(o => o.score >= 70).slice(0, 5).map(o => (
                  <div key={o.symbol} className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center justify-between animate-in fade-in slide-in-from-right-4">
                    <div>
                      <p className="text-[10px] font-black text-zinc-500">{o.tradeType} SIGNAL</p>
                      <p className="font-bold text-sm">{o.symbol}</p>
                    </div>
                    <Badge className={cn(
                        "text-[10px] font-black",
                        o.tradeType === 'LONG' ? "bg-emerald-500" : "bg-rose-500"
                    )}>
                      {o.signal}
                    </Badge>
                  </div>
               ))}
               {!scanning && opportunities.filter(o => o.score >= 70).length === 0 && (
                   <div className="py-8 text-center text-zinc-600 italic text-[10px] font-bold uppercase tracking-widest">Awaiting high-probability crossovers...</div>
               )}
               {scanning && <div className="py-8 flex justify-center"><Loader2 className="h-4 w-4 animate-spin text-zinc-700" /></div>}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#121212] shadow-inner">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-zinc-900 text-zinc-500 text-[10px] font-black uppercase">
                <tr>
                <th className="px-6 py-5">Symbol</th>
                <th className="px-6 py-5">Signal</th>
                <th className="px-6 py-5">Score</th>
                <th className="px-6 py-5">LTP (₹)</th>
                <th className="px-6 py-5">Entry Range</th>
                <th className="px-6 py-5">Targets</th>
                <th className="px-6 py-5 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
                {opportunities.map((item) => (
                <tr key={item.symbol} className="hover:bg-zinc-900/30 transition-colors group">
                    <td className="px-6 py-4">
                        <p className="font-black text-lg italic tracking-tighter">{item.symbol}</p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{item.tradeType} SCAN</p>
                    </td>
                    <td className="px-6 py-4">
                        <Badge variant="outline" className={cn(
                        "font-black text-[10px] px-3",
                        item.tradeType === 'LONG' ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/5" : "border-rose-500/50 text-rose-500 bg-rose-500/5"
                        )}>
                        {item.signal}
                        </Badge>
                    </td>
                    <td className="px-6 py-4">
                        <div className="w-24">
                        <div className="flex justify-between text-[10px] font-bold mb-1.5 text-zinc-400">
                            <span>CONFIDENCE</span>
                            <span>{item.score}%</span>
                        </div>
                        <Progress value={item.score} className="h-1 bg-zinc-800" />
                        </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-zinc-100">₹{item.entry.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 font-mono text-zinc-500 text-sm italic">₹{item.entry.toFixed(2)}</td>
                    <td className="px-6 py-4 space-y-1">
                        <div className="text-[10px] font-black text-zinc-500 flex gap-4">
                        <span className="text-emerald-500">T1: ₹{item.target1.toFixed(2)}</span>
                        <span className="text-emerald-300">T2: ₹{item.target2.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-rose-500 font-black">SL: ₹{item.stoploss.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="outline" className="h-9 rounded-full text-xs font-black border-zinc-800 hover:border-emerald-500 transition-all group-hover:bg-emerald-500 group-hover:text-white">
                        LOG TRADE <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                    </td>
                </tr>
                ))}
                {opportunities.length === 0 && !scanning && (
                    <tr>
                        <td colSpan={7} className="py-20 text-center text-zinc-600 font-bold uppercase tracking-widest text-sm">
                            <Activity className="h-12 w-12 mx-auto mb-4 opacity-10" />
                            Awaiting Signal Initialization...
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function TradeCard({ item }: { item: any }) {
  const isLong = item.tradeType === 'LONG';
  return (
    <div className="group p-4 bg-zinc-900/40 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer relative overflow-hidden">
      <div className={cn(
          "absolute top-0 right-0 w-16 h-16 opacity-5 -mr-4 -mt-4",
          isLong ? "text-emerald-500" : "text-rose-500"
      )}>
        {isLong ? <TrendingUp size={64} /> : <TrendingDown size={64} />}
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black italic tracking-tighter">{item.symbol}</h3>
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">{item.tradeType} ANALYSIS</p>
        </div>
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center border",
          isLong ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}>
          {isLong ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[9px] text-zinc-600 font-black uppercase">CMP (₹)</p>
          <p className="font-mono text-base font-bold text-zinc-200">{item.entry.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-zinc-600 font-black uppercase">ACTION</p>
          <p className={cn("text-xs font-black", isLong ? "text-emerald-500" : "text-rose-500")}>{item.signal}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px] font-black text-zinc-500 uppercase">Quant Verified</span>
        </div>
        <Badge variant="outline" className="text-[9px] font-mono font-bold text-zinc-600 border-zinc-800">
            CONF: {item.score}%
        </Badge>
      </div>
    </div>
  );
}
