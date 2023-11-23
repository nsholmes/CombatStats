import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BracketCompetitor, BracketEditState, CSBracket, CSBrackets } from "../Models";

const initialState: CSBrackets = { brackets: [], editState: "off", selectedCompetitor: null };

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
      if (typeof (action.payload) === "string") {
        const elId = action.payload;
        const bracketId = elId.split("|")[0];
        const competitorId = parseInt(elId.split("|")[1]);
        console.log(`brakcetId: ${bracketId} | competitorId: ${competitorId}`);
        console.log();
        const selectedBracket = state.brackets.find(bracket => {
          console.log(bracket);
          return bracket.bracketId == parseInt(bracketId?.toString())
        });
        if (selectedBracket) {
          const competitor = selectedBracket.competitors.find(comp => comp.id === competitorId)
          if (competitor) {
            console.log(competitor)
            state.selectedCompetitor = competitor;
          }
        }
      }
    }
  }
});

export const SelectAllCSBrackets = (state: any) => state.CSBracket.brackets;
export const SelectBracketCompetitors = (state: any) => {
  const competitors = state.CSBracket.brackets.map((bracket: CSBracket) => bracket.competitors);
  return competitors.flat();
}
export const SelectBracketCompetitorsById = (state: any, bracketId: number) => {
  console.log(state.CSBracket.brackets.filter((bracket: CSBracket) => bracket.competitors.find(compt => compt.bracket.id == bracketId)))
}
export const SelectBracketEditState = (state: any): BracketEditState => {
  return state.CSBracket.editState
}

export const SelectBracketsByRing = (state: any) => {
  const brackets = state.CSBracket.brackets;
  brackets.map((bracket: any) => {
    const ringArr = [];
    // const ringBracket = bracket.competitors.filter(comp => comp)

  })
}

export const { setCBBrackets, setBracketEditState, setSelectedBracketCompetitor } = CSBracketSlice.actions;

export const { reducer } = CSBracketSlice;