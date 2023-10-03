import { Bout } from "./event.model";

export type CreateEventProps = {
  getCombatEventName: string;
  setEventName: (eventName: string) => void;
  addBout: (bout: Bout) => void;
  getAllBouts: Bout[];
}