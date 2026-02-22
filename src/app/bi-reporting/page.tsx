'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Sparkles, LayoutGrid, Bot, Download, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip } from 'recharts';
import { generateBiReport } from '@/ai/flows/bi-report-flow';
import type { BiReportOutput } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const exampleData = `Date,Product,Category,SalePrice,Region
2024-01-15,Laptop,Electronics,1200,North
2024-01-20,Mouse,Electronics,25,North
2024-02-10,Keyboard,Electronics,75,South
2024-02-18,Laptop,Electronics,1250,South
2024-03-05,Webcam,Electronics,150,North
2024-03-25,Monitor,Electronics,300,West
2024-04-12,Laptop,Electronics,1150,West
2024-04-20,Mouse,Electronics,30,East
2024-05-08,Keyboard,Electronics,80,East
2024-05-19,Webcam,Electronics,160,South`;

export default function BiReportingPage() {
    const { toast } = useToast();
    const [data, setData] = useState(exampleData);
    const [request, setRequest] = useState('What are the total sales per region?');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<BiReportOutput | null>(null);
    const [aiError, setAiError] = useState('');

    const handleGenerate = async () => {
        if (!data.trim() || !request.trim()) {
            toast({
                variant: 'destructive',
                title: 'Data and Request Required',
                description: 'Please provide data and a request before generating a report.',
            });
            return;
        }

        setLoading(true);
        setResult(null);
        setAiError('');

        try {
            const response = await generateBiReport({ data, request });
            setResult(response);
        } catch (error: any) {
            console.error('AI report generation failed:', error);
            setAiError(error.message || 'The AI could not generate your report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadCsvData = () => {
        if (!result?.chartData) return;
        const headers = 'Metric,Value\n';
        const rows = result.chartData.map(d => `${d.name},${d.value}`).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bi-report-data.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
            <Card className="w-full max-w-6xl">
                <CardHeader className="relative">
                    <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Back to Home</span>
                    </Link>
                    <div className="text-center pt-8">
                        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <LayoutGrid className="h-8 w-8 text-primary" />
                            AI BI Intelligence Hub
                        </CardTitle>
                        <CardDescription>Generate strategic business intelligence reports and high-precision visualizations.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>AI Feature Unavailable</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="data">1. Data Context (CSV or text)</Label>
                            <Textarea
                                id="data"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                placeholder="Paste your CSV or text data here..."
                                disabled={loading}
                                rows={10}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="request">2. Analysis Requirement</Label>
                            <Textarea
                                id="request"
                                value={request}
                                onChange={(e) => setRequest(e.target.value)}
                                placeholder="e.g., 'Perform a comparative analysis of regional performance.'"
                                disabled={loading}
                                rows={10}
                            />
                        </div>
                    </div>

                    <Button onClick={handleGenerate} disabled={loading} className="w-full text-lg h-12">
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {loading ? 'Synthesizing Report...' : 'Generate Executive Report'}
                    </Button>
                
                    {result && (
                         <div className="space-y-6 pt-6 border-t">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Generated Intelligence Report</h2>
                                <Button variant="outline" size="sm" onClick={downloadCsvData}>
                                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Download CSV Data
                                </Button>
                            </div>
                             <Card className="bg-secondary/50 border-primary/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5"/> Executive Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                                </CardContent>
                            </Card>
                            {result.chartData && result.chartData.length > 0 && (
                                 <Card>
                                    <CardHeader>
                                        <CardTitle>{result.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                       <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={result.chartData}>
                                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                                            </BarChart>
                                        </ResponsiveContainer>
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
