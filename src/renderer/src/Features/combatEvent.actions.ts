import { eventModel } from "@nsholmes/combat-stats-types";
import {
  CSBoutState,
  CSBracket,
} from "@nsholmes/combat-stats-types/event.model";
import { createAction } from "@reduxjs/toolkit";
import { EventMatDisplayProps } from "../Models/props.model";

export const SYNC_COMBAT_EVENT =
  createAction<eventModel.CombatEvent>("SYNC_COMBAT_EVENT");

export const SET_PARTICIPANTS_BRACKET_COUNT = createAction<number[]>(
  "SET_PARTICIPANTS_BRACKET_COUNT"
);
export const READ_SELECTED_COMBAT_EVENT_FROM_FB = createAction(
  "GET_SELECTED_COMBAT_EVENT"
);
export const RESET_COMBAT_EVENT = createAction<eventModel.CombatEvent>(
  "RESET_COMBAT_EVENT"
);

export const ADD_BRACKET = createAction<eventModel.CSBracket>("ADD_BRACKET");
export const UPDATE_BRACKET_ORDER = createAction<CSBracket[]>(
  "UPDATE_BRACKET_ORDER"
);

// TODO: CREATE LOGIC TO HANDLE BRACKET UPDATES and BRACKET DELETION
export const UPDATE_BRACKET = createAction<CSBracket>("UPDATE_BRACKET");
export const DELETE_BRACKET = createAction<string>("DELETE_BRACKET");

export const UPDATE_MAT_BOUTS =
  createAction<EventMatDisplayProps>("UPDATE_MAT_BOUTS");

export const UPDATE_BOUT_STATUS = createAction<{
  boutId: string;
  status: CSBoutState;
}>("UPDATE_BOUT_STATUS");

export const APPROVE_BOUT_RESULTS = createAction<{
  boutId: string;
}>("APPROVE_BOUT_RESULTS");
