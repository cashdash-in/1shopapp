
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Loader2, Sparkles, Briefcase, FileText, 
  Wallet, Calendar as CalendarIcon, Bot, CheckCircle2, 
  TrendingUp, ListTodo, ClipboardList
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { processMeeting, analyzeBudget, reviewCalendar } from '@/ai/flows/office-assistant-flow';
import type { MeetingOutput, BudgetOutput, CalendarOutput } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function OfficeAssistantPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    // State for Meeting Tab
    const [transcript, setTranscript] = useState('');
    const [meetingResult, setMeetingResult] = useState<MeetingOutput | null>(null);

    // State for Budget Tab
    const [expenseData, setExpenseData] = useState('');
    const [provisions, setProvisions] = useState('0');
    const [budgetResult, setBudgetResult] = useState<BudgetOutput | null>(null);

    // State for Calendar Tab
    const [schedule, setSchedule] = useState('');
    const [calendarResult, setCalendarResult] = useState<CalendarOutput | null>(null);

    const handleMeetingAI = async () => {
        if (!transcript.trim()) return;
        setLoading(true);
        setAiError('');
        try {
            const res = await processMeeting({ transcript });
            setMeetingResult(res);
            toast({ title: "MOM Generated", description: "Meeting notes processed successfully." });
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
                budgetGoal: 'Optimal spend within limits' 
            });
            setBudgetResult(res);
            toast({ title: "Budget Analyzed", description: "Spending trends and forecast ready." });
        } catch (e: any) {
            setAiError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCalendarAI = async () => {
        if (!schedule.trim()) return;
        setLoading(true);
        setAiError('');
        try {
            const res = await reviewCalendar({ 
                scheduleText: schedule, 
                date: new Date().toLocaleDateString() 
            });
            setCalendarResult(res);
            toast({ title: "Calendar Reviewed", description: "Priorities and prep notes generated." });
        } catch (e: any) {
            setAiError(e.message);
        } finally {
            setLoading(false);
        }
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
                            AI Office Assistant
                        </CardTitle>
                        <CardDescription>Your personal assistant for meetings, budgets, and schedules.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {aiError && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTitle>AI Assistant Unavailable</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}

                    <Tabs defaultValue="meetings" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="meetings" className="flex items-center gap-2"><FileText className="h-4 w-4"/> Meetings</TabsTrigger>
                            <TabsTrigger value="budget" className="flex items-center gap-2"><Wallet className="h-4 w-4"/> Budget & Spent</TabsTrigger>
                            <TabsTrigger value="calendar" className="flex items-center gap-2"><CalendarIcon className="h-4 w-4"/> Calendar</TabsTrigger>
                        </TabsList>

                        {/* Meetings Tab */}
                        <TabsContent value="meetings" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label htmlFor="transcript">Paste Meeting Transcript or Notes</Label>
                                    <Textarea 
                                        id="transcript" 
                                        placeholder="Paste transcript here..." 
                                        className="h-[300px]"
                                        value={transcript}
                                        onChange={(e) => setTranscript(e.target.value)}
                                    />
                                    <Button onClick={handleMeetingAI} disabled={loading || !transcript} className="w-full">
                                        {loading ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2"/>}
                                        Generate MOM & Action Items
                                    </Button>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4 border overflow-hidden">
                                    {!meetingResult ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
                                            <ClipboardList className="h-12 w-12 mb-4 opacity-20"/>
                                            <p>Generated MOM will appear here.</p>
                                        </div>
                                    ) : (
                                        <ScrollArea className="h-[400px] pr-4">
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Summary</h3>
                                                    <p className="text-sm">{meetingResult.summary}</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Action Items</h3>
                                                    <ul className="space-y-1">
                                                        {meetingResult.actionItems.map((item, i) => (
                                                            <li key={i} className="flex gap-2 text-sm">
                                                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5"/> {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Minutes of Meeting</h3>
                                                    <div className="text-sm whitespace-pre-wrap font-mono bg-background p-3 rounded border">
                                                        {meetingResult.mom}
                                                    </div>
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Budget Tab */}
                        <TabsContent value="budget" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="provisions">Total Provisions Spent (₹)</Label>
                                        <Input 
                                            id="provisions" 
                                            type="number" 
                                            value={provisions} 
                                            onChange={(e) => setProvisions(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="expenses">Paste Expense CSV or List</Label>
                                        <Textarea 
                                            id="expenses" 
                                            placeholder="Category, Amount..." 
                                            className="h-[200px]"
                                            value={expenseData}
                                            onChange={(e) => setExpenseData(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleBudgetAI} disabled={loading || !expenseData} className="w-full">
                                        {loading ? <Loader2 className="animate-spin mr-2"/> : <TrendingUp className="mr-2"/>}
                                        Analyze Budget & Forecast
                                    </Button>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4 border">
                                    {!budgetResult ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
                                            <Wallet className="h-12 w-12 mb-4 opacity-20"/>
                                            <p>Financial analysis will appear here.</p>
                                        </div>
                                    ) : (
                                        <ScrollArea className="h-[400px] pr-4">
                                            <div className="space-y-6">
                                                <Card className="bg-secondary/20">
                                                    <CardHeader className="py-3">
                                                        <CardTitle className="text-sm">Forecast Insight</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-sm">
                                                        {budgetResult.forecast}
                                                    </CardContent>
                                                </Card>
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Category Breakdown</h3>
                                                    <div className="space-y-2">
                                                        {budgetResult.spendingSummary.map((s, i) => (
                                                            <div key={i} className="flex justify-between items-center bg-background p-2 rounded border">
                                                                <span className="text-sm">{s.category}</span>
                                                                <Badge variant="outline">₹{s.amount}</Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Saving Tips</h3>
                                                    <ul className="space-y-1">
                                                        {budgetResult.savingTips.map((tip, i) => (
                                                            <li key={i} className="text-sm italic">• {tip}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Calendar Tab */}
                        <TabsContent value="calendar" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label htmlFor="schedule">Paste Daily Schedule</Label>
                                    <Textarea 
                                        id="schedule" 
                                        placeholder="9:00 AM - Staff Meeting&#10;11:30 AM - Client Call..." 
                                        className="h-[300px]"
                                        value={schedule}
                                        onChange={(e) => setSchedule(e.target.value)}
                                    />
                                    <Button onClick={handleCalendarAI} disabled={loading || !schedule} className="w-full">
                                        {loading ? <Loader2 className="animate-spin mr-2"/> : <CalendarIcon className="mr-2"/>}
                                        Review Day & Prep AI
                                    </Button>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4 border">
                                    {!calendarResult ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
                                            <ListTodo className="h-12 w-12 mb-4 opacity-20"/>
                                            <p>AI Schedule review will appear here.</p>
                                        </div>
                                    ) : (
                                        <ScrollArea className="h-[400px] pr-4">
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Day Review</h3>
                                                    <p className="text-sm">{calendarResult.review}</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Top Priorities</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {calendarResult.priorities.map((p, i) => (
                                                            <Badge key={i}>{p}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg border-b pb-1 mb-2">Meeting Prep Notes</h3>
                                                    <div className="space-y-3">
                                                        {calendarResult.prepNeeded.map((prep, i) => (
                                                            <div key={i} className="bg-background p-3 rounded border">
                                                                <h4 className="font-bold text-sm text-primary mb-1">{prep.meetingTitle}</h4>
                                                                <p className="text-xs text-muted-foreground">{prep.prepNotes}</p>
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
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
