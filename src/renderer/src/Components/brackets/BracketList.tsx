import { DragEndEvent } from "@dnd-kit/core";
import { connect } from "react-redux";
import {
  SelectAllBrackets,
  SelectMats,
} from "../../Features/combatEvent.slice";
import { CSBracket, CSMat } from "../../Models";

import { useEffect, useState } from "react";
import BracketsOrderView from "../draggable/BracketsOrderView";
import DraggableBracket from "../draggable/DraggableBracket";

type BracketsListProps = {
  eventBrackets: { [key: string]: CSBracket[] };
  csMats: CSMat[];
};
function mapStateToProps(state: any) {
  return {
    eventBrackets: SelectAllBrackets(state),
    csMats: SelectMats(state),
  };
}
function BracketList(props: BracketsListProps) {
  const [isDropped, setIsDropped] = useState(false);
  const [parent, setParent] = useState(null);

  useEffect(() => {
    Object.entries(props.eventBrackets).map((bracket, idx) => {
      // console.log(bracket[idx].length);
      // return <>{bracket[idx].length}</>;
    });
  }, []);

  const draggableMarkup = (
    <DraggableBracket key={0} bracket={props.eventBrackets[0][0]} />
  );

  function handleDragEnd(event: DragEndEvent) {
    if (event.over && event.over.id === "droppable") {
      setIsDropped(true);
    }
  }

  return (
    <div>
      <h6>{`Bracket List: ${props.eventBrackets.length} barackets`}</h6>
      {/* <DndContext onDragEnd={handleDragEnd}>
        {parent === null ? draggableMarkup : null}
        <Box sx={{ display: "flex", gap: 5 }}>
          {Object.entries(props.eventBrackets).map(([key, brackets]) => (
            <DroppableMat key={key}>
              {parent === key ? draggableMarkup : "Drop here"}
            </DroppableMat>
          ))}
        </Box>
      </DndContext> */}
      <BracketsOrderView />
      {/* <KanbanMats csMats={props.csMats} /> */}
      {/* <SortableBrackets /> */}
      {/* <DroppableMat>
          {isDropped ? draggableMarkup : "Drop here"}
        </DroppableMat>
       */}
    </div>
  );
}

export default connect(mapStateToProps, null)(BracketList);
