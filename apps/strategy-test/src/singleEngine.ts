import type { Candle } from "@novax/market-data";
import { backtest } from "./backtest";
import { buildIndicators } from "./indicators";
import { ruleFromConfig } from "./ruleFromConfig";
import { mapUiToEngineConfig } from "./adapters/uiToEngine";
import type { SimulationConfig } from "../../ui/src/types/simulation";

export function runSingleEngine(
  candles: Candle[],
  uiConfig: SimulationConfig
) {

  // 🔥 Convert UI config → Engine config
  const engineConfig = mapUiToEngineConfig(uiConfig);

  const indicators = buildIndicators(candles);
  const atrArr = indicators.atr(14);

  return backtest(
    candles,
    (i) => {
      const signal = ruleFromConfig(
        uiConfig,
        i,
        indicators,
        candles
      );

      return signal === "buy";
    },
    atrArr,
    engineConfig // ✅ CORRECT TYPE
  );
}
