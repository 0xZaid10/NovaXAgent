// src/cache/ttl.ts

const TTL = 5000;

export function isExpired(ts: number) {
  return Date.now() - ts > TTL;
}
