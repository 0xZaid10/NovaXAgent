import type { SimulationConfig } from "../../ui/src/types/simulation";
import type { Candle } from "@novax/market-data";

export function ruleFromConfig(
  config: SimulationConfig,
  i: number,
  indicators: any,
  candles: Candle[]
): "buy" | "sell" | null {

  const close = candles[i].close;

  const ind = config.indicators;

  /* EMA crossover */
  if (ind.ema_fast && ind.ema_slow) {

    const fastArr =
      indicators.ema(ind.ema_fast);

    const slowArr =
      indicators.ema(ind.ema_slow);

    const fast = fastArr[i];
    const slow = slowArr[i];

    if (fast > slow) return "buy";
    if (fast < slow) return "sell";
  }

  /* RSI filter (optional) */
  if (ind.rsi_period) {

    const rsiArr =
      indicators.rsi(ind.rsi_period);

    const rsi = rsiArr[i];

    if (rsi > 70) return "sell";
    if (rsi < 30) return "buy";
  }

  return null;
}
