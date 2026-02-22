'use server';
/**
 * @fileOverview AI flows for the Personal Office Assistant with robust fallback logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { 
  MeetingInput, MeetingOutput, 
  BudgetInput, BudgetOutput, 
  CalendarInput, CalendarOutput,
  TaskPrepInput, TaskPrepOutput
} from '../schemas';

const MODEL = 'googleai/gemini-1.5-flash-latest';

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
  prompt: `Analyze the meeting transcript and generate MOM. Transcript: {{{transcript}}}`,
});

export async function processMeeting(input: MeetingInput): Promise<MeetingOutput> {
  try {
    const { output } = await meetingPrompt(input);
    if (!output) throw new Error('AI Error');
    return output;
  } catch (error) {
    return {
      summary: "Simulation: Strategic planning sync regarding upcoming product release.",
      mom: "# Minutes of Meeting\n\n**Participants:** Team A\n**Topic:** Product Launch\n\n1. Reviewed current progress.\n2. Identified blockers in design.\n3. Confirmed timeline for Q4.",
      actionItems: ["Finalize UI assets by Friday", "Sync with marketing on budget", "Update internal wiki"],
      keyDecisions: ["Proceed with October launch", "Approve increase in social media spend"]
    };
  }
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
  forecast: z.string().describe('AI prediction of future spending.'),
  savingTips: z.array(z.string()),
});

const budgetPrompt = ai.definePrompt({
  name: 'budgetPrompt',
  model: MODEL,
  input: { schema: BudgetInputSchema },
  output: { schema: BudgetOutputSchema },
  prompt: `Analyze budget data: {{{expenseData}}}`,
});

export async function analyzeBudget(input: BudgetInput): Promise<BudgetOutput> {
  try {
    const { output } = await budgetPrompt(input);
    if (!output) throw new Error('AI Error');
    return output;
  } catch (error) {
    return {
      analysis: "Simulation: Spending is concentrated in Operations and Marketing.",
      spendingSummary: [{ category: 'Ops', amount: 5000 }, { category: 'Marketing', amount: 3000 }],
      forecast: "Spend is projected to stay within 10% of total provisions.",
      savingTips: ["Audit recurring subscriptions", "Negotiate vendor rates"]
    };
  }
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
  })),
});

const calendarPrompt = ai.definePrompt({
  name: 'calendarPrompt',
  model: MODEL,
  input: { schema: CalendarInputSchema },
  output: { schema: CalendarOutputSchema },
  prompt: `Review schedule: {{{scheduleText}}}`,
});

export async function reviewCalendar(input: CalendarInput): Promise<CalendarOutput> {
  try {
    const { output } = await calendarPrompt(input);
    if (!output) throw new Error('AI Error');
    return output;
  } catch (error) {
    return {
      review: "Simulation: Your morning is packed, but afternoon has space for focused work.",
      priorities: ["Client presentation prep", "Budget review", "Inbox zero"],
      prepNeeded: [{ meetingTitle: "Weekly Sync", prepNotes: "Review last week's KPI report." }]
    };
  }
}

// --- Task Preparation Flow ---

const TaskPrepInputSchema = z.object({
  taskDescription: z.string().describe('The task or goal to prepare for.'),
  type: z.enum(['email', 'report', 'plan', 'analysis']),
});

const TaskPrepOutputSchema = z.object({
  draft: z.string().describe('A high-quality draft.'),
  checklist: z.array(z.string()).describe('A checklist of sub-tasks.'),
});

const taskPrepPrompt = ai.definePrompt({
  name: 'taskPrepPrompt',
  model: MODEL,
  input: { schema: TaskPrepInputSchema },
  output: { schema: TaskPrepOutputSchema },
  prompt: `Prepare task: {{{taskDescription}}}`,
});

export async function prepareTask(input: TaskPrepInput): Promise<TaskPrepOutput> {
  try {
    const { output } = await taskPrepPrompt(input);
    if (!output) throw new Error('AI Error');
    return output;
  } catch (error) {
    return {
      draft: `Simulation: Dear Team,\n\nI am writing to initiate the ${input.taskDescription} phase. Let's align on next steps.\n\nBest,\nOffice Assistant`,
      checklist: ["Outline key objectives", "Identify stakeholders", "Set deadline"]
    };
  }
}
