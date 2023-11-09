import { configureStore } from "@reduxjs/toolkit";
import { CombatEventSlice } from "./Features/combatEvent.slice";
import { createLogicMiddleware } from "redux-logic";
import fileUploadLogic from "./Features/fileUpload.logic";
import { CSBracketSlice } from "./Features/cbBracket.slice";

const fileUploadMiddleware = createLogicMiddleware(fileUploadLogic);

export const store = configureStore({
  reducer: {
    combatEvent: CombatEventSlice.reducer,
    CSBracket: CSBracketSlice.reducer
  },
  middleware: [fileUploadMiddleware]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;