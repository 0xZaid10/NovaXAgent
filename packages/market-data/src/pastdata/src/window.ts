import { Candle } from "../../candles/types.js";

export function recentWindow(
  candles: Candle[],
  days: number
) {

  const latest =
    Math.max(...candles.map(c => c.start));

  const cutoff =
    latest - days * 86400;

  return candles.filter(
    c => c.start >= cutoff
  );
}
