
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, Loader2, Landmark, Camera, Upload, 
  Sparkles, ArrowUpRight, ArrowDownRight, Target, 
  ShieldAlert, Clock, Info, CheckCircle2, Wand2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getMarketIndicator } from '@/ai/flows/market-indicator-flow';
import type { MarketIndicatorOutput, ExecutionStep } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default function MarketIndicatorPage() {
    const { toast } = useToast();
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MarketIndicatorOutput | null>(null);
    const [aiError, setAiError] = useState('');
    
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera API not available.');
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.onloadedmetadata = () => setIsCameraReady(true);
            }
          } catch (error) {
            setHasCameraPermission(false);
          }
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
            reader.onload = (e) => {
                setOriginalImage(e.target?.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCapture = () => {
        if (videoRef.current && canvasRef.current && isCameraReady) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                setOriginalImage(canvas.toDataURL('image/png'));
                setResult(null);
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
        try {
            const response = await getMarketIndicator({ photoDataUri: originalImage });
            setResult(response);
            toast({ title: "Chart Analysis Complete", description: "Step-by-step strategy identified." });
        } catch (error: any) {
            setAiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const StrategyCard = ({ type, data }: { type: 'BUY' | 'SHORT', data: MarketIndicatorOutput['buyStrategy'] | MarketIndicatorOutput['shortStrategy'] }) => {
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
                            EXECUTE PLAN
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-lg bg-background border flex flex-col gap-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase">Entry Price</span>
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
                            <Clock className="h-3 w-3" /> Time-wise Action Plan
                        </p>
                        <div className="space-y-2">
                            {data.executionPlan.map((step, i) => (
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
            <Card className="w-full max-w-5xl border-primary/10 shadow-2xl">
                <CardHeader className="relative">
                    <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Back to Home</span>
                    </Link>
                    <div className="text-center pt-8">
                        <div className='flex items-center justify-center gap-2 mb-2'>
                            <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5">
                                <Sparkles className="h-3 w-3 mr-1" /> VISUAL QUANT SYNCHRONIZATION
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <Landmark className="h-8 w-8 text-primary" />
                            AI Visual Market Strategist
                        </CardTitle>
                        <CardDescription>Upload chart screenshot for time-wise Entry, Exit & Profit analysis.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>Analysis Error</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className='relative w-full aspect-video bg-muted rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-primary/20 shadow-inner'>
                                 {!originalImage && (
                                     <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                 )}
                                 {originalImage && (
                                     <div className="relative w-full h-full">
                                         <Image src={originalImage} alt="Uploaded Chart" fill className="object-contain" />
                                         <Button 
                                            variant="secondary" 
                                            size="icon" 
                                            className="absolute top-2 right-2 rounded-full h-8 w-8"
                                            onClick={() => {setOriginalImage(null); setResult(null);}}
                                         >
                                             <Info className="h-4 w-4" />
                                         </Button>
                                     </div>
                                 )}
                                 <canvas ref={canvasRef} className="hidden" />
                                 {!originalImage && hasCameraPermission === false && (
                                    <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/80'>
                                         <Alert variant="destructive">
                                            <Camera className='h-4 w-4'/>
                                            <AlertTitle>Camera Required</AlertTitle>
                                            <AlertDescription>Enable permissions or use Upload.</AlertDescription>
                                        </Alert>
                                    </div>
                                 )}
                            </div>
                            <div className="flex gap-2">
                                 <Button onClick={handleCapture} disabled={originalImage !== null || !isCameraReady} className="w-full h-12 rounded-xl" variant="secondary">
                                    <Camera className="mr-2 h-4 w-4" /> Capture Screenshot
                                </Button>
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full h-12 rounded-xl border-primary/20">
                                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                                </Button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            </div>
                            <Button onClick={handleAnalyze} disabled={loading || !originalImage} className="w-full text-lg h-14 rounded-2xl shadow-xl bg-primary hover:scale-[1.02] transition-transform">
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                                {loading ? 'Analyzing Chart Patterns...' : 'Generate Step-by-Step Strategy'}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {!result && !loading && (
                                <div className="h-full min-h-[300px] border-2 border-dashed rounded-2xl bg-muted/5 flex flex-col items-center justify-center text-center p-8">
                                    <Sparkles className="h-12 w-12 text-primary/20 mb-4" />
                                    <h3 className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Waiting for Visualization</h3>
                                    <p className="text-[10px] text-muted-foreground mt-2 max-w-[200px]">Upload a 5min or 15min chart screenshot to unlock time-wise quant actions.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-4 animate-in fade-in">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary opacity-30" />
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Running Neural Trend Mapping...</p>
                                </div>
                            )}

                            {result && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                     <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-2xl font-black italic tracking-tight">{result.symbol}</h2>
                                            <Badge className={cn(
                                                "px-4 py-1",
                                                result.currentSentiment === 'Bullish' ? "bg-green-600" : result.currentSentiment === 'Bearish' ? "bg-red-600" : "bg-zinc-600"
                                            )}>
                                                {result.currentSentiment.toUpperCase()} BIAS
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                                            "{result.overallVerdict}"
                                        </p>
                                     </div>
                                     <div className="grid grid-cols-1 gap-4">
                                        <StrategyCard type="BUY" data={result.buyStrategy} />
                                        <StrategyCard type="SHORT" data={result.shortStrategy} />
                                     </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-between border-t py-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    <span>Grounded Visual Context Engine</span>
                    <span>Sync: {result?.analysisDate || 'IDLE'}</span>
                </CardFooter>
            </Card>
        </div>
    );
}
