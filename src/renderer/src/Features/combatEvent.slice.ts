import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Bout, CombatEvent, SelectedEvent } from "../Models/event.model";

const initialState: CombatEvent = {
  bouts: [],
  selectedEvent: { eventID: -1, eventUID: "", eventName: "" },
};

export const CombatEventSlice = createSlice({
  name: "CombatEvent",
  initialState,
  reducers: {
    setSelectedEvent(state, action: PayloadAction<SelectedEvent>) {
      const { eventID, eventUID, eventName } = action.payload;
      state.selectedEvent = { eventID, eventUID, eventName };
    },

    addNewBout(state, action: PayloadAction<Bout>) {
      state.bouts = [...state.bouts, action.payload];
    },
  },
});
export const SelectAllBouts = (state: any) => state.combatEvent.bouts;
export const SelectSelectedEvent = (state: any) => {
  console.log(
    "SelectCombatEventName: ",
    state.combatEvent.selectedEvent.eventName
  );
  return state.combatEvent;
};

export const { addNewBout, setSelectedEvent } = CombatEventSlice.actions;

export const { reducer } = CombatEventSlice;
