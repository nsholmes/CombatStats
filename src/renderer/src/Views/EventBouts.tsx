import {
  CSBout,
  CSBracket,
  CSMat,
} from "@nsholmes/combat-stats-types/event.model";
import { EventMatDisplayProps } from "@nsholmes/combat-stats-types/props.model";
import { getDatabase, onValue, ref } from "firebase/database";
import { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import EventMatDisplay from "../Components/bouts/EventMatDisplay";
import {
  SelectAllBouts,
  SelectAllBrackets,
  SelectMats,
  setBouts,
  setMats,
  updateMatBouts,
} from "../Features/combatEvent.slice";

type EventBoutsProps = {
  setEventMats: (mats: CSMat[]) => void;
  setBouts: (bouts: CSBracket[]) => void;
  updateMatBouts: (bouts: EventMatDisplayProps) => void;
  getEventMats: CSMat[];
  brackets: CSBracket[];
  getBouts: CSBout[];
};

function mapDispatchToProps(dispatch: any) {
  return {
    setEventMats: (mats: CSMat[]) => dispatch(setMats(mats)),
    setBouts: (bouts: CSBracket[]) => dispatch(setBouts(bouts)),
    updateMatBouts: (bouts: EventMatDisplayProps) =>
      dispatch(updateMatBouts(bouts)),
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
  const [eventMatBouts, setEventMatBouts] = useState<EventMatDisplayProps[]>(
    []
  );
  const EventMatsContext = createContext<EventMatDisplayProps[] | null>(null);

  useEffect(() => {
    props.setBouts(props.brackets);
    initMatCurrentBouts();
    const db = getDatabase();
    const matsRef = ref(db, "combatEvent/mats");

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
    console.log("Event Mat Bouts Updated:", eventMatBouts);
  }, [eventMatBouts]);

  function initMatCurrentBouts() {
    const eventMatBoutsArr: EventMatDisplayProps[] = [];
    const matCount = props.getEventMats.length;
    const bouts = props.getBouts;
    const availableBouts = bouts.filter(
      (bout) => bout.status.state !== "completed"
    );
    if (availableBouts.length > 0 && matCount > 0) {
      for (let i = 0; i < matCount; i++) {
        const matDisplay: EventMatDisplayProps = {
          currentBout: availableBouts[i],
          onDeckBout: availableBouts[i + matCount],
          inHoleBout: availableBouts[i + 2 * matCount],
          matId: i,
        };
        props.updateMatBouts(matDisplay);
        eventMatBoutsArr.push(matDisplay);
      }
      setEventMatBouts(eventMatBoutsArr);
    }
  }

  return (
    <EventMatsContext.Provider value={eventMatBouts}>
      <div>
        <h2 className='text-center font-black'>{`Event Bouts`}</h2>
        <div className='flex flex-wrap justify-around gap-4'>
          {eventMatBouts.map((mat, idx) => (
            <EventMatDisplay
              key={`${mat.matId}-${idx}-MatDisplay`}
              matName={(mat.matId + 1).toString()}
              currrentBout={
                eventMatBouts[idx]?.currentBout &&
                eventMatBouts[idx]?.currentBout.boutId
                  ? {
                      ...eventMatBouts[idx].currentBout,
                      status: { state: "inProgress" },
                    }
                  : null
              }
              onDeckBout={
                eventMatBouts[idx]?.onDeckBout &&
                eventMatBouts[idx]?.onDeckBout.boutId
                  ? {
                      ...eventMatBouts[idx].onDeckBout,
                      status: { state: "onDeck" },
                    }
                  : null
              }
              inHoleBout={
                eventMatBouts[idx]?.inHoleBout &&
                eventMatBouts[idx]?.inHoleBout.boutId
                  ? {
                      ...eventMatBouts[idx].inHoleBout,
                      status: { state: "inHole" },
                    }
                  : null
              }
            />
          ))}
        </div>
      </div>
    </EventMatsContext.Provider>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventBouts);
