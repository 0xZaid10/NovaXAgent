/* strategy-engine/engine.ts */

import { generateStrategy, Strategy } from "./generator";
import { backtest} from "./backtest";
import { buildIndicators, ruleCheck } from "./rules";
import type { Candle } from "@novax/market-data";

/* scoring */
function score(r: any) {
  return (
    r.profit * 0.5 +
    r.winrate * 0.3 -
    r.maxDrawdown * 0.2
  );
}

export interface RankedStrategy {
  strategy: Strategy;
  result: any;
  score: number;
}

/* MAIN ENTRY */
export function runEngine(
  candles: Candle[],
  count = 300,
  top = 5
): RankedStrategy[] {

  const indicators = buildIndicators(candles);
  const results: RankedStrategy[] = [];
  const atrArr = indicators.atr(14);
  
  for (let i = 0; i < count; i++) {

    const strat = generateStrategy();

    const res = backtest(
      candles,
      (idx) =>
        ruleCheck(
          strat,
          idx,
          indicators,
          candles
        ),
    atrArr
    );

    const s = score(res);

    results.push({
      strategy: strat,
      result: res,
      score: s
    });
  }

  /* sort best first */
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, top);
}
