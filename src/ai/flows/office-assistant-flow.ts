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

const MODEL = 'googleai/gemini-1.5-flash';

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
    console.warn("Meeting AI failed, using simulation:", error);
    return {
      summary: "Simulation: Strategic planning sync regarding upcoming product release and operational alignment.",
      mom: "# Minutes of Meeting\n\n**Participants:** Strategic Planning Team\n**Topic:** Product Launch & Roadmapping\n\n1. Reviewed current sprint progress.\n2. Identified primary design bottlenecks.\n3. Confirmed go-to-market timeline for next quarter.",
      actionItems: ["Finalize UI assets by end of week", "Sync with marketing on H2 budget", "Update internal stakeholder wiki"],
      keyDecisions: ["Proceed with October launch phase", "Approve increase in regional social media spend"]
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
    console.warn("Budget AI failed, using simulation:", error);
    return {
      analysis: "Simulation: Spending is currently optimized across Operations and Marketing channels.",
      spendingSummary: [{ category: 'Ops', amount: 5000 }, { category: 'Marketing', amount: 3000 }, { category: 'Tech', amount: 1500 }],
      forecast: "Spend is projected to stay within 10% of total allocated provisions based on current velocity.",
      savingTips: ["Audit monthly recurring software subscriptions", "Negotiate bulk vendor rates for Q4"]
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
    console.warn("Calendar AI failed, using simulation:", error);
    return {
      review: "Simulation: Your morning is densely packed with high-value meetings, but the afternoon has significant space for deep work.",
      priorities: ["Major client presentation prep", "Q3 Budget review", "Inbox zero management"],
      prepNeeded: [{ meetingTitle: "Weekly Strategic Sync", prepNotes: "Briefly review last week's KPI performance report to share updates." }]
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
    console.warn("Task Prep AI failed, using simulation:", error);
    return {
      draft: `Simulation: Dear Team,\n\nI am writing to initiate the ${input.taskDescription} phase. Let's align on next steps to ensure we hit our milestones.\n\nBest regards,\nOffice Assistant`,
      checklist: ["Outline primary objectives", "Identify key internal stakeholders", "Set firm internal deadline"]
    };
  }
}