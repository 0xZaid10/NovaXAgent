export function SMA(values: number[], period: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < values.length; i++) {

    if (i + 1 < period) {
      result.push(NaN);
      continue;
    }

    const slice = values.slice(i + 1 - period, i + 1);
    const sum = slice.reduce((a, b) => a + b, 0);

    result.push(sum / period);
  }

  return result;
}
