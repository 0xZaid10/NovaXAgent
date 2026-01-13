import { Candle } from "@novax/market-data";
import { IndicatorConfig } from "./indicator.config";

const store: Record<string, Candle[]> = {};

export function pushCandle(tf: string, c: Candle) {
  store[tf] ||= [];
  store[tf].push(c);

  if (store[tf].length > 1000) {
    store[tf].shift();
  }
}

export function computeIndicators(
  tf: string,
  cfg: IndicatorConfig
) {
  const data = store[tf];
  const out: any = {};

  if (!data) return out;

  if (cfg.ema) {
    for (const p of cfg.ema) {
      out[`ema${p}`] = EMA(data, p);
    }
  }

  if (cfg.rsi) {
    for (const p of cfg.rsi) {
      out[`rsi${p}`] = RSI(data, p);
    }
  }

  return out;
}

/* simple examples */
function EMA(data: Candle[], p: number) {
  const k = 2 / (p + 1);
  let ema = data[0].close;

  for (const c of data) {
    ema = c.close * k + ema * (1 - k);
  }
  return ema;
}

function RSI(data: Candle[], p: number) {
  if (data.length < p + 1) return NaN;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= p; i++) {
    const diff =
      data[data.length - i].close -
      data[data.length - i - 1].close;

    diff > 0
      ? gains += diff
      : losses -= diff;
  }

  const rs = gains / losses;
  return 100 - (100 / (1 + rs));
}
