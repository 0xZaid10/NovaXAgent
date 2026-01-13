// src/config/env.ts

export const ENV = {
  WS_PORT: Number(process.env.WS_PORT || 9000),
  POLL_INTERVAL: Number(process.env.POLL_INTERVAL_MS || 1000),
  GRAPHQL_URL: process.env.GRAPHQL_URL!
};

if (!ENV.GRAPHQL_URL) {
  throw new Error("GRAPHQL_URL missing");
}
