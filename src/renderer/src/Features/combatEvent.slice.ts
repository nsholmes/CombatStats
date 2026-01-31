import {
  CombatEvent,
  CSBout,
  CSBoutState,
  CSBracket,
  CSMat,
  IKFEvent,
  MatRolesUpdate,
} from "@nsholmes/combat-stats-types/event.model";
import { IKFParticipant } from "@nsholmes/combat-stats-types/fighter.model";
import { EventMatDisplayProps } from "@nsholmes/combat-stats-types/props.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ref, set } from "firebase/database";
import { ikfpkbDB } from "../FirebaseConfig";
import { createBracketBouts } from "./utils/EventBouts";

export const initialState: CombatEvent = {
  bouts: [],
  selectedEvent: {} as IKFEvent,
  selectedParticipantIds: [],
  selectedBracketId: -1,
  participants: [],
  brackets: [],
  mats: [
    {
      id: 0,
      name: "Mat 1",
      roles: {
        referee: " ",
        judges: [" "],
        timekeeper: " ",
      },
      currentBoutId: null,
      onDeckBoutId: null,
      inHoleBoutId: null,
    },
    {
      id: 1,
      name: "Mat 2",
      roles: {
        referee: " ",
        judges: [],
        timekeeper: " ",
      },
      currentBoutId: null,
      onDeckBoutId: null,
      inHoleBoutId: null,
    },
  ],
  bracketOrderComitted: false,
};

export const CombatEventSlice = createSlice({
  name: "CombatEvent",
  initialState,
  reducers: {
    hydrateCombatEvent(state, action: PayloadAction<CombatEvent>) {
      // Hydrate the combat event state with the provided data
      const {
        bouts,
        selectedEvent,
        selectedParticipantIds,
        participants,
        brackets,
        mats,
      } = action.payload;
      state.bouts = bouts ? bouts : [];
      state.selectedEvent = selectedEvent;
      state.selectedParticipantIds = selectedParticipantIds
        ? selectedParticipantIds
        : [];
      state.participants = participants ? participants : [];
      state.brackets = brackets ? brackets : [];
      state.mats = mats ? mats : [];

      const db = ikfpkbDB();
      try {        
        set(ref(db, "combatEvent"), state)
          .then(() => {
            console.log(
              "CombatEvent data successfully written to database. Show in Success Snack Bar"
            );
          })
          .catch((error) => {
            console.log("Error writing CombatEvent data to database:", error);
          });
      } catch (error) {
        console.error("Error hydrating combat event state:", error);
      }
    },
    setSelectedEvent(state, action: PayloadAction<IKFEvent>) {
      state.selectedEvent = action.payload;
    },
    addNewBout(state, action: PayloadAction<CSBout>) {
      state.bouts = [...state.bouts, action.payload];
    },
    setBoutsFromDB(state, action: PayloadAction<CSBout[]>) {
      state.bouts = action.payload;
    },
    setBouts(state, action: PayloadAction<CSBracket[]>) {
      // Set the bouts for the event
      createBracketBouts(action.payload).then((bouts) => {
        state.bouts = bouts;
      });
    },
    setParticipants(state, action: PayloadAction<any[]>) {
      state.participants = action.payload;
      const db = ikfpkbDB();
      set(ref(db, "combatEvent/participants"), state.participants).then(() => {
        console.log(
          "CombatEvent participants successfully written to database. Show in Success Snack Bar"
        );
      });
    },
    updateParticipantWeight(
      state,
      action: PayloadAction<{
        weight: number;
        participantId: number;
        isCheckedIn?: boolean;
      }>
    ) {
      const { weight, participantId, isCheckedIn } = action.payload;
      const idx = state.participants.findIndex(
        (p) => p.participantId === participantId
      );
      state.participants[idx].weight = weight;
      state.participants[idx].checkedIn = isCheckedIn ?? false; // Default to false if not provided
    },
    setBrackets(state, action: PayloadAction<any[]>) {
      console.log("combatEvent.Slice: ", action.payload);
      state.brackets = action.payload;
    },
    setSelectedBracketId(state, action: PayloadAction<number>) {
      state.selectedBracketId = action.payload;
      const compsIds = state.selectedParticipantIds;
      console.log(compsIds);
      compsIds.map((c) => {
        const compId = state.participants.find(
          (p) => p.participantId == c
        )!.participantId;
        state.selectedParticipantIds.push(compId);
      });
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
    updateMatBouts(state, action: PayloadAction<EventMatDisplayProps>) {
      state.mats[action.payload.matId].currentBoutId =
        action.payload.currentBoutId;
      state.mats[action.payload.matId].onDeckBoutId =
        action.payload.onDeckBoutId;
      state.mats[action.payload.matId].inHoleBoutId =
        action.payload.inHoleBoutId;
      state.bouts.map((bout) => {
        if (bout.boutId === action.payload.currentBoutId) {
          bout.status.state = "inProgress";
          bout.matId = action.payload.matId;
        } else if (bout.boutId === action.payload.onDeckBoutId) {
          bout.status.state = "onDeck";
          bout.matId = action.payload.matId;
        } else if (bout.boutId === action.payload.inHoleBoutId) {
          bout.status.state = "inHole";
          bout.matId = action.payload.matId;
        }
      });
    },
    updateMatRoles(state, action: PayloadAction<MatRolesUpdate>) {
      state.mats[action.payload.idx].roles = action.payload.roles;
    },
    addBracket(state, action: PayloadAction<CSBracket>) {
      state.brackets.push({
        ...action.payload,
      });
    },
    updateBracketOrder(state, action: PayloadAction<CSBracket[]>) {
      state.brackets = action.payload;
    },
    /**
     * Updates the sequence number for a specific bracket.
     * @param state - The current state of the combat event.
     * @param action - The action containing the bracket ID and new sequence number.
     */
    updateBracketSequence(state, action: PayloadAction<CSBracket[]>) {
      action.payload.map((bracket, idx) => {
        const bracketIndex = state.brackets.findIndex(
          (stateBracket) => bracket.bracketId === stateBracket.bracketId
        );
        state.brackets[bracketIndex].sequence = idx;
      });
    },
    resetCombatEvent(state) {
      void state;
      // Reset the combat event state to initial state
      state = initialState;
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
      void state;
      const { bracketId, matNumber } = action.payload;
      const bracketIndex = state.brackets.findIndex(
        (bracket) => bracket.bracketId === bracketId
      );
      if (bracketIndex !== -1) {
        state.brackets[bracketIndex].matNumber = matNumber;
      }
    },
    updateCombatEvent(state, action: PayloadAction<CombatEvent>) {
      void state;
      state = action.payload;
    },
    updateBoutStatus(
      state,
      action: PayloadAction<{ boutId: string; status: CSBoutState }>
    ) {
      const { boutId, status } = action.payload;
      const boutIndex = state.bouts.findIndex(
        (bout) => bout.boutId === boutId
      );
      if (boutIndex !== -1) {
        state.bouts[boutIndex].status.state = status;
      }
    },
    approveBoutResults(state, action: PayloadAction<{ boutId: string }>) {
      const { boutId } = action.payload;
      const boutIndex = state.bouts.findIndex(
        (bout) => bout.boutId === boutId
      );
      if (boutIndex !== -1) {
        state.bouts[boutIndex].isResultApproved = true;
      }
    },
  },
});
export const SelectAllBouts = (state: any) => state.combatEvent.bouts;
export const SelectSelectedEvent = (state: any) =>
  state.combatEvent.selectedEvent;
export const SelectSelectedParticipants = (state: any) => {
  return state.combatEvent.selectedParticipantIds
    ? state.combatEvent.selectedParticipantIds
    : [];
};
export const SelectParticipantsByIds = (state: any) => {
  const participants = state.combatEvent.participants as IKFParticipant[];
  const participantsIds = state.combatEvent.selectedParticipantIds as number[];

  const retVal: IKFParticipant[] = [];
  participantsIds.map((pID) => {
    console.log("SelectParticipantsByIds: ", pID);
    const item = participants.find((p) => {
      if (pID === p.participantId) {
        console.log("found participant: ", p);
      }
      return p.participantId == pID;
    });
    console.log("item: ", item);
    if (item) retVal.push(item);
  });

  console.log("SelectParticipantsByIds: ", participantsIds);
  return retVal;
};

export const SelectBracketBySelectedId = (state: any) => {
  return state.combatEvent.brackets !== undefined
    ? state.combatEvent.brackets?.find(
        (bracket: CSBracket) =>
          bracket.bracketId == state.combatEvent.selectedBracketId
      )
    : null;
};
export const SelectSelectedBracketParticipants = (state: any) => {
  return state.combatEvent.brackets !== undefined
    ? state.combatEvent.brackets.find(
        (bracket: CSBracket) =>
          bracket.bracketId == state.combatEvent.selectedBracketId
      )?.competitors
    : [];
};

export const SelectAllParticipants = (state: any) => {
  return state.combatEvent.participants ? state.combatEvent.participants : [];
};

export const SelectAllBrackets = (state: any) => {
  return state.combatEvent.brackets ? state.combatEvent.brackets : [];
};

export const SelectMats = (state: any) => {
  return state.combatEvent.mats ? state.combatEvent.mats : [];
};

export const SelectMatCount = (state: any) => {
  return state.combatEvent.mats ? state.combatEvent.mats.length : 0;
};

export const SelectCombatEventState = (state: any) => {
  return state.combatEvent;
};
export const {
  addNewBout,
  setBouts,
  setSelectedEvent,
  setSelectedBracketId,
  setSelectedParticipantIds,
  updateParticipantWeight,
  setParticipants,
  setBrackets,
  setMats,
  updateMatBouts,
  updateMatRoles,
  addBracket,
  setParticipantsBracketCount,
  updateBracketMatNumber,
  updateBracketSequence,
  updateBracketOrder,
  hydrateCombatEvent,
  resetCombatEvent,
  setBoutsFromDB,
  updateBoutStatus,
  updateCombatEvent,
  approveBoutResults,
} = CombatEventSlice.actions;

export const { reducer } = CombatEventSlice;
