import { eventModel } from "@nsholmes/combat-stats-types";
import { createAction } from "@reduxjs/toolkit";

export const SYNC_COMBAT_EVENT =
  createAction<eventModel.CombatEvent>("SYNC_COMBAT_EVENT");

export const SET_PARTICIPANTS_BRACKET_COUNT = createAction<number[]>(
  "SET_PARTICIPANTS_BRACKET_COUNT"
);
export const READ_SELECTED_COMBAT_EVENT_FROM_FB = createAction(
  "GET_SELECTED_COMBAT_EVENT"
);

export const ADD_BRACKET = createAction<eventModel.CSBracket>("ADD_BRACKET");

export const RESET_COMBAT_EVENT = createAction("RESET_COMBAT_EVENT");
