export function BollingerBands(
  values: number[],
  period = 20,
  stdDev = 2
) {

  const middle: number[] = [];
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < values.length; i++) {

    if (i + 1 < period) {
      middle.push(NaN);
      upper.push(NaN);
      lower.push(NaN);
      continue;
    }

    const slice = values.slice(i + 1 - period, i + 1);
    const mean =
      slice.reduce((a, b) => a + b, 0) / period;

    const variance =
      slice.reduce(
        (a, b) => a + Math.pow(b - mean, 2),
        0
      ) / period;

    const std = Math.sqrt(variance);

    middle.push(mean);
    upper.push(mean + stdDev * std);
    lower.push(mean - stdDev * std);
  }

  return { middle, upper, lower };
}
