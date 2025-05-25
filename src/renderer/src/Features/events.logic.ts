import { createLogic } from "redux-logic";
import { getOptions } from "../Models";
import {
  GET_FSI_EVENT_BRACKETS,
  GET_FSI_EVENT_PARTICIPANTS,
  GetEventsFromFSI,
} from "./eventsAction";
import {
  setIKFEventBrackets,
  setIKFEventParticipants,
  setIKFEvents,
} from "./events.slice";
// import * as fs from "fs";

declare const window: {
  api: {
    readEventList: any;
    readEventParticipants: any;
    readEventBrackets: any;
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
        dispatch(setIKFEventParticipants(participants));
        dispatch({
          type: "GET_FSI_EVENT_PARTICIPANTS_SUCCESS",
          payload: participants,
        });
        done();
      });
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
        dispatch(setIKFEventBrackets(brackets));
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
];
export default eventsLogic;
