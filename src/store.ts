import { configureStore } from "@reduxjs/toolkit";
import { CombatEventSlice } from "./Features/combatEvent.slice";

export const store = configureStore({
  reducer: {
    combatEvent: CombatEventSlice.reducer,
  },
  middleware: []
});