import { IKFEvent } from "@nsholmes/combat-stats-types/event.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EventSliceState = {
  events: IKFEvent[];
};

const initialState: EventSliceState = {
  events: [],
};
export const EventsSlice = createSlice({
  name: "IKFEvents",
  initialState,
  reducers: {
    setIKFEvents(state, action: PayloadAction<IKFEvent[]>) {
      state.events = action.payload;
    },
  },
});

export const SelectAllEvents = (state: any) => {
  return state.IKFEvents.events;
};

export const { setIKFEvents } = EventsSlice.actions;
export const { reducer } = EventsSlice;
