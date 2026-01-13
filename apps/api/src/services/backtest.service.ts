import { loadCandles, recentWindow } from "@novax/market-data";
import { runUserBacktest } from "../../../strategy-test/runner";

export async function runBacktest(payload: any) {

  const {
    tokenPair,
    duration,
    indicators,
    tp,
    sl
  } = payload;

  const all = loadCandles(tokenPair, "5m");
  const candles = recentWindow(all, 20);

  const result = runUserBacktest(
    candles,
    indicators,
  );

  return result;
}
