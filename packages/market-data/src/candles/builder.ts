export type Candle = {
  pair: string;
  timeframe: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ts: number;
};

const buckets = new Map<string, Candle>();

/* ADD MORE TIMEFRAMES */
const TF_MS: Record<string, number> = {
  "1m": 60_000,
  "5m": 300_000,
  "15m": 900_000,
  "1h": 3_600_000
};

export function onTick(
  pair: string,
  price: number,
  ts: number,
  tf = "1m"
): Candle | null {

  const key = `${pair}_${tf}`;
  const bucketTime =
    Math.floor(ts / TF_MS[tf]) * TF_MS[tf];

  let c = buckets.get(key);
  let closed: Candle | null = null;

  /* new candle */
  if (!c || bucketTime > c.ts) {

    if (c) {
      closed = { ...c }; // close previous
    }

    // OPEN NEW CANDLE ALWAYS
    c = {
      pair,
      timeframe: tf,
      open: price,
      high: price,
      low: price,
      close: price,
      volume: 0,
      ts: bucketTime
    };

    buckets.set(key, c);
    return closed;
  }

  /* update */
  c.high = Math.max(c.high, price);
  c.low = Math.min(c.low, price);
  c.close = price;

  return null;
}
