import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CSEvent } from '../Models/csEvent.model';

const initialState: CSEvent[] = [];

export const CSEventsSlice = createSlice({
    name: 'CSEvents',
    initialState,
    reducers: {
        addNewEvent(state, action: PayloadAction<CSEvent>) {
            state.push(action.payload);
        }
    }
});

export const SelectAllEvents = (state: any): CSEvent[] => {
    return state;
}

export const { addNewEvent } = CSEventsSlice.actions;

export const { reducer } = CSEventsSlice;