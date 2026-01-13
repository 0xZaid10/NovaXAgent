/* strategy-engine/generator.ts */

type StrategyTemplate =
  | "TREND"
  | "MEAN_REVERSION"
  | "MOMENTUM"
  | "BREAKOUT"
  | "SMA_CROSS";

export interface Strategy {
  id: string;
  type: StrategyTemplate;
  rules: string[];
  params: any;
}

/* allowed params */
const EMA = [5, 9, 12, 20, 50, 100, 200];
const SMA = [20, 50, 100, 200];
const RSI = [7, 14, 21];

const BB = [
  { period: 20, dev: 2 },
  { period: 20, dev: 2.5 }
];

const MACD = [
  { fast: 12, slow: 26, signal: 9 },
  { fast: 8, slow: 21, signal: 5 }
];

const ATR = [14, 21];

const templates: StrategyTemplate[] = [
  "TREND",
  "MEAN_REVERSION",
  "MOMENTUM",
  "BREAKOUT",
  "SMA_CROSS"
];

/* helpers */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uid() {
  return Math.random().toString(36).slice(2);
}

/* main generator */
export function generateStrategy(): Strategy {

  const type = pick(templates);
  let rules: string[] = [];
  let params: any = {};

  switch (type) {

    /* EMA trend */
    case "TREND": {
      const fast = pick(EMA);
      const slow = pick(EMA.filter(x => x > fast));
      const rsi = pick(RSI);

      rules = [
        `EMA(${fast}) > EMA(${slow})`,
        `RSI(${rsi}) < 60`
      ];

      params = { fast, slow, rsi };
      break;
    }

    /* BB mean reversion */
    case "MEAN_REVERSION": {
      const bb = pick(BB);
      const rsi = pick(RSI);

      rules = [
        `PRICE < BB_LOWER(${bb.period},${bb.dev})`,
        `RSI(${rsi}) < 30`
      ];

      params = { ...bb, rsi };
      break;
    }

    /* MACD momentum */
    case "MOMENTUM": {
      const m = pick(MACD);
      const e1 = pick(EMA);
      const e2 = pick(EMA.filter(x => x > e1));

      rules = [
        `MACD(${m.fast},${m.slow},${m.signal}) > SIGNAL`,
        `EMA(${e1}) > EMA(${e2})`
      ];

      params = { ...m, e1, e2 };
      break;
    }

    /* volatility breakout */
    case "BREAKOUT": {
      const bb = pick(BB);
      const atr = pick(ATR);

      rules = [
        `PRICE > BB_UPPER(${bb.period},${bb.dev})`,
        `ATR(${atr}) RISING`
      ];

      params = { ...bb, atr };
      break;
    }

    /* SMA crossover */
    case "SMA_CROSS": {
      const fast = pick(SMA);
      const slow = pick(SMA.filter(x => x > fast));

      rules = [
        `SMA(${fast}) > SMA(${slow})`
      ];

      params = { fast, slow };
      break;
    }
  }

  return {
    id: uid(),
    type,
    rules,
    params
  };
}
