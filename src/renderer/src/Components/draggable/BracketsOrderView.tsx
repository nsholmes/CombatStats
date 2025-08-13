import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSBracket } from "@nsholmes/combat-stats-types/event.model";
import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { UPDATE_BRACKET_ORDER } from "../../Features/combatEvent.actions";
import {
  SelectAllBrackets,
  updateBracketSequence,
} from "../../Features/combatEvent.slice";
import { saveBracketOrder } from "../../Features/utils/EventBouts";
import { EventContext } from "../../Views/SelectedEventView";
import Grid from "./Grid";
import SortableBracketItem from "./SortableBracketItem";

type BracketsOrderViewProps = {
  selectBrackets: CSBracket[];
  updateBracketSquence: (brackets: CSBracket[]) => void;
  updateBracketOrder: (brackets: CSBracket[]) => void;
};
function mapStateToProps(state: any) {
  return {
    selectBrackets: SelectAllBrackets(state),
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    updateBracketSquence: (brackets: CSBracket[]) =>
      dispatch(updateBracketSequence(brackets)),
    updateBracketOrder: (brackets: CSBracket[]) =>
      dispatch(UPDATE_BRACKET_ORDER(brackets)),
  };
}
function BracketsOrderView(props: BracketsOrderViewProps) {
  const eventData = useContext(EventContext);

  const [brackets, setBrackets] = useState(eventData?.brackets ?? []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  void activeId;

  useEffect(() => {
    console.log("Event Data in BracketsOrderView:", eventData?.brackets);
    // sort bracket by the number of competitors, if isPrimary is true, then it should be first regardless of the number of competitors
    // if (eventData?.bracketOrderComitted) {
    //   setBrackets(eventData.brackets);
    // } else {
    //   const sortedBrackets = eventData?.brackets.sort((a, b) => {
    //     if (a.isPrimary && !b.isPrimary) return -1;
    //     if (!a.isPrimary && b.isPrimary) return 1;
    //     return a.competitors.length - b.competitors.length;
    //   });
    //   setBrackets(sortedBrackets ?? []);
    // }
  }, [eventData?.brackets]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeBracketId = brackets.find(
        (item) => item.bracketId === active!.id
      )?.bracketId;
      const overBracketId = brackets.find(
        (item) => item.bracketId === over!.id
      )?.bracketId;

      const oldIndex = brackets.findIndex(
        (item) => item.bracketId === activeBracketId
      );
      const newIndex = brackets.findIndex(
        (item) => item.bracketId === overBracketId
      );

      if (oldIndex === undefined || newIndex === undefined) return;

      const newArr = arrayMove(brackets, oldIndex, newIndex);
      setBrackets(newArr);
      props.updateBracketOrder(newArr);
      saveBracketOrder(newArr);
      return;
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getActiveBracket = () => {
    if (activeId) {
      return brackets.find((b) => b.bracketId == activeId);
    }
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}>
        <SortableContext
          strategy={verticalListSortingStrategy}
          items={brackets.map((bracket) => bracket.bracketId)}>
          <Grid columns={3}>
            {brackets.map((bracket) => (
              <SortableBracketItem
                id={bracket.bracketId}
                bracket={bracket}
                key={bracket.bracketId}
                content={bracket.bracketDivisionName}
                isPrimary={bracket.isPrimary}
              />
            ))}
          </Grid>
        </SortableContext>
        <DragOverlay modifiers={[restrictToParentElement]}>
          <div>
            <div className='bg-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50'>
              <div className='flex items-center p-3 pb-1'>
                <span className='dark:text-gray-200'>
                  ⋮⋮ {`${getActiveBracket()?.divisionName}`}
                </span>
              </div>
            </div>
          </div>
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BracketsOrderView);
