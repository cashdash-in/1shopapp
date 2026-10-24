
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, Loader2, Sparkles, TrendingUp, TrendingDown, 
  BarChart4, Globe, Activity, ShieldAlert, Target, 
  ArrowUpRight, Info, Search, RefreshCw, Landmark, Droplets,
  Wifi, LineChart
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getMarketIndicator } from '@/ai/flows/market-indicator-flow';
import type { MarketIndicatorOutput } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// --- TradingView Widget Component ---
const TradingViewWidget = ({ symbol }: { symbol: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear previous widget
    container.current.innerHTML = "";
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Normalize symbol for TradingView (NSE prefix for Indian stocks if no prefix provided)
    const normalizedSymbol = symbol.toUpperCase().includes(':') ? symbol.toUpperCase() : `NSE:${symbol.toUpperCase()}`;

    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": normalizedSymbol,
      "interval": "60",
      "timezone": "Asia/Kolkata",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_top_toolbar": false,
      "allow_symbol_change": true,
      "save_image": false,
      "container_id": "tradingview_chart",
      "studies": [
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies"
      ]
    });
    
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container h-full w-full bg-muted/20 rounded-xl overflow-hidden border border-primary/10 shadow-inner">
      <div id="tradingview_chart" className="h-full w-full" ref={container}></div>
    </div>
  );
};

export default function MarketIndicatorPage() {
    const { toast } = useToast();
    const [symbol, setSymbol] = useState('');
    const [activeSymbol, setActiveSymbol] = useState('RELIANCE'); // Default for initial chart
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MarketIndicatorOutput | null>(null);
    const [aiError, setAiError] = useState('');

    const handleAnalyze = async () => {
        if (!symbol.trim()) {
            toast({ variant: 'destructive', title: 'Symbol Required', description: 'Enter a stock name or symbol.' });
            return;
        }

        setLoading(true);
        setAiError('');
        try {
            const response = await getMarketIndicator({ symbol });
            setResult(response);
            setActiveSymbol(symbol.toUpperCase());
            toast({ title: "Live Sync Complete", description: `Market indicators for ${symbol} are grounded in current session data.` });
        } catch (error: any) {
            setAiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
            <Card className="w-full max-w-7xl border-primary/10 shadow-2xl">
                <CardHeader className="relative">
                    <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Back to Home</span>
                    </Link>
                    <div className="text-center pt-8">
                        <div className='flex items-center justify-center gap-2 mb-2'>
                            <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5 animate-pulse">
                                <Wifi className="h-3 w-3 mr-1" /> LIVE INTERNET GROUNDING ENABLED
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <Landmark className="h-8 w-8 text-primary" />
                            AI Strategic Market Terminal
                        </CardTitle>
                        <CardDescription>High-Precision Quant Technicals & Real-Time Live Charts.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>API Synchronisation Error</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="max-w-2xl mx-auto w-full relative">
                        <Label htmlFor="symbol" className="sr-only">Stock Symbol</Label>
                        <Input
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="Enter Stock (e.g., RELIANCE, HDFC, TATAMOTORS, TSLA)"
                            className="h-14 text-lg pl-6 pr-32 rounded-full shadow-lg border-primary/20 bg-muted/30 focus:bg-background transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        />
                        <Button 
                            onClick={handleAnalyze} 
                            disabled={loading} 
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full px-6 h-10 shadow-md"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                            {loading ? 'Analyzing...' : 'Fetch Verdict'}
                        </Button>
                    </div>

                    {/* --- Live Chart Section --- */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 h-[500px]">
                            <Card className="h-full overflow-hidden border-primary/5">
                                <TradingViewWidget symbol={activeSymbol} />
                            </Card>
                        </div>

                        <div className="space-y-6">
                             {loading ? (
                                <div className="space-y-4 h-full flex flex-col justify-center py-12 text-center animate-pulse">
                                    <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary opacity-20" />
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold">Scrutinizing Market Depth...</p>
                                        <p className="text-sm text-muted-foreground italic">AI is extracting RSI/MACD technicals for {symbol.toUpperCase() || activeSymbol}</p>
                                    </div>
                                </div>
                            ) : result ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <Card className="bg-primary/5 border-primary/20 shadow-lg">
                                        <CardHeader className="py-4">
                                            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-black">AI Signal Strength</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                             <div className="flex items-center justify-between">
                                                <h2 className="text-4xl font-black">{result.symbol}</h2>
                                                <Badge className={cn(
                                                    "text-xl px-6 py-2 shadow-lg",
                                                    result.verdict === 'Buy' ? "bg-green-600 hover:bg-green-500" : result.verdict === 'Sell' ? "bg-red-600 hover:bg-red-500" : "bg-amber-600 hover:bg-amber-500"
                                                )}>
                                                    {result.verdict.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground">LAST TRADED PRICE</p>
                                                    <p className="text-2xl font-mono font-bold text-primary">{result.currentPrice}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-green-500 flex items-center gap-1"><Wifi className="h-2 w-2"/> GROUNDED</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                                            <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                                                <ArrowUpRight className="h-3 w-3" /> ENTRY
                                            </div>
                                            <span className="font-mono font-black text-lg">{result.entryPrice}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                                                <Target className="h-3 w-3" /> TARGET
                                            </div>
                                            <span className="font-mono font-black text-lg">{result.targetPrice}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                            <div className="flex items-center gap-2 text-xs font-bold text-red-600">
                                                <ShieldAlert className="h-3 w-3" /> STOP LOSS
                                            </div>
                                            <span className="font-mono font-black text-lg">{result.stopLoss}</span>
                                        </div>
                                    </div>
                                    
                                    <Card className="border-primary/5 bg-secondary/10">
                                        <CardHeader className="py-2">
                                            <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground">Technical Snapshot</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] font-black">
                                                    <span>RSI (14)</span>
                                                    <span>{result.rsi}</span>
                                                </div>
                                                <Progress value={result.rsi} className="h-1.5" />
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div className="p-2 rounded bg-background/50 border border-primary/5">
                                                    <p className="text-[8px] text-muted-foreground">MACD</p>
                                                    <p className="text-xs font-mono font-bold">{result.macd.value}</p>
                                                </div>
                                                <div className="p-2 rounded bg-background/50 border border-primary/5">
                                                    <p className="text-[8px] text-muted-foreground">SIGNAL</p>
                                                    <p className="text-xs font-mono font-bold">{result.macd.signal}</p>
                                                </div>
                                                <div className="p-2 rounded bg-background/50 border border-primary/5">
                                                    <p className="text-[8px] text-muted-foreground">HIST</p>
                                                    <p className="text-xs font-mono font-bold">{result.macd.histogram}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-xl border-2 border-dashed border-primary/10">
                                    <LineChart className="h-12 w-12 mb-4 text-primary/20" />
                                    <p className="text-sm font-bold text-muted-foreground">Enter a symbol to unlock AI Quantitative Research</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {result && !loading && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                             <Card className="bg-secondary/20 border-primary/5">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Strategy Rationale</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap italic text-muted-foreground">{result.rationale}</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/5 border-primary/5">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Globe className="h-4 w-4" /> Global Macro Feed</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="p-3 rounded-lg bg-background/40 border">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Brent Oil</p>
                                        <p className="text-xs font-bold flex items-center gap-2"><Droplets className="h-3 w-3 text-blue-500" /> {result.globalFactors.brentOil}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/40 border">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">US Market</p>
                                        <p className="text-xs font-bold flex items-center gap-2"><Globe className="h-3 w-3 text-indigo-500" /> {result.globalFactors.usMarketSentiment}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/40 border">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Asian Opening</p>
                                        <p className="text-xs font-bold flex items-center gap-2"><Landmark className="h-3 w-3 text-amber-500" /> {result.globalFactors.asianMarketStatus}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="py-2 text-[8px] text-muted-foreground/50 italic border-t border-primary/5 mt-2">
                                    Last Analysis Cycle: {result.analysisDate}
                                </CardFooter>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
