import { createAction } from "@reduxjs/toolkit";
import { CombatEvent, CSBracket } from "../Models";

export const SYNC_COMBAT_EVENT =
  createAction<CombatEvent>("SYNC_COMBAT_EVENT");

export const SET_PARTICIPANTS_BRACKET_COUNT = createAction<number[]>(
  "SET_PARTICIPANTS_BRACKET_COUNT"
);
export const READ_SELECTED_COMBAT_EVENT_FROM_FB = createAction(
  "GET_SELECTED_COMBAT_EVENT"
);

export const ADD_BRACKET_TO_MAT = createAction<CSBracket>(
  "ADD_BRACKET_TO_MAT"
);
