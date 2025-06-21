import { ref, set } from "firebase/database";
import { createLogic } from "redux-logic";
import { ikfpkbDB } from "../FirebaseConfig";
import {
  SET_PARTICIPANTS_BRACKET_COUNT,
  SYNC_COMBAT_EVENT,
} from "./CombatEvent.actions";

const syncCombatEvent = createLogic({
  type: SYNC_COMBAT_EVENT,
  async process({ action }, dispatch, done) {
    try {
      // write Combat Event Slice to FB Realtime DB
      const db = ikfpkbDB();
      set(ref(db, "combatEvent"), action.payload).then(() => {
        console.log(
          "CombatEvent data successfully written to database. Show in Success Snack Bar"
        );
      });
    } catch (error) {
      console.log(
        "Error writing Combat Event Data to Firebase RealTime DB: ",
        error
      );
    }
    done();
  },
});

const setParticipantsBracketCount = createLogic({
  type: SET_PARTICIPANTS_BRACKET_COUNT,
  async process({ action }, dispatch, done) {
    console.log(action.payload);

    done();
  },
});

const combatEventLogic = [syncCombatEvent, setParticipantsBracketCount];

export default combatEventLogic;
