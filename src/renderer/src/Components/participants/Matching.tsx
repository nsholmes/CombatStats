import { Box, Container, Typography } from "@mui/material";
import {
  ContextMenuType,
  PositionCoords,
} from "@nsholmes/combat-stats-types/contextMenu.model";
import { CSBracket } from "@nsholmes/combat-stats-types/event.model";
import {
  CheckInPariticipantSort,
  IKFParticipant,
} from "@nsholmes/combat-stats-types/fighter.model";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { moveSelectedCompetitor } from "../../Features/cbBracket.slice";
import {
  SelectAllBrackets,
  SelectAllParticipants,
  SelectBracketBySelectedId,
  SelectSelectedParticipants,
  setSelectedBracketId,
  setSelectedParticipantIds,
} from "../../Features/combatEvent.slice";
import {
  setCurrentMenu,
  setIsVisible,
  setMenuCoords,
} from "../../Features/contextMenu.slice";
import {
  setCurrentModal,
  setModalIsVisible,
} from "../../Features/modal.slice";
import {
  getAgeFromDOB,
  sortParticipantsForMatching,
} from "../../utils/participants";

type MatchingProps = {
  eventParticipants: IKFParticipant[];
  selectedParticipantIds: number[];
  selectAllBrackets: CSBracket[];
  selectedBracket: CSBracket;
  setSelectedBracketId: (bracketId: number) => void;
  moveSelectedCompetitor: (competitorId: string | null) => void;
  setCurrentContextMenu: (menuName: ContextMenuType) => void;
  setMenuIsVisible: (isVisible: boolean) => void;
  setMenuPosition: (coords: PositionCoords) => void;
  setSelectedParticipant: (participantIds: number[]) => void;
  setCurrentModal: (modalName: string) => void;
  setModalIsVisible: (isVisible: boolean) => void;
};

function mapStateToProps(state: any) {
  return {
    eventParticipants: SelectAllParticipants(state),
    selectedParticipantIds: SelectSelectedParticipants(state),
    selectAllBrackets: SelectAllBrackets(state),
    selectedBracket: SelectBracketBySelectedId(state),
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
    setCurrentModal: (modalName: string) =>
      dispatch(setCurrentModal(modalName)),
    setModalIsVisible: (isVisible: boolean) =>
      dispatch(setModalIsVisible(isVisible)),
    setSelectedBracketId: (bracketId: number) =>
      dispatch(setSelectedBracketId(bracketId)),
  };
}

function Matching(props: MatchingProps) {
  const [sortedParticipantsForMatching, setSortedParticipantsForMatching] =
    useState<CheckInPariticipantSort[]>([]);
  useEffect(() => {
    props.setCurrentContextMenu("matching");
    console.log(props.selectAllBrackets);
  }, []);

  useEffect(() => {
    setSortedParticipantsForMatching(
      sortParticipantsForMatching(props.eventParticipants)
    );
  }, [props.eventParticipants]);

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

  const handleBracketSelect = (bracketId: { mat: number; id: number }) => {
    props.setSelectedBracketId(bracketId.id);

    const brks = props.selectAllBrackets;

    let selectedParticipants: number[] = [];

    brks.map((bracket) => {
      if (bracket.bracketId == bracketId.id)
        selectedParticipants = bracket.competitors.map(
          (comp) => comp.competitorId
        );
    });
    props.setSelectedParticipant(selectedParticipants);
    props.setModalIsVisible(true);
    props.setCurrentModal("createBracket");
  };

  const getParticipantBrackets = (partId: number) => {
    const brackets = props.selectAllBrackets;
    let selectedBracket: CSBracket;
    const bracketIds: { mat: number; id: number }[] = [];
    brackets.forEach((bracket) => {
      if (
        bracket.competitors &&
        bracket.competitors.some((c) => c.participantId === partId)
      ) {
        selectedBracket = bracket;
        bracketIds.push({
          mat: bracket.matNumber,
          id: bracket.bracketId as number,
        });
      }
    });

    return bracketIds.map((br) => (
      <Typography
        key={`shortBracketId-${br.id}`}
        variant='caption'
        sx={{
          cursor: "pointer",
          ":hover": {
            textDecoration: "underline",
          },
          marginRight: 1,
          border: "1px solid gold",
          padding: "5px",
        }}
        onClick={() => {
          handleBracketSelect(br);
        }}>
        {`${selectedBracket.divisionName}`}
      </Typography>
    ));
  };

  // #endregion
  return (
    <Box className='pt-2 bg-gray-100 dark:bg-gray-900'>
      <Box>
        <Typography variant='h4' className='text-center'>
          Match Participants
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: 2,
          flexWrap: "wrap",
          backgroundColor: "#2D3E40",
        }}>
        {sortedParticipantsForMatching.map((weightRange, idx) => {
          return (
            <Box
              className='bg-white p-2 dark:border-gray-700 dark:bg-gray-800'
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
                      color: isSelected ? "#fff" : "#fff",
                      borderBottom:
                        participant.bracketCount > 0
                          ? "3px solid #2D3E40"
                          : "1px solid #E4F2E7",
                      marginBottom: "3px",
                      padding: "5px",
                    }}
                    key={`Participant-${idx}`}>
                    <Container
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}>
                      <Box
                        onClick={() => {
                          participantSelected(participant.participantId);
                        }}
                        sx={{
                          ":hover": {
                            textDecoration: "underline",
                            cursor: "pointer",
                          },
                          padding: "5px",
                          borderRadius: "8px",
                          backgroundColor: isSelected ? "#1976d2" : "inherit", // Highlight selected
                        }}>
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
                        <Box>
                          {`(${getAgeFromDOB(participant.dob)} yo) (${
                            participant.weight === null
                              ? 0
                              : participant.weight
                          }lbs)`}
                        </Box>
                      </Box>
                      <Box>
                        {participant.bracketCount > 0 ? (
                          <Box
                            sx={{
                              color: "gold",
                              textAlign: "center",
                            }}>
                            {getParticipantBrackets(participant.participantId)}
                          </Box>
                        ) : null}
                      </Box>
                    </Container>
                  </Box>
                ) : null;
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Matching);
