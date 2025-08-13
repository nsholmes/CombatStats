import { CSBout, CSBracket } from "@nsholmes/combat-stats-types/event.model";
import { get, ref, set } from "firebase/database";
import { createLogic } from "redux-logic";
import { ikfpkbDB } from "../FirebaseConfig";
import {
  ADD_BRACKET,
  APPROVE_BOUT_RESULTS,
  READ_SELECTED_COMBAT_EVENT_FROM_FB,
  RESET_COMBAT_EVENT,
  SET_PARTICIPANTS_BRACKET_COUNT,
  SYNC_COMBAT_EVENT,
  UPDATE_BRACKET_ORDER,
  UPDATE_MAT_BOUTS,
} from "./combatEvent.actions";
import {
  addBracket,
  approveBoutResults,
  hydrateCombatEvent,
  initialState,
  setSelectedBracketId,
  updateBracketOrder,
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

const updateMatBoutsLogic = createLogic({
  type: UPDATE_MAT_BOUTS,
  async process({ action }, dispatch, done) {
    void action;
    void dispatch;
    const { matId, currentBoutId, onDeckBoutId, inHoleBoutId } =
      action.payload;
    void matId;

    // update firebase realtime datebase, by setting the status of bouts as follows:
    // set the currentBoutId to "inProgress" where boutId , onDeckBoutId to "onDeck" where boutId is onDeckBoutId, and inHoleBoutId to "inHole" where boutId is inHoleBoutId
    try {
      const db = ikfpkbDB();
      const boutsRef = ref(db, "combatEvent/bouts");
      const boutsSnapshot = await get(boutsRef);
      if (!boutsSnapshot.exists()) {
        console.error("No bouts found in the database.");
        done();
        return;
      } else {
        const boutsData = boutsSnapshot.val();
        const bouts: CSBout[] = Object.values(boutsData);
        const currentBoutIndex = bouts.findIndex(
          (bout) => bout.boutId === currentBoutId
        );
        if (currentBoutIndex === -1) {
          console.error("Current Bout not found in the bouts data.");
          done();
          return;
        }
        const currentBoutRef = ref(
          db,
          `combatEvent/bouts/${currentBoutIndex}/status/state`
        );
        set(currentBoutRef, "inProgress");
        const onDeckBoutIndex = bouts.findIndex(
          (bout) => bout.boutId === onDeckBoutId
        );
        if (onDeckBoutIndex === -1) {
          console.error("OnDeck Bout not found in the bouts data.");
          done();
          return;
        }
        const onDeckBoutRef = ref(
          db,
          `combatEvent/bouts/${onDeckBoutIndex}/status/state`
        );
        set(onDeckBoutRef, "onDeck");
        const inHoleBoutIndex = bouts.findIndex(
          (bout) => bout.boutId === inHoleBoutId
        );
        if (inHoleBoutIndex === -1) {
          console.error("InHole Bout not found in the bouts data.");
          done();
          return;
        }
        const inHoleBoutRef = ref(
          db,
          `combatEvent/bouts/${inHoleBoutIndex}/status/state`
        );
        set(inHoleBoutRef, "inHole");
      }
    } catch (error) {
      console.error("Error updating mat bouts in Firebase: ", error);
    }
    try {
      // Update the mat bouts in the Redux store
      dispatch(updateMatBouts(action.payload));
    } catch (error) {
      console.error("Error updating mat bouts in Redux store: ", error);
    }
    done();
  },
});

const updateBracketOrderLogic = createLogic({
  type: UPDATE_BRACKET_ORDER,
  async process({ action }, dispatch, done) {
    void action;
    void dispatch;
    try {
      dispatch(updateBracketOrder(action.payload));
      // const db = ikfpkbDB();
      // const bracketsRef = ref(db, `combatEvent/brackets`);
      // // Update the brackets in the Firebase Realtime Database
      // set(bracketsRef, action.payload).then(() => {
      //   console.log("Bracket order updated successfully in Firebase.");
      // });
    } catch (error) {
      console.error("Error updating bracket order in Firebase: ", error);
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
    const combatRef = ref(db, `combatEvent`);
    const combatSnapShot = await get(combatRef);
    //#region: Update Brackets Realtime Database
    // update the brackets in the Firebase Realtime Database
    if (combatSnapShot.exists()) {
      const bracketsRef = ref(db, `combatEvent/brackets`);
      const combatEvent = combatSnapShot.val();
      const existingBrackets = combatEvent.brackets || [];
      if (existingBrackets.length > 0) {
        // Check if the bracket already exists
        const bracketExists = existingBrackets.some(
          (b: CSBracket) => b.bracketId === bracket.bracketId
        );
        if (bracketExists) {
          console.log("Bracket already exists:", bracket.bracketId);
          done();
          return;
        }
        set(bracketsRef, [...existingBrackets, bracket]).then(() => {
          console.log("Bracket added successfully:", bracket.bracketId);
        });
      } else {
        // If no existing brackets, just set the new bracket
        set(bracketsRef, [bracket]).then(() => {
          console.log(
            "Initial bracket added successfully:",
            bracket.bracketId
          );
        });
      }
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

const approveBoutResultsLogic = createLogic({
  type: APPROVE_BOUT_RESULTS,
  async process({ action }, dispatch, done) {
    void dispatch;
    console.log("Approving Bout Results: ", action.payload);
    dispatch(approveBoutResults(action.payload));
    const db = ikfpkbDB();
    const { boutId } = action.payload;
    const boutRef = ref(db, `combatEvent/bouts`);
    const boutSnap = await get(boutRef);
    const boutDataRef = boutSnap.val();
    if (!boutDataRef) {
      console.error("Bout to be approved not found");
      return;
    }

    const matsRef = ref(db, `combatEvent/mats`);
    const matsSnap = await get(matsRef);
    const matsDataRef = matsSnap.val();
    if (!matsDataRef) {
      console.error("Mats data not found");
      return;
    }

    const boutIndex = boutDataRef.findIndex((bout: CSBout) => {
      if (bout.boutId === boutId) {
        console.log("Approveing Bout: ", bout.boutId);
      }
      return bout.boutId === boutId;
    });
    if (boutIndex === -1) {
      console.error("Bout to be approved not found");
      return;
    }
    try {
      // Update the bout status to "approved"
      const selectedBoutRef = ref(db, `combatEvent/bouts/${boutIndex}`);
      await set(selectedBoutRef, {
        ...boutDataRef[boutIndex],
        status: { state: "completed" },
        isResultApproved: true,
      });
      console.log("Bout results approved successfully");
    } catch (error) {
      console.error("Error approving bout results: ", error);
    }

    try {
      // Update the mat status to reflect the approved bout
      const matId = boutDataRef[boutIndex].matId;

      const nextBoutId = boutDataRef.find(
        (bout: CSBout) => bout.status.state === "notStarted"
      )?.boutId;
      const currentBoutId = matsDataRef[matId].onDeckBoutId;
      const onDeckBoutId = matsDataRef[matId].inHoleBoutId;
      const inHoleBoutId = nextBoutId || null;

      const selectedMatRef = ref(db, `combatEvent/mats/${matId}`);
      await set(selectedMatRef, {
        ...matsDataRef[matId],
        currentBoutId,
        onDeckBoutId,
        inHoleBoutId,
      });

      dispatch(
        UPDATE_MAT_BOUTS({ matId, currentBoutId, onDeckBoutId, inHoleBoutId })
      );

      console.log("Mat status updated successfully");
    } catch (error) {
      console.error("Error updating mat status: ", error);
    }

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
  updateBracketOrderLogic,
  updateMatBoutsLogic,
  approveBoutResultsLogic,
];

export default combatEventLogic;
