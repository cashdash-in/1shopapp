
/**
 * @fileOverview This file contains all the Zod schemas and TypeScript types 
 * for the AI flows. Separating these into their own file prevents "use server"
 * directive issues in Next.js where flow files can only export async functions.
 */

// Schemas for Partner Signup Flow
export type PartnerSignupInput = {
  partnerType: 'business' | 'individual';
  shopName?: string;
  ownerName?: string;
  gstNumber?: string;
  fullName?: string;
  panNumber?: string;
  phone: string;
  email: string;
  commission?: number;
};

export type PartnerSignupOutput = {
  message: string;
  referralCode: string;
};


// Schemas for Sentiment Analysis Flow
export type FeedbackSubmissionInput = {
  text: string;
  rating: number;
};

export type SentimentAnalysisInput = FeedbackSubmissionInput;

export type SentimentOutput = {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  categories: string[];
  summary: string;
};

export type Feedback = {
  id: string;
  submittedAt: string;
  feedback: FeedbackSubmissionInput;
  analysis?: SentimentOutput;
};

// Schemas for Click Tracking Flow
export type ClickUpdateInput = {
  category: string;
  brand: string;
};

export type ClickData = {
    category: string;
    brand: string;
    clicks: number;
};

// Schemas for Product Search Flow
export type ProductSearchInput = {
  query: string;
};

export type ProductSearchOutput = {
  results: string[];
};

// Schemas for Cashback Flow
export type CashbackTransaction = {
    userId: string;
    userName: string;
    totalCashback: number;
    status: 'Pending' | 'Paid';
    lastActivity: string;
};

export type UserCashbackTransaction = {
    id: string;
    description: string;
    amount: number;
    status: 'Credited' | 'Pending' | 'Paid';
    date: string;
};

export type UserCashbackDetails = {
    totalBalance: number;
    transactions: UserCashbackTransaction[];
};


// Schemas for Tile Creation Flow
export type TileCreationInput = {
  url: string;
};

export type TileCreationOutput = {
  name: string;
  icon: string;
  color: string;
};


// Schemas for AI Photo Booth Flow
export type PhotoBoothInput = {
  photoDataUri: string;
  style: string;
};

export type PhotoBoothOutput = {
    imageDataUri: string;
};

// Schemas for AI Presentation Generator Flow
export type PresentationInput = {
  topic: string;
  instructions?: string;
};

type Slide = {
  title: string;
  content: string[];
};

export type PresentationOutput = {
  slides: Slide[];
};

// Schemas for AI Data Analyst Flow
export type DataAnalysisInput = {
  data: string;
  question: string;
};

export type DataAnalysisOutput = {
  summary: string;
  data?: string;
};

// Schemas for AI BI Report Generator Flow
export type BiReportInput = {
  data: string;
  request: string;
};

type ChartDataPoint = {
  name: string;
  value: number;
};

export type BiReportOutput = {
  title: string;
  summary: string;
  chartData: ChartDataPoint[];
};

// Schemas for Ride Finder Flow
export type RideFinderInput = {
  pickup: string;
  dropoff: string;
  currentTime?: string;
};

export type RideOption = {
  service: 'Uber' | 'Ola' | 'inDrive' | 'Rapido';
  vehicleType: string;
  eta: string;
  fare: string;
  surge: boolean;
};

export type RideFinderOutput = {
  options: RideOption[];
  trafficAlerts?: string[];
};
