import { Box, Button, Typography } from "@mui/material";
import { EventBracket } from "../Models/bracket.model";
import { IKFParticipant } from "../Models/fighter.model";
import {
  SelectAllBrackets,
  SelectAllParticipants,
} from "../Features/events.slice";
import { connect } from "react-redux";
import { SelectSelectedEvent } from "../Features/combatEvent.slice";
import { CombatEvent } from "../Models";
import { useEffect, useState } from "react";
import EventCheckIn from "../Components/participants/EventCheckIn";
import Matching from "../Components/participants/Matching";

type SelectedEventProps = {
  eventBrackets: EventBracket[];
  eventParticipants: IKFParticipant[];
  selectedEvent: CombatEvent;
};

function mapStateToProps(state: any) {
  return {
    eventBrackets: SelectAllBrackets(state),
    eventParticipants: SelectAllParticipants(state),
    selectedEvent: SelectSelectedEvent(state),
  };
}
function mapDispatchToProps(dispatch: any) {
  return {};
}

function SelectedEventView(props: SelectedEventProps) {
  const [viewState, setViewState] = useState("");
  useEffect(() => {
    console.log(props.selectedEvent);
    console.log(props.eventParticipants);
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

  const renderViewState = () => {
    switch (viewState) {
      case "Event CheckIn": // Event CheckIn
        return <EventCheckIn />;
      case "Match Making": // Match Making
        return <Matching />;
      default:
        return (
          <Box>
            <img src={`${props.selectedEvent.selectedEvent.posterUrl}`} />
          </Box>
        );
    }
  };

  return (
    <>
      <Box>
        <Typography variant='h3'>
          {`${props.selectedEvent.selectedEvent.eventName} - ${viewState}`}
        </Typography>
        <Box>
          <Button
            sx={{ fontSize: "24px" }}
            onClick={() => {
              subNavButtonClicked(1);
            }}>
            Event CheckIn
          </Button>
          <Button
            sx={{ fontSize: "24px" }}
            onClick={() => {
              subNavButtonClicked(2);
            }}>
            Match Making
          </Button>
        </Box>

        <Box></Box>
        {renderViewState()}
      </Box>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedEventView);
