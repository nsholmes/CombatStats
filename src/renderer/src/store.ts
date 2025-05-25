import { configureStore } from "@reduxjs/toolkit";
import { CombatEventSlice } from "./Features/combatEvent.slice";
import { createLogicMiddleware } from "redux-logic";
import fileUploadLogic from "./Features/fileUpload.logic";
import { CSBracketSlice } from "./Features/cbBracket.slice";
import { ContextMenuSlice } from "./Features/contextMenu.slice";
import eventsLogic from "./Features/events.logic";
import { EventsSlice } from "./Features/events.slice";

const fileUploadMiddleware = createLogicMiddleware(fileUploadLogic);
const eventsMiddleware = createLogicMiddleware(eventsLogic);

export const store = configureStore({
  reducer: {
    combatEvent: CombatEventSlice.reducer,
    CSBracket: CSBracketSlice.reducer,
    ContextMenu: ContextMenuSlice.reducer,
    IKFEvents: EventsSlice.reducer,
  },
  middleware: [fileUploadMiddleware, eventsMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
