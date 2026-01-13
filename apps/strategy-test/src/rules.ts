import { UserStrategyConfig } from "./types";

export function evaluateRules(
  config: UserStrategyConfig,
  i: number,
  ind: any,
  candles: any[]
) {

  const x = config.indicators;

  if (x.ema.enabled) {
    const f = ind.ema(x.ema.fast)[i - x.ema.fast];
    const s = ind.ema(x.ema.slow)[i - x.ema.slow];
    if (!f || !s || f <= s) return false;
  }

  if (x.sma.enabled) {
    const f = ind.sma(x.sma.fast)[i - x.sma.fast];
    const s = ind.sma(x.sma.slow)[i - x.sma.slow];
    if (!f || !s || f <= s) return false;
  }

  if (x.rsi.enabled) {
    const v = ind.rsi(x.rsi.period)[i - x.rsi.period];
    if (!v || v >= 60) return false;
  }

  if (x.macd.enabled) {
    const m =
      ind.macd(
        x.macd.fast,
        x.macd.slow,
        x.macd.signal
      )[i - x.macd.slow];
    if (!m || m.MACD <= m.signal)
      return false;
  }

  if (x.bollingerBands.enabled) {
    const bb =
      ind.bb(
        x.bollingerBands.period,
        x.bollingerBands.deviation
      )[i - x.bollingerBands.period];
    if (!bb || candles[i].close >= bb.upper)
      return false;
  }

  if (x.atr.enabled) {
    const a = ind.atr(x.atr.period);
    const cur = a[i - x.atr.period];
    const prev = a[i - x.atr.period - 1];
    if (!cur || !prev || cur <= prev)
      return false;
  }

  return true;
}
