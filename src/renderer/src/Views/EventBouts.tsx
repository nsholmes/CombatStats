import { UniqueIdentifier } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import EventMatDisplay from "../Components/bouts/EventMatDisplay";
import {
  SelectAllBrackets,
  SelectMats,
  setBouts,
  setMats,
  updateMatBouts,
} from "../Features/combatEvent.slice";
import { CSBout, CSBracket, CSMat, EventMatDisplayProps } from "../Models";
import { IKFParticipant } from "../Models/fighter.model";

type EventBoutsProps = {
  setEventMats: (mats: CSMat[]) => void;
  setBouts: (bouts: CSBracket[]) => void;
  updateMatBouts: (bouts: EventMatDisplayProps) => void;
  getEventMats: CSMat[];
  brackets: CSBracket[];
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
  };
}

function EventBouts(props: EventBoutsProps) {
  const [eventMatBouts, setEventMatBouts] = useState<EventMatDisplayProps[]>(
    []
  );
  const [eventBouts, setEventBouts] = useState<CSBout[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  void activeId;

  useEffect(() => {
    props.setBouts(props.brackets);
    props.brackets.map((bracket) => {
      console.log("MAT: ", bracket.matNumber);
      createBracketBouts(
        bracket.bracketId as number,
        bracket.matNumber,
        bracket.competitors
      );
    });
  }, []);

  useEffect(() => {
    const matBouts: EventMatDisplayProps[] = [];
    eventBouts.map((bout) => {});
    initMatCurrentBouts();
    // initMatOnDeckBouts();
  }, [eventBouts]);

  function initMatCurrentBouts() {
    console.log(eventBouts);
    const eventMatBoutsArr: EventMatDisplayProps[] = [];
    const matCount = props.getEventMats.length;
    for (let i = 0; i < matCount; i++) {
      const matDisplay: EventMatDisplayProps = {
        currentBout: eventBouts[i],
        onDeckBout: null,
        inHoleBout: null,
        matId: i,
      };
      props.updateMatBouts(matDisplay);
      eventMatBoutsArr.push(matDisplay);
    }

    // props.getEventMats.map((mat, idx) => {
    //   const currentBout =
    //     idx == 0 ? eventBouts[idx] : eventBouts[matCount * idx];
    //   const onDeckBout =
    //     idx == 0 ? eventBouts[idx + 1] : eventBouts[matCount * idx + 1];
    //   const inHoleBout =
    //     idx == 0 ? eventBouts[idx + 2] : eventBouts[matCount * idx + 2];

    //   if (mat.currentBout === null) {
    //     const nextBout = eventBouts.find(
    //       (bout) => bout.status === "notStarted"
    //     ) as CSBout;
    //     eventMatBoutsArr.push({
    //       currentBout: currentBout,
    //       onDeckBout: onDeckBout,
    //       inHoleBout: inHoleBout,
    //       matId: idx,
    //     });
    //   }
    // });
    setEventMatBouts(eventMatBoutsArr);
  }

  function initMatOnDeckBouts() {
    const eventMatBoutsArr: EventMatDisplayProps[] = [];
    props.getEventMats.map((mat, idx) => {
      if (mat.currentBout && mat.onDeckBout === null) {
        const onDeckBout = eventBouts.find(
          (bout) => bout.status === "notStarted"
        ) as CSBout;
        eventMatBoutsArr.push({
          currentBout: mat.currentBout,
          onDeckBout: { ...onDeckBout, status: "notStarted" },
          inHoleBout: null,
          matId: idx,
        });
      }
    });
  }

  function createBracketBouts(
    bracketId: number,
    matId: number,
    competitors: IKFParticipant[]
  ): CSBout[] {
    const bracketBouts: CSBout[] = [];
    switch (competitors.length) {
      case 2: // 2 competitors
        console.log(`Competitors: ${competitors}`);
        const bout: CSBout = {
          boutId: `r1-${matId}-${bracketId}-${competitors[0].participantId}-${competitors[1].participantId}`,
          bracketId: bracketId,
          matId,
          roundNumber: 1,
          redCorner: competitors[0],
          blueCorner: competitors[1],
          winnerID: null,
          loserID: null,
          status: "notStarted",
        };
        bracketBouts.push(bout);
        break;
      case 3: // 3 Competitors
        const r1Bout: CSBout = {
          boutId: `r1-${matId}-${bracketId}-${competitors[1].participantId}-${competitors[2].participantId}`,
          bracketId: bracketId,
          matId,
          roundNumber: 1,
          redCorner: competitors[1],
          blueCorner: competitors[2],
          winnerID: null,
          loserID: null,
          status: "notStarted",
        };
        bracketBouts.push(r1Bout);
        const r2Bout: CSBout = {
          boutId: `r2-${matId}-${bracketId}-${competitors[0].participantId}-blueCorner`,
          bracketId: bracketId,
          matId,
          roundNumber: 2,
          redCorner: competitors[0],
          blueCorner: null,
          winnerID: null,
          loserID: null,
          status: "notStarted",
        };
        bracketBouts.push(r2Bout);
        break;
      case 4: // 4 Competitors
        const r1Bout1: CSBout = {
          boutId: `r1-${matId}-${bracketId}-${competitors[0].participantId}-${competitors[1].participantId}`,
          bracketId: bracketId,
          matId,
          roundNumber: 1,
          redCorner: competitors[0],
          blueCorner: competitors[1],
          winnerID: null,
          loserID: null,
          status: "notStarted",
        };
        bracketBouts.push(r1Bout1);
        const r1bout2: CSBout = {
          boutId: `r1-${matId}-${bracketId}-${competitors[2].participantId}-${competitors[3].participantId}`,
          bracketId: bracketId,
          matId,
          roundNumber: 1,
          redCorner: competitors[2],
          blueCorner: competitors[3],
          winnerID: null,
          loserID: null,
          status: "notStarted",
        };
        bracketBouts.push(r1bout2);
        const r2bout1: CSBout = {
          boutId: `r2-${matId}-${bracketId}-semiFinal1`,
          bracketId: bracketId,
          matId,
          roundNumber: 2,
          redCorner: null,
          blueCorner: null,
          winnerID: null,
          loserID: null,
          status: "notStarted",
        };
        bracketBouts.push(r2bout1);
        const r2bout2: CSBout = {
          boutId: `r2-${matId}-${bracketId}-semiFinal2`,
          bracketId: bracketId,
          matId,
          roundNumber: 2,
          redCorner: null,
          blueCorner: null,
          winnerID: null,
          loserID: null,
          status: "notStarted",
        };
        bracketBouts.push(r2bout2);
        break;
      default:
        break;
    }

    const cleanArr: CSBout[] = [];

    setEventBouts((prev) => {
      bracketBouts.map((bout) => {
        if (prev.findIndex((p) => bout.boutId == p.boutId) === -1) {
          cleanArr.push(bout);
        }
      });
      const newArr = [...prev, ...cleanArr].sort(
        (a, b) => a.roundNumber - b.roundNumber
      );
      return newArr;
    });

    return bracketBouts;
  }

  return (
    <div>
      <h2 className='text-center font-black'>{`Event Bouts`}</h2>
      <div className='flex flex-wrap justify-around gap-4'>
        {eventMatBouts.map((mat, idx) => (
          <EventMatDisplay
            matName={(mat.matId + 1).toString()}
            currrentBout={eventMatBouts[idx]?.currentBout}
            onDeckBout={eventMatBouts[idx]?.onDeckBout}
            inHoleBout={eventMatBouts[idx]?.inHoleBout}
          />
        ))}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventBouts);
