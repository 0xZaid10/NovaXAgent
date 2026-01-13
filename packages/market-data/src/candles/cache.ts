import { Candle } from "./types";

const active = new Map<string, Candle>();
const history = new Map<string, Candle[]>();

function key(pair: string, tf: string) {
  return `${pair}:${tf}`;
}

export function getActive(pair: string, tf: string) {
  return active.get(key(pair, tf));
}

export function setActive(c: Candle) {
  active.set(key(c.pair, c.timeframe), c);
}

export function closeCandle(c: Candle) {
  const k = key(c.pair, c.timeframe);

  if (!history.has(k)) history.set(k, []);
  history.get(k)!.push(c);

  active.delete(k);
}

export function getHistory(pair: string, tf: string) {
  return history.get(key(pair, tf)) || [];
}
