import { Typography } from "@mui/material";
import {
  ContextMenuType,
  PositionCoords,
} from "@nsholmes/combat-stats-types/contextMenu.model";
import {
  CombatEvent,
  CSBracket,
} from "@nsholmes/combat-stats-types/event.model";
import {
  CheckInPariticipantSort,
  IKFParticipant,
} from "@nsholmes/combat-stats-types/fighter.model";
import { useContext, useEffect, useState } from "react";
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
import { setCurrentModal, setModalIsVisible } from "../../Features/modal.slice";
import {
  getAgeFromDOB,
  sortParticipantsForMatching,
} from "../../utils/participants";
import { EventContext } from "../../Views/SelectedEventView";
import MainButton from "../MainButton";

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
    setMenuIsVisible: (isVisible: boolean) => dispatch(setIsVisible(isVisible)),
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
  const eventData = useContext(EventContext);
  const { participants, brackets } = eventData as CombatEvent || {participants: [], brackets: []};
  const [bracketCount, setBracketCount] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<
    "Juniors" | "Boys" | "Girls" | "F" | "M" | "All"
  >("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortedParticipantsForMatching, setSortedParticipantsForMatching] =
    useState<CheckInPariticipantSort[]>([]);

  useEffect(() => {
    props.setCurrentContextMenu("matching");
  }, []);

  useEffect(() => {
    console.log(searchValue);
  }, [searchValue]);

  useEffect(() => {
    setSortedParticipantsForMatching(
      sortParticipantsForMatching(participants, filterMode)
    );
  }, [filterMode]);

  // useEffect(() => {
  //   setSortedParticipantsForMatching(
  //     sortParticipantsForMatching(participants)
  //   );
  // }, [participants]);

  useEffect(() => {
    // this will force a re-render when brackets change
    setBracketCount(brackets ? brackets.length : 0);
  }, [brackets]);

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

    const brks = brackets;

    let selectedParticipants: number[] = [];

    brks.map((bracket) => {
      if (bracket.bracketId == bracketId.id)
        selectedParticipants = bracket.competitors.map(
          (comp) => comp.participantId
        );
    });
    console.log("Selected Participants from Bracket:", selectedParticipants);
    props.setSelectedParticipant(selectedParticipants);
    props.setModalIsVisible(true);
    props.setCurrentModal("updateBracket");
  };
  // #endregion

  const getParticipantBrackets = (partId: number) => {
    let selectedBracket: CSBracket;
    const bracketIds: { mat: number; id: number }[] = [];
    brackets?.forEach((bracket) => {
      if (
        bracket?.competitors &&
        bracket?.competitors?.some((c) => c.participantId === partId)
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
        variant="caption"
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
        }}
      >
        {`${selectedBracket.divisionName}`}
      </Typography>
    ));
  };

  const setSearchValueCb = (value: string) => {
    setSearchValue(value);
    // This function can be used to filter participants based on search input
    // For now, it just logs the search value
  };

  const highlightText = (text: string) => {
    if (searchValue === "") return text;
    const regex = new RegExp(`(${searchValue})`, "gi");
    const parts = text.split(regex);
    const highlightedParts = parts.map((part, index) => {
      if (part.toLowerCase() === searchValue.toLowerCase()) {
        console.log("Parts:", parts);
        return (
          <span key={index} className="highlight">
            {part}
          </span>
        );
      }
      return part;
    });
    console.log("Highlighted Parts:", highlightedParts);
    return highlightedParts;
  };
  // #endregion
  return (
    <div className="pt-2 bg-gray-100 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-gray-500 p-5">
        <h2 className="text-center">Match Participants</h2>
        <div className="flex flex-row justify-center gap-2 mb-2">
          {/* <SearchBox setSearchValue={setSearchValueCb} /> */}
          <MainButton
            label="Juniors"
            onClickCb={() => setFilterMode("Juniors")}
            variant="primary"
          />
          <MainButton
            label="Boys"
            onClickCb={() => setFilterMode("Boys")}
            variant="primary"
          />
          <MainButton
            label="Girls"
            onClickCb={() => setFilterMode("Girls")}
            variant="primary"
          />
          <MainButton
            label="Women"
            onClickCb={() => setFilterMode("F")}
            variant="primary"
          />
          <MainButton
            label="Men"
            onClickCb={() => setFilterMode("M")}
            variant="primary"
          />
          <MainButton
            label="All"
            onClickCb={() => setFilterMode("All")}
            variant="primary"
          />
          <MainButton
            label="Deselect All"
            variant="danger"
            onClickCb={() => props.setSelectedParticipant([])}
          />
        </div>
      </div>
      <div className="flex justify-center flex-row gap-2 flex-wrap bg-[#2D3E40]">
        {sortedParticipantsForMatching.length > 0 ? (
          sortedParticipantsForMatching.map((weightRange, idx) => (
            <div
              className="bg-white p-2 dark:border-gray-700 dark:bg-gray-800"
              key={`WeightRange-${idx}`}
              onContextMenu={showContextMenu}
            >
              {weightRange.weightMin === 0 && weightRange.weightMax === 0 ? (
                <div>
                  <span className="text-xl font-semibold">Weight Unknown</span>
                </div>
              ) : (
                <div>
                  <h3>{`${weightRange.weightMin}lbs - ${weightRange.weightMax}lbs`}</h3>
                </div>
              )}
              {weightRange.participants.map((participant, idx) => {
                const isSelected =
                  props.selectedParticipantIds.findIndex(
                    (p) => participant.participantId === p
                  ) !== -1;
                return participant.profileName === "Competitor" ? (
                  <div
                    className={`mb-1 p-1 border-b ${
                      participant.bracketCount > 0
                        ? "border-b-4 border-[#2D3E40]"
                        : "border-b border-[#E4F2E7]"
                    } text-white`}
                    key={`Participant-${idx}`}
                  >
                    <div className="flex flex-col justify-between">
                      <div
                        onClick={() => {
                          participantSelected(participant.participantId);
                        }}
                        className={`hover:underline hover:cursor-pointer p-1 rounded-lg ${
                          isSelected ? "bg-blue-700" : ""
                        }`}
                      >
                        {`${idx + 1}. ${participant.firstName} ${
                          participant.lastName
                        }`}{" "}
                        &nbsp;
                        <span
                          className={`inline ${
                            participant.gender === "F" ? "text-pink-400" : ""
                          }`}
                        >{`(${participant.gender})`}</span>
                        <div>
                          {`(${getAgeFromDOB(participant.dob)} yo) (${
                            participant.weight === null ? 0 : participant.weight
                          }lbs)`}
                        </div>
                      </div>
                      <div>
                        {bracketCount > 0 ? (
                          <div className="text-yellow-400 text-center">
                            {getParticipantBrackets(participant.participantId)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ))
        ) : (
          <>There are no Participants to match!</>
        )}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Matching);
