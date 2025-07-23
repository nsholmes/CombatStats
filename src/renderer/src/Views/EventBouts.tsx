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
  setBoutsFromDB,
  setMats,
  updateMatBouts,
} from "../Features/combatEvent.slice";

type EventBoutsProps = {
  setEventMats: (mats: CSMat[]) => void;
  setBouts: (bouts: CSBracket[]) => void;
  setBoutsFromDB: (bouts: CSBout[]) => void;
  updateMatBouts: (bouts: EventMatDisplayProps) => void;
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
    setupMatBouts();
    const db = getDatabase();
    const matsRef = ref(db, "combatEvent/mats");
    const boutsRef = ref(db, "combatEvent/bouts");

    onValue(boutsRef, (snapshot) => {
      const boutsData = snapshot.val();
      if (boutsData) {
        const bouts: CSBout[] = Object.values(boutsData);
        console.log("Bouts data updated:", bouts);
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
    console.log("Event Mat Bouts Updated:", eventMatBouts);
  }, [eventMatBouts]);

  function setupMatBouts() {
    const eventMatBoutsArr: EventMatDisplayProps[] = [];
    const matCount = props.getEventMats.length;
    const bouts = props.getBouts;
    const availableBouts = bouts.filter(
      (bout) => bout.status.state !== "completed"
    );
    if (availableBouts.length > 0 && matCount > 0) {
      // check if the current bout status.state = "completed"
      console.log(
        "Setting up Mat Bouts with available bouts:",
        availableBouts
      );

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
    return props.getBouts.find((bout) => bout.boutId === boutId) || null;
  };

  return (
    <EventMatsContext.Provider value={eventMatBouts}>
      <div>
        <h2 className='text-center font-black'>{`Event Bouts`}</h2>
        <div className='flex flex-wrap justify-around gap-4'>
          {eventMatBouts.map((bout, idx) => (
            <EventMatDisplay
              key={`${bout.matId}-${idx}-MatDisplay`}
              matName={(bout.matId + 1).toString()}
              currentBout={getBoutById(bout.currentBoutId)}
              onDeckBout={getBoutById(bout.onDeckBoutId)}
              inHoleBout={getBoutById(bout.inHoleBoutId)}
            />
          ))}
        </div>
      </div>
    </EventMatsContext.Provider>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventBouts);
