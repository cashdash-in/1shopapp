'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Sparkles, BarChart3, Bot, Download, FileText, FileSpreadsheet, Upload, FileJson } from 'lucide-react';
import Link from 'next/link';
import { analyzeData } from '@/ai/flows/data-analysis-flow';
import type { DataAnalysisOutput } from '@/ai/schemas';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as XLSX from 'xlsx';

export default function DataAnalystPage() {
    const { toast } = useToast();
    const [data, setData] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DataAnalysisOutput | null>(null);
    const [aiError, setAiError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const csv = XLSX.utils.sheet_to_csv(ws);
                setData(csv);
                toast({ title: "File Uploaded", description: `${file.name} has been processed.` });
            } catch (err) {
                console.error("File processing error:", err);
                toast({ variant: 'destructive', title: "Upload Failed", description: "Could not read the file. Please ensure it's a valid Excel or CSV." });
            }
        };
        reader.readAsBinaryString(file);
    };

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

    const downloadWord = () => {
        if (!result) return;
        const content = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>AI Analysis Report</title></head>
            <body style="font-family: Arial, sans-serif;">
                <h1>AI High-Precision Analysis Report</h1>
                <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
                <hr/>
                <h2>Executive Summary</h2>
                <p style="white-space: pre-wrap;">${result.summary}</p>
                ${result.data ? `<h2>Calculated Data Table</h2><pre>${result.data}</pre>` : ''}
            </body>
            </html>
        `;
        const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-analysis-report.doc';
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadExcel = () => {
        if (!result?.data) return;
        try {
            const rows = result.data.trim().split('\n').filter(r => r.includes('|') && !r.includes('---'));
            const wsData = rows.map(row => {
                return row.split('|')
                    .map(cell => cell.trim())
                    .filter((_, i, arr) => i > 0 && i < arr.length - 1);
            });
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "AI Results");
            XLSX.writeFile(wb, 'ai-analysis-data.xlsx');
        } catch (e) {
            toast({ variant: 'destructive', title: "Excel Export Failed" });
        }
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
                        <CardDescription>Upload Excel files or paste data, ask a question, and get professional-grade MS documents.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>AI Feature Unavailable</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="flex justify-end">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xlsx,.xls,.csv" />
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" /> Upload Excel / CSV
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="data">1. Data Context</Label>
                            <Textarea
                                id="data"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                placeholder="Paste data or upload a file above..."
                                disabled={loading}
                                rows={8}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question">2. Analysis Requirement</Label>
                            <Textarea
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Example: 'Analyze the growth trend and output a precision summary with exact metrics.'"
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
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h2 className="text-2xl font-bold">Analysis Results</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={downloadWord}>
                                        <FileText className="mr-2 h-4 w-4 text-blue-500" /> MS Word
                                    </Button>
                                    {result.data && (
                                        <Button variant="outline" size="sm" onClick={downloadExcel}>
                                            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" /> MS Excel
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
                                        <CardTitle>Structured Findings</CardTitle>
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