import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CombatEvent,
  CSBout,
  CSBracket,
  CSMat,
  IKFEvent,
  MatRolesUpdate,
} from "../Models/event.model";
import { IKFParticipant } from "../Models/fighter.model";
import { createBracketBouts } from "./utils/EventBouts";

const initialState: CombatEvent = {
  bouts: [],
  selectedEvent: {} as IKFEvent,
  selectedParticipantIds: [],
  participants: [],
  brackets: [],
  mats: [
    {
      id: 0,
      name: "Mat 1",
      roles: {
        referee: "",
        judges: [],
        timekeeper: "",
      },
    },
    {
      id: 1,
      name: "Mat 2",
      roles: {
        referee: "",
        judges: [],
        timekeeper: "",
      },
    },
  ],
};

export const CombatEventSlice = createSlice({
  name: "CombatEvent",
  initialState,
  reducers: {
    setSelectedEvent(state, action: PayloadAction<IKFEvent>) {
      state.selectedEvent = action.payload;
    },
    addNewBout(state, action: PayloadAction<CSBout>) {
      state.bouts = [...state.bouts, action.payload];
    },
    setBouts(state, action: PayloadAction<CSBracket[]>) {
      // Set the bouts for the event
      state.bouts = createBracketBouts(action.payload);
    },
    setParticipants(state, action: PayloadAction<any[]>) {
      state.participants = action.payload;
    },
    setBrackets(state, action: PayloadAction<any[]>) {
      console.log("combatEvent.Slice: ", action.payload);
      state.brackets = action.payload;
    },
    setSelectedParticipantIds(state, action: PayloadAction<number[]>) {
      // Set the selected participants
      state.selectedParticipantIds = action.payload;
    },
    setParticipantsBracketCount(state, action: PayloadAction<number[]>) {
      console.log(action.payload);
      const partArr: IKFParticipant[] = [];
      state.participants.map((participant) => {
        if (action.payload.includes(participant.participantId)) {
          participant.bracketCount = (participant.bracketCount || 0) + 1;
        }
        partArr.push(participant);
      });
      state.participants = partArr;
    },
    setMats(state, action: PayloadAction<CSMat[]>) {
      state.mats = action.payload;
    },
    updateMatRoles(state, action: PayloadAction<MatRolesUpdate>) {
      state.mats[action.payload.idx].roles = action.payload.roles;
    },
    addBracketToMat(state, action: PayloadAction<CSBracket>) {
      const matId = action.payload.matNumber;
      const sequence = state.brackets.filter(
        (b) => b.matNumber === matId
      ).length;
      state.brackets.push({
        ...action.payload,
        bracketId: `${state.selectedEvent.id}-${state.brackets.length}`,
        sequence,
      });
    },
    /**
     * Updates the sequence number for a specific bracket.
     * @param state - The current state of the combat event.
     * @param action - The action containing the bracket ID and new sequence number.
     */
    updateBracketSequence(state, action: PayloadAction<CSBracket[]>) {
      // const { bracketId, sequence } = action.payload;
      action.payload.map((bracket, idx) => {
        const bracketIndex = state.brackets.findIndex(
          (stateBracket) => bracket.bracketId === stateBracket.bracketId
        );
        state.brackets[bracketIndex].sequence = idx;
      });
    },
    /**
     * Updates the mat number for a specific bracket.
     * @param state - The current state of the combat event.
     * @param action - The action containing the bracket ID and new mat number.
     */
    updateBracketMatNumber(
      state,
      action: PayloadAction<{ bracketId: number; matNumber: number }>
    ) {
      const { bracketId, matNumber } = action.payload;
      const bracketIndex = state.brackets.findIndex(
        (bracket) => bracket.bracketId === bracketId
      );
      if (bracketIndex !== -1) {
        state.brackets[bracketIndex].matNumber = matNumber;
      }
    },
  },
});
export const SelectAllBouts = (state: any) => state.combatEvent.bouts;
export const SelectSelectedEvent = (state: any) =>
  state.combatEvent.selectedEvent;
export const SelectSelectedParticipants = (state: any) => {
  return state.combatEvent.selectedParticipantIds;
};
export const SelectParticipantsByIds = (state: any) => {
  const participants = state.combatEvent.participants as IKFParticipant[];
  const participantsIds = state.combatEvent.selectedParticipantIds as number[];
  const retVal: IKFParticipant[] = [];
  participantsIds.map((pID) => {
    const item = participants.find((p) => p.participantId === pID);
    if (item) retVal.push(item);
  });
  return retVal;
};

export const SelectParticipantBracketCount = (state: any) => {
  const { selectedParticipantIds, mats, brackets } = state.combatEvent;
  void mats;
  const bracketCount: Record<number, number> = {};
  selectedParticipantIds.forEach((participantId: number) => {
    bracketCount[participantId] = 0;
  });

  brackets.forEach((bracket: CSBracket) => {
    bracket.competitors.forEach((competitor: { participantId: number }) => {
      if (selectedParticipantIds.includes(competitor.participantId)) {
        bracketCount[competitor.participantId]++;
      }
    });
  });
  return bracketCount;
};

export const SelectAllParticipants = (state: any) => {
  return state.combatEvent.participants;
};

export const SelectAllBrackets = (state: any) => state.combatEvent.brackets;

export const SelectMats = (state: any) => {
  return state.combatEvent.mats;
};

export const SelectMatCount = (state: any) => {
  return state.combatEvent.mats.length;
};

export const SelectCombatEventState = (state: any) => {
  return state.combatEvent;
};
export const {
  addNewBout,
  setBouts,
  setSelectedEvent,
  setSelectedParticipantIds,
  setParticipants,
  setBrackets,
  setMats,
  updateMatRoles,
  addBracketToMat,
  setParticipantsBracketCount,
  updateBracketMatNumber,
  updateBracketSequence,
} = CombatEventSlice.actions;

export const { reducer } = CombatEventSlice;
