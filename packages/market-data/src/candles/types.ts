export type Timeframe = "1m" | "5m" | "15m" | "1h";

export type Candle = {
  pair: string;
  timeframe: Timeframe;
  start: number;

  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};
