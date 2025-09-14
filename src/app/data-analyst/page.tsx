
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Sparkles, BarChart3, Bot } from 'lucide-react';
import Link from 'next/link';
import { analyzeData } from '@/ai/flows/data-analysis-flow';
import type { DataAnalysisOutput } from '@/ai/schemas';
import { useToast } from '@/hooks/use-toast';

export default function DataAnalystPage() {
    const { toast } = useToast();
    const [data, setData] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DataAnalysisOutput | null>(null);

    const handleAnalyze = async () => {
        if (!data.trim() || !question.trim()) {
            toast({
                variant: 'destructive',
                title: 'Data and Question Required',
                description: 'Please provide data and a question before analyzing.',
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await analyzeData({ data, question });
            setResult(response);
        } catch (error) {
            console.error('AI analysis failed:', error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'The AI could not analyze your data. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };
    
    // A simple function to render markdown tables
    const renderMarkdownTable = (markdown: string) => {
        const rows = markdown.trim().split('\n');
        const header = rows[0].split('|').map(h => h.trim());
        const body = rows.slice(2).map(row => row.split('|').map(c => c.trim()));

        return (
            <div className="overflow-x-auto rounded-md border">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted">
                        <tr>
                            {header.map((col, i) => col && <th key={i} className="p-2 text-left font-semibold">{col}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {body.map((row, i) => (
                            <tr key={i} className="border-t">
                                {row.map((cell, j) => header[j] && <td key={j} className="p-2">{cell}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
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
                            <BarChart3 className="h-8 w-8 text-primary" />AI Data Analyst
                        </CardTitle>
                        <CardDescription>Paste your data, ask a question, and get instant insights from AI.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="data">1. Paste your data (CSV or text)</Label>
                            <Textarea
                                id="data"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                placeholder="Example:\nProduct,Sales,Region\nLaptop,5000,North\nMouse,1200,South"
                                disabled={loading}
                                rows={8}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question">2. Ask a question about your data</Label>
                            <Textarea
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Example: 'What are the total sales per region?'"
                                disabled={loading}
                                rows={8}
                            />
                        </div>
                    </div>

                    <Button onClick={handleAnalyze} disabled={loading} className="w-full text-lg h-12">
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {loading ? 'Analyzing...' : 'Analyze Data'}
                    </Button>
                
                    {result && (
                         <div className="space-y-4 pt-6 border-t">
                            <h2 className="text-2xl font-bold text-center">Analysis Result</h2>
                             <Card className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5"/> AI Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{result.summary}</p>
                                </CardContent>
                            </Card>
                            {result.data && (
                                 <Card>
                                    <CardHeader>
                                        <CardTitle>Resulting Data</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {renderMarkdownTable(result.data)}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                
                </CardContent>
            </Card>
        </div>
    );
}
