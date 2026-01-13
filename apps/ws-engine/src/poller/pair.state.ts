export type PairState =
  | "STRATEGY_RUNNING"
  | "POSITION_OPEN";

const pairStates = new Map<string, PairState>();

export function setPairState(pair: string, state: PairState) {
  console.log("STATE SET:", pair, state); 
  pairStates.set(pair, state);
}

export function removePair(pair: string) {
  console.log("STATE REMOVE:", pair);
  pairStates.delete(pair);
}

export function getPairStates() {
  return pairStates;
}
