import { configureStore, Tuple } from "@reduxjs/toolkit";
import { createLogicMiddleware } from "redux-logic";
import { CSBracketSlice } from "./Features/cbBracket.slice";
import combatEventLogic from "./Features/combatEvent.logic";
import { CombatEventSlice } from "./Features/combatEvent.slice";
import { ContextMenuSlice } from "./Features/contextMenu.slice";
import eventsLogic from "./Features/events.logic";
import { EventsSlice } from "./Features/events.slice";
import fileUploadLogic from "./Features/fileUpload.logic";
import { ModalsSlice } from "./Features/modal.slice";

const fileUploadMiddleware = createLogicMiddleware(fileUploadLogic);
const eventsMiddleware = createLogicMiddleware(eventsLogic);
const combatEventMiddleware = createLogicMiddleware(combatEventLogic);

export const store = configureStore({
  reducer: {
    combatEvent: CombatEventSlice.reducer,
    CSBracket: CSBracketSlice.reducer,
    ContextMenu: ContextMenuSlice.reducer,
    IKFEvents: EventsSlice.reducer,
    Modals: ModalsSlice.reducer,
  },
  middleware: () =>
    new Tuple(fileUploadMiddleware, eventsMiddleware, combatEventMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
