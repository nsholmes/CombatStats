import { IKFParticipant } from "@nsholmes/combat-stats-types/fighter.model";
import { get, ref } from "firebase/database";
import { createLogic } from "redux-logic";
import { ikfpkbDB } from "../FirebaseConfig";
import { setBrackets, setParticipants } from "./combatEvent.slice";
import { setIKFEvents } from "./events.slice";
import {
  GET_BRACKETS_FROM_FB,
  GET_EVENTS_FROM_FB,
  GET_FSI_EVENT_BRACKETS,
  GET_FSI_EVENT_PARTICIPANTS,
  GET_PARTICIPANTS_FROM_FB,
  GetEventsFromFSI,
  REFRESH_EVENT_PARTICIPANTS_FROM_FSI,
} from "./eventsAction";

declare const window: {
  api: {
    readEventList: any;
    readEventParticipants: any;
    readEventBrackets: any;
    refreshEventParticipantsFromFSI: any;
    ikf: {
      fetchParticipants: (eventUID: string, eventID: number) => Promise<any>;
      fetchBrackets: (eventUID: string, eventID: number) => Promise<any>;
    };
  };
};

const GetFSIEvents = createLogic({
  type: GetEventsFromFSI,
  async process({}, dispatch, done) {
    window.api.readEventList().then((resp: any) => {
      console.log(`Renerer: GetFSIEvnets `);
      const events = JSON.parse(resp.data);
      console.log(`events lenth: ${events.length}`);
      dispatch(setIKFEvents(events));
      done();
    });
  },
});

const GetEventsFromFB = createLogic({
  type: GET_EVENTS_FROM_FB,
  async process({ action }, dispatch, done) {
    void action;
    try {
      const db = ikfpkbDB();

      const eventsRef = ref(db, "ikf/events");
      //Fetch Data
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        const events = snapshot.val();
        // convert object to array if needed
        const eventsArray = Array.isArray(events)
          ? events
          : Object.values(events);
        dispatch(setIKFEvents(eventsArray));
      } else {
        console.log("No events found in Firebase");
      }
    } catch (error) {
      console.error("Error reading events from Firebase: ", error);
    }
    done();
  },
});

const GetParticipantsFromFB = createLogic({
  type: GET_PARTICIPANTS_FROM_FB,
  async process({ action }, dispatch, done) {
    try {
      // Read from the ikf/eventsParticipant
      const db = ikfpkbDB();
      const participantsRef = ref(
        db,
        `ikf/eventParticipants/${action.payload.eventID}`
      );
      // Fetch Data
      const snapshot = await get(participantsRef);
      if (snapshot.exists()) {
        const participants = snapshot.val();
        const participantsArray = Array.isArray(participants)
          ? participants
          : Object.values(participants);
        dispatch(setParticipants(participantsArray));
      } else {
        dispatch(setParticipants([]));
        console.log("No Participants found in Firebase");
      }
    } catch (error) {
      console.error("Error reading participants from Firebase: ", error);
    }
    done();
  },
});

const GetFSIEventParticipants = createLogic({
  type: GET_FSI_EVENT_PARTICIPANTS,
  async process({ action }, dispatch, done) {
    try {
      // Use IKF Service to fetch participants from FSI API
      const result = await window.api.ikf.fetchParticipants(
        action.payload.eventUID,
        action.payload.eventID
      );

      if (result.success) {
        const participants = result.data;
        participants.sort((a: IKFParticipant, b: IKFParticipant) => {
          return a.weight - b.weight;
        });
        console.log(`participants: ${participants.length} loaded from FSI API`);
        dispatch(setParticipants(participants));
        dispatch({
          type: "GET_FSI_EVENT_PARTICIPANTS_SUCCESS",
          payload: participants,
        });
      } else {
        console.error('Failed to fetch participants:', result.error);
        dispatch(setParticipants([]));
        dispatch({
          type: "GET_FSI_EVENT_PARTICIPANTS_FAILURE",
          payload: result.error,
        });
      }
    } catch (error) {
      console.error('Error fetching participants from FSI:', error);
      dispatch(setParticipants([]));
      dispatch({
        type: "GET_FSI_EVENT_PARTICIPANTS_FAILURE",
        payload: error,
      });
    }
    done();
  },
});

const RefreshEventParticipantsFromFSI = createLogic({
  type: REFRESH_EVENT_PARTICIPANTS_FROM_FSI,
  async process({ action }, _dispatch, done) {
    console.log("RefreshEventParticipantsFromFSI: ", action.payload.eventUID);
    console.log("Event ID: ", action.payload.eventID);
    window.api
      .refreshEventParticipantsFromFSI(
        action.payload.eventUID,
        action.payload.eventID
      )
      .then((resp: any) => {
        const participants = JSON.parse(resp.data);
        participants.sort((a: IKFParticipant, b: IKFParticipant) => {
          return a.weight - b.weight;
        });
      });
    done();
  },
});

const GetBracketsFromFB = createLogic({
  type: GET_BRACKETS_FROM_FB,
  async process({ action }, dispatch, done) {
    try {
      // read from ikf/eventBrackets
      const db = ikfpkbDB();
      const bracketsRef = ref(
        db,
        `ikf/eventBrackets/${action.payload.eventID}`
      );
      //fetch Data
      const snapshot = await get(bracketsRef);
      if (snapshot.exists()) {
        const brackets = snapshot.val();
        const bracketsArray = Array.isArray(brackets)
          ? brackets
          : Object.values(brackets);
        dispatch(setBrackets(bracketsArray));
      } else {
        console.log("No Brackets found in Firebase");
      }
    } catch (error) {
      console.error("Error reading brackets from firebase: ", error);
    }
    done();
  },
});

const GetFSIEventBrackets = createLogic({
  type: GET_FSI_EVENT_BRACKETS,
  async process({ action }, dispatch, done) {
    console.log("GET_FSI_EVENT_BRACKETS: ", action.payload.eventUID);
    try {
      // Use IKF Service to fetch brackets from FSI API
      const result = await window.api.ikf.fetchBrackets(
        action.payload.eventUID,
        action.payload.eventID
      );

      if (result.success) {
        const brackets = result.data;
        console.log("Brackets: ", brackets.length);
        dispatch(setBrackets(brackets));
        dispatch({
          type: "GET_FSI_EVENT_BRACKETS_SUCCESS",
          payload: brackets,
        });
      } else {
        console.error('Failed to fetch brackets:', result.error);
        dispatch(setBrackets([]));
        dispatch({
          type: "GET_FSI_EVENT_BRACKETS_FAILURE",
          payload: result.error,
        });
      }
    } catch (error) {
      console.error('Error fetching brackets from FSI:', error);
      dispatch(setBrackets([]));
      dispatch({
        type: "GET_FSI_EVENT_BRACKETS_FAILURE",
        payload: error,
      });
    }
    done();
  },
});

const eventsLogic = [
  GetFSIEvents,
  GetParticipantsFromFB,
  GetFSIEventParticipants,
  GetBracketsFromFB,
  GetFSIEventBrackets,
  RefreshEventParticipantsFromFSI,
  GetEventsFromFB,
];
export default eventsLogic;
