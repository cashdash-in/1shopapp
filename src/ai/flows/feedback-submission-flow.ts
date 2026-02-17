
'use server';
/**
 * @fileOverview A flow for submitting and retrieving feedback.
 *
 * - submitFeedback - A function that stores raw feedback text.
 * - getFeedback - A function to retrieve all feedback.
 * - updateFeedback - A function to update a feedback item (e.g., with analysis).
 */

import { FAKE_FEEDBACK_DB } from '@/lib/feedback-db';
import fs from 'fs/promises';
import path from 'path';
import { type Feedback, type FeedbackSubmissionInput } from '../schemas';

// Helper function to stringify a feedback object for file writing
function stringifyFeedback(feedback: Feedback): string {
    const fields = [
        `id: "${feedback.id}"`,
        `submittedAt: "${feedback.submittedAt}"`,
        `feedback: { 
            text: \`${feedback.feedback.text.replace(/`/g, '\\`')}\`,
            rating: ${feedback.feedback.rating}
        }`,
    ];

    if (feedback.analysis) {
        const analysisCategories = feedback.analysis.categories.map(c => `"${c}"`).join(', ');
        fields.push(`analysis: {
            sentiment: "${feedback.analysis.sentiment}",
            categories: [${analysisCategories}],
            summary: \`${feedback.analysis.summary.replace(/`/g, '\\`')}\`,
        }`);
    }

    return `    {\n        ${fields.join(',\n        ')}\n    }`;
}

// NOTE: This is a hack for the prototype to persist data.
// In a real app, this would be a proper database like Firestore.
function persistFeedback(allFeedback: Feedback[]) {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'feedback-db.ts');
    
    const allFeedbackString = allFeedback.map(stringifyFeedback).join(',\n');

    const fileContent = `
import type { Feedback } from "@/ai/schemas";

// In a real app, this would be a database like Firestore.
// For this prototype, we'll use an in-memory array to simulate a user feedback database.
// New feedback will be prepended to this array.
export const FAKE_FEEDBACK_DB: Feedback[] = [
${allFeedbackString}
];
`.trimStart();
    
    // In a real app, this fs.writeFile would be a Firestore SDK call like setDoc() or updateDoc().
    return fs.writeFile(dbPath, fileContent, 'utf-8');
}

// The main function that clients will call to submit feedback
export async function submitFeedback(input: FeedbackSubmissionInput): Promise<Feedback> {
  const newFeedback: Feedback = {
    id: `fb_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    feedback: input,
    // Analysis is now optional and not done at submission time.
  };

  // Prepend to the in-memory array
  FAKE_FEEDBACK_DB.unshift(newFeedback);

  // Persist the entire updated array to the file
  try {
      await persistFeedback(FAKE_FEEDBACK_DB);
  } catch (e) {
      console.warn("Could not persist feedback to file (expected in production):", e);
  }

  return newFeedback;
}

// Function to update an existing feedback item
export async function updateFeedback(updatedItem: Feedback): Promise<Feedback> {
    const itemIndex = FAKE_FEEDBACK_DB.findIndex(item => item.id === updatedItem.id);
    if (itemIndex === -1) {
        throw new Error("Feedback item not found");
    }

    // Update the in-memory array
    FAKE_FEEDBACK_DB[itemIndex] = updatedItem;

    try {
        await persistFeedback(FAKE_FEEDBACK_DB);
        return updatedItem;
    } catch (error) {
        console.error("!!! FAILED TO PERSIST FEEDBACK (Simulated Firestore Error) !!!", error);
        throw new Error("Database update failed. Check permissions or network connection.");
    }
}

// Function to retrieve all feedback
export async function getFeedback(): Promise<Feedback[]> {
    // In a real app, you'd fetch this from your database.
    return Promise.resolve(FAKE_FEEDBACK_DB);
}
