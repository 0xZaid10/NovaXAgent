"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIndicators = buildIndicators;
const technicalindicators_1 = require("technicalindicators");
function buildIndicators(candles) {
    const close = candles.map(c => c.close);
    const high = candles.map(c => c.high);
    const low = candles.map(c => c.low);
    const cache = {};
    const key = (n, ...p) => n + "_" + p.join("_");
    return {
        ema(p) {
            const k = key("ema", p);
            if (!cache[k])
                cache[k] = technicalindicators_1.EMA.calculate({ period: p, values: close });
            return cache[k];
        },
        sma(p) {
            const k = key("sma", p);
            if (!cache[k])
                cache[k] = technicalindicators_1.SMA.calculate({ period: p, values: close });
            return cache[k];
        },
        rsi(p) {
            const k = key("rsi", p);
            if (!cache[k])
                cache[k] = technicalindicators_1.RSI.calculate({ period: p, values: close });
            return cache[k];
        },
        macd(f, s, sig) {
            const k = key("macd", f, s, sig);
            if (!cache[k])
                cache[k] = technicalindicators_1.MACD.calculate({
                    fastPeriod: f,
                    slowPeriod: s,
                    signalPeriod: sig,
                    values: close,
                    SimpleMAOscillator: false,
                    SimpleMASignal: false
                });
            return cache[k];
        },
        bb(p, d) {
            const k = key("bb", p, d);
            if (!cache[k])
                cache[k] = technicalindicators_1.BollingerBands.calculate({
                    period: p,
                    stdDev: d,
                    values: close
                });
            return cache[k];
        },
        atr(p) {
            const k = key("atr", p);
            if (!cache[k])
                cache[k] = technicalindicators_1.ATR.calculate({
                    period: p,
                    high,
                    low,
                    close
                });
            return cache[k];
        }
    };
}
