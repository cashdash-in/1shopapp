
'use server';
/**
 * @fileOverview Visual Quant Analyst flow. Optimized to handle stock page screenshots
 * and extract exact intraday session levels with time-wise execution.
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
      config: {
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
        ]
      },
      prompt: [
        { media: { url: input.photoDataUri, contentType: 'image/jpeg' } },
        { text: `You are a High-Precision Intraday Quant Strategist. 
        
        GOAL: Analyze this stock chart or market page screenshot and provide a definitive, time-wise execution plan.
        
        SYMBOL HINT: ${input.symbolHint || 'Detect from image header'}

        REQUIRED DATA EXTRACTION:
        1. Current Price (LTP): Find the largest bold price on the screen (e.g. 134.82). Look in headers or tooltips.
        2. Scale Calibration: Read the Y-axis price scale to ensure all targets are mathematically valid for this stock.
        3. Visual Patterns: Look for RSI crossovers, MACD histograms, or price action (Candlesticks).

        EXECUTION PLAN REQUIREMENTS:
        - Provide a 3-step 'executionPlan' for both Buy and Short setups.
        - Each step must have a specific TIME (e.g. '09:45 AM', 'Early Morning Session') and a PRICE level.
        - Calculate Stop-Loss and Targets based on visible support/resistance levels in the image.

        STRICT RULE: Do not hallucinate prices. If you see ₹134, do not suggest ₹1200 entry points.` },
      ],
      output: { schema: MarketIndicatorOutputSchema }
    });

    if (!output) throw new Error('AI analysis was blocked or returned no data.');
    
    return {
      ...output,
      analysisDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

  } catch (error: any) {
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
          { time: "System", action: "Retry Analysis", priceLevel: "N/A", logic: `Error: ${error.message || 'The AI encountered a filter or timeout issue.'}` }
        ]
      },
      shortStrategy: {
        entry: "Analysis Error",
        stopLoss: "N/A",
        target1: "N/A",
        target2: "N/A",
        executionPlan: [
          { time: "System", action: "Check Image", priceLevel: "N/A", logic: "Please ensure the price and chart are clearly visible and try again." }
        ]
      },
      overallVerdict: "The visual analysis failed. This is often due to API safety filters blocking financial advice or the image being too low-resolution. Provide a 'Stock Name' hint to help the AI focus.",
      analysisDate: new Date().toLocaleString()
    };
  }
}
