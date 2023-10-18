import { configureStore } from "@reduxjs/toolkit";
import { CombatEventSlice } from "./Features/combatEvent.slice";
import { createLogicMiddleware } from "redux-logic";
import fileUploadLogic from "./Features/fileUpload.logic";

const fileUploadMiddleware = createLogicMiddleware(fileUploadLogic);

export const store = configureStore({
  reducer: {
    combatEvent: CombatEventSlice.reducer,
  },
  middleware: [fileUploadMiddleware]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;