import { createLogic } from 'redux-logic';
import {
  FETCH_IKF_EVENTS,
  READ_IKF_EVENTS,
  FETCH_IKF_PARTICIPANTS,
  READ_IKF_PARTICIPANTS,
  FETCH_ALL_IKF_PARTICIPANTS,
  FETCH_IKF_BRACKETS,
  READ_IKF_BRACKETS,
  ENRICH_IKF_PARTICIPANTS,
  GET_PARTICIPANT_STATUS,
  VALIDATE_IKF_TOKEN,
  SYNC_EVENTS_TO_FIREBASE,
  SYNC_PARTICIPANTS_TO_FIREBASE,
  SYNC_BRACKETS_TO_FIREBASE,
} from './ikf.actions';
import {
  setEvents,
  setEventsLoading,
  setParticipants,
  setBrackets,
  setError,
  setEnrichmentProgress,
  setEnrichmentStatus,
  setFetchAllProgress,
  setFetchAllStatus,
  setParticipantStatus,
  setTokenValidation,
  setSyncEventsProgress,
  setSyncEventsStatus,
  setEventsSyncStatus,
  setParticipantsSyncStatus,
  setBracketsSyncStatus,
} from './ikf.slice';

declare global {
  interface Window {
    api: {
      ikf: {
        fetchEvents: () => Promise<{ success: boolean; data?: any; error?: string }>;
        readEvents: () => Promise<{ success: boolean; data?: any; error?: string }>;
        fetchParticipants: (
          eventUID: string,
          eventID: number
        ) => Promise<{ success: boolean; data?: any; error?: string }>;
        readParticipants: (
          eventUID: string,
          eventID: number
        ) => Promise<{ success: boolean; data?: any; error?: string }>;
        fetchAllParticipants: () => Promise<{
          success: boolean;
          data?: any;
          error?: string;
        }>;
        onFetchAllProgress: (callback: (data: any) => void) => () => void;
        fetchBrackets: (
          eventUID: string,
          eventID: number
        ) => Promise<{ success: boolean; data?: any; error?: string }>;
        readBrackets: (
          eventUID: string,
          eventID: number
        ) => Promise<{ success: boolean; data?: any; error?: string }>;
        enrichParticipants: (
          eventId?: string,
          forceUpdate?: boolean
        ) => Promise<{ success: boolean; data?: any; error?: string }>;
        onEnrichProgress: (callback: (data: any) => void) => () => void;
        getParticipantStatus: () => Promise<{
          success: boolean;
          data?: any;
          error?: string;
        }>;
        validateToken: () => Promise<{
          success: boolean;
          data?: any;
          error?: string;
        }>;
        updateToken: (token: string) => Promise<{
          success: boolean;
          error?: string;
        }>;
        syncEventsToFirebase: () => Promise<{
          success: boolean;
          data?: any;
          error?: string;
        }>;
        onSyncEventsProgress: (callback: (data: any) => void) => () => void;
        syncParticipantsToFirebase: (
          eventUID: string,
          eventID: number
        ) => Promise<{ success: boolean; data?: any; error?: string }>;
        syncBracketsToFirebase: (
          eventUID: string,
          eventID: number
        ) => Promise<{ success: boolean; data?: any; error?: string }>;
      };
    };
  }
}

// Fetch Events Logic
const fetchEventsLogic = createLogic({
  type: FETCH_IKF_EVENTS,
  async process({ action }, dispatch: any, done) {
    dispatch(setEventsLoading(true));
    try {
      const result = await window.api.ikf.fetchEvents();
      if (result.success) {
        dispatch(setEvents(result.data));
      } else {
        dispatch(setError(result.error || 'Failed to fetch events'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to fetch events'));
    } finally {
      dispatch(setEventsLoading(false));
      done();
    }
  },
});

// Read Events Logic
const readEventsLogic = createLogic({
  type: READ_IKF_EVENTS,
  async process({ action }, dispatch: any, done) {
    dispatch(setEventsLoading(true));
    try {
      const result = await window.api.ikf.readEvents();
      if (result.success) {
        dispatch(setEvents(result.data));
      } else {
        dispatch(setError(result.error || 'Failed to read events'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to read events'));
    } finally {
      dispatch(setEventsLoading(false));
      done();
    }
  },
});

// Fetch Participants Logic
const fetchParticipantsLogic = createLogic({
  type: FETCH_IKF_PARTICIPANTS,
  async process({ action }: any, dispatch: any, done) {
    dispatch(setEventsLoading(true));
    try {
      const { eventUID, eventID } = action.payload;
      const result = await window.api.ikf.fetchParticipants(eventUID, eventID);
      if (result.success) {
        dispatch(setParticipants(result.data));
      } else {
        dispatch(setError(result.error || 'Failed to fetch participants'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to fetch participants'));
    } finally {
      dispatch(setEventsLoading(false));
      done();
    }
  },
});

// Read Participants Logic
const readParticipantsLogic = createLogic({
  type: READ_IKF_PARTICIPANTS,
  async process({ action }: any, dispatch: any, done) {
    dispatch(setEventsLoading(true));
    try {
      const { eventUID, eventID } = action.payload;
      const result = await window.api.ikf.readParticipants(eventUID, eventID);
      if (result.success) {
        dispatch(setParticipants(result.data));
      } else {
        dispatch(setError(result.error || 'Failed to read participants'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to read participants'));
    } finally {
      dispatch(setEventsLoading(false));
      done();
    }
  },
});

// Fetch All Participants Logic
const fetchAllParticipantsLogic = createLogic({
  type: FETCH_ALL_IKF_PARTICIPANTS,
  async process({ action }, dispatch: any, done) {
    dispatch(setFetchAllStatus('running'));

    // Setup progress listener
    const cleanup = window.api.ikf.onFetchAllProgress((data) => {
      dispatch(
        setFetchAllProgress({
          current: data.current,
          total: data.total,
          currentEvent: data.eventName,
        })
      );
    });

    try {
      const result = await window.api.ikf.fetchAllParticipants();
      if (result.success) {
        dispatch(setFetchAllStatus('complete'));
      } else {
        dispatch(setError(result.error || 'Failed to fetch all participants'));
        dispatch(setFetchAllStatus('error'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to fetch all participants'));
      dispatch(setFetchAllStatus('error'));
    } finally {
      cleanup();
      done();
    }
  },
});

// Fetch Brackets Logic
const fetchBracketsLogic = createLogic({
  type: FETCH_IKF_BRACKETS,
  async process({ action }: any, dispatch: any, done) {
    dispatch(setEventsLoading(true));
    try {
      const { eventUID, eventID } = action.payload;
      const result = await window.api.ikf.fetchBrackets(eventUID, eventID);
      if (result.success) {
        dispatch(setBrackets(result.data));
      } else {
        dispatch(setError(result.error || 'Failed to fetch brackets'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to fetch brackets'));
    } finally {
      dispatch(setEventsLoading(false));
      done();
    }
  },
});

// Read Brackets Logic
const readBracketsLogic = createLogic({
  type: READ_IKF_BRACKETS,
  async process({ action }: any, dispatch: any, done) {
    dispatch(setEventsLoading(true));
    try {
      const { eventUID, eventID } = action.payload;
      const result = await window.api.ikf.readBrackets(eventUID, eventID);
      if (result.success) {
        dispatch(setBrackets(result.data));
      } else {
        dispatch(setError(result.error || 'Failed to read brackets'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to read brackets'));
    } finally {
      dispatch(setEventsLoading(false));
      done();
    }
  },
});

// Enrich Participants Logic
const enrichParticipantsLogic = createLogic({
  type: ENRICH_IKF_PARTICIPANTS,
  async process({ action }: any, dispatch: any, done) {
    dispatch(setEnrichmentStatus('running'));

    // Setup progress listener
    const cleanup = window.api.ikf.onEnrichProgress((data) => {
      dispatch(
        setEnrichmentProgress({
          current: data.current,
          total: data.total,
          currentName: data.participantName,
        })
      );
    });

    try {
      const { eventId, forceUpdate } = action.payload;
      const result = await window.api.ikf.enrichParticipants(eventId, forceUpdate);
      if (result.success) {
        dispatch(setEnrichmentStatus('complete'));
      } else {
        dispatch(setError(result.error || 'Failed to enrich participants'));
        dispatch(setEnrichmentStatus('error'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to enrich participants'));
      dispatch(setEnrichmentStatus('error'));
    } finally {
      cleanup();
      done();
    }
  },
});

// Get Participant Status Logic
const getParticipantStatusLogic = createLogic({
  type: GET_PARTICIPANT_STATUS,
  async process({ action }, dispatch: any, done) {
    try {
      const result = await window.api.ikf.getParticipantStatus();
      if (result.success) {
        dispatch(setParticipantStatus(result.data));
      } else {
        dispatch(setError(result.error || 'Failed to get participant status'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to get participant status'));
    } finally {
      done();
    }
  },
});

// Validate Token Logic
const validateTokenLogic = createLogic({
  type: VALIDATE_IKF_TOKEN,
  async process({ action }, dispatch: any, done) {
    try {
      const result = await window.api.ikf.validateToken();
      if (result.success) {
        dispatch(setTokenValidation(result.data));
      } else {
        dispatch(setError(result.error || 'Failed to validate token'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to validate token'));
    } finally {
      done();
    }
  },
});

// Sync Events to Firebase Logic
const syncEventsToFirebaseLogic = createLogic({
  type: SYNC_EVENTS_TO_FIREBASE,
  async process({ action }, dispatch: any, done) {
    dispatch(setSyncEventsStatus('running'));
    dispatch(setEventsSyncStatus('loading'));

    // Setup progress listener
    const cleanup = window.api.ikf.onSyncEventsProgress((data) => {
      dispatch(
        setSyncEventsProgress({
          current: data.current,
          total: data.total,
          currentEvent: data.eventName,
        })
      );
    });

    try {
      const result = await window.api.ikf.syncEventsToFirebase();
      if (result.success) {
        dispatch(setSyncEventsStatus('complete'));
        dispatch(setEventsSyncStatus('success'));
      } else {
        dispatch(setError(result.error || 'Failed to sync events to Firebase'));
        dispatch(setSyncEventsStatus('error'));
        dispatch(setEventsSyncStatus('error'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to sync events to Firebase'));
      dispatch(setSyncEventsStatus('error'));
      dispatch(setEventsSyncStatus('error'));
    } finally {
      cleanup();
      done();
    }
  },
});

// Sync Participants to Firebase Logic
const syncParticipantsToFirebaseLogic = createLogic({
  type: SYNC_PARTICIPANTS_TO_FIREBASE,
  async process({ action }: any, dispatch: any, done) {
    dispatch(setParticipantsSyncStatus('loading'));
    try {
      const { eventUID, eventID } = action.payload;
      const result = await window.api.ikf.syncParticipantsToFirebase(
        eventUID,
        eventID
      );
      if (result.success) {
        dispatch(setParticipantsSyncStatus('success'));
      } else {
        dispatch(
          setError(result.error || 'Failed to sync participants to Firebase')
        );
        dispatch(setParticipantsSyncStatus('error'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to sync participants to Firebase'));
      dispatch(setParticipantsSyncStatus('error'));
    } finally {
      done();
    }
  },
});

// Sync Brackets to Firebase Logic
const syncBracketsToFirebaseLogic = createLogic({
  type: SYNC_BRACKETS_TO_FIREBASE,
  async process({ action }: any, dispatch: any, done) {
    dispatch(setBracketsSyncStatus('loading'));
    try {
      const { eventUID, eventID } = action.payload;
      const result = await window.api.ikf.syncBracketsToFirebase(eventUID, eventID);
      if (result.success) {
        console.log('Bracket sync result:', result);
        dispatch(setBracketsSyncStatus('success'));
      } else {
        console.error('Bracket sync error:', result.error);
        dispatch(setError(result.error || 'Failed to sync brackets to Firebase'));
        dispatch(setBracketsSyncStatus('error'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to sync brackets to Firebase'));
      dispatch(setBracketsSyncStatus('error'));
    } finally {
      done();
    }
  },
});

// Export all logic
export default [
  fetchEventsLogic,
  readEventsLogic,
  fetchParticipantsLogic,
  readParticipantsLogic,
  fetchAllParticipantsLogic,
  fetchBracketsLogic,
  readBracketsLogic,
  enrichParticipantsLogic,
  getParticipantStatusLogic,
  validateTokenLogic,
  syncEventsToFirebaseLogic,
  syncParticipantsToFirebaseLogic,
  syncBracketsToFirebaseLogic,
];
