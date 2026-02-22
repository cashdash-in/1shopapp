'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Sparkles, BarChart3, Bot, Download, FileText, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { analyzeData } from '@/ai/flows/data-analysis-flow';
import type { DataAnalysisOutput } from '@/ai/schemas';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DataAnalystPage() {
    const { toast } = useToast();
    const [data, setData] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DataAnalysisOutput | null>(null);
    const [aiError, setAiError] = useState('');

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
        setAiError('');

        try {
            const response = await analyzeData({ data, question });
            setResult(response);
        } catch (error: any) {
            console.error('AI analysis failed:', error);
            setAiError(error.message || 'The AI could not analyze your data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadTxt = () => {
        if (!result) return;
        const blob = new Blob([result.summary, '\n\n', result.data || ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-analysis-report.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadCsv = () => {
        if (!result?.data) return;
        // Simple conversion from MD table to CSV
        const rows = result.data.trim().split('\n').filter(r => r.includes('|') && !r.includes('---'));
        const csvContent = rows.map(row => {
            return row.split('|')
                .map(cell => cell.trim())
                .filter((_, i, arr) => i > 0 && i < arr.length - 1)
                .join(',');
        }).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-analysis-data.csv';
        a.click();
        URL.revokeObjectURL(url);
    };
    
    const renderMarkdownTable = (markdown: string) => {
        try {
            const rows = markdown.trim().split('\n').filter(row => row.includes('|'));
            if (rows.length < 2) return <p>Could not render table from AI output.</p>;

            const headerCells = rows[0].split('|').map(h => h.trim()).filter(h => h);
            const bodyRows = rows.slice(2).map(row => {
                const cells = row.split('|').map(c => c.trim());
                return cells.slice(1, -1);
            });

            if (headerCells.length === 0 || bodyRows.length === 0) return null;

            return (
                <div className="overflow-x-auto rounded-md border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                {headerCells.map((col, i) => <th key={i} className="p-2 text-left font-semibold">{col}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {bodyRows.map((row, i) => (
                                <tr key={i} className="border-t">
                                    {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } catch (error) {
            return (
                <pre className="text-xs bg-muted p-4 rounded-md whitespace-pre-wrap font-mono">
                    <code>{markdown}</code>
                </pre>
            )
        }
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
                            <BarChart3 className="h-8 w-8 text-primary" />AI High-Precision Data Analyst
                        </CardTitle>
                        <CardDescription>Paste your data, ask a question, and get professional-grade insights and documents.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>AI Feature Unavailable</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="data">1. Paste your data (CSV or text)</Label>
                            <Textarea
                                id="data"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                placeholder="Example:&#10;Product,Sales,Region&#10;Laptop,5000,North&#10;Mouse,1200,South"
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
                                placeholder="Example: 'Analyze the growth trend and output a precision summary.'"
                                disabled={loading}
                                rows={8}
                            />
                        </div>
                    </div>

                    <Button onClick={handleAnalyze} disabled={loading} className="w-full text-lg h-12">
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {loading ? 'Analyzing with Precision...' : 'Analyze & Generate Documents'}
                    </Button>
                
                    {result && (
                         <div className="space-y-4 pt-6 border-t">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Analysis Result</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={downloadTxt}>
                                        <FileText className="mr-2 h-4 w-4" /> Download Report
                                    </Button>
                                    {result.data && (
                                        <Button variant="outline" size="sm" onClick={downloadCsv}>
                                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Download CSV
                                        </Button>
                                    )}
                                </div>
                            </div>
                             <Card className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5"/> AI Precision Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{result.summary}</p>
                                </CardContent>
                            </Card>
                            {result.data && (
                                 <Card>
                                    <CardHeader>
                                        <CardTitle>Calculated Data</CardTitle>
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
