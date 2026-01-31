import {
  CSBout,
  CSBoutState,
  CSBracket,
  CSMat,
} from "@nsholmes/combat-stats-types/event.model";
import { EventMatDisplayProps } from "@nsholmes/combat-stats-types/props.model";
import { DataSnapshot, getDatabase, onValue, ref } from "firebase/database";
import { createContext, useContext, useEffect, useRef } from "react";
import { connect } from "react-redux";
import EventMatDisplay from "../Components/bouts/EventMatDisplay";
import FullBoutList from "../Components/bouts/FullBoutList";
import {
  APPROVE_BOUT_RESULTS,
  UPDATE_BOUT_STATUS,
  UPDATE_MAT_BOUTS,
} from "../Features/combatEvent.actions";
import {
  SelectAllBouts,
  SelectAllBrackets,
  SelectMats,
  setBouts,
  setBoutsFromDB,
  setMats,
} from "../Features/combatEvent.slice";
import { EventContext } from "./SelectedEventView";

type EventBoutsProps = {
  setEventMats: (mats: CSMat[]) => void;
  setBouts: (bouts: CSBracket[]) => void;
  setBoutsFromDB: (bouts: CSBout[]) => void;
  updateMatBouts: (bouts: EventMatDisplayProps) => void;
  updateBoutStatus: (boutId: string, status: CSBoutState) => void;
  approveBoutResults: (boutId: string) => void;
  getEventMats: CSMat[];
  brackets: CSBracket[];
  getBouts: CSBout[];
};

function mapDispatchToProps(dispatch: any) {
  return {
    setEventMats: (mats: CSMat[]) => dispatch(setMats(mats)),
    setBouts: (bouts: CSBracket[]) => dispatch(setBouts(bouts)),
    setBoutsFromDB: (bouts: CSBout[]) => dispatch(setBoutsFromDB(bouts)),
    updateMatBouts: (bouts: EventMatDisplayProps) =>
      dispatch(UPDATE_MAT_BOUTS(bouts)),
    updateBoutStatus: (boutId: string, status: CSBoutState) =>
      dispatch(UPDATE_BOUT_STATUS({ boutId, status })),
    approveBoutResults: (boutId: string) =>
      dispatch(APPROVE_BOUT_RESULTS({ boutId })),
  };
}

function mapStateToProps(state: any) {
  return {
    getEventMats: SelectMats(state),
    brackets: SelectAllBrackets(state),
    getBouts: SelectAllBouts(state),
  };
}

function EventBouts(props: EventBoutsProps) {
  const eventMatBoutsRef = useRef<EventMatDisplayProps[]>([]);
  const eventMatsContext = createContext<EventMatDisplayProps[] | null>(null);
  const eventData = useContext(EventContext);

  const eventMatBouts = eventMatBoutsRef.current;
  const setEventMatBouts = (bouts: EventMatDisplayProps[]) => {
    eventMatBoutsRef.current = bouts;
  };
  useEffect(() => {
    // Compare previous and current mat bouts to determine which mat changed
    const prevMatBouts = eventMatBoutsRef.current;
    const currentMatBouts: EventMatDisplayProps[] = [];
    void prevMatBouts;
    void currentMatBouts;
    const matCount = props.getEventMats.length;
    const bouts = eventData?.bouts ?? [];
    const availableBouts = bouts.filter(
      (bout) => bout.status.state !== "completed" && !bout.isResultApproved
    );

    if (availableBouts.length > 0 && matCount > 0) {
      //   for (let i = 0; i < matCount; i++) {
      //     currentMatBouts.push({
      //       currentBoutId: availableBouts[i]?.boutId,
      //       onDeckBoutId: availableBouts[i + matCount]?.boutId,
      //       inHoleBoutId: availableBouts[i + 2 * matCount]?.boutId,
      //       matId: i,
      //     });
      //   }
      //   // Find which mat changed
      //   currentMatBouts.forEach((matBout, idx) => {
      //     const prev = prevMatBouts[idx];
      //     if (
      //       !prev ||
      //       prev.currentBoutId !== matBout.currentBoutId ||
      //       prev.onDeckBoutId !== matBout.onDeckBoutId ||
      //       prev.inHoleBoutId !== matBout.inHoleBoutId
      //     ) {
      //       // Mat idx changed
      //       console.log(`Mat ${matBout.matId} changed`);
      //     }
      //   });
      //   eventMatBoutsRef.current = currentMatBouts;
    }
  }, [eventMatBoutsRef]);

  useEffect(() => {
    // props.setBouts(props.brackets);
    setupMatBouts();
    const db = getDatabase();
    const matsRef = ref(db, "combatEvent/mats");
    const boutsRef = ref(db, "combatEvent/bouts");
    void boutsRef;

    onValue(boutsRef, (snapshot: DataSnapshot) => {
      const boutsData = snapshot.val();
      if (boutsData) {
        const bouts: CSBout[] = Object.values(boutsData);
        // console.log("Bouts data updated:", bouts);
        props.setBoutsFromDB(bouts);
      }
    });
    // when matsRef changes, update the mats in the store
    onValue(matsRef, (snapshot) => {
      const matsData = snapshot.val();
      if (matsData) {
        const mats: CSMat[] = Object.values(matsData);
        console.log("Mats data updated:", mats);

        props.setEventMats(mats);
      }
    });
  }, []);

  useEffect(() => {
    const matCount = props.getEventMats.length;
    for (let i = 0; i < matCount; i++) {
      const currBout = getBoutById(eventMatBoutsRef.current[i]?.currentBoutId);
      if (currBout?.status.state === "completed") {
        console.log(
          `Mat ${i + 1} bout ${currBout.boutId} completed. Awaiting approval.`
        );
        props.updateBoutStatus(currBout.boutId, "completed");
      }
    }

    console.log(
      "EventBouts updated with new bouts:",
      eventData?.bouts?.length
    );
  }, [eventData?.bouts]);

  function approveResultsClicked(boutId: string) {
    props.approveBoutResults(boutId);
  }
  function setupMatBouts() {
    const eventMatBoutsArr: EventMatDisplayProps[] = [];
    const matCount = props.getEventMats.length;
    const bouts = eventData?.bouts ?? [];
    const availableBouts = bouts.filter(
      (bout) => bout.status.state !== "completed" && !bout.isResultApproved
    );

    if (availableBouts.length > 0 && matCount > 0) {
      // Distribute bouts across mats
      for (let i = 0; i < matCount; i++) {
        const matDisplay: EventMatDisplayProps = {
          currentBoutId: availableBouts[i].boutId,
          onDeckBoutId: availableBouts[i + matCount]?.boutId,
          inHoleBoutId: availableBouts[i + 2 * matCount]?.boutId,
          matId: i,
        };
        props.updateMatBouts(matDisplay);
        eventMatBoutsArr.push(matDisplay);
      }
      setEventMatBouts(eventMatBoutsArr);
    }
  }

  const getBoutById = (boutId: string | null) => {
    return eventData?.bouts?.find((bout) => bout.boutId === boutId) || null;
  };

  return (
    <eventMatsContext.Provider value={eventMatBouts}>
      <div>
        <h2 className='text-center font-black'>{`Event Bouts`}</h2>
        {eventMatBouts.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}>
            <h6>No bouts available</h6>
          </div>
        ) : null}
        <div className='flex flex-wrap justify-around gap-4'>
          {props.getEventMats.map((mat, idx) => (
            <EventMatDisplay
              key={`${mat.id}-${idx}-MatDisplay`}
              matName={(mat.id + 1).toString()}
              currentBout={getBoutById(mat.currentBoutId)}
              onDeckBout={getBoutById(mat.onDeckBoutId)}
              inHoleBout={getBoutById(mat.inHoleBoutId)}
              approveClickHandler={approveResultsClicked}
            />
          ))}
          <div>
            <FullBoutList />
          </div>
        </div>
      </div>
    </eventMatsContext.Provider>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventBouts);
