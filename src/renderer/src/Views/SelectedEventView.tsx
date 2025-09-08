import { Box, Button, Typography } from "@mui/material";
import { eventModel } from "@nsholmes/combat-stats-types";
import { CombatEvent } from "@nsholmes/combat-stats-types/event.model";
import { onValue, ref } from "firebase/database";
import { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import BracketList from "../Components/brackets/BracketList";
import EventCheckIn from "../Components/participants/EventCheckIn";
import Matching from "../Components/participants/Matching";
import { SYNC_COMBAT_EVENT } from "../Features/combatEvent.actions";
import {
  SelectAllBrackets,
  SelectAllParticipants,
  SelectCombatEventState,
  SelectSelectedEvent,
  updateCombatEvent,
} from "../Features/combatEvent.slice";
import { REFRESH_EVENT_PARTICIPANTS_FROM_FSI } from "../Features/eventsAction";
import { ikfpkbDB } from "../FirebaseConfig";
import EventBouts from "./EventBouts";
import EventDetails from "./EventDetails";
import EventResults from "./EventResults";

type SelectedEventProps = {
  selectedEvent: eventModel.IKFEvent;
  selectedCombatEvent: eventModel.CombatEvent;
  refreshParticipantsFromFSI: (eventUID: string, eventID: number) => void;
  syncDBWithCombatEventSlice: (event: eventModel.CombatEvent) => void;
  resetCombatEvent: () => void;
  updateCombatEvent: (event: CombatEvent) => void;
};

function mapStateToProps(state: any) {
  return {
    eventBrackets: SelectAllBrackets(state),
    eventParticipants: SelectAllParticipants(state),
    selectedEvent: SelectSelectedEvent(state),
    selectedCombatEvent: SelectCombatEventState(state),
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    refreshParticipantsFromFSI: (eventUID: string, eventID: number) =>
      dispatch(REFRESH_EVENT_PARTICIPANTS_FROM_FSI({ eventUID, eventID })),
    syncDBWithCombatEventSlice: (event: eventModel.CombatEvent) =>
      dispatch(SYNC_COMBAT_EVENT(event)),
    resetCombatEvent: () => dispatch({ type: "RESET_COMBAT_EVENT" }),
    updateCombatEvent: (event: CombatEvent) =>
      dispatch(updateCombatEvent(event)),
  };
}

export const EventContext = createContext<CombatEvent | null>(null);

function SelectedEventView(props: SelectedEventProps) {
  const [eventData, setEventData] = useState<CombatEvent | null>(null);
  const [viewState, setViewState] = useState("");
  useEffect(() => {
    // props.syncDBWithCombatEventSlice(props.selectedCombatEvent);
    // console.log("TODO: Check Need for this variable: ", props.selectedEvent);
    const db = ikfpkbDB();
    const combatEventref = ref(db, "combatEvent");

    let combatEvent: CombatEvent = {} as CombatEvent;

    onValue(combatEventref, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Current event found in Firebase.");
        const objEvent = snapshot.val();
        combatEvent = objEvent as CombatEvent;
        setEventData(combatEvent);
        props.updateCombatEvent(combatEvent);
      } else {
        console.log("No current event found.");
      }
    });
  }, []);

  const subNavButtonClicked = (vState: number) => {
    // props.syncDBWithCombatEventSlice(props.selectedCombatEvent);
    switch (vState) {
      case 1: // Event CheckIn
        setViewState("Event CheckIn");
        break;
      case 2: // Match Making
        setViewState("Match Making");
        break;
      case 3: //Bracket Lists
        setViewState("Bracket List");
        break;
      case 4: //Event Details
        setViewState("Event Details");
        break;
      case 5: //Event Details
        setViewState("Event Bouts");
        break;
      case 6: // Event Results
        setViewState("Event Results");
        break;
      default:
        setViewState("");
    }
  };

  const renderViewState = () => {
    switch (viewState) {
      case "Event CheckIn": // Event CheckIn
        return <EventCheckIn />;
      case "Match Making": // Match Making
        return <Matching />;
      case "Bracket List": // Bracket List
        return <BracketList />;
      case "Event Details": //Event Details
        return <EventDetails />;
      case "Event Bouts": //Event Details
        return <EventBouts />;
      case "Event Results": // Event Results
        return <EventResults />;
      default:
        return (
          <Box>
            <img src={`${props.selectedEvent.posterUrl}`} />
          </Box>
        );
    }
  };

  return (
    <EventContext.Provider value={eventData}>
      <div className=''>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginBottom: 2,
            marginTop: "-53px",
            position: "fixed",
            padding: "5px",
            backgroundColor: "#1e2939",
          }}>
          <Button
            variant='outlined'
            sx={{ fontSize: "18px" }}
            onClick={() => {
              subNavButtonClicked(1);
            }}>
            Event CheckIn
          </Button>
          <Button
            variant='outlined'
            sx={{ fontSize: "18px" }}
            onClick={() => {
              subNavButtonClicked(2);
            }}>
            Match Making
          </Button>
          <Button
            variant='outlined'
            sx={{ fontSize: "18px" }}
            onClick={() => {
              subNavButtonClicked(3);
            }}>
            Brackets
          </Button>
          <Button
            variant='outlined'
            sx={{ fontSize: "18px" }}
            onClick={() => {
              subNavButtonClicked(5);
            }}>
            Event Bouts
          </Button>
          <Button
            variant='outlined'
            sx={{ fontSize: "18px" }}
            onClick={() => {
              subNavButtonClicked(4);
            }}>
            Event Details
          </Button>
          <Button
            variant='outlined'
            sx={{ fontSize: "18px" }}
            onClick={() => {
              subNavButtonClicked(6);
            }}>
            Event Results
          </Button>
          <Button
            variant='outlined'
            sx={{ fontSize: "18px" }}
            onClick={() => {
              props.resetCombatEvent();
            }}>
            Reset Event
          </Button>
          <Typography variant='h6'>
            {`${props.selectedEvent.eventName} - ${viewState}`}
          </Typography>
        </Box>
      </div>
      <div className='mt-26'>{renderViewState()}</div>
    </EventContext.Provider>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedEventView);
