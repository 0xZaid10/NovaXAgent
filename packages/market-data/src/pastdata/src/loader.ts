import fs from "node:fs";
import path from "node:path";

import type { Candle, Timeframe } from "../../candles/types";
import type { RawCandle } from "./raw";

function normalize(
  raw: RawCandle[],
  pair: string,
  tf: Timeframe
): Candle[] {

  return raw.map(c => ({
    pair,
    timeframe: tf,
    start: c.time,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
    volume: c.volume
  }));
}

export function loadCandles(
  pair: string,
  tf: Timeframe
): Candle[] {

  const base = path.resolve(
    __dirname,
    "../../data"
  );

  const file = path.join(
    base,
    `candles_${tf}.csv`
  );

  if (!fs.existsSync(file)) {
    throw new Error(
      `Missing candle file: ${file}`
    );
  }

  const csv = fs.readFileSync(file, "utf8");

  const raw: RawCandle[] = csv
    .split("\n")
    .slice(1)
    .filter(Boolean)
    .map(row => {

      const [
        time,o,h,l,c,v
      ] = row.split(",");

      return {
        time:+time,
        open:+o,
        high:+h,
        low:+l,
        close:+c,
        volume:+v
      };
    });

  return normalize(raw, pair, tf);
}
