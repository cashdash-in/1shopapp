
'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Frown, Meh, Smile, Tag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getSentimentFeedback } from '@/ai/flows/sentiment-analysis-flow';
import type { SentimentAnalysis } from '@/ai/schemas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

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
    const [feedbackList, setFeedbackList] = useState<SentimentAnalysis[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                const data = await getSentimentFeedback();
                setFeedbackList(data);
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
        const sentimentCounts = feedbackList.reduce((acc, curr) => {
            acc[curr.analysis.sentiment] = (acc[curr.analysis.sentiment] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(sentimentCounts).map(([name, value]) => ({
            name,
            value,
        }));
    }, [feedbackList]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">AI-Powered Sentiment Analysis</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sentiment Distribution</CardTitle>
                        <CardDescription>Live analysis of all user feedback received.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading && (!feedbackList || feedbackList.length === 0) ? (
                            <Skeleton className="w-full h-[250px] rounded-lg"/>
                        ) : (
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
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Feedback Log</CardTitle>
                        <CardDescription>A real-time log of all feedback submitted by users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sentiment</TableHead>
                                        <TableHead>Summary</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading && (!feedbackList || feedbackList.length === 0) ? (
                                        Array.from({length: 5}).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-5 w-20"/></TableCell>
                                                <TableCell><Skeleton className="h-5 w-full"/></TableCell>
                                                <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                                            </TableRow>
                                        ))
                                    ) : feedbackList?.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Badge
                                                    variant={item.analysis.sentiment === 'Positive' ? 'default' : item.analysis.sentiment === 'Negative' ? 'destructive' : 'secondary'}
                                                    className={`text-base ${item.analysis.sentiment === 'Positive' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700' : ''}`}
                                                >
                                                    <SentimentIcon sentiment={item.analysis.sentiment} />
                                                    <span className='ml-2'>{item.analysis.sentiment}</span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium">{item.analysis.summary}</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {item.analysis.categories.map(cat => (
                                                         <Badge key={cat} variant="outline" className="flex items-center gap-1 text-xs">
                                                            <Tag className="h-2.5 w-2.5"/>
                                                            {cat}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {format(new Date(item.submittedAt), "MMM d, yyyy")}
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
