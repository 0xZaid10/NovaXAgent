export function EMA(values: number[], period: number): number[] {

  const k = 2 / (period + 1);
  const ema: number[] = [];

  let prev = values[0];
  ema.push(prev);

  for (let i = 1; i < values.length; i++) {
    const current = values[i] * k + prev * (1 - k);
    ema.push(current);
    prev = current;
  }

  return ema;
}
