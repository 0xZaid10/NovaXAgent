import { bus } from "../../ws-engine/src/bus/event.bus";

import {
  EMA,
  RSI,
  MACD,
  BollingerBands,
  Candle
} from "@novax/market-data" ;

/* store close prices */
const closes: Record<string, number[]> = {};

bus.on("candle_closed", (candle: Candle) => {

  const key = `${candle.pair}_${candle.timeframe}`;

  if (!closes[key]) closes[key] = [];
  closes[key].push(candle.close);

  const prices = closes[key];

  if (prices.length < 30) return; // warmup

  const ema20 = EMA(prices, 20).at(-1);
  const rsi14 = RSI(prices, 14).at(-1);
  const macd = MACD(prices);
  const bb = BollingerBands(prices);

  console.log("INDICATORS:", {
    pair: candle.pair,
    tf: candle.timeframe,
    ema20,
    rsi14,
    macd: macd.macd.at(-1),
    upper: bb.upper.at(-1),
    lower: bb.lower.at(-1)
  });
});
