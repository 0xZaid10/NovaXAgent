import { buildIndicators } from "../strategy-test/src/indicators";
import { evaluateRules } from "../strategy-test/src/rules";
import { backtest } from "../strategy-test/src/backtest";
import { UserStrategyConfig } from "../strategy-test/src//types";

export function runUserBacktest(
  candles: any[],
  config: UserStrategyConfig
) {

  const indicators =
    buildIndicators(candles);

  const atr =
    indicators.atr(
      config.indicators.atr.period
    );

  return backtest(
    candles,
    (i) =>
      evaluateRules(
        config,
        i,
        indicators,
        candles
      ),
    atr,
    config        // ✅ added
  );
}
