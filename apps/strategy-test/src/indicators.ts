import {
  EMA,
  SMA,
  RSI,
  MACD,
  BollingerBands,
  ATR
} from "technicalindicators";

export function buildIndicators(candles: any[]) {

  const close = candles.map(c => c.close);
  const high = candles.map(c => c.high);
  const low = candles.map(c => c.low);

  const cache: any = {};

  const key = (n: string, ...p: any[]) =>
    n + "_" + p.join("_");

  return {
    ema(p: number) {
      const k = key("ema", p);
      if (!cache[k])
        cache[k] = EMA.calculate({ period: p, values: close });
      return cache[k];
    },

    sma(p: number) {
      const k = key("sma", p);
      if (!cache[k])
        cache[k] = SMA.calculate({ period: p, values: close });
      return cache[k];
    },

    rsi(p: number) {
      const k = key("rsi", p);
      if (!cache[k])
        cache[k] = RSI.calculate({ period: p, values: close });
      return cache[k];
    },

    macd(f: number, s: number, sig: number) {
      const k = key("macd", f, s, sig);
      if (!cache[k])
        cache[k] = MACD.calculate({
          fastPeriod: f,
          slowPeriod: s,
          signalPeriod: sig,
          values: close,
          SimpleMAOscillator: false,
          SimpleMASignal: false
        });
      return cache[k];
    },

    bb(p: number, d: number) {
      const k = key("bb", p, d);
      if (!cache[k])
        cache[k] = BollingerBands.calculate({
          period: p,
          stdDev: d,
          values: close
        });
      return cache[k];
    },

    atr(p: number) {
      const k = key("atr", p);
      if (!cache[k])
        cache[k] = ATR.calculate({
          period: p,
          high,
          low,
          close
        });
      return cache[k];
    }
  };
}
