"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleFromConfig = ruleFromConfig;
function ruleFromConfig(config, i, indicators, candles) {
    const close = candles[i].close;
    // EMA rule (single period)
    if (config.indicators.ema?.period) {
        const ema = indicators.ema(config.indicators.ema.period)[i];
        if (close > ema)
            return "buy";
        if (close < ema)
            return "sell";
    }
    return null;
}
