import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import BracketList from "../Components/brackets/BracketList";
import EventCheckIn from "../Components/participants/EventCheckIn";
import Matching from "../Components/participants/Matching";
import { SYNC_COMBAT_EVENT } from "../Features/CombatEvent.actions";
import {
  SelectAllBrackets,
  SelectAllParticipants,
  SelectCombatEventState,
  SelectSelectedEvent,
} from "../Features/combatEvent.slice";
import { REFRESH_EVENT_PARTICIPANTS_FROM_FSI } from "../Features/eventsAction";
import { CombatEvent, IKFEvent } from "../Models";
import EventDetails from "./EventDetails";

type SelectedEventProps = {
  selectedEvent: IKFEvent;
  selectedCombatEvent: CombatEvent;
  refreshParticipantsFromFSI: (eventUID: string, eventID: number) => void;
  syncDBWithCombatEventSlice: (event: CombatEvent) => void;
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
    syncDBWithCombatEventSlice: (event: CombatEvent) =>
      dispatch(SYNC_COMBAT_EVENT(event)),
  };
}

function SelectedEventView(props: SelectedEventProps) {
  const [viewState, setViewState] = useState("");
  useEffect(() => {
    props.syncDBWithCombatEventSlice(props.selectedCombatEvent);
    console.log("TODO: Check Need for this variable: ", props.selectedEvent);
  }, []);

  const subNavButtonClicked = (vState: number) => {
    props.syncDBWithCombatEventSlice(props.selectedCombatEvent);
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
      default:
        return (
          <Box>
            <img src={`${props.selectedEvent.posterUrl}`} />
          </Box>
        );
    }
  };

  return (
    <>
      <Box>
        <Typography variant='h6'>
          {`${props.selectedEvent.eventName} - ${viewState}`}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2, marginTop: 2 }}>
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
              subNavButtonClicked(4);
            }}>
            Event Details
          </Button>
        </Box>

        <Box></Box>
        {renderViewState()}
      </Box>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedEventView);
