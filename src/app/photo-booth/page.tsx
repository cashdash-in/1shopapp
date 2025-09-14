
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Camera, Download, Loader2, Sparkles, Upload, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { runPhotoBooth } from '@/ai/flows/photo-booth-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const styles = [
    { id: 'Cartoon', label: 'Cartoon', filter: 'saturate(2) contrast(1.5)' },
    { id: 'Anime', label: 'Anime', filter: 'brightness(1.2) contrast(1.2)' },
    { id: 'Oil Painting', label: 'Oil Painting', filter: 'sepia(0.5) contrast(1.4)' },
    { id: 'Cyberpunk', label: 'Cyberpunk', filter: 'hue-rotate(-45deg) saturate(1.5) contrast(1.2)' },
    { id: 'Pixel Art', label: 'Pixel Art', filter: 'grayscale(1) brightness(0.9) contrast(2)' },
    { id: 'Wallpaper', label: 'Wallpaper', filter: 'brightness(1.1) contrast(1.1) saturate(1.2)' },
];

export default function PhotoBoothPage() {
    const { toast } = useToast();
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>(styles[0].id);
    const [loading, setLoading] = useState(false);
    
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Request camera permission on mount
    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera API not available in this browser.');
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              // Add an event listener to know when the video is ready to be played.
              videoRef.current.onloadedmetadata = () => {
                setIsCameraReady(true);
              };
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
          }
        };
    
        getCameraPermission();

        return () => {
            // Cleanup: stop camera stream when component unmounts
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        }
      }, [toast]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setOriginalImage(e.target?.result as string);
                setGeneratedImage(null); // Clear previous result
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
                const dataUri = canvas.toDataURL('image/png');
                setOriginalImage(dataUri);
                setGeneratedImage(null); // Clear previous result
            }
        }
    };

    const handleGenerate = async () => {
        if (!originalImage) {
            toast({
                variant: 'destructive',
                title: 'No Image',
                description: 'Please capture or upload an image first.',
            });
            return;
        }

        setLoading(true);
        setGeneratedImage(null);

        try {
            const result = await runPhotoBooth({
                photoDataUri: originalImage,
                style: selectedStyle,
            });
            setGeneratedImage(result.imageDataUri);
        } catch (error) {
            console.error('AI generation failed:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'The AI could not process the image. Please try again or use a different image.',
            });
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = () => {
        if (generatedImage) {
            const a = document.createElement('a');
            a.href = generatedImage;
            a.download = `1shopapp-ai-photobooth-${selectedStyle.toLowerCase()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const activeStyleFilter = styles.find(s => s.id === selectedStyle)?.filter || 'none';

    return (
        <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
            <Card className="w-full max-w-6xl">
                <CardHeader className="relative">
                    <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Back to Home</span>
                    </Link>
                    <div className="text-center pt-8">
                        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3"><Wand2 className="h-8 w-8 text-primary"/>AI Photo Booth</CardTitle>
                        <CardDescription>Transform your photos into stunning works of art with AI.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Input */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Provide an Image</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className='relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center'>
                                     <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                     <canvas ref={canvasRef} className="hidden" />
                                     {hasCameraPermission === false && (
                                        <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/80'>
                                             <Alert variant="destructive">
                                                <Camera className='h-4 w-4'/>
                                                <AlertTitle>Camera Access Required</AlertTitle>
                                                <AlertDescription>
                                                    Please allow camera access to use this feature. You may need to reload the page after granting permission.
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                     )}
                                     {hasCameraPermission === null && <Loader2 className="h-8 w-8 animate-spin text-primary"/>}
                                </div>
                                <div className="flex gap-2">
                                     <Button onClick={handleCapture} disabled={!hasCameraPermission || !isCameraReady} className="w-full">
                                        <Camera className="mr-2 h-4 w-4" />
                                        Capture Photo
                                    </Button>
                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Image
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/png, image/jpeg"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>2. Choose a Style</CardTitle>
                            </CardHeader>
                            <CardContent>
                               <RadioGroup value={selectedStyle} onValueChange={setSelectedStyle} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {styles.map((style) => (
                                        <div key={style.id}>
                                            <RadioGroupItem value={style.id} id={style.id} className="peer sr-only" />
                                            <Label
                                                htmlFor={style.id}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                            >
                                                {style.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                        <Button onClick={handleGenerate} disabled={loading || !originalImage} className="w-full text-lg h-12">
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                            {loading ? 'Generating...' : 'Generate Image'}
                        </Button>
                    </div>

                    {/* Right Column: Output */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className='font-semibold text-center mb-2'>Original</h3>
                                <div className="aspect-square w-full rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                    {originalImage ? (
                                        <Image src={originalImage} alt="Original" width={512} height={512} className="object-contain w-full h-full" />
                                    ) : (
                                        <p className="text-muted-foreground text-sm">Your image</p>
                                    )}
                                </div>
                            </div>
                             <div>
                                <h3 className='font-semibold text-center mb-2'>Stylized</h3>
                                <div className="aspect-square w-full rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                     {loading && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
                                     {!loading && generatedImage && (
                                        <Image 
                                            src={generatedImage} 
                                            alt="Generated" 
                                            width={512} 
                                            height={512} 
                                            className="object-contain w-full h-full" 
                                            style={{ filter: activeStyleFilter }}
                                        />
                                     )}
                                     {!loading && !generatedImage && (
                                        <p className="text-muted-foreground text-sm">Your result</p>
                                     )}
                                </div>
                            </div>
                        </div>
                        <Button onClick={downloadImage} disabled={!generatedImage} variant="secondary" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download Generated Image
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
