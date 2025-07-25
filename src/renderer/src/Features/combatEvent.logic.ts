import { CSBracket } from "@nsholmes/combat-stats-types/event.model";
import { get, ref, set } from "firebase/database";
import { createLogic } from "redux-logic";
import { ikfpkbDB } from "../FirebaseConfig";
import {
  ADD_BRACKET,
  READ_SELECTED_COMBAT_EVENT_FROM_FB,
  RESET_COMBAT_EVENT,
  SET_PARTICIPANTS_BRACKET_COUNT,
  SYNC_COMBAT_EVENT,
} from "./combatEvent.actions";
import {
  addBracket,
  hydrateCombatEvent,
  initialState,
  setSelectedBracketId,
  updateMatBouts,
} from "./combatEvent.slice";

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
        action.payload == null ||
        action.payload.matId == null ||
        action.payload.currentBoutId == null ||
        action.payload.onDeckBoutId == null ||
        action.payload.inHoleBoutId == null
      ) {
        console.error("Invalid payload for updating mat currentBout.");
        done();
        return;
      }
      // Get the database reference and update the currentBout for the specified matId
      const db = ikfpkbDB();
      const currentBoutRef = ref(
        db,
        `combatEvent/mats/${action.payload.matId}`
      );
      const currentBoutSnapshotValue = await get(currentBoutRef).then(
        (snapshot) => {
          if (snapshot.exists()) {
            console.log("Current Bout Snapshot: ", snapshot.val());
            return snapshot.val();
          }
          console.error("No current bout found for the specified matId.");
          done();
          return null;
        }
      );
      set(currentBoutRef, {
        ...currentBoutSnapshotValue,
        currentBoutId: action.payload.currentBoutId,
        onDeckBoutId: action.payload.onDeckBoutId,
        inHoleBoutId: action.payload.inHoleBoutId,
        matId: action.payload.matId,
      }).then(() => {
        const updateBoutStatus = [
          {
            boutId: action.payload.currentBoutId,
            boutStatus: "inProgress",
            matId: action.payload.matId,
          },
          {
            boutId: action.payload.onDeckBoutId,
            boutStatus: "onDeck",
            matId: action.payload.matId,
          },
          {
            boutId: action.payload.inHoleBoutId,
            boutStatus: "inHole",
            matId: action.payload.matId,
          },
        ];
        fetch(
          "http://127.0.0.1:5002/ikfpkb-midwest/us-central1/updateBoutStatus",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              boutData: updateBoutStatus,
            }),
          }
        );
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

const addBracketLogic = createLogic({
  type: ADD_BRACKET,
  async process({ action }, dispatch, done) {
    void dispatch;
    const bracket: CSBracket = action.payload;
    const db = ikfpkbDB();
    const bracketRef = ref(db, `combatEvent/brackets`);
    const bracketSnapshot = await get(bracketRef);
    //#region: Update Brackets Realtime Database
    // update the brackets in the Firebase Realtime Database
    if (bracketSnapshot.exists()) {
      const existingBrackets = bracketSnapshot.val();
      // Check if the bracket already exists
      const bracketExists = existingBrackets.some(
        (b: CSBracket) => b.bracketId === bracket.bracketId
      );
      if (bracketExists) {
        console.log("Bracket already exists:", bracket.bracketId);
        done();
        return;
      }
      set(bracketRef, [...existingBrackets, bracket]).then(() => {
        console.log("Bracket added successfully:", bracket.bracketId);
      });
    }
    dispatch(addBracket(action.payload));
    //#endregion

    //#region: Update Bouts in Realtime Database
    // Update Bouts from the bracket
    // This assumes that the action.payload contains the bracketId and other necessary data
    // const boutsRef = ref(db, `combatEvent/bouts`);
    // const boutsSnapshot = await get(boutsRef);
    // if (boutsSnapshot.exists()) {
    //   const existingBouts = boutsSnapshot.val();
    //   // Add bouts from the bracket to the existing bouts
    //   const bracketBouts = addBoutsFromBracket(action.payload);
    //   const updatedBouts = [...existingBouts, ...bracketBouts];
    //   set(boutsRef, updatedBouts).then(() => {
    //     console.log(
    //       "Bouts added successfully from bracket:",
    //       action.payload.bracketId
    //     );
    //   });
    // } else {
    //   // If no existing bouts, just set the new bouts
    //   const bracketBouts = addBoutsFromBracket(action.payload);
    //   set(boutsRef, bracketBouts).then(() => {
    //     console.log(
    //       "Initial bouts added successfully from bracket:",
    //       action.payload.bracketId
    //     );
    //   });
    // }
    //#endregion
    // done();
    // const bracketBouts = addBoutsFromBracket(action.payload);
    // bracketBouts.forEach((bout) => {
    //   dispatch(addNewBout(bout));
    // });
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

const ResetCombatEventLogic = createLogic({
  type: RESET_COMBAT_EVENT,
  async process({ action }, dispatch, done) {
    void dispatch;
    console.log("Resetting Combat Event: ", action.payload);
    dispatch(hydrateCombatEvent(initialState)); // Reset to initial state
    done();
  },
});

const combatEventLogic = [
  syncCombatEvent,
  setParticipantsBracketCount,
  GetCombatEventsFromFB,
  addBracketLogic,
  setSelectedBracketIdLogic,
  updateMatLogic,
  ResetCombatEventLogic,
];

export default combatEventLogic;
