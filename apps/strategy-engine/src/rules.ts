import { Strategy } from "./generator";
import type { Candle } from "@novax/market-data";

import {
  EMA,
  SMA,
  RSI,
  MACD,
  BollingerBands,
  ATR
} from "technicalindicators";

/* Pre-calc & cache indicators */
export function buildIndicators(candles: Candle[]) {

  const close = candles.map(c => c.close);
  const high = candles.map(c => c.high);
  const low = candles.map(c => c.low);

  const cache: Record<string, any> = {};

  const key = (name: string, ...p: any[]) =>
    name + "_" + p.join("_");

  return {

    ema(p: number) {
      const k = key("ema", p);
      if (!cache[k])
        cache[k] = EMA.calculate({
          period: p,
          values: close
        });
      return cache[k];
    },

    sma(p: number) {
      const k = key("sma", p);
      if (!cache[k])
        cache[k] = SMA.calculate({
          period: p,
          values: close
        });
      return cache[k];
    },

    rsi(p: number) {
      const k = key("rsi", p);
      if (!cache[k])
        cache[k] = RSI.calculate({
          period: p,
          values: close
        });
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

/* Evaluate rule */
export function ruleCheck(
  strat: Strategy,
  i: number,
  ind: any,
  candles: Candle[]
): boolean {

  for (const r of strat.rules) {

    /* EMA(x) > EMA(y) */
    if (r.startsWith("EMA")) {
      const [a, b] = r.match(/\d+/g)!.map(Number);

      const e1 = ind.ema(a)[i - a];
      const e2 = ind.ema(b)[i - b];

      if (!e1 || !e2) return false;
      if (e1 <= e2) return false;
    }

    /* SMA(x) > SMA(y) */
    if (r.startsWith("SMA")) {
      const [a, b] = r.match(/\d+/g)!.map(Number);

      const s1 = ind.sma(a)[i - a];
      const s2 = ind.sma(b)[i - b];

      if (!s1 || !s2) return false;
      if (s1 <= s2) return false;
    }

    /* RSI(x) < value */
    if (r.startsWith("RSI")) {
      const [p] = r.match(/\d+/g)!.map(Number);
      const v = ind.rsi(p)[i - p];

      if (!v) return false;
      if (v >= 60) return false;
    }

    /* PRICE < BB_LOWER */
    if (r.includes("BB_LOWER")) {
      const [p, d] =
        r.match(/\d+\.?\d*/g)!.map(Number);

      const bb = ind.bb(p, d)[i - p];

      if (!bb) return false;
      if (candles[i].close >= bb.lower)
        return false;
    }

    /* PRICE > BB_UPPER */
    if (r.includes("BB_UPPER")) {
      const [p, d] =
        r.match(/\d+\.?\d*/g)!.map(Number);

      const bb = ind.bb(p, d)[i - p];

      if (!bb) return false;
      if (candles[i].close <= bb.upper)
        return false;
    }

    /* MACD > SIGNAL */
    if (r.startsWith("MACD")) {
      const [f, s, sig] =
        r.match(/\d+/g)!.map(Number);

      const m =
        ind.macd(f, s, sig)[i - s];

      if (!m) return false;
      if (m.MACD <= m.signal)
        return false;
    }

    /* ATR rising */
    if (r.includes("ATR")) {
      const [p] = r.match(/\d+/g)!.map(Number);
      const a = ind.atr(p);

      const cur = a[i - p];
      const prev = a[i - p - 1];

      if (!cur || !prev) return false;
      if (cur <= prev) return false;
    }
  }

  return true;
}
