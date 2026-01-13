import type { SimulationConfig } from "../../../ui/src/types/simulation";
import type { UserStrategyConfig } from "../types";

export function mapUiToEngineConfig(
  ui: SimulationConfig
): UserStrategyConfig {

  const ind = ui.indicators;

  return {
    name: "UI Strategy",

    indicators: {
      ema: {
        enabled: true,
        fast: Number(ind.ema_fast),
        slow: Number(ind.ema_slow)
      },

      sma: {
        enabled: true,
        fast: Number(ind.sma_period),
        slow: Number(ind.sma_period) * 2
      },

      macd: {
        enabled: true,
        fast: Number(ind.macd_fast),
        slow: Number(ind.macd_slow),
        signal: Number(ind.macd_signal)
      },

      bollingerBands: {
        enabled: false,
        period: 20,
        deviation: 2
      },

      atr: {
        enabled: false,
        period: 14
      },

      rsi: {
        enabled: true,
        period: Number(ind.rsi_period)
      }
    },

    risk: {
      slMult: Number(ui.sl),
      tpR: Number(ui.tp),
      riskPct: 1
    }
  };
}
