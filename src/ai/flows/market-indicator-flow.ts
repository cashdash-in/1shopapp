
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
});

export async function getMarketIndicator(input: MarketIndicatorInput): Promise<MarketIndicatorOutput & { analysisDate: string }> {
  try {
    const { output } = await ai.generate({
      model: MODEL,
      prompt: [
        { media: { url: input.photoDataUri } },
        { text: `You are a Senior Intraday Quant Analyst. Analyze this stock chart/page screenshot with 100% precision.
        
        SYMBOL HINT (Use if visible): ${input.symbolHint || 'Search in image'}

        CRITICAL INSTRUCTIONS:
        1. IDENTIFY THE SYMBOL: Look for large text like "Reliance Industries", "TCS", or tickers like "NSE: RELIANCE".
        2. EXTRACT EXACT PRICE: Read the largest bold number (e.g., 1,201.80) or the number in the blue/red tooltip on the Y-axis.
        3. READ THE Y-AXIS: Use the visible price scale to ground all Buy/Short levels.
        4. NO HALLUCINATIONS: If current price is ~1200, targets must be ~1210-1250. Do NOT use default values.
        5. INTRADAY ACTIONS: Provide a Buy (Long) setup and a Short setup based on the VISUAL indicators (moving averages, support lines, etc.).
        6. TIME PLAN: Specify exactly WHEN to act based on the X-axis (e.g., "at 11:30 AM", "at session high").` },
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
    return {
      symbol: input.symbolHint || "ANALYSIS FAILED",
      currentSentiment: 'Neutral',
      buyStrategy: {
        entry: "Analysis Error",
        stopLoss: "N/A",
        target1: "N/A",
        target2: "N/A",
        executionPlan: [
          { time: "Session", action: "Retry Analysis", priceLevel: "N/A", logic: "The AI encountered an error. Please ensure the stock price and symbol are clearly visible in the screenshot." }
        ]
      },
      shortStrategy: {
        entry: "Analysis Error",
        stopLoss: "N/A",
        target1: "N/A",
        target2: "N/A",
        executionPlan: [
          { time: "Session", action: "Retry Analysis", priceLevel: "N/A", logic: "The AI encountered an error. Please try a clearer screenshot." }
        ]
      },
      overallVerdict: "The visual analysis failed or timed out. This often happens if the image is too blurry or the stock price is not clear. Provide a 'Stock Name' hint to improve results.",
      analysisDate: new Date().toLocaleString()
    };
  }
}
