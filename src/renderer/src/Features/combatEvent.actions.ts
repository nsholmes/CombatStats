import { createAction } from "@reduxjs/toolkit";
import { CombatEvent } from "../Models";

export const SYNC_COMBAT_EVENT =
  createAction<CombatEvent>("SYNC_COMBAT_EVENT");

export const SET_PARTICIPANTS_BRACKET_COUNT = createAction<number[]>(
  "SET_PARTICIPANTS_BRACKET_COUNT"
);
