import fs from "node:fs";
import path from "node:path";

import {
  loadCandles,
  recentWindow
} from "@novax/market-data";

import { runEngine } from "../strategy-engine/src/engine";

/* CONFIG */
const PAIR = "WEGLD/USDC";
const TF = "5m";
const DAYS = 20;

const STRATEGY_COUNT = 200;
const TOP = 5;

/* OUTPUT DIR */
const OUT = path.resolve("./results");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

async function main() {

  console.log("Loading candles...");

  const all =
    loadCandles(PAIR, TF);

  const candles =
    recentWindow(all, DAYS);

  const first = candles[0];
  const last = candles[candles.length - 1];

  console.log(
    "Window:",
    new Date(first.start * 1000),
    "→",
    new Date(last.start * 1000)
  );

  console.log("Running engine...");

  const ranked =
    runEngine(
      candles,
      STRATEGY_COUNT,
      TOP
    );

  console.log("\nTOP STRATEGIES\n");

  let report = "";
  let i = 1;

  for (const r of ranked) {

    const block = `
#${i}
Score: ${r.score.toFixed(2)}
Type: ${r.strategy.type}
Rules: ${r.strategy.rules.join(" | ")}
Profit: ${r.result.profit.toFixed(2)} %
Trades: ${r.result.trades.length}
Winrate: ${r.result.winrate.toFixed(2)} %
DD: ${r.result.maxDrawdown.toFixed(2)} %
-------------------------
`;

    console.log(block);
    report += block;
    i++;
  }

  /* SAVE FILES */
  const stamp = Date.now();

  fs.writeFileSync(
    `${OUT}/strategies_${stamp}.json`,
    JSON.stringify(ranked, null, 2)
  );

  fs.writeFileSync(
    `${OUT}/report_${stamp}.txt`,
    report
  );

  console.log("\nSaved:");
  console.log(`→ results/strategies_${stamp}.json`);
  console.log(`→ results/report_${stamp}.txt`);
}

main();
