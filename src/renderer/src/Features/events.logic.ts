import { createLogic } from "redux-logic";
import { IKFParticipant } from "../Models/fighter.model";
import { setBrackets, setParticipants } from "./combatEvent.slice";
import { setIKFEvents } from "./events.slice";
import {
  GET_FSI_EVENT_BRACKETS,
  GET_FSI_EVENT_PARTICIPANTS,
  GetEventsFromFSI,
  REFRESH_EVENT_PARTICIPANTS_FROM_FSI,
} from "./eventsAction";
// import * as fs from "fs";

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
  GetFSIEventParticipants,
  GetFSIEventBrackets,
  RefreshEventParticipantsFromFSI,
];
export default eventsLogic;
