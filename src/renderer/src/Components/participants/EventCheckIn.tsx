import Typography from "@mui/material/Typography";
import { IKFParticipant } from "../../Models/fighter.model";
import { SelectAllParticipants } from "../../Features/events.slice";
import { connect } from "react-redux";
import Box from "@mui/material/Box";

type CheckinProps = {
  eventParticipants: IKFParticipant[];
};

function mapStateToProps(state: any) {
  return {
    eventParticipants: SelectAllParticipants(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {};
}

function EventCheckIn(props: CheckinProps) {
  return (
    <>
      <Typography variant='h4'>Event Check In</Typography>
      {props.eventParticipants.map((participant, idx) => {
        return (
          <Box>{`${idx + 1}. ${participant.firstName} ${
            participant.lastName
          }`}</Box>
        );
      })}
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventCheckIn);
