import { createLogicMiddleware } from 'redux-logic';

import { configureStore } from '@reduxjs/toolkit';

import { CSBracketSlice } from './Features/cbBracket.slice';
import { CombatEventSlice } from './Features/combatEvent.slice';
import { ContextMenuSlice } from './Features/contextMenu.slice';
import { CSEventsSlice } from './Features/CSEvents.slice';
import fileUploadLogic from './Features/fileUpload.logic';

const fileUploadMiddleware = createLogicMiddleware(fileUploadLogic);

export const store = configureStore({
  reducer: {
    combatEvent: CombatEventSlice.reducer,
    CSBracket: CSBracketSlice.reducer,
    ContextMenu: ContextMenuSlice.reducer,
    CSEvents: CSEventsSlice.reducer,
  },
  middleware: [fileUploadMiddleware]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;