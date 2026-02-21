
'use server';
/**
 * @fileOverview AI flows for the Personal Office Assistant.
 *
 * - processMeeting - Generates MOM and action items from a transcript.
 * - analyzeBudget - Tracks spending and provides forecasts.
 * - reviewCalendar - Analyzes schedules and identifies priorities.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { 
  MeetingInput, MeetingOutput, 
  BudgetInput, BudgetOutput, 
  CalendarInput, CalendarOutput 
} from '../schemas';

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

export async function processMeeting(input: MeetingInput): Promise<MeetingOutput> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    input: {
      schema: MeetingInputSchema,
      data: input,
    },
    output: { schema: MeetingOutputSchema },
    prompt: `You are a professional executive assistant.
    Analyze the following meeting transcript. 
    Context: {{{context}}}
    Transcript: {{{transcript}}}
    
    Generate a concise summary, a formal Minutes of Meeting (MOM), and extract all actionable tasks and key decisions.`,
  });
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

export async function analyzeBudget(input: BudgetInput): Promise<BudgetOutput> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    input: {
      schema: BudgetInputSchema,
      data: input,
    },
    output: { schema: BudgetOutputSchema },
    prompt: `You are a financial analyst. 
    Analyze this expense data: {{{expenseData}}}
    Current provisions spent: {{{provisionsSpent}}}
    Budget Goal: {{{budgetGoal}}}
    
    Provide a detailed breakdown of spending by category, an analysis of current trends, a realistic forecast for the next period, and practical tips to save or optimize.`,
  });
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

export async function reviewCalendar(input: CalendarInput): Promise<CalendarOutput> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    input: {
      schema: CalendarInputSchema,
      data: input,
    },
    output: { schema: CalendarOutputSchema },
    prompt: `You are a productivity coach. 
    Review the schedule for {{{date}}}:
    {{{scheduleText}}}
    
    Identify the most important priorities, provide an overall review of the schedule (look for conflicts or tight gaps), and list specific preparation notes for the important meetings.`,
  });
  if (!output) throw new Error('AI failed to review calendar.');
  return output;
}
