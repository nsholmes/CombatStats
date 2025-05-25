import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IKFEvent } from "../Models";
import { EventBracket } from "../Models/bracket.model";
import { IKFParticipant } from "../Models/fighter.model";

type EventSliceState = {
  events: IKFEvent[];
  participants: IKFParticipant[];
  brackets: EventBracket[];
};

const initialState: EventSliceState = {
  events: [],
  participants: [],
  brackets: [],
};
export const EventsSlice = createSlice({
  name: "IKFEvents",
  initialState,
  reducers: {
    setIKFEvents(state, action: PayloadAction<IKFEvent[]>) {
      state.events = action.payload;
    },
    setIKFEventParticipants(state, action: PayloadAction<any[]>) {
      state.participants = action.payload;
    },
    setIKFEventBrackets(state, action: PayloadAction<any[]>) {
      state.brackets = action.payload;
    },
  },
});

export const SelectAllEvents = (state: any) => {
  return state.IKFEvents.events;
};
export const SelectAllParticipants = (state: any) => {
  return state.IKFEvents.participants;
};
export const SelectAllBrackets = (state: any) => {
  return state.IKFEvents.brackets;
};

export const { setIKFEvents, setIKFEventParticipants, setIKFEventBrackets } =
  EventsSlice.actions;
export const { reducer } = EventsSlice;
