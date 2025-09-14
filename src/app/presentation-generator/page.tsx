
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Sparkles, Presentation, Copy } from 'lucide-react';
import Link from 'next/link';
import { generatePresentation } from '@/ai/flows/presentation-flow';
import type { PresentationOutput } from '@/ai/schemas';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function PresentationGeneratorPage() {
    const { toast } = useToast();
    const [topic, setTopic] = useState('');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PresentationOutput | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast({
                variant: 'destructive',
                title: 'Topic Required',
                description: 'Please enter a topic for your presentation.',
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await generatePresentation({ topic, instructions });
            setResult(response);
        } catch (error) {
            console.error('AI generation failed:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'The AI could not generate the presentation. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleCopySlide = (slide: { title: string; content: string[] }) => {
        const slideText = `Title: ${slide.title}\n\n${slide.content.map(point => `- ${point}`).join('\n')}`;
        navigator.clipboard.writeText(slideText);
        toast({
            title: 'Copied to Clipboard',
            description: `Slide "${slide.title}" has been copied.`,
        });
    }

    return (
        <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
            <Card className="w-full max-w-4xl">
                <CardHeader className="relative">
                    <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Back to Home</span>
                    </Link>
                    <div className="text-center pt-8">
                        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <Presentation className="h-8 w-8 text-primary" />AI Presentation Generator
                        </CardTitle>
                        <CardDescription>Get a head start on your next presentation. Just provide a topic and let AI do the heavy lifting.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="topic">Presentation Topic</Label>
                            <Input
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., 'Q3 Marketing Performance Review'"
                                disabled={loading}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="instructions">Specific Instructions (Optional)</Label>
                            <Textarea
                                id="instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="e.g., 'Create 5 slides. Cover social media, email campaigns, and budget.'"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <Button onClick={handleGenerate} disabled={loading} className="w-full text-lg h-12">
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {loading ? 'Generating...' : 'Generate Presentation'}
                    </Button>
                
                    {result && (
                         <div className="space-y-6 pt-6 border-t">
                            <h2 className="text-2xl font-bold text-center">Generated Slides</h2>
                            {result.slides.map((slide, index) => (
                                <Card key={index} className="bg-secondary/50">
                                    <CardHeader className="flex flex-row items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">SLIDE {index + 1}</p>
                                            <CardTitle className="text-xl">{slide.title}</CardTitle>
                                        </div>
                                         <Button variant="ghost" size="icon" onClick={() => handleCopySlide(slide)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                                            {slide.content.map((point, pointIndex) => (
                                                <li key={pointIndex}>{point}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                
                </CardContent>
            </Card>
        </div>
    );
}
