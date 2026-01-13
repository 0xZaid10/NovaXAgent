import { getCandles } from "./service";

setInterval(() => {
  const candles = getCandles("EGLD/USDC", "1m");
  const last = candles[candles.length - 1];

  console.log("LAST 1M CANDLE:", last);
}, 10_000);
