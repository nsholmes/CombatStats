import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedParticipantIds: [] as number[],
};

export const MatchingSlice = createSlice({
  name: "Matching",
  initialState,
  reducers: {
    setSelectedParticipants(state, action: PayloadAction<number[]>) {
      // Set the selected participants
      state.selectedParticipantIds = action.payload;
    },
    addSelectedParticipant(state, action: PayloadAction<number>) {
      // Add a participant to the selected list
      state.selectedParticipantIds.push(action.payload);
    },
    removeSelectedParticipant(state, action: PayloadAction<number>) {
      // Remove a participant from the selected list
      state.selectedParticipantIds = state.selectedParticipantIds.filter(
        (p) => p !== action.payload
      );
    },
  },
});

export const SelectSelectedParticipants = (state: any) => {
  return state.Matching.selectedParticipantIds;
};

export const {
  setSelectedParticipants,
  addSelectedParticipant,
  removeSelectedParticipant,
} = MatchingSlice.actions;

export const { reducer } = MatchingSlice;
