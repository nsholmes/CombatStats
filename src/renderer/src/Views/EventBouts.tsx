import { useEffect, useState } from "react";
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
import { CSBout, CSBracket, CSMat, EventMatDisplayProps } from "../Models";

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

  useEffect(() => {
    props.setBouts(props.brackets);
    initMatCurrentBouts();
  }, []);

  function initMatCurrentBouts() {
    const eventMatBoutsArr: EventMatDisplayProps[] = [];
    const matCount = props.getEventMats.length;
    const bouts = props.getBouts;
    if (bouts.length > 0 && matCount > 0) {
      for (let i = 0; i < matCount; i++) {
        const matDisplay: EventMatDisplayProps = {
          currentBout: bouts[i],
          onDeckBout: bouts[i + matCount],
          inHoleBout: bouts[i + 2 * matCount],
          matId: i,
        };
        props.updateMatBouts(matDisplay);
        eventMatBoutsArr.push(matDisplay);
      }
      setEventMatBouts(eventMatBoutsArr);
    }
  }

  return (
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
                    status: { state: "queued" },
                  }
                : null
            }
            onDeckBout={
              eventMatBouts[idx]?.onDeckBout &&
              eventMatBouts[idx]?.onDeckBout.boutId
                ? {
                    ...eventMatBouts[idx].onDeckBout,
                    status: { state: "queued" },
                  }
                : null
            }
            inHoleBout={
              eventMatBouts[idx]?.inHoleBout &&
              eventMatBouts[idx]?.inHoleBout.boutId
                ? {
                    ...eventMatBouts[idx].inHoleBout,
                    status: { state: "queued" },
                  }
                : null
            }
          />
        ))}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventBouts);
