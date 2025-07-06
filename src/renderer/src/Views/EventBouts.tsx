import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  SelectAllBrackets,
  SelectMats,
  setMats,
} from "../Features/combatEvent.slice";
import { CSBout, CSBracket, CSMat } from "../Models";
import { IKFParticipant } from "../Models/fighter.model";

type EventBoutsProps = {
  setEventMats: (mats: CSMat[]) => void;
  getEventMats: CSMat[];
  brackets: CSBracket[];
};

function mapDispatchToProps(dispatch: any) {
  return {
    setEventMats: (mats: CSMat[]) => dispatch(setMats(mats)),
  };
}

function mapStateToProps(state: any) {
  return {
    getEventMats: SelectMats(state),
    brackets: SelectAllBrackets(state),
  };
}

function SortableBout({
  id,
  content,
  bout,
}: {
  id: UniqueIdentifier;
  content: any;
  bout: CSBout;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`list-none cursor-grab touch-none rounded-md border p-3 active:cursor-grabbing
       ${
         isDragging
           ? "border-2 border-dashed border-gray-300 bg-gray-50 opacity-30 dark:border-gray-600 dark:bg-gray-800/30"
           : "bg-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
       }  bg-white p-3 dark:border-gray-700 dark:bg-gray-800`}>
      <div className='border m-2 w-45 rounded-md border-gray-800 bg-gray-400 p-3'>
        <div className='text-red-700 text-1xl font-bold'>{`${bout.redCorner?.firstName}  ${bout.redCorner?.lastName}`}</div>
        <hr />
        <div className='text-blue-700 text-1xl font-bold'>{`${bout.blueCorner?.firstName} ${bout.blueCorner?.lastName}`}</div>
      </div>
    </li>
  );
}

function DroppableBoutsContainer({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: CSBout[];
}) {
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <div ref={setNodeRef}>
      <h3 className='mb-2 font-medium text-gray-700 dark:text-gray-200'>
        {title}
      </h3>
      <div>
        <SortableContext items={items.map((item) => item.boutId)}>
          {items.map((item, idx) => {
            return item.matId.toString() === id && item.roundNumber === 1 ? (
              <SortableBout
                key={`sortableBout-${item.bracketId}-${item.blueCorner?.competitorId}-${item.redCorner?.competitorId}`}
                id={item.boutId}
                content={`${item.bracketId.toString()}`}
                bout={item}
              />
            ) : null;
          })}
        </SortableContext>
      </div>
    </div>
  );
}

function ItemOverly({ children }: { children: React.ReactNode }) {
  return (
    <div className='cursor-grabbing touch-none rounded border bg-white p-3 shadow-md dark: border-gray-700 dark:bg-gray-700'>
      <div className='flex items-center gap-3'>
        <span className='text-gray-500 dark:text-gray-400'>⋮⋮</span>
        <span className='dark:text-gray-200'>{children}</span>
      </div>
    </div>
  );
}

function EventBouts(props: EventBoutsProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  void activeId;

  function findContainerId(
    itemId: UniqueIdentifier
  ): UniqueIdentifier | undefined {
    // Is the Id a container ID?
    if (eventBouts.some((bout) => bout.matId.toString() === itemId)) {
      return itemId;
    }

    // If not figure out which container has that ID
    return eventBouts.find((bout) =>
      eventBouts.some((item) => item.matId.toString() === itemId)
    )?.boutId;
  }

  const getActiveItem = () => {
    for (const mat of props.getEventMats) {
      const item = mat.brackets.find(
        (item) => item.bracketId.toString() === activeId
      );
      if (item) return item;
    }
    return null;
  };

  const [eventBouts, setEventBouts] = useState<CSBout[]>([]);

  useEffect(() => {
    console.log("Event Length: ", eventBouts.length);
  }, [eventBouts]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function createBracketBouts(
    bracketId: number,
    matId: number,
    competitors: IKFParticipant[]
  ): CSBout[] {
    const bracketBouts: CSBout[] = [];

    switch (competitors.length) {
      case 2: // 2 competitors
        console.log(`Competitors: ${competitors}`);
        const bout: CSBout = {
          boutId: `r1-${matId}-${bracketId}-${competitors[0].participantId}-${competitors[1].participantId}`,
          bracketId: bracketId,
          matId,
          roundNumber: 1,
          redCorner: competitors[0],
          blueCorner: competitors[1],
        };
        bracketBouts.push(bout);
        break;
      case 3: // 3 Competitors
        const r1Bout: CSBout = {
          boutId: `r1-${matId}-${bracketId}-${competitors[1].participantId}-${competitors[2].participantId}`,
          bracketId: bracketId,
          matId,
          roundNumber: 1,
          redCorner: competitors[1],
          blueCorner: competitors[2],
        };
        bracketBouts.push(r1Bout);
        const r2Bout: CSBout = {
          boutId: `r2-${matId}-${bracketId}-${competitors[0].participantId}-blueCorner`,
          bracketId: bracketId,
          matId,
          roundNumber: 2,
          redCorner: competitors[0],
          blueCorner: null,
        };
        bracketBouts.push(r2Bout);
        break;
      case 4: // 4 Competitors
        const r1Bout1: CSBout = {
          boutId: `r1-${matId}-${bracketId}-${competitors[0].participantId}-${competitors[1].participantId}`,
          bracketId: bracketId,
          matId,
          roundNumber: 1,
          redCorner: competitors[0],
          blueCorner: competitors[1],
        };
        bracketBouts.push(r1Bout1);
        const r1bout2: CSBout = {
          boutId: `r1-${matId}-${bracketId}-${competitors[2].participantId}-${competitors[3].participantId}`,
          bracketId: bracketId,
          matId,
          roundNumber: 1,
          redCorner: competitors[2],
          blueCorner: competitors[3],
        };
        bracketBouts.push(r1bout2);
        const r2bout1: CSBout = {
          boutId: `r2-${matId}-${bracketId}-semiFinal1`,
          bracketId: bracketId,
          matId,
          roundNumber: 2,
          redCorner: null,
          blueCorner: null,
        };
        bracketBouts.push(r2bout1);
        const r2bout2: CSBout = {
          boutId: `r2-${matId}-${bracketId}-semiFinal2`,
          bracketId: bracketId,
          matId,
          roundNumber: 2,
          redCorner: null,
          blueCorner: null,
        };
        bracketBouts.push(r2bout2);
        break;
      default:
        break;
    }
    bracketBouts.map((bout) => {});
    setEventBouts((prev) => {
      const cleanArr: CSBout[] = [];
      bracketBouts.map((bout) => {
        if (prev.findIndex((p) => bout.boutId == p.boutId) === -1) {
          cleanArr.push(bout);
        }
      });
      return [...prev, ...cleanArr];
    });
    return bracketBouts;
  }
  useEffect(() => {
    // This seems to be clled twice, Why?

    props.brackets.map((bracket) => {
      console.log("MAT: ", bracket.matNumber);
      createBracketBouts(
        bracket.bracketId as number,
        bracket.matNumber,
        bracket.competitors
      );
    });
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };
  const handleDragOver = (event: DragOverEvent) => {
    void event;
    setActiveId(null);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const mats: CSMat[] = props.getEventMats;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeMatId = findContainerId(active.id);
    const overMatId = findContainerId(over.id);

    if (!activeMatId || !overMatId) {
      setActiveId(null);
      return;
    }

    //Dragging in the same container
    if (activeMatId === overMatId && active.id !== over.id) {
      // handle sorting within that same container
      const matIndex = mats.findIndex((m) => m.id.toString() === activeMatId);
      if (matIndex === -1) {
        setActiveId(null);
        return;
      }

      const mat = mats[matIndex];
      const activeIndex = mat.brackets.findIndex(
        (item) => item.bracketId.toString() === active.id
      );
      const overIndex = mat.brackets.findIndex(
        (item) => item.bracketId.toString() === over.id
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const newItems = arrayMove(mat.brackets, activeIndex, overIndex);
        setMats((mats) => {
          return mats.map((m, i) => {
            if (i === matIndex) {
              return { ...m, brackets: newItems };
            }
            return m;
          });
        });
      }
      setActiveId(null);
    }
  };

  return (
    <div>
      <h2 className='text-center font-black'>{`Event Bouts`}</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>
        <div className='flex gap-8 justify-center'>
          {props.getEventMats.map((mat) => (
            <div className='border rounded-md border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-800/50 mt-6'>
              <DroppableBoutsContainer
                id={mat.id.toString()}
                title={`MAT-${mat.id + 1}`}
                items={eventBouts}
              />
            </div>
          ))}
        </div>
        <DragOverlay
          dropAnimation={{
            duration: 150,
            easing: "cubic-bezier(0.18, 0.67, 0.6,1.22)",
          }}>
          {activeId ? (
            <ItemOverly>{getActiveItem()?.bracketClassName}</ItemOverly>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventBouts);
