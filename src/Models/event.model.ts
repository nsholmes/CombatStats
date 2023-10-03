export type CombatEvent = {
  eventName: string;
  bouts: Bout[];
}
export type Fighter = { firstName: string; lastName: string }
export type Bout = { blueCorner: Fighter, redCorner: Fighter }
