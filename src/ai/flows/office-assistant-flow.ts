'use server';
/**
 * @fileOverview AI flows for the Personal Office Assistant.
 *
 * - processMeeting - Generates MOM and action items from a transcript.
 * - analyzeBudget - Tracks spending and provides forecasts.
 * - reviewCalendar - Analyzes schedules and identifies priorities.
 * - prepareTask - Drafts emails, reports, or plans for upcoming office work.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { 
  MeetingInput, MeetingOutput, 
  BudgetInput, BudgetOutput, 
  CalendarInput, CalendarOutput,
  TaskPrepInput, TaskPrepOutput
} from '../schemas';

const MODEL = 'gemini-1.5-flash';

// --- Meeting Flow ---

const MeetingInputSchema = z.object({
  transcript: z.string().describe('The raw text or transcript of the meeting.'),
  context: z.string().optional().describe('Context or agenda of the meeting.'),
});

const MeetingOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the meeting.'),
  mom: z.string().describe('Formal Minutes of Meeting in Markdown format.'),
  actionItems: z.array(z.string()).describe('List of tasks assigned to individuals.'),
  keyDecisions: z.array(z.string()).describe('List of major decisions made.'),
});

const meetingPrompt = ai.definePrompt({
  name: 'meetingPrompt',
  model: MODEL,
  input: { schema: MeetingInputSchema },
  output: { schema: MeetingOutputSchema },
  prompt: `You are a professional executive assistant.
    Analyze the following meeting transcript. 
    Context: {{{context}}}
    Transcript: {{{transcript}}}
    
    Generate a concise summary, a formal Minutes of Meeting (MOM), and extract all actionable tasks and key decisions.`,
});

export async function processMeeting(input: MeetingInput): Promise<MeetingOutput> {
  const { output } = await meetingPrompt(input);
  if (!output) throw new Error('AI failed to process meeting notes.');
  return output;
}

// --- Budget Flow ---

const BudgetInputSchema = z.object({
  expenseData: z.string().describe('Raw text or CSV data of expenses.'),
  provisionsSpent: z.number().describe('Total money spent on provisions so far.'),
  budgetGoal: z.string().describe('The goal or limit for the budget.'),
});

const BudgetOutputSchema = z.object({
  analysis: z.string().describe('Analysis of current spending patterns.'),
  spendingSummary: z.array(z.object({
    category: z.string(),
    amount: z.number(),
  })),
  forecast: z.string().describe('AI prediction of future spending and budget status.'),
  savingTips: z.array(z.string()),
});

const budgetPrompt = ai.definePrompt({
  name: 'budgetPrompt',
  model: MODEL,
  input: { schema: BudgetInputSchema },
  output: { schema: BudgetOutputSchema },
  prompt: `You are a financial analyst. 
    Analyze this expense data: {{{expenseData}}}
    Current provisions spent: {{{provisionsSpent}}}
    Budget Goal: {{{budgetGoal}}}
    
    Provide a detailed breakdown of spending by category, an analysis of current trends, a realistic forecast for the next period, and practical tips to save or optimize.`,
});

export async function analyzeBudget(input: BudgetInput): Promise<BudgetOutput> {
  const { output } = await budgetPrompt(input);
  if (!output) throw new Error('AI failed to analyze budget.');
  return output;
}

// --- Calendar Flow ---

const CalendarInputSchema = z.object({
  scheduleText: z.string().describe('Textual representation of a day schedule.'),
  date: z.string(),
});

const CalendarOutputSchema = z.object({
  review: z.string().describe('Overall assessment of the schedule.'),
  priorities: z.array(z.string()).describe('Top 3 items to focus on today.'),
  prepNeeded: z.array(z.object({
    meetingTitle: z.string(),
    prepNotes: z.string(),
  })).describe('Notes on what to prepare for specific meetings.'),
});

const calendarPrompt = ai.definePrompt({
  name: 'calendarPrompt',
  model: MODEL,
  input: { schema: CalendarInputSchema },
  output: { schema: CalendarOutputSchema },
  prompt: `You are a productivity coach. 
    Review the schedule for {{{date}}}:
    {{{scheduleText}}}
    
    Identify the most important priorities, provide an overall review of the schedule (look for conflicts or tight gaps), and list specific preparation notes for the important meetings.`,
});

export async function reviewCalendar(input: CalendarInput): Promise<CalendarOutput> {
  const { output } = await calendarPrompt(input);
  if (!output) throw new Error('AI failed to review calendar.');
  return output;
}

// --- Task Preparation Flow ---

const TaskPrepInputSchema = z.object({
  taskDescription: z.string().describe('The task or goal to prepare for.'),
  type: z.enum(['email', 'report', 'plan', 'analysis']).describe('The format of the draft.'),
});

const TaskPrepOutputSchema = z.object({
  draft: z.string().describe('A high-quality draft of the email, report, or plan.'),
  checklist: z.array(z.string()).describe('A checklist of sub-tasks to complete.'),
});

const taskPrepPrompt = ai.definePrompt({
  name: 'taskPrepPrompt',
  model: MODEL,
  input: { schema: TaskPrepInputSchema },
  output: { schema: TaskPrepOutputSchema },
  prompt: `You are a highly efficient office chief of staff. 
    Prepare a draft for the following task:
    Task Description: {{{taskDescription}}}
    Type: {{{type}}}
    
    Create a professional draft and a detailed checklist of items to consider or complete to finish the task successfully.`,
});

export async function prepareTask(input: TaskPrepInput): Promise<TaskPrepOutput> {
  const { output } = await taskPrepPrompt(input);
  if (!output) throw new Error('AI failed to prepare task.');
  return output;
}
