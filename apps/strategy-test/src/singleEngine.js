"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSingleEngine = runSingleEngine;
const backtest_1 = require("./backtest");
const indicators_1 = require("./indicators");
const ruleFromConfig_1 = require("./ruleFromConfig");
const uiToEngine_1 = require("./adapters/uiToEngine");
function runSingleEngine(candles, uiConfig) {
    // 🔥 Convert UI config → Engine config
    const engineConfig = (0, uiToEngine_1.mapUiToEngineConfig)(uiConfig);
    const indicators = (0, indicators_1.buildIndicators)(candles);
    const atrArr = indicators.atr(14);
    return (0, backtest_1.backtest)(candles, (i) => {
        const signal = (0, ruleFromConfig_1.ruleFromConfig)(uiConfig, i, indicators, candles);
        return signal === "buy";
    }, atrArr, engineConfig // ✅ CORRECT TYPE
    );
}
