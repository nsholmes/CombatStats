import { Box, Typography } from "@mui/material";
import { EventBracket } from "../Models/bracket.model";
import { IKFParticipant } from "../Models/fighter.model";
import {
  SelectAllBrackets,
  SelectAllParticipants,
} from "../Features/events.slice";
import { connect } from "react-redux";
import { SelectSelectedEvent } from "../Features/combatEvent.slice";
import { CombatEvent } from "../Models";
import { useEffect } from "react";
import EventCheckIn from "../Components/participants/EventCheckIn";

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
  useEffect(() => {
    console.log(props.selectedEvent);
    console.log(props.eventParticipants);
  }, []);
  return (
    <>
      <Box>
        <Typography variant='h3'>
          {props.selectedEvent.selectedEvent.eventName}
        </Typography>
        <EventCheckIn />
      </Box>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedEventView);
