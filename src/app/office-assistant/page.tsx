
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Loader2, Sparkles, Briefcase, FileText, 
  Wallet, Calendar as CalendarIcon, Bot, CheckCircle2, 
  TrendingUp, ListTodo, ClipboardList, PenTool, ClipboardCheck,
  Mic, MicOff, Upload, FileSpreadsheet, Download, Presentation
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { processMeeting, analyzeBudget, reviewCalendar, prepareTask } from '@/ai/flows/office-assistant-flow';
import type { MeetingOutput, BudgetOutput, CalendarOutput, TaskPrepOutput } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as XLSX from 'xlsx';

export default function OfficeAssistantPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    // --- Meeting Tab State ---
    const [transcript, setTranscript] = useState('');
    const [meetingResult, setMeetingResult] = useState<MeetingOutput | null>(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // --- Budget Tab State ---
    const [expenseData, setExpenseData] = useState('');
    const [provisions, setProvisions] = useState('0');
    const [budgetResult, setBudgetResult] = useState<BudgetOutput | null>(null);
    const budgetFileRef = useRef<HTMLInputElement>(null);

    // --- Calendar Tab State ---
    const [schedule, setSchedule] = useState('');
    const [calendarResult, setCalendarResult] = useState<CalendarOutput | null>(null);

    // --- Task Prep Tab State ---
    const [taskDesc, setTaskDesc] = useState('');
    const [taskType, setTaskType] = useState<'email' | 'report' | 'plan' | 'analysis'>('email');
    const [taskResult, setTaskResult] = useState<TaskPrepOutput | null>(null);

    // --- Voice Logic ---
    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscript(prev => prev + ' ' + event.results[i][0].transcript);
                    }
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
                
                let errorTitle = "Speech Recognition Failed";
                let errorMessage = "An unexpected error occurred with voice transcription.";
                
                if (event.error === 'network') {
                    errorMessage = "A network error occurred. Please ensure you have a stable internet connection, as voice processing often requires cloud connectivity.";
                } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    errorMessage = "Microphone access was denied or is not supported. Please check your browser permissions.";
                } else if (event.error === 'no-speech') {
                    errorMessage = "No speech was detected. Please try again.";
                }

                toast({
                    variant: 'destructive',
                    title: errorTitle,
                    description: errorMessage,
                });
            };
        }
    }, [toast]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast({ variant: 'destructive', title: "Not Supported", description: "Voice-to-text is not supported in this browser. Please try Chrome or Edge." });
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            toast({ title: "Microphone Off", description: "Transcription paused." });
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                toast({ title: "Listening...", description: "Discuss your meeting points now." });
            } catch (e) {
                console.error("Failed to start recognition:", e);
                setIsListening(false);
            }
        }
    };

    // --- Budget Upload Logic ---
    const handleBudgetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setExpenseData(csv);
                toast({ title: "Budget Loaded", description: `${file.name} context extracted.` });
            } catch (err) {
                toast({ variant: 'destructive', title: "Upload Failed" });
            }
        };
        reader.readAsBinaryString(file);
    };

    // --- AI Execution Handlers ---
    const handleMeetingAI = async () => {
        if (!transcript.trim()) return;
        setLoading(true);
        setAiError('');
        try {
            const res = await processMeeting({ transcript });
            setMeetingResult(res);
            toast({ title: "Intelligence Synthesized", description: "Meeting MOM and Actions identified." });
        } catch (e: any) {
            setAiError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBudgetAI = async () => {
        if (!expenseData.trim()) return;
        setLoading(true);
        setAiError('');
        try {
            const res = await analyzeBudget({ 
                expenseData, 
                provisionsSpent: parseFloat(provisions), 
                budgetGoal: 'High-precision fiscal optimization' 
            });
            setBudgetResult(res);
            toast({ title: "Analysis Complete", description: "Fiscal trends mapped." });
        } catch (e: any) {
            setAiError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Export Logic ---
    const downloadWord = (title: string, content: string) => {
        const html = `<html><body style="font-family: Arial;"><h1>${title}</h1><div style="white-space: pre-wrap;">${content}</div></body></html>`;
        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s/g, '-')}.doc`;
        a.click();
    };

    const downloadExcel = (title: string, data: any[]) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "AI Output");
        XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s/g, '-')}.xlsx`);
    };

    const downloadPptOutline = (title: string, slides: {title: string, text: string}[]) => {
        let content = `PRESENTATION OUTLINE: ${title.toUpperCase()}\n\n`;
        slides.forEach((s, i) => {
            content += `SLIDE ${i+1}: ${s.title}\n-------------------\n${s.text}\n\n`;
        });
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s/g, '-')}-outline.txt`;
        a.click();
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
                            <Briefcase className="h-8 w-8 text-primary" />
                            AI Personal Office Assistant
                        </CardTitle>
                        <CardDescription>Professional intelligence for meetings, high-precision budgeting, and daily strategy.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {aiError && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTitle>AI Assistant Error</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}

                    <Tabs defaultValue="meetings" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-8">
                            <TabsTrigger value="meetings" className="flex items-center gap-2"><FileText className="h-4 w-4"/> Meetings</TabsTrigger>
                            <TabsTrigger value="budget" className="flex items-center gap-2"><Wallet className="h-4 w-4"/> Budgeting</TabsTrigger>
                            <TabsTrigger value="calendar" className="flex items-center gap-2"><CalendarIcon className="h-4 w-4"/> Calendar</TabsTrigger>
                            <TabsTrigger value="tasks" className="flex items-center gap-2"><PenTool className="h-4 w-4"/> Task Prep</TabsTrigger>
                        </TabsList>

                        {/* --- Meetings Tab --- */}
                        <TabsContent value="meetings" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="transcript">Meeting Discourse Context</Label>
                                        <Button 
                                            variant={isListening ? "destructive" : "secondary"} 
                                            size="sm" 
                                            onClick={toggleListening}
                                            className={isListening ? "animate-pulse" : ""}
                                        >
                                            {isListening ? <MicOff className="mr-2 h-4 w-4"/> : <Mic className="mr-2 h-4 w-4"/>}
                                            {isListening ? 'Stop Listening' : 'Listen to Meeting'}
                                        </Button>
                                    </div>
                                    <Textarea 
                                        id="transcript" 
                                        placeholder="Transcript will appear here as you speak, or you can paste notes..." 
                                        className="h-[300px] border-primary/20"
                                        value={transcript}
                                        onChange={(e) => setTranscript(e.target.value)}
                                    />
                                    <Button onClick={handleMeetingAI} disabled={loading || !transcript} className="w-full h-12 shadow-lg">
                                        {loading ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2"/>}
                                        Synthesize MOM & Deliverables
                                    </Button>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4 border overflow-hidden relative">
                                    {!meetingResult ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
                                            <ClipboardList className="h-12 w-12 mb-4 opacity-20"/>
                                            <p>Awaiting meeting data synthesis.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-end gap-2 mb-4">
                                                <Button size="icon" variant="outline" title="Export Word" onClick={() => downloadWord("Meeting MOM", meetingResult.mom)}>
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="outline" title="Export PPT Outline" onClick={() => downloadPptOutline("Meeting Strategy", [{title: "Summary", text: meetingResult.summary}, {title: "Action Items", text: meetingResult.actionItems.join('\n')}])}>
                                                    <Presentation className="h-4 w-4 text-orange-500" />
                                                </Button>
                                            </div>
                                            <ScrollArea className="h-[400px] pr-4">
                                                <div className="space-y-6">
                                                    <div>
                                                        <h3 className="font-bold text-lg border-b pb-1 mb-2 flex items-center gap-2 text-primary"><Bot className="h-4 w-4"/> Strategic Summary</h3>
                                                        <p className="text-sm leading-relaxed italic">{meetingResult.summary}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg border-b pb-1 mb-2">Primary Deliverables</h3>
                                                        <ul className="space-y-2">
                                                            {meetingResult.actionItems.map((item, i) => (
                                                                <li key={i} className="flex gap-2 text-sm bg-background p-2 rounded border border-primary/5">
                                                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5"/> {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg border-b pb-1 mb-2">Full Minutes of Meeting</h3>
                                                        <div className="text-xs whitespace-pre-wrap font-mono bg-background p-3 rounded border">
                                                            {meetingResult.mom}
                                                        </div>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                        </>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* --- Budgeting Tab --- */}
                        <TabsContent value="budget" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="provisions">Total Capital Provisions (₹)</Label>
                                            <Input id="provisions" type="number" value={provisions} onChange={(e) => setProvisions(e.target.value)}/>
                                        </div>
                                        <div className="flex items-end">
                                            <input type="file" ref={budgetFileRef} className="hidden" accept=".xlsx,.xls,.csv" onChange={handleBudgetUpload}/>
                                            <Button variant="outline" className="w-full" onClick={() => budgetFileRef.current?.click()}>
                                                <Upload className="mr-2 h-4 w-4" /> Load Budget File
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="expenses">Financial Dataset (Paste CSV or Category:Amount)</Label>
                                        <Textarea 
                                            id="expenses" 
                                            placeholder="Paste raw data or use the upload button above..." 
                                            className="h-[200px]"
                                            value={expenseData}
                                            onChange={(e) => setExpenseData(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleBudgetAI} disabled={loading || !expenseData} className="w-full h-12 shadow-lg">
                                        {loading ? <Loader2 className="animate-spin mr-2"/> : <TrendingUp className="mr-2"/>}
                                        Analyze Fiscal Trajectory
                                    </Button>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4 border relative">
                                    {!budgetResult ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
                                            <Wallet className="h-12 w-12 mb-4 opacity-20"/>
                                            <p>Awaiting fiscal analysis.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-end gap-2 mb-4">
                                                <Button size="icon" variant="outline" title="Export Excel" onClick={() => downloadExcel("Budget Analysis", budgetResult.spendingSummary)}>
                                                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                                                </Button>
                                                <Button size="icon" variant="outline" title="Export Word" onClick={() => downloadWord("Budget Report", budgetResult.analysis + "\n\nForecast: " + budgetResult.forecast)}>
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                </Button>
                                            </div>
                                            <ScrollArea className="h-[400px] pr-4">
                                                <div className="space-y-6">
                                                    <Card className="bg-primary/5 border-primary/20">
                                                        <CardHeader className="py-3">
                                                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                                                                <Bot className="h-4 w-4"/> Fiscal Projection
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="text-sm font-medium">
                                                            {budgetResult.forecast}
                                                        </CardContent>
                                                    </Card>
                                                    <div>
                                                        <h3 className="font-bold text-lg border-b pb-1 mb-2">Category Utilization</h3>
                                                        <div className="space-y-2">
                                                            {budgetResult.spendingSummary.map((s, i) => (
                                                                <div key={i} className="flex justify-between items-center bg-background p-2 rounded border border-primary/5">
                                                                    <span className="text-sm font-semibold">{s.category}</span>
                                                                    <Badge variant="secondary" className="font-mono text-xs">₹{s.amount.toLocaleString()}</Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg border-b pb-1 mb-2 text-amber-600">Optimization Tips</h3>
                                                        <ul className="space-y-2">
                                                            {budgetResult.savingTips.map((tip, i) => (
                                                                <li key={i} className="text-sm flex gap-2 items-start">
                                                                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5"/> <span>{tip}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                        </>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* --- Calendar Tab --- */}
                        <TabsContent value="calendar" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label htmlFor="schedule">Input Daily Itinerary</Label>
                                    <Textarea 
                                        id="schedule" 
                                        placeholder="9:00 AM - Staff Sync&#10;11:30 AM - Design Review..." 
                                        className="h-[300px]"
                                        value={schedule}
                                        onChange={(e) => setSchedule(e.target.value)}
                                    />
                                    <Button onClick={async () => {
                                        if (!schedule.trim()) return;
                                        setLoading(true);
                                        try {
                                            const res = await reviewCalendar({ scheduleText: schedule, date: new Date().toLocaleDateString() });
                                            setCalendarResult(res);
                                        } finally { setLoading(false); }
                                    }} disabled={loading || !schedule} className="w-full h-12">
                                        {loading ? <Loader2 className="animate-spin mr-2"/> : <CalendarIcon className="mr-2"/>}
                                        Optimize Schedule & Briefings
                                    </Button>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4 border">
                                    {!calendarResult ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
                                            <ListTodo className="h-12 w-12 mb-4 opacity-20"/>
                                            <p>Waiting for daily schedule input.</p>
                                        </div>
                                    ) : (
                                        <ScrollArea className="h-[400px] pr-4">
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2 text-primary">Coaching Insight</h3>
                                                    <p className="text-sm leading-relaxed">{calendarResult.review}</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Top 3 Strategic Priorities</h3>
                                                    <div className="flex flex-col gap-2">
                                                        {calendarResult.priorities.map((p, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-background p-2 rounded border border-primary/10 text-sm font-bold">
                                                                <Badge className="bg-primary text-xs h-5 w-5 flex items-center justify-center rounded-full p-0">{i+1}</Badge>
                                                                {p}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Briefing Prep</h3>
                                                    <div className="space-y-3">
                                                        {calendarResult.prepNeeded.map((prep, i) => (
                                                            <div key={i} className="bg-secondary/30 p-3 rounded-lg border border-primary/10">
                                                                <h4 className="font-bold text-sm text-primary mb-1">{prep.meetingTitle}</h4>
                                                                <p className="text-xs text-muted-foreground italic">{prep.prepNotes}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* --- Tasks Tab --- */}
                        <TabsContent value="tasks" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="taskType">Deliverable Format</Label>
                                        <Select value={taskType} onValueChange={(v: any) => setTaskType(v)}>
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="email">Formal Correspondence</SelectItem>
                                                <SelectItem value="report">Executive Intelligence Report</SelectItem>
                                                <SelectItem value="plan">Project Roadmap</SelectItem>
                                                <SelectItem value="analysis">Comparative Analysis</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="taskDesc">Core Objective Description</Label>
                                        <Textarea 
                                            id="taskDesc" 
                                            placeholder="Specify the objective, audience, and key data points..." 
                                            className="h-[200px]"
                                            value={taskDesc}
                                            onChange={(e) => setTaskDesc(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={async () => {
                                        if (!taskDesc.trim()) return;
                                        setLoading(true);
                                        try {
                                            const res = await prepareTask({ taskDescription: taskDesc, type: taskType });
                                            setTaskResult(res);
                                        } finally { setLoading(false); }
                                    }} disabled={loading || !taskDesc} className="w-full h-12 shadow-lg">
                                        {loading ? <Loader2 className="animate-spin mr-2"/> : <PenTool className="mr-2"/>}
                                        Draft Strategic Asset
                                    </Button>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4 border relative">
                                    {!taskResult ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
                                            <ClipboardCheck className="h-12 w-12 mb-4 opacity-20"/>
                                            <p>Awaiting objective synthesis.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-end gap-2 mb-4">
                                                <Button size="icon" variant="outline" title="Export Word" onClick={() => downloadWord("Draft Asset", taskResult.draft)}>
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                </Button>
                                            </div>
                                            <ScrollArea className="h-[400px] pr-4">
                                                <div className="space-y-6">
                                                    <div>
                                                        <h3 className="font-bold text-lg border-b pb-1 mb-2 flex items-center justify-between">
                                                            <span>Synthetic Draft</span>
                                                            <Badge variant="outline" className="capitalize">{taskType}</Badge>
                                                        </h3>
                                                        <div className="text-sm bg-background p-4 rounded border border-primary/5 whitespace-pre-wrap leading-relaxed">
                                                            {taskResult.draft}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg border-b pb-1 mb-2">Execution Checklist</h3>
                                                        <ul className="space-y-2">
                                                            {taskResult.checklist.map((item, i) => (
                                                                <li key={i} className="flex gap-2 text-sm items-center">
                                                                    <div className="h-4 w-4 rounded-sm border border-primary shrink-0" />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                        </>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
