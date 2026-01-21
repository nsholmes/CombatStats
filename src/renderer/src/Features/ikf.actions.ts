// Action Types
export const FETCH_IKF_EVENTS = 'FETCH_IKF_EVENTS';
export const READ_IKF_EVENTS = 'READ_IKF_EVENTS';
export const FETCH_IKF_PARTICIPANTS = 'FETCH_IKF_PARTICIPANTS';
export const READ_IKF_PARTICIPANTS = 'READ_IKF_PARTICIPANTS';
export const FETCH_ALL_IKF_PARTICIPANTS = 'FETCH_ALL_IKF_PARTICIPANTS';
export const GET_ALL_IKF_PARTICIPANTS = 'GET_ALL_IKF_PARTICIPANTS';
export const FETCH_IKF_BRACKETS = 'FETCH_IKF_BRACKETS';
export const READ_IKF_BRACKETS = 'READ_IKF_BRACKETS';
export const ENRICH_IKF_PARTICIPANTS = 'ENRICH_IKF_PARTICIPANTS';
export const GET_PARTICIPANT_STATUS = 'GET_PARTICIPANT_STATUS';
export const VALIDATE_IKF_TOKEN = 'VALIDATE_IKF_TOKEN';

// Action Creators
export const fetchIKFEvents = () => ({
  type: FETCH_IKF_EVENTS,
});

export const readIKFEvents = () => ({
  type: READ_IKF_EVENTS,
});

export const fetchIKFParticipants = (eventUID: string, eventID: number) => ({
  type: FETCH_IKF_PARTICIPANTS,
  payload: { eventUID, eventID },
});

export const readIKFParticipants = (eventUID: string, eventID: number) => ({
  type: READ_IKF_PARTICIPANTS,
  payload: { eventUID, eventID },
});

export const fetchAllIKFParticipants = () => ({
  type: FETCH_ALL_IKF_PARTICIPANTS,
});

export const getAllIKFParticipants = () => ({
  type: GET_ALL_IKF_PARTICIPANTS,
});

export const fetchIKFBrackets = (eventUID: string, eventID: number) => ({
  type: FETCH_IKF_BRACKETS,
  payload: { eventUID, eventID },
});

export const readIKFBrackets = (eventUID: string, eventID: number) => ({
  type: READ_IKF_BRACKETS,
  payload: { eventUID, eventID },
});

export const enrichIKFParticipants = (eventId?: string, forceUpdate?: boolean) => ({
  type: ENRICH_IKF_PARTICIPANTS,
  payload: { eventId, forceUpdate },
});

export const getParticipantStatus = () => ({
  type: GET_PARTICIPANT_STATUS,
});

export const validateIKFToken = () => ({
  type: VALIDATE_IKF_TOKEN,
});

// Firebase Sync Actions
export const SYNC_EVENTS_TO_FIREBASE = 'SYNC_EVENTS_TO_FIREBASE';
export const SYNC_PARTICIPANTS_TO_FIREBASE = 'SYNC_PARTICIPANTS_TO_FIREBASE';
export const SYNC_BRACKETS_TO_FIREBASE = 'SYNC_BRACKETS_TO_FIREBASE';

export const syncEventsToFirebase = () => ({
  type: SYNC_EVENTS_TO_FIREBASE,
});

export const syncParticipantsToFirebase = (eventUID: string, eventID: number) => ({
  type: SYNC_PARTICIPANTS_TO_FIREBASE,
  payload: { eventUID, eventID },
});

export const syncBracketsToFirebase = (eventUID: string, eventID: number) => ({
  type: SYNC_BRACKETS_TO_FIREBASE,
  payload: { eventUID, eventID },
});
