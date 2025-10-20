

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


// Schemas for Tile Creation Flow
export const TileCreationInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to create a tile for.'),
});
export type TileCreationInput = z.infer<typeof TileCreationInputSchema>;

export const TileCreationOutputSchema = z.object({
  name: z.string().describe('A concise, user-friendly name for the website, extracted from its title or content.'),
  icon: z.string().describe('The most relevant icon name from the lucide-react library (e.g., "Briefcase", "ShoppingCart", "Book").'),
  color: z.string().describe('A hex color code that represents the primary brand color of the website.'),
});
export type TileCreationOutput = z.infer<typeof TileCreationOutputSchema>;

// Schemas for AI Photo Booth Flow
export const PhotoBoothInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person or object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  style: z.string().describe('The artistic style to apply to the photo (e.g., "Cartoon", "Anime", "Oil Painting").'),
});
export type PhotoBoothInput = z.infer<typeof PhotoBoothInputSchema>;

export const PhotoBoothOutputSchema = z.object({
    imageDataUri: z.string().describe('The newly generated image in data URI format.'),
});
export type PhotoBoothOutput = z.infer<typeof PhotoBoothOutputSchema>;

// Schemas for AI Presentation Generator Flow
export const PresentationInputSchema = z.object({
  topic: z.string().describe('The main topic or title of the presentation.'),
  instructions: z.string().optional().describe('Optional specific instructions, like number of slides or key points to include.'),
});
export type PresentationInput = z.infer<typeof PresentationInputSchema>;

const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.array(z.string()).describe('An array of bullet points for the slide content.'),
});

export const PresentationOutputSchema = z.object({
  slides: z.array(SlideSchema).describe('An array of slide objects, each containing a title and content.'),
});
export type PresentationOutput = z.infer<typeof PresentationOutputSchema>;

// Schemas for AI Data Analyst Flow
export const DataAnalysisInputSchema = z.object({
  data: z.string().describe('The dataset to be analyzed, typically in CSV or plain text format.'),
  question: z.string().describe('The user\'s question about the data.'),
});
export type DataAnalysisInput = z.infer<typeof DataAnalysisInputSchema>;

export const DataAnalysisOutputSchema = z.object({
  summary: z.string().describe('A text-based summary answering the user\'s question.'),
  data: z.string().optional().describe('A string representation of the resulting data, such as a markdown table.'),
});
export type DataAnalysisOutput = z.infer<typeof DataAnalysisOutputSchema>;

// Schemas for AI BI Report Generator Flow
export const BiReportInputSchema = z.object({
  data: z.string().describe('The dataset to be analyzed, in CSV or plain text format.'),
  request: z.string().describe('The user\'s request for the BI report (e.g., "Show monthly sales trends").'),
});
export type BiReportInput = z.infer<typeof BiReportInputSchema>;

const ChartDataPointSchema = z.object({
  name: z.string().describe("The label for the data point on the x-axis."),
  value: z.number().describe("The numerical value for the data point on the y-axis."),
});

export const BiReportOutputSchema = z.object({
  title: z.string().describe("The title of the generated report."),
  summary: z.string().describe("A brief, one or two-sentence summary of the key insight from the data."),
  chartData: z.array(ChartDataPointSchema).describe("An array of data points formatted for a chart."),
});
export type BiReportOutput = z.infer<typeof BiReportOutputSchema>;

// Schemas for Ride Finder Flow
export const RideFinderInputSchema = z.object({
  pickup: z.string().describe('The starting location for the ride.'),
  dropoff: z.string().describe('The destination for the ride.'),
});
export type RideFinderInput = z.infer<typeof RideFinderInputSchema>;

const RideOptionSchema = z.object({
  service: z.enum(['Uber', 'Ola', 'inDrive']).describe('The ride-sharing service provider.'),
  vehicleType: z.string().describe('The type of vehicle (e.g., "Auto", "Mini", "Sedan", "SUV").'),
  eta: z.string().describe('The estimated time of arrival for the ride.'),
  fare: z.string().describe('The estimated fare for the ride, formatted as a string (e.g., "₹150 - ₹180").'),
  surge: z.boolean().describe('Indicates if surge pricing is active.'),
});

export const RideFinderOutputSchema = z.object({
  options: z.array(RideOptionSchema).describe('A list of available ride options.'),
});
export type RideFinderOutput = z.infer<typeof RideFinderOutputSchema>;
