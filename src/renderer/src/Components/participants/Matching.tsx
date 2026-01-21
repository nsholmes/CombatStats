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
import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { selectIKFBrackets } from "../../Features/ikf.slice";
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
import SearchBox from "../SearchBox";

type MatchingProps = {
  eventParticipants: IKFParticipant[];
  selectedParticipantIds: number[];
  selectAllBrackets: CSBracket[];
  ikfBrackets: any[]; // EventBracket[] from FSI API with fighterGym
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
    ikfBrackets: selectIKFBrackets(state), // EventBracket[] from FSI with fighterGym
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
  const { participants, brackets } = (eventData as CombatEvent) || {
    participants: [],
    brackets: [],
  };
  // Use IKF Redux brackets for gym data (EventBracket[] from FSI has fighterGym)
  const ikfBrackets = props.ikfBrackets;
  const [bracketCount, setBracketCount] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<
    "Juniors" | "Boys" | "Girls" | "F" | "M" | "All"
  >("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortedParticipantsForMatching, setSortedParticipantsForMatching] =
    useState<CheckInPariticipantSort[]>([]);
  const [highlightedBracketId, setHighlightedBracketId] = useState<
    number | null
  >(null);
  const [currentResultIndex, setCurrentResultIndex] = useState<number>(0);
  const participantRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const trimmedSearch = useMemo(() => searchValue.trim(), [searchValue]);

  useEffect(() => {
    props.setCurrentContextMenu("matching");
  }, []);

  useEffect(() => {
    // no-op: state used for client-side filtering and highlighting
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

  const getParticipantGym = (competitorId: number): string | null => {
    // Look through IKF Redux brackets (EventBracket[] from FSI) for gym name
    // Note: ikfBrackets are EventBracket[] which have fighterGym field
    // Firebase brackets are CSBracket[] which don't have fighterGym
    for (const bracket of ikfBrackets || []) {
      if (bracket.fighterGym) {
        const gymEntry = bracket.fighterGym.find(
          (fg: any) => fg.competitorId === competitorId || fg.competitor_id === competitorId
        );
        if (gymEntry && gymEntry.gymName) {
          return gymEntry.gymName;
        }
      }
    }
    return null;
  };

  const getParticipantDisciplines = (competitorId: number): string[] => {
    // Look through IKF brackets to find all disciplines for this competitor
    const disciplines: string[] = [];
    for (const bracket of ikfBrackets || []) {
      if (bracket.fighterIds && bracket.fighterIds.includes(competitorId)) {
        if (bracket.discipline && bracket.discipline.name) {
          disciplines.push(bracket.discipline.name);
        }
      }
    }
    return disciplines;
  };

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
        onMouseEnter={() => {
          setHighlightedBracketId(br.id);
        }}
        onMouseLeave={() => {
          setHighlightedBracketId(null);
        }}
      >
        {`${selectedBracket.divisionName}`}
      </Typography>
    ));
  };

  const isParticipantInHighlightedBracket = (
    participantId: number
  ): boolean => {
    if (!highlightedBracketId) return false;

    const bracket = brackets?.find((b) => b.bracketId === highlightedBracketId);
    if (!bracket?.competitors) return false;

    return bracket.competitors.some((c) => c.participantId === participantId);
  };

  const setSearchValueCb = (value: string) => {
    setSearchValue(value);
  };

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlightText = (text: string) => {
    if (trimmedSearch === "") return text;
    const regex = new RegExp(`(${escapeRegExp(trimmedSearch)})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === trimmedSearch.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Calculate match count and matched participant IDs when searching
  const { matchCount, matchedParticipantIds } = useMemo(() => {
    if (!trimmedSearch) return { matchCount: 0, matchedParticipantIds: [] };

    const lowerSearch = trimmedSearch.toLowerCase();
    const ids: number[] = [];

    sortedParticipantsForMatching.forEach((weightRange) => {
      weightRange.participants.forEach((participant) => {
        if (participant.profileName === "Competitor") {
          const fullName =
            `${participant.firstName} ${participant.lastName}`.toLowerCase();
          if (fullName.includes(lowerSearch)) {
            ids.push(participant.participantId);
          }
        }
      });
    });

    return { matchCount: ids.length, matchedParticipantIds: ids };
  }, [sortedParticipantsForMatching, trimmedSearch]);

  // Reset current index when search changes
  useEffect(() => {
    setCurrentResultIndex(0);
  }, [trimmedSearch]);

  // Navigation functions
  const goToNextResult = () => {
    if (matchedParticipantIds.length === 0) return;
    const nextIndex = (currentResultIndex + 1) % matchedParticipantIds.length;
    setCurrentResultIndex(nextIndex);
    scrollToParticipant(matchedParticipantIds[nextIndex]);
  };

  const goToPreviousResult = () => {
    if (matchedParticipantIds.length === 0) return;
    const prevIndex = currentResultIndex === 0 ? matchedParticipantIds.length - 1 : currentResultIndex - 1;
    setCurrentResultIndex(prevIndex);
    scrollToParticipant(matchedParticipantIds[prevIndex]);
  };

  const scrollToParticipant = (participantId: number) => {
    const element = participantRefs.current.get(participantId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  // #endregion
  return (
    <div className="pt-2 bg-gray-100 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-gray-500 p-5">
        <h2 className="text-center">Match Participants</h2>
        <div className="flex flex-row justify-center items-center gap-2 mb-2">
          <div>
            <SearchBox setSearchValue={setSearchValueCb} />
            <div className="flex items-center justify-center gap-2 text-white text-sm h-6">
              {trimmedSearch.length > 0 ? (
                <>
                  <button
                    onClick={goToPreviousResult}
                    disabled={matchCount === 0}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded transition-colors"
                    title="Previous result"
                  >
                    ↑
                  </button>
                  <span>
                    {matchCount > 0 ? currentResultIndex + 1 : 0} / {matchCount}
                  </span>
                  <button
                    onClick={goToNextResult}
                    disabled={matchCount === 0}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded transition-colors"
                    title="Next result"
                  >
                    ↓
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div>
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
                const isHighlighted = isParticipantInHighlightedBracket(
                  participant.participantId
                );
                const isCurrentSearchResult = trimmedSearch && 
                  matchedParticipantIds[currentResultIndex] === participant.participantId;
                return participant.profileName === "Competitor" ? (
                  <div
                    ref={(el) => {
                      if (el) {
                        participantRefs.current.set(participant.participantId, el);
                      } else {
                        participantRefs.current.delete(participant.participantId);
                      }
                    }}
                    className={`mb-1 p-1 border-b ${
                      participant.bracketCount > 0
                        ? "border-b-4 border-[#2D3E40]"
                        : "border-b border-[#E4F2E7]"
                    } text-white transition-colors duration-200 ${
                      isHighlighted
                        ? "bg-yellow-500/30 ring-2 ring-yellow-400"
                        : ""
                    } ${
                      isCurrentSearchResult
                        ? "bg-blue-500/40 ring-2 ring-blue-400"
                        : ""
                    }`}
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
                        {`${idx + 1}. `}
                        {highlightText(
                          `${participant.firstName} ${participant.lastName}`
                        )}
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
                        {(() => {
                          const gym = getParticipantGym(participant.competitorId);
                          const disciplines = getParticipantDisciplines(participant.competitorId);
                          
                          return (gym || disciplines.length > 0) ? (
                            <div className="text-xs text-gray-300 mt-1">
                              {gym && <div className="italic">{gym}</div>}
                              {disciplines.length > 0 && (
                                <div className="text-yellow-300">
                                  {disciplines.join(', ')}
                                </div>
                              )}
                            </div>
                          ) : null;
                        })()}
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
