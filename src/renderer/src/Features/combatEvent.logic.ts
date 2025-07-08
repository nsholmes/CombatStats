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
      console.log(
        "Error writing Combat Event Data to Firebase RealTime DB: ",
        error
      );
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
      const combatEventRef = ref(db, `combatEvents`);
      // Fetch Data
      const snapshot = await get(combatEventRef);
      if (snapshot.exists()) {
        const selectedEvent = snapshot.val();
        dispatch(hydrateCombatEvent(selectedEvent));
      }
    } catch (error) {
      console.error("Error reading combat events from Firebase: ", error);
    }
    // }`);
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
      // Here you can dispatch an action to add the bout to the store if needed
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

const combatEventLogic = [
  syncCombatEvent,
  setParticipantsBracketCount,
  GetCombatEventsFromFB,
  addBracketToMat,
];

export default combatEventLogic;
