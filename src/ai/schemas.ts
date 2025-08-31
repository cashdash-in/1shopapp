
/**
 * @fileOverview This file contains all the Zod schemas and TypeScript types 
 * for the AI flows. Separating these into their own file prevents "use server"
 * directive issues in Next.js where flow files can only export async functions.
 */

import { z } from 'zod';

// Schemas for Partner Signup Flow
export const PartnerSignupInputSchema = z.object({
  partnerType: z.enum(['business', 'individual']),
  // Business fields
  shopName: z.string().optional(),
  ownerName: z.string().optional(),
  gstNumber: z.string().optional(),
  // Individual fields
  fullName: z.string().optional(),
  panNumber: z.string().optional(),
  // Common fields
  phone: z.string().describe("The partner's phone number."),
  email: z.string().email().describe("The partner's email address."),
  commission: z.number().optional().describe("The commission percentage for the partner."),
});
export type PartnerSignupInput = z.infer<typeof PartnerSignupInputSchema>;


export const PartnerSignupOutputSchema = z.object({
  message: z.string().describe('A success message for the user.'),
  referralCode: z.string().describe('The unique referral code generated for the partner.'),
});
export type PartnerSignupOutput = z.infer<typeof PartnerSignupOutputSchema>;


// Schemas for Sentiment Analysis Flow
export const SentimentInputSchema = z.object({
  text: z.string().describe('The customer feedback text to be analyzed.'),
});
export type SentimentInput = z.infer<typeof SentimentInputSchema>;

export const SentimentOutputSchema = z.object({
  sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe('The overall sentiment of the text.'),
  categories: z.array(z.string()).describe('A list of categories the feedback falls into (e.g., "UI/UX", "App Performance", "Feature Request").'),
  summary: z.string().describe('A brief summary of the feedback provided.'),
});
export type SentimentOutput = z.infer<typeof SentimentOutputSchema>;

export const SentimentAnalysisSchema = z.object({
  id: z.string(),
  submittedAt: z.string().datetime(),
  feedback: SentimentInputSchema,
  analysis: SentimentOutputSchema,
});
export type SentimentAnalysis = z.infer<typeof SentimentAnalysisSchema>;
