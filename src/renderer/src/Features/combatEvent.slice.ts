import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Bout,
  CombatEvent,
  IKFEvent,
  SelectedEvent,
} from "../Models/event.model";

const initialState: CombatEvent = {
  bouts: [],
  selectedEvent: {} as CombatEvent["selectedEvent"],
};

export const CombatEventSlice = createSlice({
  name: "CombatEvent",
  initialState,
  reducers: {
    setSelectedEvent(state, action: PayloadAction<IKFEvent>) {
      state.selectedEvent = action.payload;
    },

    addNewBout(state, action: PayloadAction<Bout>) {
      state.bouts = [...state.bouts, action.payload];
    },
  },
});
export const SelectAllBouts = (state: any) => state.combatEvent.bouts;
export const SelectSelectedEvent = (state: any) => {
  console.log("Selected Event: ", state.combatEvent.selectedEvent);
  return state.combatEvent;
};

export const { addNewBout, setSelectedEvent } = CombatEventSlice.actions;

export const { reducer } = CombatEventSlice;
