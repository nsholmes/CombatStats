import { createLogic } from "redux-logic";
import { IKFParticipant } from "../Models/fighter.model";
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
// import * as fs from "fs";
import { get, ref } from "firebase/database";
import { ikfpkbDB } from "../FirebaseConfig";

declare const window: {
  api: {
    readEventList: any;
    readEventParticipants: any;
    readEventBrackets: any;
    refreshEventParticipantsFromFSI: any;
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
    window.api
      .readEventParticipants(action.payload.eventUID, action.payload.eventID)
      .then((resp: any) => {
        const participants = JSON.parse(resp.data);
        participants.sort((a: IKFParticipant, b: IKFParticipant) => {
          return a.weight - b.weight;
        });
        console.log(`participants ${participants}`);
        dispatch(setParticipants(participants));
        dispatch({
          type: "GET_FSI_EVENT_PARTICIPANTS_SUCCESS",
          payload: participants,
        });
        done();
      });
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
    window.api
      .readEventBrackets(action.payload.eventUID, action.payload.eventID)
      .then((resp: any) => {
        const brackets = JSON.parse(resp.data);
        console.log("Brackets: ", brackets.length);
        dispatch(setBrackets(brackets));
        dispatch({
          type: "GET_FSI_EVENT_BRACKETS_SUCCESS",
          payload: brackets,
        });
        done();
      });
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
