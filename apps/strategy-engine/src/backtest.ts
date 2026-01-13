import type { Candle } from "@novax/market-data";

/* CONFIG */
const RISK_PCT = 0.02;        // 2% risk per trade
const SL_MULT = 1.2;
const TP1_R = 1;             // 1R
const TP2_R = 2;             // 2R
const TP1_SIZE = 0.5;        // 50%
const TP2_SIZE = 0.3;        // 30%
const TRAIL_MULT = 1;        // 1 ATR trailing

export interface Trade {
  entry: number;
  exit: number;
  size: number;
  pnl: number;
  reason: string;
}

export interface BacktestResult {
  trades: Trade[];
  balance: number;
  profit: number;
  winrate: number;
  maxDrawdown: number;
}

/* MAIN ENGINE */
export function backtest(
  candles: Candle[],
  signals: (i: number) => boolean,
  atrArr: number[]
): BacktestResult {

  let balance = 1000;
  let peak = balance;

  let inTrade = false;
  let entry = 0;
  let sl = 0;
  let trail = 0;
  let size = 0;
  let r = 0;

  let remainingSize = 0;

  const trades: Trade[] = [];

  for (let i = 50; i < candles.length; i++) {

    const c = candles[i];
    const atr = atrArr[i - 1];

    /* ENTER */
    if (!inTrade && signals(i)) {

      entry = c.close;
      sl = entry - atr * SL_MULT;

      r = entry - sl;

      const riskAmt = balance * RISK_PCT;
      size = riskAmt / r;

      remainingSize = size;
      trail = sl;

      inTrade = true;
      continue;
    }

    if (!inTrade) continue;

    /* TP1 */
    if (c.high >= entry + r * TP1_R && remainingSize > 0) {

      const exit = entry + r * TP1_R;
      const qty = size * TP1_SIZE;

      const pnl = (exit - entry) * qty;
      balance += pnl;

      remainingSize -= qty;

      trades.push({
        entry,
        exit,
        size: qty,
        pnl,
        reason: "TP1"
      });
    }

    /* TP2 */
    if (c.high >= entry + r * TP2_R && remainingSize > 0) {

      const exit = entry + r * TP2_R;
      const qty = size * TP2_SIZE;

      const pnl = (exit - entry) * qty;
      balance += pnl;

      remainingSize -= qty;

      trades.push({
        entry,
        exit,
        size: qty,
        pnl,
        reason: "TP2"
      });
    }

    /* TRAILING SL */
    const newTrail = c.close - atr * TRAIL_MULT;
    trail = Math.max(trail, newTrail);

    /* EXIT TRAIL */
    if (c.low <= trail && remainingSize > 0) {

      const exit = trail;
      const pnl = (exit - entry) * remainingSize;

      balance += pnl;

      trades.push({
        entry,
        exit,
        size: remainingSize,
        pnl,
        reason: "TRAIL"
      });

      inTrade = false;
      peak = Math.max(peak, balance);
      continue;
    }

    /* EXIT SIGNAL */
    if (!signals(i) && remainingSize > 0) {

      const exit = c.close;
      const pnl = (exit - entry) * remainingSize;

      balance += pnl;

      trades.push({
        entry,
        exit,
        size: remainingSize,
        pnl,
        reason: "SIGNAL"
      });

      inTrade = false;
      peak = Math.max(peak, balance);
    }
  }

  /* STATS */
  const wins = trades.filter(t => t.pnl > 0).length;
  const profit = ((balance - 1000) / 1000) * 100;

  const winrate = trades.length
    ? (wins / trades.length) * 100
    : 0;

  const dd = ((peak - balance) / peak) * 100;

  return {
    trades,
    balance,
    profit,
    winrate,
    maxDrawdown: dd
  };
}
