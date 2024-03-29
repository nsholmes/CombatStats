import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BracketCompetitor, BracketEditState, CSBracket, CSBrackets } from "../Models";
import { mockBracket } from "../data/mock";

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
      state.selectedCompetitor = action.payload;
      // if (typeof (action.payload) === "string") {
      //   const elId = action.payload;
      //   const bracketId = elId.split("|")[0];
      //   const competitorId = parseInt(elId.split("|")[1]);
      //   console.log(`brakcetId: ${bracketId} | competitorId: ${competitorId}`);
      //   console.log();
      //   const selectedBracket = state.brackets.find(bracket => {
      //     return bracket.bracketId == parseInt(bracketId?.toString())
      //   });
      //   if (selectedBracket) {
      //     const competitor = selectedBracket.competitors.find(comp => comp.id === competitorId)
      //     if (competitor) {
      //       console.log(competitor)
      //       state.selectedCompetitor = competpaitor;
      //     }
      //   }
      // } else {
      //   state.selectedCompetitor = initialState.selectedCompetitor;
      // }
    },
    moveSelectedCompetitor(state, action: PayloadAction<string | null>) {
      const values = action.payload?.split("|");
      if (values) {
        const selectedBracketId = values[0];
        const selectedCompetitorId = values[1];
        const destinationBracketId = values[2];

        const selectedBracket = state.brackets.find((bracket) => {
          if (bracket.bracketId.toString() == selectedBracketId) {
            console.log("GOT A HIT: ", bracket.bracketClassName);
          }
          return bracket.bracketId.toString() == selectedBracketId
        });
        const selectedCompetitor = selectedBracket?.competitors.find((competitor) => {
          if (competitor.id.toString() == selectedCompetitorId) {
            console.log("Competitor has been Found: ", competitor.person.first_name)
          }
          return competitor.id.toString() == selectedCompetitorId;
        });

        state.brackets.find((bracket) => {
          if (bracket.bracketId.toString() === destinationBracketId) {
            // insert selected competitor to the competitors array
            state.brackets.find((bracket) => {
              if (bracket.bracketId.toString() == destinationBracketId && selectedCompetitor) {
                console.log(`Destination Bracket: ${bracket.bracketId}`)
                bracket.competitors.push(selectedCompetitor);
              }
            });
          }

          return bracket.bracketId.toString() === destinationBracketId
        });

        state.brackets.find((bracket) => {
          if (bracket.bracketId.toString() === selectedBracketId) {
            // remove competitor from selected bracket
            bracket.competitors.map((competitor, idx) => {
              if (competitor.id.toString() === selectedCompetitorId && selectedCompetitor) {
                console.log(`bracket.bracketId: ${bracket.bracketId}`);
                console.log(`${competitor.person.first_name}: ${idx}`);
                const removedCompetitor = bracket.competitors.splice(idx, 1);
                console.log("Removed Competitor: ", removedCompetitor[0].person.full_name);
              }
            })
          }
        });

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
export const SelectedCompetitorSelector = (state: any): string | null => {
  return state.CSBracket.selectedCompetitor;
}
export const SelectBracketsByRing = (state: any) => {
  const brackets = state.CSBracket.brackets;
  brackets.map((bracket: any) => {
    const ringArr = [];
    // const ringBracket = bracket.competitors.filter(comp => comp)

  })
}

export const { setCBBrackets, setBracketEditState, setSelectedBracketCompetitor, moveSelectedCompetitor } = CSBracketSlice.actions;

export const { reducer } = CSBracketSlice;