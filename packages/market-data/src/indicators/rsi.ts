export function RSI(values: number[], period = 14): number[] {

  const rsi: number[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    diff >= 0 ? gains += diff : losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  rsi[period] = 100 - (100 / (1 + avgGain / avgLoss));

  for (let i = period + 1; i < values.length; i++) {

    const diff = values[i] - values[i - 1];

    avgGain =
      (avgGain * (period - 1) + Math.max(diff, 0)) / period;

    avgLoss =
      (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;

    rsi[i] = 100 - (100 / (1 + avgGain / avgLoss));
  }

  return rsi;
}
