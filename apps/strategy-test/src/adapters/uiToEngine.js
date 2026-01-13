"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUiToEngineConfig = mapUiToEngineConfig;
function mapUiToEngineConfig(ui) {
    return {
        name: "UI Strategy", // 👈 REQUIRED FIELD
        indicators: {
            ema: {
                enabled: true,
                fast: ui.indicators.ema.period,
                slow: ui.indicators.ema.period * 2
            },
            sma: {
                enabled: false,
                fast: 20,
                slow: 50
            },
            macd: {
                enabled: false,
                fast: 12,
                slow: 26,
                signal: 9
            },
            bollingerBands: {
                enabled: false,
                period: 20,
                deviation: 2
            },
            atr: {
                enabled: true,
                period: ui.indicators.atr.period
            },
            rsi: {
                enabled: false,
                period: 14
            }
        },
        risk: {
            slMult: 1.5,
            tpR: 2,
            riskPct: 1
        }
    };
}
