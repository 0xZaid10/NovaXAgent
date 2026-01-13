import { Trade, BacktestResult } from "./types";
import { UserStrategyConfig } from "./types";

export function backtest(
  candles: any[],
  signal: (i: number) => boolean,
  atrArr: number[],
  config: UserStrategyConfig
): BacktestResult {

  const { slMult, tpR, riskPct } = config.risk;

  let balance = 1000;
  let peak = balance;

  let inTrade = false;
  let entry = 0;
  let sl = 0;
  let tp = 0;
  let size = 0;

  const trades: Trade[] = [];

  for (let i = 50; i < candles.length; i++) {

    const c = candles[i];
    const atr = atrArr[i - 1];

    /* ENTRY */
    if (!inTrade && signal(i)) {

      entry = c.close;
      sl = entry - atr * slMult;

      const r = entry - sl;
      tp = entry + r * tpR;

      size = (balance * riskPct) / r;

      inTrade = true;
      continue;
    }

    if (!inTrade) continue;

    /* TP */
    if (c.high >= tp) {

      const pnl = (tp - entry) * size;
      balance += pnl;

      trades.push({
        entry,
        exit: tp,
        size,
        pnl,
        reason: "TP"
      });

      inTrade = false;
      peak = Math.max(peak, balance);
      continue;
    }

    /* SL */
    if (c.low <= sl) {

      const pnl = (sl - entry) * size;
      balance += pnl;

      trades.push({
        entry,
        exit: sl,
        size,
        pnl,
        reason: "SL"
      });

      inTrade = false;
      peak = Math.max(peak, balance);
    }
  }

  const wins =
    trades.filter(t => t.pnl > 0).length;

  const profit =
    ((balance - 1000) / 1000) * 100;

  const dd =
    ((peak - balance) / peak) * 100;

  return {
    trades,
    profit,
    winrate:
      trades.length
        ? (wins / trades.length) * 100
        : 0,
    maxDrawdown: dd,
    numberOfTrades: trades.length
  };
}
