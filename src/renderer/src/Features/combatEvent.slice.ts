import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Bout, CombatEvent, IKFEvent } from "../Models/event.model";
import { IKFParticipant } from "../Models/fighter.model";

const initialState: CombatEvent = {
  bouts: [],
  selectedEvent: {} as IKFEvent,
  selectedParticipantIds: [],
  participants: [],
  brackets: [],
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
    setParticipants(state, action: PayloadAction<any[]>) {
      state.participants = action.payload;
    },
    setBrackets(state, action: PayloadAction<any[]>) {
      state.brackets = action.payload;
    },
    setSelectedParticipantIds(state, action: PayloadAction<number[]>) {
      // Set the selected participants
      state.selectedParticipantIds = action.payload;
    },
  },
});
export const SelectAllBouts = (state: any) => state.combatEvent.bouts;
export const SelectSelectedEvent = (state: any) => {
  return state.combatEvent.selectedEvent;
};
export const SelectSelectedParticipants = (state: any) => {
  return state.combatEvent.selectedParticipantIds;
};
export const SelectParticipantsByIds = (state: any) => {
  const participants = state.combatEvent.participants as IKFParticipant[];
  const participantsIds = state.combatEvent.selectedParticipantIds;
  return participants.filter((p) => participantsIds.includes(p.participantId));
};

export const SelectAllParticipants = (state: any) => {
  return state.combatEvent.participants;
};

export const SelectAllBrackets = (state: any) => {
  return state.brackets;
};

export const {
  addNewBout,
  setSelectedEvent,
  setSelectedParticipantIds,
  setParticipants,
  setBrackets,
} = CombatEventSlice.actions;

export const { reducer } = CombatEventSlice;
