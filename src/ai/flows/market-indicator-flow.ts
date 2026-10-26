'use server';
/**
 * @fileOverview Visual Quant Analyst flow. Optimized to handle generic stock page 
 * screenshots (Google Finance, Yahoo, etc.) and extract exact session levels.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { MarketIndicatorInput, MarketIndicatorOutput } from '../schemas';

const MODEL = 'googleai/gemini-1.5-flash';

const ExecutionStepSchema = z.object({
  time: z.string().describe('The specific time or session trigger (e.g., "10:15 AM", "Break of Day High").'),
  action: z.string().describe('The action to take (e.g., "Buy at Market", "Trailing SL").'),
  priceLevel: z.string().describe('The exact price level observed in the image for this action.'),
  logic: z.string().describe('The technical reason for this step based on the chart pattern.'),
});

const StrategySchema = z.object({
  entry: z.string().describe('The precise entry price level based on the chart Y-axis.'),
  stopLoss: z.string().describe('The precise stop loss price level.'),
  target1: z.string().describe('The first profit target.'),
  target2: z.string().describe('The second profit target.'),
  executionPlan: z.array(ExecutionStepSchema),
});

const MarketIndicatorOutputSchema = z.object({
  symbol: z.string().describe('The identified stock symbol from the chart image or page header.'),
  currentSentiment: z.enum(['Bullish', 'Bearish', 'Neutral']),
  buyStrategy: StrategySchema,
  shortStrategy: StrategySchema,
  overallVerdict: z.string().describe('A final executive summary of the chart setup.'),
  analysisDate: z.string(),
});

export async function getMarketIndicator(input: MarketIndicatorInput): Promise<MarketIndicatorOutput> {
  try {
    const { output } = await ai.generate({
      model: MODEL,
      prompt: [
        { media: { url: input.photoDataUri } },
        { text: `You are a Senior Intraday Quant Analyst. Analyze this stock chart/page screenshot with 100% precision.
        
        CRITICAL INSTRUCTIONS:
        1. IDENTIFY THE SYMBOL: Look at the top header. It might be "Reliance Industries", "TCS", etc.
        2. EXTRACT EXACT PRICE: Read the latest price tooltip or large bold number (e.g., 1,201.80).
        3. READ THE Y-AXIS: Use the visible price scale on the right/left to ground all your suggestions. 
        4. NO HALLUCINATIONS: If the current price is ~1200, all your targets must be near 1200. Do NOT use random 1400/1500 levels.
        5. PROVIDE INTRADAY ACTIONS: Give a Buy Setup (Long) and a Short Setup (Bearish). 
        6. TIME-WISE PLAN: Specify exactly WHEN to take action based on the time scale shown on the X-axis (e.g., "at 11:00 AM", "on session break").
        7. If the image is unclear or doesn't show price levels, return reasonable estimates based on the identified symbol's recent context, but prioritize visual evidence.` },
      ],
      output: { schema: MarketIndicatorOutputSchema }
    });

    if (!output) throw new Error('AI failed to provide a structured analysis.');
    
    return {
      ...output,
      analysisDate: new Date().toLocaleString()
    };

  } catch (error) {
    console.warn("Visual Chart Analysis Error:", error);
    // Return a specific "Error State" object that the frontend can identify
    return {
      symbol: input.symbolHint || "ANALYSIS FAILED",
      currentSentiment: 'Neutral',
      buyStrategy: {
        entry: "Analysis Error",
        stopLoss: "N/A",
        target1: "N/A",
        target2: "N/A",
        executionPlan: [
          { time: "Session", action: "Retry Analysis", priceLevel: "N/A", logic: "The AI encountered an error. Please try with a clearer screenshot focused on the chart." }
        ]
      },
      shortStrategy: {
        entry: "Analysis Error",
        stopLoss: "N/A",
        target1: "N/A",
        target2: "N/A",
        executionPlan: [
          { time: "Session", action: "Retry Analysis", priceLevel: "N/A", logic: "The AI encountered an error. Please try with a clearer screenshot focused on the chart." }
        ]
      },
      overallVerdict: "The visual analysis failed because the image was too large or the AI service timed out. Please try uploading a smaller, cropped screenshot showing the price levels.",
      analysisDate: new Date().toLocaleString()
    };
  }
}
