"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_data_1 = require("@novax/market-data");
const runner_1 = require("./runner");
async function test() {
    console.log("Loading candles...");
    const all = (0, market_data_1.loadCandles)("WEGLD/USDC", "5m");
    const candles = (0, market_data_1.recentWindow)(all, 20);
    console.log("Candles:", candles.length);
    const config = {
        name: "EMA + RSI test",
        // 🔥 USER RISK INPUT
        risk: {
            slMult: 1.2, // ATR multiplier
            tpR: 2, // R multiple
            riskPct: 0.02 // 2% per trade
        },
        indicators: {
            ema: { enabled: true, fast: 12, slow: 26 },
            sma: { enabled: false, fast: 0, slow: 0 },
            macd: { enabled: false, fast: 0, slow: 0, signal: 0 },
            bollingerBands: {
                enabled: false,
                period: 20,
                deviation: 2
            },
            atr: { enabled: true, period: 14 },
            rsi: { enabled: true, period: 14 }
        }
    };
    console.log("Running backtest...");
    const result = (0, runner_1.runUserBacktest)(candles, config);
    console.log("\nRESULT\n");
    console.log(result);
    console.log("\nTrades\n");
    console.table(result.trades);
}
test();
