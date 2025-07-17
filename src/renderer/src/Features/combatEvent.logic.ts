import { get, ref, set } from "firebase/database";
import { createLogic } from "redux-logic";
import { ikfpkbDB } from "../FirebaseConfig";
import {
  ADD_BRACKET_TO_MAT,
  READ_SELECTED_COMBAT_EVENT_FROM_FB,
  SET_PARTICIPANTS_BRACKET_COUNT,
  SYNC_COMBAT_EVENT,
} from "./combatEvent.actions";
import {
  addBracketToMatState,
  addNewBout,
  hydrateCombatEvent,
  setSelectedBracketId,
  updateMatBouts,
} from "./combatEvent.slice";
import { addBoutsFromBracket } from "./utils/EventBouts";

const syncCombatEvent = createLogic({
  type: SYNC_COMBAT_EVENT,
  async process({ action }, dispatch, done) {
    void dispatch;
    try {
      // write Combat Event Slice to FB Realtime DB
      const db = ikfpkbDB();
      set(ref(db, "combatEvent"), action.payload).then(() => {
        console.log(
          "CombatEvent data successfully written to database. Show in Success Snack Bar"
        );
      });
    } catch (error) {
      console.error(
        `Error writing Combat Event Data to Firebase RealTime DB: `,
        error
      );
    }
    done();
  },
});

const updateMatLogic = createLogic({
  type: updateMatBouts,
  async process({ action }, dispatch, done) {
    void action;
    void dispatch;
    try {
      // write Mat currentBout to FB Realtime DB
      // action.payload should contain matId and currentBout
      console.log("Updating mat currentBout in Firebase: ", action.payload);
      // action.payload should be { matId: number, currentBout: CSBout }
      if (
        !action.payload ||
        !action.payload.matId ||
        !action.payload.currentBout
      ) {
        console.error("Invalid payload for updating mat currentBout.");
        done();
        return;
      }
      // Get the database reference and update the currentBout for the specified matId
      const db = ikfpkbDB();
      const currentBoutRef = ref(
        db,
        `combatEvent/mats/${action.payload.matId}/currentBout`
      );
      set(currentBoutRef, action.payload.currentBout).then(() => {
        console.log("Mat currentBout successfully updated in Firebase.");
      });
    } catch (error) {
      console.error("Error updating mat currentBout: ", error);
    }
    done();
  },
});
// Logic to get selected CombatEvent from Firebase and hydrate the Redux store CombatEvent Slice
const GetCombatEventsFromFB = createLogic({
  type: READ_SELECTED_COMBAT_EVENT_FROM_FB,
  async process({ action }, dispatch, done) {
    void action;
    try {
      const db = ikfpkbDB();
      const combatEventRef = ref(db, `combatEvent`);
      // Fetch Data
      const snapshot = await get(combatEventRef);
      if (snapshot.exists()) {
        const selectedEvent = snapshot.val();
        dispatch(hydrateCombatEvent(selectedEvent));
      }
    } catch (error) {
      console.error("Error reading combat events from Firebase: ", error);
    }
    done();
  },
});

const addBracketToMat = createLogic({
  type: ADD_BRACKET_TO_MAT,
  async process({ action }, dispatch, done) {
    void dispatch;
    dispatch(addBracketToMatState(action.payload));
    const bracketBouts = addBoutsFromBracket(action.payload);
    bracketBouts.forEach((bout) => {
      dispatch(addNewBout(bout));
    });
    done();
  },
});

const setParticipantsBracketCount = createLogic({
  type: SET_PARTICIPANTS_BRACKET_COUNT,
  async process({ action }, dispatch, done) {
    void dispatch;

    console.log(action.payload);

    done();
  },
});

const setSelectedBracketIdLogic = createLogic({
  type: setSelectedBracketId,
  async process({ action }, dispatch, done) {
    void dispatch;
    console.log("FROM THE LOGIC: ", action.payload);

    done();
  },
});

const combatEventLogic = [
  syncCombatEvent,
  setParticipantsBracketCount,
  GetCombatEventsFromFB,
  addBracketToMat,
  setSelectedBracketIdLogic,
  updateMatLogic,
];

export default combatEventLogic;
