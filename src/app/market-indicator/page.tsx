
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, Loader2, Sparkles, TrendingUp, TrendingDown, 
  BarChart4, Globe, Activity, ShieldAlert, Target, 
  ArrowUpRight, Info, Search, RefreshCw, Landmark, Droplets,
  Wifi
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getMarketIndicator } from '@/ai/flows/market-indicator-flow';
import type { MarketIndicatorOutput } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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
            toast({ title: "Live Sync Complete", description: `Market indicators for ${symbol} are grounded in current session data.` });
        } catch (error: any) {
            setAiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
            <Card className="w-full max-w-5xl border-primary/10 shadow-2xl">
                <CardHeader className="relative">
                    <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Back to Home</span>
                    </Link>
                    <div className="text-center pt-8">
                        <div className='flex items-center justify-center gap-2 mb-2'>
                            <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5 animate-pulse">
                                <Wifi className="h-3 w-3 mr-1" /> LIVE GROUNDING ENABLED
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <Landmark className="h-8 w-8 text-primary" />
                            AI Strategic Market Indicator
                        </CardTitle>
                        <CardDescription>Expert Technical & Global Macro Research Terminal powered by real-time AI tools.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>API Synchronisation Error</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="max-w-xl mx-auto w-full relative">
                        <Label htmlFor="symbol" className="sr-only">Stock Symbol</Label>
                        <Input
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="Enter Stock Name (e.g., RELIANCE, HDFC, TSLA)"
                            className="h-14 text-lg pl-6 pr-32 rounded-full shadow-lg border-primary/20"
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        />
                        <Button 
                            onClick={handleAnalyze} 
                            disabled={loading} 
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full px-6 h-10"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                            {loading ? 'Fetching...' : 'Get Live Verdict'}
                        </Button>
                    </div>

                    {loading && (
                        <div className="space-y-4 py-12 text-center animate-pulse">
                            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary opacity-20" />
                            <div className="space-y-1">
                                <p className="text-lg font-bold">Connecting to Live Market Data...</p>
                                <p className="text-sm text-muted-foreground italic">AI is calling technical and global research tools for {symbol.toUpperCase()}</p>
                            </div>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Verdict Header */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-primary/5 p-6 rounded-2xl border border-primary/10 shadow-inner">
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-black flex items-center gap-3">
                                        {result.symbol}
                                        <Badge className={cn(
                                            "text-lg px-4 py-1",
                                            result.verdict === 'Buy' ? "bg-green-600" : result.verdict === 'Sell' ? "bg-red-600" : "bg-amber-600"
                                        )}>
                                            {result.verdict.toUpperCase()}
                                        </Badge>
                                    </h2>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Wifi className="h-3 w-3 text-green-500" /> Grounded Sync: {result.analysisDate}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase text-muted-foreground">Real-Time CMP</p>
                                    <p className="text-3xl font-mono font-bold text-primary">{result.currentPrice}</p>
                                </div>
                            </div>

                            {/* Levels Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="border-green-500/20 bg-green-500/[0.02]">
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-green-600">
                                            <ArrowUpRight className="h-4 w-4" /> RECOMMENDED ENTRY
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-mono font-black">{result.entryPrice}</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-blue-500/20 bg-blue-500/[0.02]">
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-600">
                                            <Target className="h-4 w-4" /> PROFIT TARGET
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-mono font-black">{result.targetPrice}</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-red-500/20 bg-red-500/[0.02]">
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-600">
                                            <ShieldAlert className="h-4 w-4" /> STOP LOSS (SL)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-mono font-black">{result.stopLoss}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Indicators & Rationale */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm flex items-center gap-2"><BarChart4 className="h-4 w-4" /> Real-Time Oscillators</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span>RSI (14)</span>
                                                    <span>{result.rsi}</span>
                                                </div>
                                                <Progress value={result.rsi} className="h-2" />
                                                <p className="text-[10px] text-muted-foreground">
                                                    {result.rsi > 70 ? 'OVERBOUGHT' : result.rsi < 30 ? 'OVERSOLD' : 'NEUTRAL ZONE'}
                                                </p>
                                            </div>
                                            <div className="pt-2 border-t">
                                                <div className="flex justify-between text-xs font-bold mb-2">
                                                    <span>MACD Divergence</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="p-2 bg-muted/50 rounded text-center">
                                                        <p className="text-[10px] uppercase">Value</p>
                                                        <p className="text-xs font-mono font-bold">{result.macd.value}</p>
                                                    </div>
                                                    <div className="p-2 bg-muted/50 rounded text-center">
                                                        <p className="text-[10px] uppercase">Signal</p>
                                                        <p className="text-xs font-mono font-bold">{result.macd.signal}</p>
                                                    </div>
                                                    <div className="p-2 bg-muted/50 rounded text-center">
                                                        <p className="text-[10px] uppercase">Hist</p>
                                                        <p className="text-xs font-mono font-bold">{result.macd.histogram}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm flex items-center gap-2"><Globe className="h-4 w-4" /> Live Macro Feed</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between text-xs p-2 rounded bg-muted/30">
                                                <div className="flex items-center gap-2"><Droplets className="h-3 w-3 text-blue-500" /> Brent Oil</div>
                                                <span className="font-bold">{result.globalFactors.brentOil}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs p-2 rounded bg-muted/30">
                                                <div className="flex items-center gap-2"><Globe className="h-3 w-3 text-indigo-500" /> US Sentiment</div>
                                                <span className="font-bold">{result.globalFactors.usMarketSentiment}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs p-2 rounded bg-muted/30">
                                                <div className="flex items-center gap-2"><Landmark className="h-3 w-3 text-amber-500" /> Asian Open</div>
                                                <span className="font-bold">{result.globalFactors.asianMarketStatus}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="bg-secondary/20 flex flex-col h-full border-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Strategy Rationale</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.rationale}</p>
                                    </CardContent>
                                    <CardFooter className="pt-4 border-t border-primary/5">
                                        <p className="text-[10px] text-muted-foreground italic">
                                            Grounding Notice: This analysis uses live tool-retrieved technicals and macro context. Verify with your broker before execution.
                                        </p>
                                    </CardFooter>
                                </Card>
                            </div>
                            
                            <Button variant="outline" className="w-full h-12" onClick={handleAnalyze}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Re-Sync Live Data
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
