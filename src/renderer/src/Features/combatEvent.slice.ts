import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Bout,
  CombatEvent,
  CSBracket,
  CSMat,
  IKFEvent,
  MatRolesUpdate,
} from "../Models/event.model";
import { IKFParticipant } from "../Models/fighter.model";

const initialState: CombatEvent = {
  bouts: [],
  selectedEvent: {} as IKFEvent,
  selectedParticipantIds: [],
  participants: [],
  brackets: [],
  mats: [],
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
      console.log(state.participants);
      state.participants = partArr;
    },
    setMats(state, action: PayloadAction<CSMat[]>) {
      state.mats = action.payload;
    },
    updateMatRoles(state, action: PayloadAction<MatRolesUpdate>) {
      state.mats[action.payload.idx].roles = action.payload.roles;
    },
    addBracketToMat(state, action: PayloadAction<CSBracket>) {
      const { matNumber } = action.payload;
      state.mats[matNumber].brackets.push(action.payload);
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
  const participantsIds = state.combatEvent.selectedParticipantIds as number[];
  const retVal: IKFParticipant[] = [];
  participantsIds.map((pID) => {
    const item = participants.find((p) => p.participantId === pID);
    if (item) retVal.push(item);
  });
  return retVal;
};

export const SelectParticipantBracketCount = (state: any) => {
  const { selectedParticipantIds, mats } = state.combatEvent;

  const bracketCount: Record<number, number> = {};
  selectedParticipantIds.forEach((participantId: number) => {
    bracketCount[participantId] = 0;
  });
  mats.forEach((mat: CSMat) => {
    mat.brackets.forEach((bracket: CSBracket) => {
      bracket.competitors.forEach((competitor: { participantId: number }) => {
        if (selectedParticipantIds.includes(competitor.participantId)) {
          bracketCount[competitor.participantId]++;
        }
      });
    });
  });
  return bracketCount;
};

export const SelectAllParticipants = (state: any) => {
  return state.combatEvent.participants;
};

export const SelectAllBrackets = (state: any) => {
  return state.combatEvent.brackets;
};

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
  setSelectedEvent,
  setSelectedParticipantIds,
  setParticipants,
  setBrackets,
  setMats,
  updateMatRoles,
  addBracketToMat,
  setParticipantsBracketCount,
} = CombatEventSlice.actions;

export const { reducer } = CombatEventSlice;
