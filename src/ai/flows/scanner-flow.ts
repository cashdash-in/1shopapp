
'use server';
/**
 * @fileOverview Scanner flow that processes stock data and returns trading signals.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { TradeHunterEngine, type MarketData } from '@/lib/tradehunter-logic';

const ScannerInputSchema = z.object({
  symbol: z.string(),
  marketData: z.object({
    high: z.array(z.number()),
    low: z.array(z.number()),
    close: z.array(z.number()),
    volume: z.array(z.number()),
  }),
});

const ScannerOutputSchema = z.object({
  symbol: z.string(),
  tradeType: z.enum(['LONG', 'SHORT']),
  signal: z.string(),
  score: z.number(),
  entry: z.number(),
  stoploss: z.number(),
  target1: z.number(),
  target2: z.number(),
  confidence: z.number(),
});

export async function runScanner(input: z.infer<typeof ScannerInputSchema>) {
  const engine = new TradeHunterEngine();
  const longScore = engine.scoreLong(input.marketData);
  const shortScore = engine.scoreShort(input.marketData);

  const ltp = input.marketData.close[input.marketData.close.length - 1];
  const isLong = longScore >= shortScore;
  const score = isLong ? longScore : shortScore;
  const tradeType = isLong ? 'LONG' : 'SHORT';

  let signal = 'AVOID';
  if (score >= 80) signal = isLong ? 'STRONG BUY' : 'STRONG SHORT';
  else if (score >= 60) signal = isLong ? 'BUY' : 'SHORT';
  else if (score >= 40) signal = 'WATCH';

  // Calculate SL/Target
  const recentHighs = input.marketData.high.slice(-5);
  const recentLows = input.marketData.low.slice(-5);
  
  let sl = 0;
  if (isLong) {
    sl = Math.min(...recentLows);
    const risk = ltp - sl;
    return {
      symbol: input.symbol,
      tradeType: 'LONG',
      signal,
      score,
      entry: ltp,
      stoploss: sl,
      target1: ltp + risk * 2,
      target2: ltp + risk * 3,
      confidence: score
    };
  } else {
    sl = Math.max(...recentHighs);
    const risk = sl - ltp;
    return {
      symbol: input.symbol,
      tradeType: 'SHORT',
      signal,
      score,
      entry: ltp,
      stoploss: sl,
      target1: ltp - risk * 2,
      target2: ltp - risk * 3,
      confidence: score
    };
  }
}
