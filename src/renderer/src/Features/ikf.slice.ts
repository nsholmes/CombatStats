import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventBracket } from '@nsholmes/combat-stats-types/bracket.model';
import { IKFEvent } from '@nsholmes/combat-stats-types/event.model';
import { IKFParticipant } from '@nsholmes/combat-stats-types/fighter.model';

export type SyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type IKFSliceState = {
  events: IKFEvent[];
  selectedEvent: IKFEvent | null;
  participants: IKFParticipant[];
  brackets: EventBracket[];
  loading: boolean;
  error: string | null;
  syncStatus: {
    events: SyncStatus;
    participants: SyncStatus;
    brackets: SyncStatus;
  };
  enrichmentProgress: {
    current: number;
    total: number;
    currentName: string;
    status: 'idle' | 'running' | 'complete' | 'error';
  };
  fetchAllProgress: {
    current: number;
    total: number;
    currentEvent: string;
    status: 'idle' | 'running' | 'complete' | 'error';
  };
  syncEventsProgress: {
    current: number;
    total: number;
    currentEvent: string;
    status: 'idle' | 'running' | 'complete' | 'error';
  };
  participantStatus: {
    eventsWithParticipants: string[];
    eventsWithoutParticipants: string[];
  } | null;
  tokenValidation: {
    valid: boolean;
    message: string;
    lastChecked: number | null;
  };
};

const initialState: IKFSliceState = {
  events: [],
  selectedEvent: null,
  participants: [],
  brackets: [],
  loading: false,
  error: null,
  syncStatus: {
    events: 'idle',
    participants: 'idle',
    brackets: 'idle',
  },
  enrichmentProgress: {
    current: 0,
    total: 0,
    currentName: '',
    status: 'idle',
  },
  fetchAllProgress: {
    current: 0,
    total: 0,
    currentEvent: '',
    status: 'idle',
  },
  syncEventsProgress: {
    current: 0,
    total: 0,
    currentEvent: '',
    status: 'idle',
  },
  participantStatus: null,
  tokenValidation: {
    valid: false,
    message: '',
    lastChecked: null,
  },
};

export const IKFSlice = createSlice({
  name: 'IKF',
  initialState,
  reducers: {
    // Events
    setEvents(state, action: PayloadAction<IKFEvent[]>) {
      state.events = action.payload;
      state.error = null;
    },
    setSelectedEvent(state, action: PayloadAction<IKFEvent | null>) {
      state.selectedEvent = action.payload;
    },
    setEventsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setEventsSyncStatus(state, action: PayloadAction<SyncStatus>) {
      state.syncStatus.events = action.payload;
    },

    // Participants
    setParticipants(state, action: PayloadAction<IKFParticipant[]>) {
      state.participants = action.payload;
      state.error = null;
    },
    setParticipantsSyncStatus(state, action: PayloadAction<SyncStatus>) {
      state.syncStatus.participants = action.payload;
    },

    // Brackets
    setBrackets(state, action: PayloadAction<EventBracket[]>) {
      state.brackets = action.payload;
      state.error = null;
    },
    setBracketsSyncStatus(state, action: PayloadAction<SyncStatus>) {
      state.syncStatus.brackets = action.payload;
    },

    // Error handling
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },

    // Enrichment progress
    setEnrichmentProgress(
      state,
      action: PayloadAction<{
        current: number;
        total: number;
        currentName: string;
      }>
    ) {
      state.enrichmentProgress = {
        ...action.payload,
        status: 'running',
      };
    },
    setEnrichmentStatus(
      state,
      action: PayloadAction<'idle' | 'running' | 'complete' | 'error'>
    ) {
      state.enrichmentProgress.status = action.payload;
      if (action.payload === 'idle' || action.payload === 'complete') {
        state.enrichmentProgress.current = 0;
        state.enrichmentProgress.total = 0;
        state.enrichmentProgress.currentName = '';
      }
    },

    // Fetch all progress
    setFetchAllProgress(
      state,
      action: PayloadAction<{
        current: number;
        total: number;
        currentEvent: string;
      }>
    ) {
      state.fetchAllProgress = {
        ...action.payload,
        status: 'running',
      };
    },
    setFetchAllStatus(
      state,
      action: PayloadAction<'idle' | 'running' | 'complete' | 'error'>
    ) {
      state.fetchAllProgress.status = action.payload;
      if (action.payload === 'idle' || action.payload === 'complete') {
        state.fetchAllProgress.current = 0;
        state.fetchAllProgress.total = 0;
        state.fetchAllProgress.currentEvent = '';
      }
    },

    // Participant status
    setParticipantStatus(
      state,
      action: PayloadAction<{
        eventsWithParticipants: string[];
        eventsWithoutParticipants: string[];
      }>
    ) {
      state.participantStatus = action.payload;
    },

    // Token validation
    setTokenValidation(
      state,
      action: PayloadAction<{
        valid: boolean;
        message: string;
      }>
    ) {
      state.tokenValidation = {
        ...action.payload,
        lastChecked: Date.now(),
      };
    },

    // Sync events progress
    setSyncEventsProgress(
      state,
      action: PayloadAction<{
        current: number;
        total: number;
        currentEvent: string;
      }>
    ) {
      state.syncEventsProgress = {
        ...action.payload,
        status: 'running',
      };
    },
    setSyncEventsStatus(
      state,
      action: PayloadAction<'idle' | 'running' | 'complete' | 'error'>
    ) {
      state.syncEventsProgress.status = action.payload;
      if (action.payload === 'idle' || action.payload === 'complete') {
        state.syncEventsProgress.current = 0;
        state.syncEventsProgress.total = 0;
        state.syncEventsProgress.currentEvent = '';
      }
    },
  },
});

// Selectors
export const selectIKFEvents = (state: any) => state.IKF.events;
export const selectSelectedEvent = (state: any) => state.IKF.selectedEvent;
export const selectIKFParticipants = (state: any) => state.IKF.participants;
export const selectIKFBrackets = (state: any) => state.IKF.brackets;
export const selectIKFLoading = (state: any) => state.IKF.loading;
export const selectIKFError = (state: any) => state.IKF.error;
export const selectSyncStatus = (state: any) => state.IKF.syncStatus;
export const selectEnrichmentProgress = (state: any) =>
  state.IKF.enrichmentProgress;
export const selectFetchAllProgress = (state: any) => state.IKF.fetchAllProgress;
export const selectParticipantStatus = (state: any) =>
  state.IKF.participantStatus;
export const selectTokenValidation = (state: any) => state.IKF.tokenValidation;
export const selectSyncEventsProgress = (state: any) =>
  state.IKF.syncEventsProgress;

// Actions
export const {
  setEvents,
  setSelectedEvent,
  setEventsLoading,
  setEventsSyncStatus,
  setParticipants,
  setParticipantsSyncStatus,
  setBrackets,
  setBracketsSyncStatus,
  setError,
  clearError,
  setEnrichmentProgress,
  setEnrichmentStatus,
  setFetchAllProgress,
  setFetchAllStatus,
  setParticipantStatus,
  setTokenValidation,
  setSyncEventsProgress,
  setSyncEventsStatus,
} = IKFSlice.actions;

export default IKFSlice.reducer;
