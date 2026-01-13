export interface Strategy {
  id: string;
  name: string;
  profit: number;
  createdAt: string; // ISO
}

export interface SimulationResults {
  profit: number;
  winrate: number;
  maxDrawdown: number;
  numberOfTrades: number;
}

/* 
  FLAT STRUCTURE
  Matches UI state & API payload
*/
export interface IndicatorSettings {

  // EMA
  ema_fast: number;
  ema_slow: number;

  // SMA
  sma_period: number;

  // MACD
  macd_fast: number;
  macd_slow: number;
  macd_signal: number;

  // RSI
  rsi_period: number;
}

export interface SimulationConfig {
  name: string;
  tokenPair: string;
  duration: string;

  // risk inputs
  tp: string;   // take profit %
  sl: string;   // stop loss %

  indicators: IndicatorSettings;
}
