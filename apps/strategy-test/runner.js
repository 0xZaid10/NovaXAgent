"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runUserBacktest = runUserBacktest;
const indicators_1 = require("../strategy-test/src/indicators");
const rules_1 = require("../strategy-test/src/rules");
const backtest_1 = require("../strategy-test/src/backtest");
function runUserBacktest(candles, config) {
    const indicators = (0, indicators_1.buildIndicators)(candles);
    const atr = indicators.atr(config.indicators.atr.period);
    return (0, backtest_1.backtest)(candles, (i) => (0, rules_1.evaluateRules)(config, i, indicators, candles), atr, config // ✅ added
    );
}
