import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Bout, CombatEvent } from "../Models/event.model";

const initialState: CombatEvent = {
  eventName: "",
  bouts: []
};

export const CombatEventSlice = createSlice({
  name: "CombatEvent",
  initialState,
  reducers: {
    setEventName(state, action: PayloadAction<string>) {
      console.log("CombatEvent.setEventName: ", action.payload);
      state.eventName = action.payload;
    },
    addNewBout(state, action: PayloadAction<Bout>) {
      state.bouts = [...state.bouts, action.payload];
    }
  },
});
export const SelectAllBouts = (state: any) => state.combatEvent.bouts;
export const SelectCombatEventName = (state: any) => {
  console.log("SelectCombatEventName: ", state.combatEvent)
  return state.combatEvent.eventName;
}

export const {
  setEventName,
  addNewBout,
} = CombatEventSlice.actions;

export const { reducer } = CombatEventSlice;
