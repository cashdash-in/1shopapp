
'use client'

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { analyzeSentiment, type SentimentOutput } from '@/ai/flows/sentiment-analysis-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Frown, Meh, Smile, Tag, Bot } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Simulated historical data
const initialSentimentData = [
    { name: 'Positive', value: 400 },
    { name: 'Negative', value: 125 },
    { name: 'Neutral', value: 175 },
];

const COLORS = {
    Positive: '#22c55e', // green-500
    Negative: '#ef4444', // red-500
    Neutral: '#f59e0b',  // amber-500
};

export default function SentimentAnalysisPage() {
    const [feedback, setFeedback] = useState('');
    const [result, setResult] = useState<SentimentOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!feedback.trim()) {
            setError("Please enter some feedback to analyze.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const analysisResult = await analyzeSentiment({ text: feedback });
            setResult(analysisResult);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze sentiment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const chartData = useMemo(() => {
        if (!result) return initialSentimentData;
        const newData = [...initialSentimentData];
        const existingEntry = newData.find(d => d.name === result.sentiment);
        if (existingEntry) {
            // This is just a simulation of updating the chart
            // A real implementation would fetch and aggregate data
        }
        return newData;
    }, [result]);


    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">AI-Powered Sentiment Analysis</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Sentiment Distribution</CardTitle>
                        <CardDescription>Overall customer sentiment based on feedback.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                             <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Analyze New Feedback</CardTitle>
                        <CardDescription>Enter customer feedback below to get an instant AI analysis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="feedback-text">Customer Feedback</Label>
                                <Textarea
                                    id="feedback-text"
                                    placeholder="Type or paste customer feedback here..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                />
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Analyzing...' : 'Analyze Sentiment'}
                            </Button>
                        </form>

                        {loading && (
                            <div className="mt-6 space-y-4">
                                <Skeleton className="h-8 w-1/4" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                        )}
                        
                        {result && !loading && (
                             <div className="mt-6 space-y-4 p-4 border rounded-lg bg-muted/50">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Bot className="h-5 w-5 text-primary" /> Analysis Result
                                </h3>
                                <div className="flex items-center gap-4">
                                    <h4 className="font-medium text-muted-foreground w-24">Sentiment</h4>
                                    <Badge
                                        variant={result.sentiment === 'Positive' ? 'default' : result.sentiment === 'Negative' ? 'destructive' : 'secondary'}
                                        className={`text-base ${result.sentiment === 'Positive' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                                    >
                                        {result.sentiment === 'Positive' && <Smile className="h-4 w-4 mr-2" />}
                                        {result.sentiment === 'Negative' && <Frown className="h-4 w-4 mr-2" />}
                                        {result.sentiment === 'Neutral' && <Meh className="h-4 w-4 mr-2" />}
                                        {result.sentiment}
                                    </Badge>
                                </div>
                                 <div className="flex items-start gap-4">
                                    <h4 className="font-medium text-muted-foreground w-24 mt-1">Summary</h4>
                                    <p className="text-foreground flex-1">{result.summary}</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <h4 className="font-medium text-muted-foreground w-24 mt-1">Categories</h4>
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {result.categories.map(cat => (
                                            <Badge key={cat} variant="outline" className="flex items-center gap-1">
                                                <Tag className="h-3 w-3"/>
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
