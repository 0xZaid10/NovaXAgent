type Tick = {
  pair: string;
  price: string;
  ts: number;
};

const cache = new Map<string, Tick>();

export function update(pair: string, price: string) {
  cache.set(pair, { pair, price, ts: Date.now() });
}

export function get(pair: string) {
  return cache.get(pair);
}
