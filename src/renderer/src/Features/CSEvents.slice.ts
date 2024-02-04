import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Bout, CSEvent } from '../Models/csEvent.model';

const initialState: CSEvent[] = [];

export const CSEventsSlice = createSlice({
    name: 'CSEvents',
    initialState,
    reducers: {
        addNewEvent(state, action: PayloadAction<CSEvent>) {
            state.push(action.payload);
        },
        addBoutToEvent(state, action: PayloadAction<Bout>) {
            state[0].bouts.push(action.payload);
        }
    }
});

export const SelectAllEvents = (state: any): CSEvent[] => {
    return state.CSEvents;
}

export const SelectEventById = (state: CSEvent[], eventId: number) => {
    return state.find((event) => event.overview.eventID === eventId);
}
export const SelectEventBouts = (state: any): Bout[] => {
    console.log(state.CSEvents);
    return state.CSEvents.length > 0 ? state.CSEvents[0].bouts : []
}

export const { addNewEvent, addBoutToEvent } = CSEventsSlice.actions;

export const { reducer } = CSEventsSlice;