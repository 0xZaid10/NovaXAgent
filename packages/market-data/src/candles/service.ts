import { getHistory } from "./cache";
import { Timeframe } from "./types";

export function getCandles(
  pair: string,
  tf: Timeframe
) {
  return getHistory(pair, tf);
}
