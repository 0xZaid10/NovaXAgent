export type IndicatorConfig = {
  ema?: number[];
  sma?: number[];
  rsi?: number[];
  atr?: number[];
  macd?: {
    fast: number;
    slow: number;
    signal: number;
  }[];
  bb?: {
    period: number;
    dev: number;
  }[];
};
