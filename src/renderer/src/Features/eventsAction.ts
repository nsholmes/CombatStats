import { createAction } from "@reduxjs/toolkit";
import { EventBracketRequest, EventParticipantRequest } from "../Models";

export const GET_EVENTS_FROM_FB = createAction("GET_EVENTS_FROM_FB");
export const GET_PARTICIPANTS_FROM_FB = createAction<EventParticipantRequest>(
  "GET_PARTICIPANTS_FROM_FB"
);
export const GET_BRACKETS_FROM_FB = createAction<EventParticipantRequest>(
  "GET_BRACKETS_FROM_FB"
);
export const GetEventsFromFSI = createAction("GetEventsFromFSI");
export const GET_FSI_EVENT_PARTICIPANTS =
  createAction<EventParticipantRequest>("GET_FSI_EVENT_PARTICIPANTS");
export const GET_FSI_EVENT_PARTICIPANTS_SUCCESS = createAction(
  "GET_FSI_EVENT_PARTICIPANTS_SUCCESS"
);
export const GET_FSI_EVENT_PARTICIPANTS_FAILURE = createAction(
  "GET_FSI_EVENT_PARTICIPANTS_FAILURE"
);
export const GET_FSI_EVENT_BRACKETS = createAction<EventBracketRequest>(
  "GET_FSI_EVENT_BRACKETS"
);
export const GET_FSI_EVENT_BRACKETS_SUCCESS = createAction(
  "GET_FSI_EVENT_BRACKETS_SUCCESS"
);
export const GET_FSI_EVENT_BRACKETS_FAILURE = createAction(
  "GET_FSI_EVENT_BRACKETS_FAILURE"
);
export const REFRESH_EVENT_PARTICIPANTS_FROM_FSI =
  createAction<EventParticipantRequest>("REFRESH_EVENT_PARTICIPANTS_FROM_FSI");
