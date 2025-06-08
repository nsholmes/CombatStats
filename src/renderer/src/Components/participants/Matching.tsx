import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  CheckInPariticipantSort,
  IKFParticipant,
} from "../../Models/fighter.model";
import {
  getAgeFromDOB,
  sortParticipantsForMatching,
} from "../../utils/participants";
import { SelectAllParticipants } from "../../Features/events.slice";
import { Typography, TextField, Box } from "@mui/material";
import { ContextMenuType, PositionCoords } from "../../Models";
import {
  setSelectedBracketCompetitor,
  moveSelectedCompetitor,
} from "../../Features/cbBracket.slice";
import {
  setCurrentMenu,
  setIsVisible,
  setMenuCoords,
} from "../../Features/contextMenu.slice";

type MatchingProps = {
  eventParticipants: IKFParticipant[];
  moveSelectedCompetitor: (competitorId: string | null) => void;
  setCurrentContextMenu: (menuName: ContextMenuType) => void;
  setMenuIsVisible: (isVisible: boolean) => void;
  setMenuPosition: (coords: PositionCoords) => void;
  setSelectedCompetitor: (competitorId: string | null) => void;
};

function mapStateToProps(state: any) {
  return {
    eventParticipants: SelectAllParticipants(state),
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
    setSelectedCompetitor: (competitorId: string | null) =>
      dispatch(setSelectedBracketCompetitor(competitorId)),
    moveSelectedCompetitor: (competitorId: string | null) =>
      dispatch(moveSelectedCompetitor(competitorId)),
  };
}

function Matching(props: MatchingProps) {
  // #region State
  const [filteredParticipants, setFilteredParticipants] = useState<
    IKFParticipant[]
  >(props.eventParticipants);

  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    []
  );
  // #endregion
  const [sortedParticipantsForMatching, setSortedParticipantsForMatching] =
    useState<CheckInPariticipantSort[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    props.setCurrentContextMenu("matching");
  }, []);
  useEffect(() => {
    if (!searchValue) {
      setFilteredParticipants(props.eventParticipants);
      setSortedParticipantsForMatching(
        sortParticipantsForMatching(props.eventParticipants)
      );
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

  //#region Event Handlers
  const showContextMenu = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault();
    const selectedId = ev.currentTarget.getAttribute("id");
    props.setSelectedCompetitor(selectedId);
    props.setMenuIsVisible(false);
    const positionChange: PositionCoords = {
      xpos: ev.clientX,
      ypos: ev.clientY,
    };
    props.setMenuPosition(positionChange);
    props.setMenuIsVisible(true);
  };

  const hideContextMenu = () => {
    props.setMenuIsVisible(false);
  };

  const participantSelected = (participantId: number) => {
    if (selectedParticipants.includes(participantId)) {
      // If already selected, remove from selectedParticipants
      setSelectedParticipants(
        selectedParticipants.filter((id) => id !== participantId)
      );
    } else {
      // If not selected, add to selectedParticipants
      setSelectedParticipants([...selectedParticipants, participantId]);
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
      <Box
        onClick={(e) => {
          hideContextMenu();
        }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100vw",
            flexWrap: "wrap",
            backgroundColor: "#2D3E40",
          }}>
          {sortedParticipantsForMatching.map((weightRange, idx) => {
            return (
              <Box
                sx={{ backgroundColor: "#93BFB7", padding: 2 }}
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
                    selectedParticipants.findIndex(
                      (p) => participant.participantId === p
                    ) !== -1;
                  return participant.profileName === "Competitor" ? (
                    <Box
                      sx={{
                        color: isSelected ? "#fff" : "#2D3E40",
                        borderBottom: "1px solid #E4F2E7",
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
