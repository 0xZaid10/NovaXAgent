import {
  EMA,
  SMA,
  RSI,
  MACD,
  BollingerBands,
  ATR
} from "./index"

const store = new Map<string, any>()

export function calcIndicators(
  candle:any,
  cfg:any
){

  const key = `${candle.pair}_${candle.timeframe}`

  if(!store.has(key)) store.set(key, {})

  const s = store.get(key)
  const out:any = {}

  /* EMA */
  if(cfg.ema){
    cfg.ema.forEach((p:number)=>{
      s[`ema${p}`] ||= []
      s[`ema${p}`].push(candle.close)
      out[`ema${p}`] = EMA(s[`ema${p}`], p)
    })
  }

  /* SMA */
  if(cfg.sma){
    cfg.sma.forEach((p:number)=>{
      s[`sma${p}`] ||= []
      s[`sma${p}`].push(candle.close)
      out[`sma${p}`] = SMA(s[`sma${p}`], p)
    })
  }

  /* RSI */
  if(cfg.rsi){
    cfg.rsi.forEach((p:number)=>{
      s[`rsi${p}`] ||= []
      s[`rsi${p}`].push(candle.close)
      out[`rsi${p}`] = RSI(s[`rsi${p}`], p)
    })
  }

  /* ATR */
  if(cfg.atr){
    cfg.atr.forEach((p:number)=>{
      s[`atr${p}`] ||= []
      s[`atr${p}`].push(candle)
      out[`atr${p}`] = ATR(s[`atr${p}`], p)
    })
  }

  /* MACD */
  if(cfg.macd){
    cfg.macd.forEach((m:any)=>{
      const k = `macd_${m.fast}_${m.slow}_${m.signal}`
      s[k] ||= []
      s[k].push(candle.close)
      out[k] = MACD(
        s[k],
        m.fast,
        m.slow,
        m.signal
      )
    })
  }

  /* BOLLINGER */
  if(cfg.bb){
    cfg.bb.forEach((b:any)=>{
      const k = `bb_${b.period}_${b.dev}`
      s[k] ||= []
      s[k].push(candle.close)
      out[k] = BollingerBands(
        s[k],
        b.period,
        b.dev
      )
    })
  }

  return out
}
