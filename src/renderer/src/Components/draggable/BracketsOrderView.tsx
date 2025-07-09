import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { connect } from "react-redux";
import {
  SelectAllBrackets,
  updateBracketOrder,
  updateBracketSequence,
} from "../../Features/combatEvent.slice";
import { CSBracket } from "../../Models";
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
      dispatch(updateBracketOrder(brackets)),
  };
}
function BracketsOrderView(props: BracketsOrderViewProps) {
  const [brackets, setBrackets] = useState(props.selectBrackets);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDrageStart = (event: DragStartEvent) => {
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
      return;
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDrageStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}>
        <SortableContext items={brackets.map((bracket) => bracket.bracketId)}>
          <Grid columns={3}>
            {brackets.map((bracket) => (
              <SortableBracketItem
                id={bracket.bracketId}
                bracket={bracket}
                key={bracket.bracketId}
                content={bracket.bracketDivisionName}
              />
            ))}
          </Grid>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BracketsOrderView);
