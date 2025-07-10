import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  SelectAllParticipants,
  updateParticipantWeight,
} from "../../Features/combatEvent.slice";
import { IKFParticipant } from "../../Models/fighter.model";
import { sortParticipantsForMatching } from "../../utils/participants";
import CheckInParticipant from "./CheckInParticipant";

type CheckinProps = {
  eventParticipants: IKFParticipant[];
  updateParticipantWeight: (weight: number, participantId: number) => void;
};

function mapStateToProps(state: any) {
  return {
    eventParticipants: SelectAllParticipants(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    updateParticipantWeight: (weight: number, participantId: number) => {
      dispatch(updateParticipantWeight({ weight, participantId }));
    },
  };
}

function EventCheckIn(props: CheckinProps) {
  const [filteredParticipants, setFilteredParticipants] = useState<
    IKFParticipant[]
  >(props.eventParticipants);
  const [searchValue, setSearchValue] = useState<string>("");
  useEffect(() => {
    if (!searchValue) {
      setFilteredParticipants(props.eventParticipants);
      sortParticipantsForMatching(props.eventParticipants);
      // setSortedParticipantsForCheckin(
      // );
    } else {
      const lower = searchValue.toLowerCase();
      setFilteredParticipants(
        props.eventParticipants.filter(
          (p) =>
            p.firstName.toLowerCase().includes(lower) ||
            p.lastName.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchValue, props.eventParticipants]);

  const weightUpdateFunction = (weight: number, participantId: number) => {
    props.updateParticipantWeight(weight, participantId);
  };
  return (
    <>
      <Typography variant='h4'>[Event Check In]</Typography>
      <TextField
        variant='filled'
        sx={{ backgroundColor: "#fff" }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder='Search by Name'
      />
      <Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100vw",
            flexWrap: "wrap",
            fontSize: "18px",
            backgroundColor: "#2D3E40",
            padding: 3,
          }}>
          {filteredParticipants.map((participant) => {
            return participant.profileName === "Competitor" ? (
              <CheckInParticipant
                participant={participant}
                updateWeightFunc={weightUpdateFunction}
              />
            ) : (
              <></>
            );
          })}
        </Box>
      </Box>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventCheckIn);
