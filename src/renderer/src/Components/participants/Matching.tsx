import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { moveSelectedCompetitor } from "../../Features/cbBracket.slice";
import {
  SelectAllParticipants,
  SelectSelectedParticipants,
  setSelectedParticipantIds,
} from "../../Features/combatEvent.slice";
import {
  setCurrentMenu,
  setIsVisible,
  setMenuCoords,
} from "../../Features/contextMenu.slice";
import { ContextMenuType, PositionCoords } from "../../Models";
import {
  CheckInPariticipantSort,
  IKFParticipant,
} from "../../Models/fighter.model";
import {
  getAgeFromDOB,
  sortParticipantsForMatching,
} from "../../utils/participants";

type MatchingProps = {
  eventParticipants: IKFParticipant[];
  selectedParticipantIds: number[];
  moveSelectedCompetitor: (competitorId: string | null) => void;
  setCurrentContextMenu: (menuName: ContextMenuType) => void;
  setMenuIsVisible: (isVisible: boolean) => void;
  setMenuPosition: (coords: PositionCoords) => void;
  setSelectedParticipant: (participantIds: number[]) => void;
};

function mapStateToProps(state: any) {
  return {
    eventParticipants: SelectAllParticipants(state),
    selectedParticipantIds: SelectSelectedParticipants(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setCurrentContextMenu: (menuName: ContextMenuType) =>
      dispatch(setCurrentMenu(menuName)),
    setMenuIsVisible: (isVisible: boolean) =>
      dispatch(setIsVisible(isVisible)),
    setMenuPosition: (coords: PositionCoords) =>
      dispatch(setMenuCoords(coords)),
    moveSelectedCompetitor: (competitorId: string | null) =>
      dispatch(moveSelectedCompetitor(competitorId)),
    setSelectedParticipant: (participantIds: number[]) =>
      dispatch(setSelectedParticipantIds(participantIds)),
  };
}

function Matching(props: MatchingProps) {
  // #region State
  // const [filteredParticipants, setFilteredParticipants] = useState<
  //   IKFParticipant[]
  // >(props.eventParticipants);

  // const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
  //   []
  // );
  // #endregion
  const [sortedParticipantsForMatching, setSortedParticipantsForMatching] =
    useState<CheckInPariticipantSort[]>([]);
  // const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    props.setCurrentContextMenu("matching");
  }, []);

  useEffect(() => {
    // if (props.selectedParticipantIds.length === 0) setSelectedParticipants([]);
  }, [props.selectedParticipantIds]);

  useEffect(() => {
    setSortedParticipantsForMatching(
      sortParticipantsForMatching(props.eventParticipants)
    );
  }, [props.eventParticipants]);

  // useEffect(() => {
  //   props.setSelectedParticipant(selectedParticipants);
  // }, [selectedParticipants]);

  //#region Event Handlers
  const showContextMenu = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault();
    console.log("Context Menu Triggered", ev.currentTarget);
    props.setMenuIsVisible(false);
    const positionChange: PositionCoords = {
      xpos: ev.clientX,
      ypos: ev.clientY,
    };
    props.setMenuPosition(positionChange);
    props.setMenuIsVisible(true);
  };

  // const hideContextMenu = () => {
  //   props.setMenuIsVisible(false);
  // };

  const participantSelected = (participantId: number) => {
    if (props.selectedParticipantIds.includes(participantId)) {
      // If already selected, remove from selectedParticipants
      props.setSelectedParticipant(
        props.selectedParticipantIds.filter((id) => id !== participantId)
      );
    } else {
      // If not selected, add to selectedParticipants
      props.setSelectedParticipant([
        ...props.selectedParticipantIds,
        participantId,
      ]);
    }
  };

  // #endregion
  return (
    <>
      {/* <TextField
        variant='filled'
        sx={{ backgroundColor: "#fff" }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder='Search by Name'
      /> */}
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100vh",
            flexWrap: "wrap",
            backgroundColor: "#2D3E40",
          }}>
          {sortedParticipantsForMatching.map((weightRange, idx) => {
            return (
              <Box
                sx={{
                  backgroundColor: "#93BFB7",
                  padding: 2,
                }}
                key={`WeightRange-${idx}`}
                onContextMenu={showContextMenu}>
                {weightRange.weightMin === 0 && weightRange.weightMax === 0 ? (
                  <Box>
                    <Typography variant='h5'>Weight Unknown</Typography>
                  </Box>
                ) : (
                  <Box>
                    <h3>{`${weightRange.weightMin}lbs - ${weightRange.weightMax}lbs`}</h3>
                  </Box>
                )}
                {weightRange.participants.map((participant, idx) => {
                  const isSelected =
                    props.selectedParticipantIds.findIndex(
                      (p) => participant.participantId === p
                    ) !== -1;
                  return participant.profileName === "Competitor" ? (
                    <Box
                      sx={{
                        color: isSelected ? "#fff" : "#2D3E40",
                        borderBottom: "1px solid #E4F2E7",
                        borderColor:
                          participant.bracketCount > 0 ? "#2D3E40" : "#E4F2E7",
                        marginBottom: "3px",
                        padding: "5px",
                        ":hover": {
                          backgroundColor: "#E4F2E7",
                          cursor: "pointer",
                        },
                        backgroundColor: isSelected ? "#1976d2" : "inherit", // Highlight selected
                      }}
                      onClick={() => {
                        participantSelected(participant.participantId);
                      }}
                      key={`Participant-${idx}`}>
                      <Box>
                        {`${idx + 1}. ${participant.firstName} ${
                          participant.lastName
                        }`}{" "}
                        &nbsp;
                        <Typography
                          sx={{
                            display: "inline",
                            ...(participant.gender === "F"
                              ? { color: "pink" }
                              : {}),
                          }}>{`(${participant.gender})`}</Typography>
                      </Box>
                      <Box>
                        {`(${getAgeFromDOB(participant.dob)} yo) (${
                          participant.weight === null ? 0 : participant.weight
                        }lbs)`}
                      </Box>
                    </Box>
                  ) : (
                    <></>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Matching);
