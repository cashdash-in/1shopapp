
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
export const FeedbackSubmissionInputSchema = z.object({
  text: z.string().describe('The customer feedback text to be analyzed.'),
  rating: z.number().min(1).max(5).describe('A star rating from 1 to 5.'),
});
export type FeedbackSubmissionInput = z.infer<typeof FeedbackSubmissionInputSchema>;

export const SentimentAnalysisInputSchema = FeedbackSubmissionInputSchema;
export type SentimentAnalysisInput = z.infer<typeof SentimentAnalysisInputSchema>;

export const SentimentOutputSchema = z.object({
  sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe('The overall sentiment of the text.'),
  categories: z.array(z.string()).describe('A list of categories the feedback falls into (e.g., "UI/UX", "App Performance", "Feature Request").'),
  summary: z.string().describe('A brief summary of the feedback provided.'),
});
export type SentimentOutput = z.infer<typeof SentimentOutputSchema>;

export const FeedbackSchema = z.object({
  id: z.string(),
  submittedAt: z.string().datetime(),
  feedback: FeedbackSubmissionInputSchema,
  analysis: SentimentOutputSchema.optional(),
});
export type Feedback = z.infer<typeof FeedbackSchema>;

// Schemas for Click Tracking Flow
export const ClickUpdateInputSchema = z.object({
  category: z.string(),
  brand: z.string(),
});
export type ClickUpdateInput = z.infer<typeof ClickUpdateInputSchema>;

export const ClickDataSchema = z.object({
    category: z.string(),
    brand: z.string(),
    clicks: z.number(),
});
export type ClickData = z.infer<typeof ClickDataSchema>;

// Schemas for Product Search Flow
export const ProductSearchInputSchema = z.object({
  query: z.string().describe('The search query for the product.'),
});
export type ProductSearchInput = z.infer<typeof ProductSearchInputSchema>;

export const ProductSearchOutputSchema = z.object({
  results: z.array(z.string()).describe('A list of product names.'),
});
export type ProductSearchOutput = z.infer<typeof ProductSearchOutputSchema>;

// Schemas for Cashback Flow
export const CashbackTransactionSchema = z.object({
    userId: z.string(),
    userName: z.string(),
    totalCashback: z.number(),
    status: z.enum(['Pending', 'Paid']),
    lastActivity: z.string(),
});
export type CashbackTransaction = z.infer<typeof CashbackTransactionSchema>;

export const UserCashbackTransactionSchema = z.object({
    id: z.string(),
    description: z.string(),
    amount: z.number(),
    status: z.enum(['Credited', 'Pending', 'Paid']),
    date: z.string(),
});
export type UserCashbackTransaction = z.infer<typeof UserCashbackTransactionSchema>;

export const UserCashbackDetailsSchema = z.object({
    totalBalance: z.number(),
    transactions: z.array(UserCashbackTransactionSchema),
});
export type UserCashbackDetails = z.infer<typeof UserCashbackDetailsSchema>;
