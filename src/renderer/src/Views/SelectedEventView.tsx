import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import EventCheckIn from "../Components/participants/EventCheckIn";
import Matching from "../Components/participants/Matching";
import {
  SelectAllBrackets,
  SelectAllParticipants,
  SelectSelectedEvent,
} from "../Features/combatEvent.slice";
import { REFRESH_EVENT_PARTICIPANTS_FROM_FSI } from "../Features/eventsAction";
import { IKFEvent } from "../Models";

type SelectedEventProps = {
  selectedEvent: IKFEvent;
  refreshParticipantsFromFSI: (eventUID: string, eventID: number) => void;
};

function mapStateToProps(state: any) {
  return {
    eventBrackets: SelectAllBrackets(state),
    eventParticipants: SelectAllParticipants(state),
    selectedEvent: SelectSelectedEvent(state),
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    refreshParticipantsFromFSI: (eventUID: string, eventID: number) =>
      dispatch(REFRESH_EVENT_PARTICIPANTS_FROM_FSI({ eventUID, eventID })),
  };
}

function SelectedEventView(props: SelectedEventProps) {
  const [viewState, setViewState] = useState("");
  useEffect(() => {
    console.log(props.selectedEvent);
  }, []);

  const subNavButtonClicked = (vState: number) => {
    switch (vState) {
      case 1: // Event CheckIn
        setViewState("Event CheckIn");
        break;
      case 2: // Match Making
        setViewState("Match Making");
        break;
      default:
        setViewState("");
    }
  };

  const refreshParticipantsClicked = () => {
    // props.refreshParticipantsFromFSI(
    //   props.selectedEvent.selectedEvent.eventUid,
    //   props.selectedEvent.selectedEvent.id
    // );
    console.log("Refresh Participants Clicked");
  };
  const renderViewState = () => {
    switch (viewState) {
      case "Event CheckIn": // Event CheckIn
        return <EventCheckIn />;
      case "Match Making": // Match Making
        return <Matching />;
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
              refreshParticipantsClicked();
            }}>
            Refresh Participants
          </Button>
        </Box>

        <Box></Box>
        {renderViewState()}
      </Box>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedEventView);
