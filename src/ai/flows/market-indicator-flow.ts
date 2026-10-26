'use server';
/**
 * @fileOverview Visual Quant Analyst flow. Analyzes stock chart screenshots 
 * to provide exact time-wise Entry/Exit instructions based on VISUAL evidence.
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
  symbol: z.string().describe('The identified stock symbol from the chart image.'),
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
        { text: `You are a Senior Intraday Quant Analyst. Analyze this stock chart screenshot with 100% precision.
        
        CRITICAL INSTRUCTIONS:
        1. Read the Y-AXIS and latest PRICE TOOLTIP carefully. Use the EXACT numbers visible in the image.
        2. Identify the current candlestick pattern (e.g., Bullish Engulfing, Pin Bar, Breakout).
        3. If the price is around 130-140, do NOT suggest entry at 1200. Every number MUST be derived from the visual scale of this specific image.
        4. Provide exact time-wise actions for both a BUY (Long) setup and a SHORT SELL setup based on the current session timeframe.
        5. For each strategy, give precise Entry, Stop-Loss, and two Profit Targets based on the visual support/resistance levels seen in the candlesticks.
        6. Detail the "Time-wise execution plan" - specify exactly when (time or event) to enter and exit.
        7. Maintain a professional, clinical quant tone.` },
      ],
      output: { schema: MarketIndicatorOutputSchema }
    });

    if (!output) throw new Error('AI failed to analyze chart');
    return {
      ...output,
      analysisDate: new Date().toLocaleString()
    };

  } catch (error) {
    console.warn("Visual Chart Analysis Error:", error);
    // Robust fallback that uses the user's symbol hint if available
    return {
      symbol: input.symbolHint || "CHART ANALYSIS",
      currentSentiment: 'Neutral',
      buyStrategy: {
        entry: "Analysis Error",
        stopLoss: "N/A",
        target1: "N/A",
        target2: "N/A",
        executionPlan: [
          { time: "Session", action: "Retry Analysis", priceLevel: "N/A", logic: "Visual analysis request failed. Please check your network and ensure the image is clear." }
        ]
      },
      shortStrategy: {
        entry: "Analysis Error",
        stopLoss: "N/A",
        target1: "N/A",
        target2: "N/A",
        executionPlan: [
          { time: "Session", action: "Retry Analysis", priceLevel: "N/A", logic: "Visual analysis request failed. Please check your network and ensure the image is clear." }
        ]
      },
      overallVerdict: "Visual analysis encountered a network or payload error. Please ensure your image is smaller and clearly shows price levels on the Y-axis.",
      analysisDate: new Date().toLocaleString()
    };
  }
}
