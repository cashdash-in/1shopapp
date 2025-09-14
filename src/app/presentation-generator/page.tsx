
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const shortcutCategories = [
    {
        category: "General Shortcuts",
        shortcuts: [
            { name: "Ctrl + N", description: "Create a new presentation." },
            { name: "Ctrl + M", description: "Insert a new slide." },
            { name: "Ctrl + D", description: "Duplicate the selected slide." },
            { name: "Ctrl + S", description: "Save the presentation." },
            { name: "Ctrl + Z", description: "Undo the last action." },
            { name: "Ctrl + Y", description: "Redo the last action." },
        ]
    },
    {
        category: "Editing & Formatting Shortcuts",
        shortcuts: [
            { name: "Ctrl + B", description: "Apply or remove bold formatting." },
            { name: "Ctrl + I", description: "Apply or remove italic formatting." },
            { name: "Ctrl + U", description: "Apply or remove an underline." },
            { name: "Ctrl + E", description: "Center align text." },
            { name: "Ctrl + L", description: "Left align text." },
            { name: "Ctrl + R", description: "Right align text." },
            { name: "Ctrl + K", description: "Insert a hyperlink." },
            { name: "Ctrl + Shift + >", description: "Increase font size." },
            { name: "Ctrl + Shift + <", description: "Decrease font size." },
        ]
    },
    {
        category: "Objects & Media Shortcuts",
        shortcuts: [
            { name: "Alt + N, P", description: "Insert a picture from your device." },
            { name: "Alt + N, S, H", description: "Insert a shape." },
            { name: "Ctrl + G", description: "Group selected objects." },
            { name: "Ctrl + Shift + G", description: "Ungroup selected objects." },
            { name: "Ctrl + Shift + C", description: "Copy formatting of an object (Format Painter)." },
            { name: "Ctrl + Shift + V", description: "Paste formatting to an object (Format Painter)." },
            { name: "Alt + Shift + D", description: "Insert the current date." },
            { name: "Alt + Shift + T", description: "Insert the current time." },
        ]
    },
    {
        category: "Slideshow Shortcuts",
        shortcuts: [
            { name: "F5", description: "Start the presentation from the beginning." },
            { name: "Shift + F5", description: "Start the presentation from the current slide." },
            { name: "N or Spacebar", description: "Advance to the next slide or animation." },
            { name: "P or Backspace", description: "Go back to the previous slide or animation." },
            { name: "Esc", description: "End the slideshow." },
            { name: "B", description: "Turn the screen black during a slideshow." },
        ]
    },
    {
        category: "Animation & Transitions",
        shortcuts: [
            { name: "Alt + K, A", description: "Open the Animations Pane." },
            { name: "Alt + K, T", description: "Open the Transitions tab." },
            { name: "Shift + F9", description: "Toggle the grid and guides." },
        ]
    }
];

const ShortcutRow = ({ shortcut }: { shortcut: { name: string; description: string } }) => {
    return (
        <div className="flex items-center justify-between gap-2 p-3 border-t">
            <p className="text-sm text-muted-foreground">{shortcut.description}</p>
            <code className="text-sm bg-muted px-2 py-1 rounded-sm font-semibold whitespace-nowrap">{shortcut.name}</code>
        </div>
    )
}

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
                        <CardDescription>Get a head start on your next presentation, plus a handy list of shortcuts.</CardDescription>
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

                    <div className="space-y-6 pt-6 border-t">
                        <h2 className="text-2xl font-bold text-center">Presentation Shortcuts</h2>
                         <Accordion type="single" collapsible className="w-full" defaultValue={shortcutCategories[0].category}>
                            {shortcutCategories.map(category => (
                                <AccordionItem value={category.category} key={category.category}>
                                    <AccordionTrigger className="text-lg font-medium">{category.category}</AccordionTrigger>
                                    <AccordionContent className="p-0">
                                        <div className="flex flex-col">
                                            {category.shortcuts.map(shortcut => (
                                                <ShortcutRow key={shortcut.name} shortcut={shortcut} />
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                
                </CardContent>
            </Card>
        </div>
    );
}
