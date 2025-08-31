
'use client'

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Frown, Meh, Smile, Tag, Bot, Sparkles, BrainCircuit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { getFeedback, updateFeedback } from '@/ai/flows/feedback-submission-flow';
import { runSentimentAnalysis } from '@/ai/flows/sentiment-analysis-flow';
import type { Feedback, SentimentOutput } from '@/ai/schemas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const COLORS = {
    Positive: '#22c55e', // green-500
    Negative: '#ef4444', // red-500
    Neutral: '#f59e0b',  // amber-500
};

const SentimentIcon = ({ sentiment }: { sentiment: 'Positive' | 'Negative' | 'Neutral' }) => {
    switch (sentiment) {
        case 'Positive': return <Smile className="h-4 w-4 text-green-500" />;
        case 'Negative': return <Frown className="h-4 w-4 text-red-500" />;
        case 'Neutral': return <Meh className="h-4 w-4 text-amber-500" />;
        default: return null;
    }
}

export default function SentimentAnalysisPage() {
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAnalyzing, startAnalyzing] = useTransition();
    const { toast } = useToast();


    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                const data = await getFeedback();
                // Sort by date descending
                const sortedData = data.sort((a, b) => parseISO(b.submittedAt).getTime() - parseISO(a.submittedAt).getTime());
                setFeedbackList(sortedData);
            } catch (error) {
                console.error("Failed to fetch sentiment feedback", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    const chartData = useMemo(() => {
        if (!feedbackList) return [];
        const analyzedFeedback = feedbackList.filter(item => item.analysis);
        const sentimentCounts = analyzedFeedback.reduce((acc, curr) => {
            const sentiment = curr.analysis!.sentiment;
            acc[sentiment] = (acc[sentiment] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(sentimentCounts).map(([name, value]) => ({
            name,
            value,
        }));
    }, [feedbackList]);

     const handleAnalyze = (feedbackItem: Feedback) => {
        startAnalyzing(async () => {
            try {
                const analysisResult = await runSentimentAnalysis(feedbackItem.feedback);

                const updatedItem: Feedback = { ...feedbackItem, analysis: analysisResult };

                // Optimistically update the UI
                setFeedbackList(prevList =>
                    prevList.map(item => item.id === updatedItem.id ? updatedItem : item)
                );

                // Persist the change
                await updateFeedback(updatedItem);

                toast({
                    title: "Analysis Complete",
                    description: "Sentiment analysis has been successfully performed.",
                });

            } catch (error) {
                 toast({
                    title: "Analysis Failed",
                    description: "Could not analyze the feedback. Please try again.",
                    variant: 'destructive'
                });
                console.error("Failed to analyze feedback:", error);
                // Revert optimistic update on failure if necessary, though in this case it might not be a bad user experience to leave it.
            }
        });
    };


    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">AI-Powered Sentiment Analysis</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sentiment Distribution</CardTitle>
                        <CardDescription>Analysis of all processed user feedback.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading && chartData.length === 0 ? (
                            <Skeleton className="w-full h-[250px] rounded-lg"/>
                        ) : chartData.length > 0 ? (
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
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[250px] text-center text-muted-foreground">
                                <BrainCircuit className="h-12 w-12 mb-4 text-primary/50"/>
                                <p>No feedback analyzed yet.</p>
                                <p className="text-xs">Click "Analyze" on items in the log to see results here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Feedback Log</CardTitle>
                        <CardDescription>A real-time log of all feedback submitted by users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Feedback</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Action / Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({length: 5}).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-5 w-full"/></TableCell>
                                                <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto"/></TableCell>
                                            </TableRow>
                                        ))
                                    ) : feedbackList?.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {item.analysis ? (
                                                    <>
                                                        <p className="font-medium">{item.analysis.summary}</p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {item.analysis.categories.map(cat => (
                                                                <Badge key={cat} variant="outline" className="flex items-center gap-1 text-xs">
                                                                    <Tag className="h-2.5 w-2.5"/>
                                                                    {cat}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-muted-foreground italic">{item.feedback.text}</p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {format(parseISO(item.submittedAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.analysis ? (
                                                     <Badge
                                                        variant={item.analysis.sentiment === 'Positive' ? 'default' : item.analysis.sentiment === 'Negative' ? 'destructive' : 'secondary'}
                                                        className={`text-base ${item.analysis.sentiment === 'Positive' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700' : ''}`}
                                                    >
                                                        <SentimentIcon sentiment={item.analysis.sentiment} />
                                                        <span className='ml-2'>{item.analysis.sentiment}</span>
                                                    </Badge>
                                                ) : (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => handleAnalyze(item)}
                                                        disabled={isAnalyzing}
                                                    >
                                                        <Sparkles className="mr-2 h-4 w-4"/>
                                                        Analyze
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

