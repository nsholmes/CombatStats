import { CSBout, CSBracket } from "@nsholmes/combat-stats-types/event.model";
import { get, ref, set } from "firebase/database";
import { createLogic } from "redux-logic";
import { ikfpkbDB } from "../FirebaseConfig";
import {
  ADD_BRACKET,
  APPROVE_BOUT_RESULTS,
  DELETE_BRACKET,
  READ_SELECTED_COMBAT_EVENT_FROM_FB,
  RESET_COMBAT_EVENT,
  SET_PARTICIPANTS_BRACKET_COUNT,
  SYNC_COMBAT_EVENT,
  UPDATE_BRACKET,
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
  updateMatRoles,
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

const updateMatRolesLogic = createLogic({
  type: updateMatRoles,
  async process({ action }, dispatch, done) {
    void dispatch;
    try {
      // write Mat roles to FB Realtime DB
      if (
        action.payload == null ||
        action.payload.idx == null ||
        action.payload.roles == null
      ) {
        console.error("Invalid payload for updating mat roles.");
        done();
        return;
      }
      const db = ikfpkbDB();
      const matRolesRef = ref(
        db,
        `combatEvent/mats/${action.payload.idx}/roles`
      );
      await set(matRolesRef, action.payload.roles);
      console.log(
        `Mat ${action.payload.idx} roles successfully updated in Firebase`
      );
    } catch (error) {
      console.error("Error updating mat roles in Firebase: ", error);
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
        action.payload.onDeckBoutId == null
        // Note: inHoleBoutId can be null when there are no more pending bouts
      ) {
        console.error("Invalid payload for updating mat currentBout.");
        console.error("Payload:", action.payload);
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
        // fetch(
        //   "http://127.0.0.1:5002/ikfpkb-midwest/us-central1/updateCurrentBoutStatus",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       boutData: updateBoutStatus,
        //     }),
        //   }
        // );
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

const deleteBracketLogic = createLogic({
  type: DELETE_BRACKET,
  async process({ action }, dispatch, done) {
    void action;
    void dispatch;
    const db = ikfpkbDB();
    const bracketsRef = ref(db, `combatEvent/brackets`);
    try {
      const snapshot = await get(bracketsRef);
      if (snapshot.exists()) {
        const brackets = snapshot.val();
        const bracketIndex = brackets.findIndex(
          (bracket: CSBracket) => bracket.bracketId === action.payload
        );
        if (bracketIndex !== -1) {
          // Remove the bracket from the array
          brackets.splice(bracketIndex, 1);
          // Write the updated brackets back to Firebase
          set(bracketsRef, brackets).then(() => {
            console.log("Bracket deleted successfully in Firebase.");
          });
        } else {
          console.error("Bracket not found in the database.");
        }
      } else {
        console.error("No brackets found in the database.");
      }
    } catch (error) {
      console.error("Error reading brackets from Firebase: ", error);
    }
    done();
  },
});

const updateBracketLogic = createLogic({
  type: UPDATE_BRACKET,
  async process({ action }, dispatch, done) {
    void action;
    void dispatch;
    const db = ikfpkbDB();
    const bracketsRef = ref(db, `combatEvent/brackets`);

    try {
      const snapshot = await get(bracketsRef);
      if (snapshot.exists()) {
        const brackets = snapshot.val();
        const bracketIndex = brackets.findIndex(
          (bracket: CSBracket) =>
            bracket.bracketId === action.payload.bracketId
        );

        if (bracketIndex !== -1) {
          // Update the bracket in the array
          brackets[bracketIndex] = action.payload;
          // Write the updated brackets back to Firebase
          set(bracketsRef, brackets).then(() => {
            console.log("Bracket updated successfully in Firebase.");
          });
        }

        // dispatch(updateBracket(brackets));
      }
    } catch (error) {
      console.error("Error reading brackets from Firebase: ", error);
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
        // Firebase stores bouts as an object with keys, not an array
        const boutEntries = Object.entries(boutsData);
        
        // Find current bout
        const currentBoutEntry = boutEntries.find(
          ([_, bout]: [string, any]) => bout.boutId === currentBoutId
        );
        if (!currentBoutEntry) {
          console.error("Current Bout not found in the bouts data.");
          done();
          return;
        }
        const [currentBoutKey] = currentBoutEntry;
        const currentBoutRef = ref(
          db,
          `combatEvent/bouts/${currentBoutKey}/status/state`
        );
        set(currentBoutRef, "inProgress");
        
        // Find onDeck bout
        const onDeckBoutEntry = boutEntries.find(
          ([_, bout]: [string, any]) => bout.boutId === onDeckBoutId
        );
        if (!onDeckBoutEntry) {
          console.error("OnDeck Bout not found in the bouts data.");
          done();
          return;
        }
        const [onDeckBoutKey] = onDeckBoutEntry;
        const onDeckBoutRef = ref(
          db,
          `combatEvent/bouts/${onDeckBoutKey}/status/state`
        );
        set(onDeckBoutRef, "onDeck");
        
        // Find inHole bout (may be null)
        if (inHoleBoutId) {
          const inHoleBoutEntry = boutEntries.find(
            ([_, bout]: [string, any]) => bout.boutId === inHoleBoutId
          );
          if (!inHoleBoutEntry) {
            console.error("InHole Bout not found in the bouts data.");
            done();
            return;
          }
          const [inHoleBoutKey] = inHoleBoutEntry;
          const inHoleBoutRef = ref(
            db,
            `combatEvent/bouts/${inHoleBoutKey}/status/state`
          );
          set(inHoleBoutRef, "inHole");
        }
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

    // Firebase stores bouts as an object with keys, not an array
    const boutEntries = Object.entries(boutDataRef);
    const boutEntry = boutEntries.find(
      ([_, bout]: [string, any]) => bout.boutId === boutId
    );
    
    if (!boutEntry) {
      console.error("Bout to be approved not found");
      return;
    }
    
    const [boutKey, boutData] = boutEntry;
    console.log("Approving Bout: ", boutData.boutId);
    
    try {
      // Update the bout status to "approved"
      const selectedBoutRef = ref(db, `combatEvent/bouts/${boutKey}`);
      await set(selectedBoutRef, {
        ...boutData,
        status: { state: "completed" },
        isResultApproved: true,
      });
      console.log("Bout results approved successfully");
    } catch (error) {
      console.error("Error approving bout results: ", error);
    }

    try {
      // Find which mat has this bout as current
      const matsEntries = Object.entries(matsDataRef);
      const matEntry = matsEntries.find(
        ([_, mat]: [string, any]) => mat.currentBoutId === boutId
      );
      
      if (!matEntry) {
        console.error(`No mat found with bout ${boutId} as current bout`);
        done();
        return;
      }
      
      const [matKey, matData] = matEntry;
      const matId = matData.id !== undefined ? matData.id : parseInt(matKey);
      console.log("Found mat:", matId, "with bout:", boutId);

      // Find next bout with status "pending"
      const allBouts = Object.values(boutDataRef) as CSBout[];
      const nextBoutId = allBouts.find(
        (bout: CSBout) => bout.status.state === "pending"
      )?.boutId;
      
      const currentBoutId = matData.onDeckBoutId;
      const onDeckBoutId = matData.inHoleBoutId;
      const inHoleBoutId = nextBoutId || null;

      console.log("Bout progression:", {
        oldCurrent: boutId,
        newCurrent: currentBoutId,
        newOnDeck: onDeckBoutId,
        newInHole: inHoleBoutId,
      });

      const selectedMatRef = ref(db, `combatEvent/mats/${matKey}`);
      await set(selectedMatRef, {
        ...matData,
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
  updateMatRolesLogic,
  ResetCombatEventLogic,
  updateBracketOrderLogic,
  updateMatBoutsLogic,
  approveBoutResultsLogic,
  updateBracketLogic,
  deleteBracketLogic,
];

export default combatEventLogic;
