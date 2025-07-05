import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { connect } from "react-redux";
import { SelectMats, setMats } from "../Features/combatEvent.slice";
import { CSBout, CSMat } from "../Models";

type EventBoutsProps = {
  eventBouts: CSBout[];
  setEventMats: (mats: CSMat[]) => void;
};

// #region : Redux
function mapDispatchToProps(dispatch: any) {
  return {
    setEventMats: (mats: CSMat[]) => dispatch(setMats(mats)),
  };
}

function mapStateToProps(state: any) {
  return {
    getEventMats: SelectMats(state),
  };
}
//#endregion

function EventBouts(props: EventBoutsProps) {
  const [bouts, setBouts] = useState<CSBout[]>(props.eventBouts);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Group round 1 bouts by matId
  const round1BoutsByMat: { [matId: string]: CSBout[] } = {};
  bouts
    .filter((bout) => bout.roundNumber === 1)
    .forEach((bout) => {
      if (!round1BoutsByMat[bout.matId]) round1BoutsByMat[bout.matId] = [];
      round1BoutsByMat[bout.matId].push(bout);
    });

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 50, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper to find which mat a bout belongs to
  function findMatId(boutId: UniqueIdentifier): string | undefined {
    return Object.keys(round1BoutsByMat).find((matId) =>
      round1BoutsByMat[matId].some((b) => b.boutId === boutId)
    );
  }

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeMatId = findMatId(active.id);
    const overMatId = findMatId(over.id);

    if (!activeMatId || !overMatId) {
      setActiveId(null);
      return;
    }

    // Dragging within the same mat
    if (activeMatId === overMatId && active.id !== over.id) {
      const matBouts = round1BoutsByMat[activeMatId];
      const oldIndex = matBouts.findIndex((b) => b.boutId === active.id);
      const newIndex = matBouts.findIndex((b) => b.boutId === over.id);

      const newMatBouts = arrayMove(matBouts, oldIndex, newIndex);

      setBouts((prev) =>
        prev.map((b) =>
          b.matId === +activeMatId && b.roundNumber === 1
            ? newMatBouts.find((nb) => nb.boutId === b.boutId) || b
            : b
        )
      );
    } else if (activeMatId !== overMatId) {
      // Dragging to a different mat: update matId and move to end
      setBouts((prev) =>
        prev.map((b) =>
          b.boutId === active.id ? { ...b, matId: +overMatId } : b
        )
      );
    }
    setActiveId(null);
  };

  // Helper for DragOverlay
  const getActiveBout = () => {
    for (const matId in round1BoutsByMat) {
      const bout = round1BoutsByMat[matId].find((b) => b.boutId === activeId);
      if (bout) return bout;
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: 16 }}>
        {Object.entries(round1BoutsByMat).map(([matId, matBouts]) => (
          <div key={matId} style={{ minWidth: 300 }}>
            <h3>Mat {matId}</h3>
            <SortableContext
              items={matBouts.map((b) => b.boutId)}
              strategy={verticalListSortingStrategy}>
              <ul>
                {matBouts.map((bout) => (
                  <SortableBout
                    key={bout.boutId}
                    id={bout.boutId}
                    bout={bout}
                  />
                ))}
              </ul>
            </SortableContext>
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeId && (
          <div>
            {/* Render a preview of the active bout */}
            {getActiveBout()?.redCorner?.firstName} vs{" "}
            {getActiveBout()?.blueCorner?.firstName}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventBouts);
