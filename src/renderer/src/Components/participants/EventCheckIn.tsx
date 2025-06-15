import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { SelectAllParticipants } from "../../Features/combatEvent.slice";
import { IKFParticipant } from "../../Models/fighter.model";
import {
  getAgeFromDOB,
  sortParticipantsForMatching,
} from "../../utils/participants";

type CheckinProps = {
  eventParticipants: IKFParticipant[];
};

function mapStateToProps(state: any) {
  return {
    eventParticipants: SelectAllParticipants(state),
  };
}

// function mapDispatchToProps(dispatch: any) {
//   return {};
// }

function EventCheckIn(props: CheckinProps) {
  const [filteredParticipants, setFilteredParticipants] = useState<
    IKFParticipant[]
  >(props.eventParticipants);
  // const [sortedParticipantsForCheckin, setSortedParticipantsForCheckin] =
  //   useState<CheckInPariticipantSort[]>([]);
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
          }}>
          {filteredParticipants.map((participant, idx) => {
            return participant.profileName === "Competitor" ? (
              <Box
                sx={{ backgroundColor: "#93BFB7", padding: 2, width: "200px" }}
                key={`WeightRange-${idx}`}>
                <Box>
                  {`${idx + 1}. ${participant.firstName} ${
                    participant.lastName
                  }`}
                </Box>

                <Box
                  sx={{
                    color: "#2D3E40",
                    padding: "5px",
                  }}
                  key={`Participant-${idx}`}>
                  <Box></Box>
                  <Box>
                    {`(${getAgeFromDOB(participant.dob)} yo) (${
                      participant.weight === null ? 0 : participant.weight
                    }lbs) (${participant.gender})`}
                  </Box>
                </Box>
              </Box>
            ) : (
              <></>
            );
          })}
        </Box>
      </Box>
    </>
  );
}

export default connect(mapStateToProps, null)(EventCheckIn);
