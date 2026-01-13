type Candle = {
  high: number;
  low: number;
  close: number;
};

export function ATR(
  candles: Candle[],
  period = 14
) {

  const trs: number[] = [];

  for (let i = 1; i < candles.length; i++) {

    const c = candles[i];
    const p = candles[i - 1];

    const tr = Math.max(
      c.high - c.low,
      Math.abs(c.high - p.close),
      Math.abs(c.low - p.close)
    );

    trs.push(tr);
  }

  const atr: number[] = [];

  let sum = trs
    .slice(0, period)
    .reduce((a, b) => a + b, 0);

  atr[period] = sum / period;

  for (let i = period + 1; i < trs.length; i++) {

    atr[i] =
      (atr[i - 1] * (period - 1) + trs[i]) / period;
  }

  return atr;
}
