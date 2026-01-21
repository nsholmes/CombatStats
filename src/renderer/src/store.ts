import { configureStore, Tuple } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { createLogicMiddleware } from "redux-logic";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { CSBracketSlice } from "./Features/cbBracket.slice";
import combatEventLogic from "./Features/combatEvent.logic";
import { CombatEventSlice } from "./Features/combatEvent.slice";
import { ContextMenuSlice } from "./Features/contextMenu.slice";
import eventsLogic from "./Features/events.logic";
import { EventsSlice } from "./Features/events.slice";
import fileUploadLogic from "./Features/fileUpload.logic";
import ikfLogic from "./Features/ikf.logic";
import ikfReducer from "./Features/ikf.slice";
import { ModalsSlice } from "./Features/modal.slice";

const persistConfig = {
  key: "root",
  storage,
};

const fileUploadMiddleware = createLogicMiddleware(fileUploadLogic);
const eventsMiddleware = createLogicMiddleware(eventsLogic);
const combatEventMiddleware = createLogicMiddleware(combatEventLogic);
const ikfMiddleware = createLogicMiddleware(ikfLogic);
const rootReducer = combineReducers({
  combatEvent: CombatEventSlice.reducer,
  CSBracket: CSBracketSlice.reducer,
  ContextMenu: ContextMenuSlice.reducer,
  IKFEvents: EventsSlice.reducer,
  IKF: ikfReducer,
  Modals: ModalsSlice.reducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: () =>
    new Tuple(
      fileUploadMiddleware,
      eventsMiddleware,
      combatEventMiddleware,
      ikfMiddleware
    ),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
