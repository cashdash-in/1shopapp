
/**
 * @fileOverview Technical analysis and scoring logic for TradeHunter.
 * Mirrors the Python implementation provided in TypeScript.
 */

export interface MarketData {
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

export class TradeHunterEngine {
  calculateRSI(close: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    const deltas: number[] = [];
    for (let i = 1; i < close.length; i++) {
      deltas.push(close[i] - close[i - 1]);
    }

    let avgGain = 0;
    let avgLoss = 0;

    for (let i = 0; i < period; i++) {
      const delta = deltas[i];
      if (delta > 0) avgGain += delta;
      else avgLoss -= delta;
    }

    avgGain /= period;
    avgLoss /= period;

    rsi[period] = 100 - (100 / (1 + avgGain / (avgLoss || 1)));

    for (let i = period + 1; i < close.length; i++) {
      const delta = deltas[i - 1];
      const gain = delta > 0 ? delta : 0;
      const loss = delta < 0 ? -delta : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      rsi[i] = 100 - (100 / (1 + avgGain / (avgLoss || 1)));
    }

    return rsi;
  }

  calculateEMA(data: number[], span: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (span + 1);
    ema[0] = data[0];
    for (let i = 1; i < data.length; i++) {
      ema[i] = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }
    return ema;
  }

  calculateMACD(close: number[]): { macd: number[]; signal: number[] } {
    const ema12 = this.calculateEMA(close, 12);
    const ema26 = this.calculateEMA(close, 26);
    const macd: number[] = [];
    for (let i = 0; i < close.length; i++) {
      macd[i] = (ema12[i] || 0) - (ema26[i] || 0);
    }
    const signal = this.calculateEMA(macd, 9);
    return { macd, signal };
  }

  calculateVWAP(high: number[], low: number[], close: number[], volume: number[]): number[] {
    const vwap: number[] = [];
    let cumulativeTPV = 0;
    let cumulativeVol = 0;

    for (let i = 0; i < close.length; i++) {
      const tp = (high[i] + low[i] + close[i]) / 3;
      cumulativeTPV += tp * volume[i];
      cumulativeVol += volume[i];
      vwap[i] = cumulativeTPV / cumulativeVol;
    }
    return vwap;
  }

  scoreLong(df: MarketData): number {
    let score = 0;
    const rsi = this.calculateRSI(df.close);
    const { macd, signal } = this.calculateMACD(df.close);
    const vwap = this.calculateVWAP(df.high, df.low, df.close, df.volume);

    const latestIdx = df.close.length - 1;
    const prevIdx = latestIdx - 1;

    // RSI > 55 = 15 pts
    if (rsi[latestIdx] > 55) score += 15;

    // MACD Bullish Crossover = 15 pts
    if (macd[latestIdx] > signal[latestIdx] && macd[prevIdx] <= signal[prevIdx]) score += 15;
    else if (macd[latestIdx] > signal[latestIdx]) score += 10; // Already bullish

    // Price Above VWAP = 15 pts
    if (df.close[latestIdx] > vwap[latestIdx]) score += 15;

    // Volume > 1.5x average = 15 pts
    const avgVol = df.volume.slice(-20).reduce((a, b) => a + b, 0) / 20;
    if (df.volume[latestIdx] > avgVol * 1.5) score += 15;

    // PDH Breakout = 20 pts
    const pdh = Math.max(...df.high.slice(0, -1));
    if (df.close[latestIdx] > pdh) score += 20;

    // HHHL Structure = 20 pts
    if (df.high[latestIdx] > df.high[prevIdx] && df.low[latestIdx] > df.low[prevIdx]) score += 20;

    return score;
  }

  scoreShort(df: MarketData): number {
    let score = 0;
    const rsi = this.calculateRSI(df.close);
    const { macd, signal } = this.calculateMACD(df.close);
    const vwap = this.calculateVWAP(df.high, df.low, df.close, df.volume);

    const latestIdx = df.close.length - 1;
    const prevIdx = latestIdx - 1;

    if (rsi[latestIdx] < 45) score += 15;
    if (macd[latestIdx] < signal[latestIdx] && macd[prevIdx] >= signal[prevIdx]) score += 15;
    else if (macd[latestIdx] < signal[latestIdx]) score += 10;

    if (df.close[latestIdx] < vwap[latestIdx]) score += 15;

    const avgVol = df.volume.slice(-20).reduce((a, b) => a + b, 0) / 20;
    if (df.volume[latestIdx] > avgVol * 1.5) score += 15;

    const pdl = Math.min(...df.low.slice(0, -1));
    if (df.close[latestIdx] < pdl) score += 20;

    if (df.high[latestIdx] < df.high[prevIdx] && df.low[latestIdx] < df.low[prevIdx]) score += 20;

    return score;
  }
}
