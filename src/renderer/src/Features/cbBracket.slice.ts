import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  BracketEditState,
  CSBracket,
  CSBrackets,
} from "@nsholmes/combat-stats-types/event.model";

const initialState: CSBrackets = {
  brackets: [],
  editState: "off",
  selectedCompetitor: null,
};

export const CSBracketSlice = createSlice({
  name: "CSBracket",
  initialState,
  reducers: {
    setCBBrackets(state, action: PayloadAction<any[]>) {
      state.brackets = action.payload;
    },
    setBracketEditState(state, action: PayloadAction<BracketEditState>) {
      state.editState = action.payload;
    },
    setSelectedBracketCompetitor(state, action: PayloadAction<string | null>) {
      state.selectedCompetitor = action.payload;
    },
    moveSelectedCompetitor(state, action: PayloadAction<string | null>) {
      const values = action.payload?.split("|");
      if (values) {
        const selectedBracketId = values[0];
        const selectedCompetitorId = values[1];
        const destinationBracketId = values[2];

        const selectedBracket = state.brackets.find((bracket) => {
          if (bracket.bracketId.toString() == selectedBracketId) {
            console.log("GOT A HIT: ", bracket.bracketDivisionName);
          }
          return bracket.bracketId.toString() == selectedBracketId;
        });
        const selectedCompetitor = selectedBracket?.competitors.find(
          (competitor) => {
            if (competitor.participantId.toString() == selectedCompetitorId) {
              console.log("Competitor has been Found: ", competitor.firstName);
            }
            return competitor.participantId.toString() == selectedCompetitorId;
          }
        );

        state.brackets.find((bracket) => {
          if (bracket.bracketId.toString() === destinationBracketId) {
            // insert selected competitor to the competitors array
            state.brackets.find((bracket) => {
              if (
                bracket.bracketId.toString() == destinationBracketId &&
                selectedCompetitor
              ) {
                console.log(`Destination Bracket: ${bracket.bracketId}`);
                bracket.competitors.push(selectedCompetitor);
              }
            });
          }

          return bracket.bracketId.toString() === destinationBracketId;
        });

        state.brackets.find((bracket) => {
          if (bracket.bracketId.toString() === selectedBracketId) {
            // remove competitor from selected bracket
            bracket.competitors.map((competitor, idx) => {
              if (
                competitor.participantId.toString() === selectedCompetitorId &&
                selectedCompetitor
              ) {
                console.log(`bracket.bracketId: ${bracket.bracketId}`);
                console.log(`${competitor.firstName}: ${idx}`);
                const removedCompetitor = bracket.competitors.splice(idx, 1);
                console.log(
                  "Removed Competitor: ",
                  `${removedCompetitor[0].firstName} ${removedCompetitor[0].lastName}`
                );
              }
            });
          }
        });
      }
    },
  },
});

export const SelectAllCSBrackets = (state: any) => state.brackets;
export const SelectBracketCompetitors = (state: any) => {
  const competitors = state.CSBracket.brackets.map(
    (bracket: CSBracket) => bracket.competitors
  );
  return competitors.flat();
};

export const SelectBracketEditState = (state: any): BracketEditState => {
  return state.CSBracket.editState;
};
export const SelectedCompetitorSelector = (state: any): string | null => {
  return state.CSBracket.selectedCompetitor;
};
export const SelectBracketsByRing = (state: any) => {
  const brackets = state.CSBracket.brackets;
  brackets.map((bracket: any) => {
    console.log(bracket.ringNumber);
    // const ringArr = [];
    // const ringBracket = bracket.competitors.filter(comp => comp)
  });
};

export const {
  setCBBrackets,
  setBracketEditState,
  setSelectedBracketCompetitor,
  moveSelectedCompetitor,
} = CSBracketSlice.actions;

export const { reducer } = CSBracketSlice;
