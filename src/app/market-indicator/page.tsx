'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, Loader2, Search, Landmark, Droplets,
  Wifi, Globe, Sparkles, ArrowUpRight, Target, ShieldAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getMarketIndicator } from '@/ai/flows/market-indicator-flow';
import type { MarketIndicatorOutput } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function MarketIndicatorPage() {
    const { toast } = useToast();
    const [symbol, setSymbol] = useState('');
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
            toast({ title: "Live Sync Complete", description: `Exact data for ${symbol} grounded in current session.` });
        } catch (error: any) {
            setAiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
            <Card className="w-full max-w-4xl border-primary/10 shadow-2xl">
                <CardHeader className="relative">
                    <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Back to Home</span>
                    </Link>
                    <div className="text-center pt-8">
                        <div className='flex items-center justify-center gap-2 mb-2'>
                            <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5 animate-pulse">
                                <Wifi className="h-3 w-3 mr-1" /> EXACT DATA GROUNDING ENABLED
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <Landmark className="h-8 w-8 text-primary" />
                            AI Strategic Market Verdict
                        </CardTitle>
                        <CardDescription>Professional Quant Guidance & Precision Entry/Exit Levels.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>API Sync Error</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="max-w-2xl mx-auto w-full relative">
                        <Label htmlFor="symbol" className="sr-only">Stock Symbol</Label>
                        <Input
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="Enter Stock (e.g., RELIANCE, PARADEEP, TCS)"
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

                    {loading ? (
                        <div className="py-20 text-center space-y-4">
                            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary opacity-30" />
                            <p className="font-bold text-muted-foreground animate-pulse">Extracting Real-Time Technicals for {symbol.toUpperCase()}...</p>
                        </div>
                    ) : result ? (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                             <Card className="bg-primary/5 border-primary/20 shadow-xl overflow-hidden">
                                <div className={cn(
                                    "h-2 w-full",
                                    result.verdict === 'Buy' ? "bg-green-500" : result.verdict === 'Sell' ? "bg-red-500" : "bg-amber-500"
                                )} />
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-5xl font-black italic tracking-tighter">{result.symbol}</h2>
                                        <Badge className={cn(
                                            "text-2xl px-8 py-3 shadow-lg rounded-full",
                                            result.verdict === 'Buy' ? "bg-green-600" : result.verdict === 'Sell' ? "bg-red-600" : "bg-amber-600"
                                        )}>
                                            {result.verdict === 'Buy' ? 'STRATEGIC BUY' : result.verdict === 'Sell' ? 'SHORT SELL' : 'WATCH'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-background border shadow-inner">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current Market Price (LTP)</p>
                                                <p className="text-3xl font-mono font-black text-primary">{result.currentPrice}</p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                                                    <span className="text-xs font-bold flex items-center gap-2"><ArrowUpRight className="h-3 w-3 text-green-500"/> EXACT ENTRY</span>
                                                    <span className="font-mono font-bold text-green-600">{result.entryPrice}</span>
                                                </div>
                                                <div className="flex justify-between p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                                                    <span className="text-xs font-bold flex items-center gap-2"><Target className="h-3 w-3 text-blue-500"/> PROFIT TARGET</span>
                                                    <span className="font-mono font-bold text-blue-600">{result.targetPrice}</span>
                                                </div>
                                                <div className="flex justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                                                    <span className="text-xs font-bold flex items-center gap-2"><ShieldAlert className="h-3 w-3 text-red-500"/> STOP LOSS</span>
                                                    <span className="font-mono font-bold text-red-600">{result.stopLoss}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-secondary/10 border">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Technical Indicators</p>
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-black">
                                                            <span>RSI (14)</span>
                                                            <span className={cn(result.rsi > 60 ? "text-red-500" : result.rsi < 40 ? "text-green-500" : "")}>{result.rsi.toFixed(1)}</span>
                                                        </div>
                                                        <Progress value={result.rsi} className="h-2" />
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                                                        <div className="p-2 border rounded bg-background">
                                                            <p className="text-muted-foreground mb-1">MACD</p>
                                                            <p className="font-mono">{result.macd.value}</p>
                                                        </div>
                                                        <div className="p-2 border rounded bg-background">
                                                            <p className="text-muted-foreground mb-1">SIGNAL</p>
                                                            <p className="font-mono">{result.macd.signal}</p>
                                                        </div>
                                                        <div className="p-2 border rounded bg-background">
                                                            <p className="text-muted-foreground mb-1">HIST</p>
                                                            <p className="font-mono">{result.macd.histogram}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl border italic text-xs leading-relaxed text-muted-foreground bg-muted/20">
                                                <Sparkles className="h-4 w-4 text-primary mb-2" />
                                                "{result.rationale}"
                                            </div>
                                        </div>
                                     </div>
                                </CardContent>
                             </Card>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 border rounded-xl bg-background flex flex-col gap-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase">Brent Oil</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><Droplets className="h-3 w-3 text-blue-500"/> {result.globalFactors.brentOil}</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-background flex flex-col gap-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase">US Market</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><Globe className="h-3 w-3 text-indigo-500"/> {result.globalFactors.usMarketSentiment}</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-background flex flex-col gap-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase">Asian Open</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><Landmark className="h-3 w-3 text-amber-500"/> {result.globalFactors.asianMarketStatus}</p>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-muted/5">
                            <Sparkles className="h-12 w-12 mx-auto text-primary/20 mb-4" />
                            <h3 className="text-lg font-bold text-muted-foreground">Enter a symbol to unlock Quant Research</h3>
                            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">AI will fetch grounded session data to provide exact buy/sell levels.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="justify-center border-t py-4">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">NSE Real-Time Quant Synchronization Engine</p>
                </CardFooter>
            </Card>
        </div>
    );
}