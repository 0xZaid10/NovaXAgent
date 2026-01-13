import express from "express";
import cors from "cors";

import {
  loadCandles,
  recentWindow
} from "@novax/market-data";

import { runUserBacktest }
from "../../strategy-test/runner";

import type { UserStrategyConfig }
from "../../strategy-test/src/types";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/run", async (req, res) => {
  try {

    const config =
      req.body as UserStrategyConfig;

    console.log("📥 Strategy:", config.name);

    console.log("Loading candles...");

    const all =
      loadCandles(
        "WEGLD/USDC", // or config.pair later
        "5m"
      );

    const candles =
      recentWindow(all, 200);

    console.log("Candles:", candles.length);
    console.log("Running backtest...");

    const result =
      runUserBacktest(
        candles,
        config
      );

    res.json(result);

  } catch (e) {
    console.error("ENGINE ERROR", e);

    res.status(500).json({
      error: "Engine failed"
    });
  }
});

app.listen(3001, () => {
  console.log(
    "🔥 Engine running on http://localhost:3001"
  );
});
