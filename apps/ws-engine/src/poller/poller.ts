import { fetchPairs } from "./price.source";
import { update } from "../cache/price.cache";
import { bus } from "../bus/event.bus";
import { getPairStates } from "./pair.state";

/* ---------------- MAPPINGS ---------------- */

const DISPLAY_MAP: Record<string, string> = {
  WEGLD: "EGLD",
  WETH: "ETH",
  WBNB: "BNB"
};

const NORMALIZE_MAP: Record<string, string> = {
  EGLD: "WEGLD",
  ETH: "WETH",
  BNB: "WBNB"
};

function display(token: string) {
  return DISPLAY_MAP[token] || token;
}

function normalize(token: string) {
  return NORMALIZE_MAP[token] || token;
}

function normalizePair(pair: string) {
  let [base, quote] = pair.split("/");
  base = normalize(base);
  quote = normalize(quote);
  return `${base}/${quote}`;
}

/* --------------- SPEED CONTROL --------------- */

const SPEED = {
  STRATEGY_RUNNING: 20_000,
  POSITION_OPEN: 10_000
};

/* --------------- TIMER STORE --------------- */

const timers = new Map<string, NodeJS.Timeout>();

/* --------------- CORE LOOP --------------- */

async function pollPair(pair: string) {

  const state = getPairStates().get(pair);

  // if strategy stopped -> kill timer
  if (!state) {
    stop(pair);
    return;
  }

  const delay =
    state === "POSITION_OPEN"
      ? SPEED.POSITION_OPEN
      : SPEED.STRATEGY_RUNNING;

  try {

    const normalized = normalizePair(pair);

    const p = await fetchPairs(normalized);
    if (!p || !p.firstTokenPrice) return;

    const symbol =
      `${display(p.firstToken.ticker)}/${display(p.secondToken.ticker)}`;

    update(symbol, p.firstTokenPrice);

    bus.emit("price", {
      pair: symbol,
      price: p.firstTokenPrice,
      ts: Date.now()
    });

  } catch (err) {
    console.error("POLL ERROR:", err);
  }

  timers.set(
    pair,
    setTimeout(() => pollPair(pair), delay)
  );
}

/* --------------- TIMER CONTROL --------------- */

function start(pair: string) {

  // always clear old timer first
  stop(pair);

  pollPair(pair);
}

function stop(pair: string) {

  const t = timers.get(pair);
  if (t) clearTimeout(t);

  timers.delete(pair);
}

/* --------------- MAIN WATCHER --------------- */

export function startPoller() {

  setInterval(() => {

    const states = getPairStates();

    /* start new strategies */
    for (const pair of states.keys()) {
      if (!timers.has(pair)) {
        start(pair);
      }
    }

    /* stop removed strategies */
    for (const pair of timers.keys()) {
      if (!states.has(pair)) {
        stop(pair);
      }
    }

  }, 1000); // watcher interval
}
