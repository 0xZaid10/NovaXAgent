import { WebSocketServer, WebSocket } from "ws";
import { bus } from "../bus/event.bus";
import {
  setPairState,
  removePair
} from "../poller/pair.state";

import { onTick } from "@novax/market-data";
import { TIMEFRAMES } from "../config";

import {
  pushCandle,
  computeIndicators
} from "../../../research-engine/src/indicator.engine";

/* ---------- CLIENT CONFIG ---------- */

type ClientCfg = {
  pair: string;
  tf: string;
  indicators: any;
};

const PORT = Number(process.env.WS_PORT || 9000);
const wss = new WebSocketServer({ port: PORT });

const clients = new Map<WebSocket, ClientCfg>();

/* prevent duplicate candle spam */
const lastClosed = new Map<string, number>();

/* ---------- WS CONNECTION ---------- */

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  ws.on("message", (raw: Buffer) => {

    try {
      const text = raw.toString().trim();
      console.log("WS RAW:", text);
      if (!text) return;

      let msg;
      try {
        msg = JSON.parse(text);
      } catch {
        console.warn("Invalid JSON:", text);
        return;
      }

      /* ---------- SUBSCRIBE ---------- */

      if (msg.type === "subscribe") {

        clients.set(ws, {
          pair: msg.pair,
          tf: msg.tf || "1m",
          indicators: msg.indicators || {}
        });

        console.log(
          "Subscribed:",
          msg.pair,
          msg.tf
        );
      }

      /* -------- STRATEGY CONTROL -------- */

      if (msg.type === "start_strategy" && msg.pair) {
        setPairState(msg.pair, "STRATEGY_RUNNING");
        console.log("Strategy started:", msg.pair);
      }

      if (msg.type === "open_position" && msg.pair) {
        setPairState(msg.pair, "POSITION_OPEN");
        console.log("Position opened:", msg.pair);
      }

      if (msg.type === "stop_strategy" && msg.pair) {
        removePair(msg.pair);
        console.log("Strategy stopped:", msg.pair);
      }

    } catch (err) {
      console.error("WS handler error:", err);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client disconnected");
  });

  ws.on("error", err => {
    console.error("WS error:", err);
  });
});

/* -------- PRICE BUS LISTENER -------- */

bus.on("price", data => {

  /* 🔥 BUILD ALL TIMEFRAMES */
  for (const tf of TIMEFRAMES) {

    const closed = onTick(
      data.pair,
      Number(data.price),
      data.ts,
      tf
    ) as any;

    if (closed) {

      const key =
        `${closed.pair}_${closed.timeframe}`;

      /* prevent duplicate spam */
      if (lastClosed.get(key) === closed.ts)
        continue;

      lastClosed.set(key, closed.ts);

      bus.emit("candle_closed", closed);
    }
  }

  /* -------- BROADCAST PRICE -------- */

  for (const [ws, cfg] of clients) {

    if (
      ws.readyState === WebSocket.OPEN &&
      cfg.pair === data.pair
    ) {
      ws.send(JSON.stringify({
        type: "price",
        data
      }));
    }
  }
});

/* -------- CANDLE CLOSED LISTENER -------- */

bus.on("candle_closed", candle => {

  /* 🔥 STORE FOR INDICATORS */
  pushCandle(
    candle.timeframe,
    candle
  );

  for (const [ws, cfg] of clients) {

    if (
      ws.readyState === WebSocket.OPEN &&
      cfg.pair === candle.pair &&
      cfg.tf === candle.timeframe
    ) {

      const values = computeIndicators(
        candle.timeframe,
        cfg.indicators
      );

      ws.send(JSON.stringify({
        type: "candle",
        candle,
        indicators: values
      }));
    }
  }
});

console.log("WS running on port", PORT);
