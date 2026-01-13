import { EMA } from "./ema";

export function MACD(
  values: number[],
  fast = 12,
  slow = 26,
  signal = 9
) {

  const fastEMA = EMA(values, fast);
  const slowEMA = EMA(values, slow);

  const macdLine = fastEMA.map(
    (v, i) => v - slowEMA[i]
  );

  const signalLine = EMA(macdLine, signal);

  const histogram = macdLine.map(
    (v, i) => v - signalLine[i]
  );

  return {
    macd: macdLine,
    signal: signalLine,
    histogram
  };
}
