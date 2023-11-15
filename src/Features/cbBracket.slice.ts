import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CSBracket, CSBrackets } from "../Models";

const initialState: CSBrackets = { brackets: [] };

export const CSBracketSlice = createSlice({
  name: "CSBracket",
  initialState,
  reducers: {
    setCBBrackets(state, action: PayloadAction<any[]>) {
      state.brackets = action.payload;
    }
  }
});

export const SelectAllCSBrackets = (state: any) => state.CSBracket.brackets;
export const SelectBracketCompetitors = (state: any) => {
  const competitors = state.CSBracket.brackets.map((bracket: CSBracket) => bracket.competitors);
  return competitors.flat();
}
export const SelectBracketsByRing = (state: any) => {
  const brackets = state.CSBracket.brackets;
  const bracketsByRing = [];
  brackets.map((bracket: any) => {
    const ringArr = [];
    // const ringBracket = bracket.competitors.filter(comp => comp)

  })
}

export const { setCBBrackets } = CSBracketSlice.actions;

export const { reducer } = CSBracketSlice;