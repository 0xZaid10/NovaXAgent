export interface UserStrategyConfig {
  name: string;

  risk: {
    slMult: number;   // ATR multiplier
    tpR: number;      // R multiple
    riskPct: number; // % per trade
  };

  indicators: {
    ema: { enabled: boolean; fast: number; slow: number };
    sma: { enabled: boolean; fast: number; slow: number };
    macd: { enabled: boolean; fast: number; slow: number; signal: number };
    bollingerBands: { enabled: boolean; period: number; deviation: number };
    atr: { enabled: boolean; period: number };
    rsi: { enabled: boolean; period: number };
  };
}

export interface Trade {
  entry: number;
  exit: number;
  size: number;
  pnl: number;
  reason: string;
}

export interface BacktestResult {
  trades: Trade[];
  profit: number;
  winrate: number;
  maxDrawdown: number;
  numberOfTrades: number;
}
