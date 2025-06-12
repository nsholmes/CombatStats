import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IKFEvent } from "../Models";

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
