import {WebSocket} from "ws";
import {
  EMA,
  RSI,
  MACD,
  BollingerBands,
  Candle
} from "@novax/market-data";

const ws = new WebSocket("ws://localhost:9000");

const closes: Record<string, number[]> = {};

ws.on("open", () => {
  console.log("Research WS connected");
});

ws.on("message", raw => {

  console.log("RESEARCH RAW:", raw.toString());

  const msg = JSON.parse(raw.toString());

  if (msg.type !== "candle") return;

  console.log("RESEARCH GOT CANDLE"); 

  const candle: Candle = msg.data;

  const key = `${candle.pair}_${candle.timeframe}`;

  if (!closes[key]) closes[key] = [];
  closes[key].push(candle.close);

  const prices = closes[key];

  if (prices.length < 30) return;

  console.log("INDICATORS:", {
    pair: candle.pair,
    tf: candle.timeframe,
    ema20: EMA(prices, 20).at(-1),
    rsi14: RSI(prices, 14).at(-1),
    macd: MACD(prices).macd.at(-1)
  });
});
