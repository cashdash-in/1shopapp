
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Loader2, Landmark, Camera, Upload, 
  Sparkles, Target, ShieldAlert, Clock, Info, Search,
  RefreshCw, History, CheckCircle2, AlertCircle,
  ArrowRightLeft, FileSearch, BarChart4, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getMarketIndicator } from '@/ai/flows/market-indicator-flow';
import type { MarketIndicatorOutput, ExecutionStep } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const resizeImage = (dataUrl: string, maxWidth = 1000, maxHeight = 1000): Promise<string> => {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
            }
            resolve(canvas.toDataURL('image/jpeg', 0.9)); 
        };
        img.src = dataUrl;
    });
};

export default function MarketIndicatorPage() {
    const { toast } = useToast();
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [symbolHint, setSymbolHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MarketIndicatorOutput | null>(null);
    const [previousAnalysis, setPreviousAnalysis] = useState<MarketIndicatorOutput | null>(null);
    const [previousImage, setPreviousImage] = useState<string | null>(null);
    const [aiError, setAiError] = useState('');
    
    const [isCameraReady, setIsCameraReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedAnalysis = localStorage.getItem('last_market_analysis');
        const savedImage = localStorage.getItem('last_market_image');
        
        if (savedAnalysis) {
            try {
                setPreviousAnalysis(JSON.parse(savedAnalysis));
            } catch (e) {}
        }
        if (savedImage) {
            setPreviousImage(savedImage);
        }

        const getCameraPermission = async () => {
          try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.onloadedmetadata = () => setIsCameraReady(true);
            }
          } catch (error) {}
        };
        getCameraPermission();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const optimizedImage = await resizeImage(e.target?.result as string);
                setOriginalImage(optimizedImage);
                setResult(null);
                setAiError('');
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCapture = async () => {
        if (videoRef.current && canvasRef.current && isCameraReady) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const optimizedImage = await resizeImage(canvas.toDataURL('image/png'));
                setOriginalImage(optimizedImage);
                setResult(null);
                setAiError('');
            }
        }
    };

    const handleAnalyze = async () => {
        if (!originalImage) {
            toast({ variant: 'destructive', title: 'No Image', description: 'Upload a chart screenshot first.' });
            return;
        }

        setLoading(true);
        setAiError('');
        setResult(null);
        try {
            const response = await getMarketIndicator({ 
              photoDataUri: originalImage,
              symbolHint: symbolHint.trim() || undefined,
              previousAnalysis: previousAnalysis || undefined
            });
            
            setResult(response);
            
            localStorage.setItem('last_market_analysis', JSON.stringify(response));
            localStorage.setItem('last_market_image', originalImage);
            
            toast({ 
                title: response.openingStatus, 
                description: response.isPatternRepeating ? "Pattern Replay Detected!" : "Intraday roadmap generated." 
            });
            
        } catch (error: any) {
            setAiError("Analysis issue. Try clarifying the 'Stock Name' or using a sharper screenshot.");
        } finally {
            setLoading(false);
        }
    };

    const StrategyCard = ({ type, data }: { type: 'BUY' | 'SHORT', data: any }) => {
        const isBuy = type === 'BUY';
        return (
            <Card className={cn(
                "border-2",
                isBuy ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
            )}>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className={cn("text-lg font-black", isBuy ? "text-green-500" : "text-red-500")}>
                            {type} SETUP
                        </CardTitle>
                        <Badge variant="outline" className={isBuy ? "border-green-500/50 text-green-500" : "border-red-500/50 text-red-500"}>
                            INTRADAY PLAN
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-lg bg-background border flex flex-col gap-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase">Entry</span>
                            <span className="font-mono font-bold text-primary">{data.entry}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-background border flex flex-col gap-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase">Stop Loss</span>
                            <span className="font-mono font-bold text-rose-500">{data.stopLoss}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-background border flex flex-col gap-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase">Target 1</span>
                            <span className="font-mono font-bold text-emerald-500">{data.target1}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-background border flex flex-col gap-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase">Target 2</span>
                            <span className="font-mono font-bold text-emerald-600">{data.target2}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Clock className="h-3 w-3" /> Execution Roadmap
                        </p>
                        <div className="space-y-2">
                            {data.executionPlan.map((step: ExecutionStep, i: number) => (
                                <div key={i} className="flex gap-3 text-xs bg-background/50 p-2 rounded border border-primary/5">
                                    <span className="font-black text-primary shrink-0 w-16">{step.time}</span>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{step.action} @ {step.priceLevel}</span>
                                        <span className="text-muted-foreground italic text-[10px]">{step.logic}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
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
                            <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5 uppercase tracking-tighter font-black">
                                <Sparkles className="h-3 w-3 mr-1" /> OPENING GAP DETECTOR ACTIVE
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <Landmark className="h-8 w-8 text-primary" />
                            AI Visual Market Strategist
                        </CardTitle>
                        <CardDescription>Upload today's chart and compare it with previous sessions to detect Gaps and Pattern Repeats.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {aiError && (
                        <div className='animate-in slide-in-from-top-2 duration-300'>
                            <Alert variant="destructive">
                                <ShieldAlert className="h-4 w-4" />
                                <AlertTitle>Analysis Issue</AlertTitle>
                                <AlertDescription className='flex flex-col gap-3'>
                                    <span>{aiError}</span>
                                    <Button variant="outline" size="sm" className='w-fit h-7 text-[10px]' onClick={handleAnalyze}>
                                        <RefreshCw className='mr-2 h-3 w-3' /> Retry Analysis
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* INPUT SECTION */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="symbolHint" className="text-xs font-black text-zinc-500 uppercase">Stock Name (Optional)</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-600" />
                                    <Input 
                                        id="symbolHint" 
                                        placeholder="e.g. Reliance, Paradeep" 
                                        className="pl-8 bg-muted/50 text-xs h-10 border-primary/10"
                                        value={symbolHint}
                                        onChange={(e) => setSymbolHint(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2 px-1">
                                        <Target className="h-3 w-3 text-primary" /> Today's Chart Movement
                                    </p>
                                    <div className='relative w-full aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-primary/20 shadow-inner group'>
                                         {!originalImage && (
                                             <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                         )}
                                         {originalImage && (
                                             <div className="relative w-full h-full">
                                                 <Image src={originalImage} alt="Uploaded Chart" fill className="object-contain" />
                                                 <Button 
                                                    variant="secondary" 
                                                    size="icon" 
                                                    className="absolute top-2 right-2 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => {setOriginalImage(null); setResult(null); setAiError('');}}
                                                 >
                                                     <Info className="h-4 w-4" />
                                                 </Button>
                                             </div>
                                         )}
                                         <canvas ref={canvasRef} className="hidden" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2 px-1">
                                        <History className="h-3 w-3 text-zinc-500" /> Previous Session Context
                                    </p>
                                    <div className='relative w-full aspect-square bg-zinc-900 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-800 shadow-inner group'>
                                        {previousImage ? (
                                            <div className="relative w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer">
                                                <Image src={previousImage} alt="Previous Chart" fill className="object-contain" />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                                                    <History className="h-8 w-8 text-white/40" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-4">
                                                <BarChart4 className="h-8 w-8 text-zinc-800 mx-auto mb-2" />
                                                <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest text-center">No previous session<br/>data recorded</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                 <Button onClick={handleCapture} disabled={originalImage !== null || !isCameraReady} className="w-full h-12 rounded-xl" variant="secondary">
                                    <Camera className="mr-2 h-4 w-4" /> Capture
                                </Button>
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full h-12 rounded-xl border-primary/20">
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                </Button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            </div>

                            <Button onClick={handleAnalyze} disabled={loading || !originalImage} className="w-full text-lg h-14 rounded-2xl shadow-xl bg-primary hover:scale-[1.02] transition-transform">
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
                                {loading ? 'Detecting Opening Movement...' : 'Check Opening & Strategy'}
                            </Button>
                        </div>

                        {/* RESULTS SECTION */}
                        <div className="space-y-4">
                            {!result && !loading && !aiError && (
                                <div className="h-full min-h-[400px] border-2 border-dashed rounded-2xl bg-muted/5 flex flex-col items-center justify-center text-center p-8">
                                    <ArrowRightLeft className="h-12 w-12 text-primary/20 mb-4" />
                                    <h3 className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Opening Detector Active</h3>
                                    <p className="text-[10px] text-muted-foreground mt-2 max-w-[250px]">
                                        Upload tomorrow's morning chart. I will cross-reference it with your history to detect Gap Ups/Downs and pattern repeats.
                                    </p>
                                </div>
                            )}

                            {loading && (
                                <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-4 animate-in fade-in">
                                    <div className='relative'>
                                        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-30" />
                                        <FileSearch className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary' />
                                    </div>
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse text-center">
                                        Analyzing Opening Candles...<br/>
                                        <span className='text-[9px] font-bold opacity-50'>Calculating Gap Variance</span>
                                    </p>
                                </div>
                            )}

                            {result && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                     {/* Opening Status Badge */}
                                     <div className={cn(
                                         "p-6 rounded-2xl border-2 flex items-center justify-between",
                                         result.openingStatus === 'Up Opening' ? "bg-emerald-500/10 border-emerald-500/20" : 
                                         result.openingStatus === 'Down Opening' ? "bg-rose-500/10 border-rose-500/20" : 
                                         "bg-zinc-500/10 border-zinc-500/20"
                                     )}>
                                         <div className="flex items-center gap-4">
                                             {result.openingStatus === 'Up Opening' ? <ArrowUpCircle className="h-8 w-8 text-emerald-500" /> : <ArrowDownCircle className="h-8 w-8 text-rose-500" />}
                                             <div>
                                                 <h3 className="font-black text-xl uppercase italic tracking-tighter">
                                                     {result.openingStatus} {result.openingGapPercent && `(${result.openingGapPercent})`}
                                                 </h3>
                                                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Visual Session Delta Detected</p>
                                             </div>
                                         </div>
                                         {result.isPatternRepeating && (
                                              <Badge className="bg-primary text-[10px] font-black py-1 px-3">REPLAY DETECTED</Badge>
                                         )}
                                     </div>

                                     <Tabs defaultValue="today" className="w-full">
                                         <TabsList className="grid w-full grid-cols-2 mb-4 h-12 bg-zinc-900/50 p-1">
                                             <TabsTrigger value="today" className="font-black text-[10px] uppercase">Execution Plan</TabsTrigger>
                                             <TabsTrigger value="previous" className="font-black text-[10px] uppercase" disabled={!previousAnalysis}>Prior Session</TabsTrigger>
                                         </TabsList>
                                         
                                         <TabsContent value="today" className="space-y-6">
                                             <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h2 className="text-2xl font-black italic tracking-tight uppercase">{result.symbol}</h2>
                                                    <Badge className={cn(
                                                        "px-4 py-1",
                                                        result.currentSentiment === 'Bullish' ? "bg-green-600" : result.currentSentiment === 'Bearish' ? "bg-red-600" : "bg-zinc-600"
                                                    )}>
                                                        {result.currentSentiment.toUpperCase()} BIAS
                                                    </Badge>
                                                </div>
                                                
                                                <div className='mt-4 pt-4 border-t border-primary/10 space-y-2'>
                                                    <p className='text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2'>
                                                        <AlertCircle className='h-3 w-3' /> Trend Similarity Analysis
                                                    </p>
                                                    <p className='text-xs text-muted-foreground italic leading-relaxed'>
                                                        "{result.comparisonVerdict || result.overallVerdict}"
                                                    </p>
                                                </div>
                                             </div>
                                             <div className="grid grid-cols-1 gap-4">
                                                <StrategyCard type="BUY" data={result.buyStrategy} />
                                                <StrategyCard type="SHORT" data={result.shortStrategy} />
                                             </div>
                                         </TabsContent>

                                         <TabsContent value="previous">
                                             {previousAnalysis && (
                                                 <div className="space-y-4 opacity-70">
                                                     <div className="p-4 rounded-xl border border-dashed border-zinc-800">
                                                         <p className="text-[10px] font-black uppercase text-zinc-500 mb-2">Historical Record: {previousAnalysis.symbol}</p>
                                                         <p className="text-xs italic text-zinc-400 leading-relaxed">"{previousAnalysis.overallVerdict}"</p>
                                                     </div>
                                                     <div className="grid grid-cols-2 gap-3">
                                                         <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                                                             <p className="text-[9px] font-bold text-zinc-600 uppercase">Buy Entry</p>
                                                             <p className="text-sm font-mono font-bold">{previousAnalysis.buyStrategy.entry}</p>
                                                         </div>
                                                         <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                                                             <p className="text-[9px] font-bold text-zinc-600 uppercase">Short Entry</p>
                                                             <p className="text-sm font-mono font-bold">{previousAnalysis.shortStrategy.entry}</p>
                                                         </div>
                                                     </div>
                                                 </div>
                                             )}
                                         </TabsContent>
                                     </Tabs>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-between border-t py-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    <div className='flex items-center gap-4'>
                        <span className='flex items-center gap-1'><RefreshCw className='h-3 w-3'/> Grounded Sync v2.6</span>
                        <span className='opacity-30'>|</span>
                        <span>GAP DETECTOR ENABLED</span>
                    </div>
                    <span>SYNCED: {result?.analysisDate || 'IDLE'}</span>
                </CardFooter>
            </Card>
        </div>
    );
}
