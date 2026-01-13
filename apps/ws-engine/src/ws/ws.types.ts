// src/ws/ws.types.ts

export type SubscribeMsg = {
  type: "subscribe";
  pair: string;
};

export type WsMessage = SubscribeMsg;
