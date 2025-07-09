import {
  closestCorners,
  DndContext,
  DragCancelEvent,
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { connect } from "react-redux";
import {
  SelectAllBrackets,
  SelectMats,
  setMats,
  updateBracketMatNumber,
  updateBracketSequence,
} from "../../Features/combatEvent.slice";
import { matBrackets } from "../../Features/utils/EventBouts";
import { CSBracket, CSMat } from "../../Models";

type KanbanMatsProps = {
  setEventMats: (mats: CSMat[]) => void;
  getEventMats: CSMat[];
  brackets: CSBracket[];
  updateBracketMatNumber: (bracketId: number, matNumber: number) => void;
  updateBracketSequence: (brackets: CSBracket[]) => void;
};

function mapDispatchToProps(dispatch: any) {
  return {
    setEventMats: (mats: CSMat[]) => dispatch(setMats(mats)),
    updateBracketMatNumber: (bracketId: number, matNumber: number) =>
      dispatch(updateBracketMatNumber({ bracketId, matNumber })),
    updateBracketSequence: (brackets: CSBracket[]) =>
      dispatch(updateBracketSequence(brackets)),
  };
}

function mapStateToProps(state: any) {
  return {
    getEventMats: SelectMats(state),
    brackets: SelectAllBrackets(state),
  };
}

function SortableItem({
  id,
  content,
  bracket,
}: {
  id: UniqueIdentifier;
  content: string;
  bracket: CSBracket;
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
      className={`cursor-grab touch-none rounded-md border p-3 active:cursor-grabbing
       ${
         isDragging
           ? "border-2 border-dashed border-gray-300 bg-gray-50 opacity-30 dark:border-gray-600 dark:bg-gray-800/30"
           : "bg-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
       }  bg-white p-3 dark:border-gray-700 dark:bg-gray-800`}>
      <div>
        <div className='flex items-center gap-3 pb-1'>
          <span className='text-gray-500 dark:text-gray-400'>⋮</span>
          <span className='dark:text-gray-200'>{content}</span>
        </div>
        <hr />
        <div>
          {`Mat: ${bracket.matNumber} BracketId: ${bracket.bracketId}`}
          {bracket.competitors.map((competitor, idx) => {
            void idx;
            return (
              <div
                key={`competitor-${bracket.bracketId}-competitor-${competitor.competitorId}`}>{`- ${competitor.firstName} ${competitor.lastName} (${competitor.weight} lbs)`}</div>
            );
          })}
        </div>
      </div>
    </li>
  );
}

function DroppableContainer({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: CSBracket[];
}) {
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <div
      ref={setNodeRef}
      className='w-fit flex h-full min-h-40 flex-col rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'>
      <h3 className='mb-2 font-medium text-gray-700 dark:text-gray-200'>
        {title}
      </h3>
      <div className='flex-1'>
        <SortableContext
          items={items.map((item) => item.bracketId)}
          strategy={verticalListSortingStrategy}>
          <ul className='flex flex-col gap-2'>
            {items.map((item) => {
              {
                return item.matNumber.toString() == id ? (
                  <SortableItem
                    key={`sortableItem-${item.bracketId}`}
                    id={item.bracketId}
                    content={item.bracketDivisionName}
                    bracket={item}
                  />
                ) : null;
              }
            })}
          </ul>
        </SortableContext>

        {items.length === 0 && (
          <div className='flex h-20 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/30'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Drop Brackets Here
            </p>
          </div>
        )}
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

function KanbanMats(props: KanbanMatsProps) {
  const [mats, setMats] = useState<CSMat[]>(props.getEventMats);
  const [matBracketsArr, setMatBracketsArr] = useState<
    { matId: number; matName: string; brackets: CSBracket[] }[]
  >(matBrackets(props.brackets, props.getEventMats));

  void setMats;

  // State to track which item is being dragged
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  void activeId;

  // Configure Sensors for different input methods
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 50, // small delay helps distinguish clicks from drags on mobile
        tolerance: 5, // Allow small movements before activating drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Takes a ItemID and help find which container has that ID
  function findContainerId(
    itemId: UniqueIdentifier
  ): UniqueIdentifier | undefined {
    // Is the Id a container ID?
    if (mats.some((mat) => mat.id.toString() === itemId)) {
      return itemId;
    }
    // If not figure out which container has that ID
    let retValue: UniqueIdentifier | undefined;
    matBracketsArr.map((matbrackets) => {
      const foundItem = matbrackets.brackets.some(
        (item) => item.bracketId.toString() === itemId
      );
      if (foundItem) {
        retValue = matbrackets.matId.toString();
      }
    });
    return retValue;
  }

  const handleDrageStart = (event: DragStartEvent) => {
    console.log("Active ID: ", event.active.id);
    setActiveId(event.active.id);
  };
  function handleDragCancel(event: DragCancelEvent) {
    void event;
    setActiveId(null);
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    void active;

    if (!over) return;
    // const activeId = active.id;
    // const overId = over.id;

    // const activeMatId = findContainerId(activeId);
    // const overMatId = findContainerId(overId);

    // if (!activeMatId || !overMatId) return;
    // if (activeMatId === overMatId && activeId !== overId) return;
    // if (activeMatId === overMatId) return;

    // // Update bracket mat number
    // console.log(
    //   `Active Mat ID: ${activeMatId}, Over Mat ID: ${overMatId}, Active ID: ${activeId}, Over ID: ${overId}`
    // );

    // const activeItem = props.brackets.find(
    //   (item) => item.bracketId.toString() === activeId
    // );

    // matBracketsArr.map((matBrackets) => {
    //   if(matBrackets.matId === activeMatId)
    //     if(matBrackets.matId === overMatId){

    //     }
    // });
    // mats.map((mat) => {
    //   if (mat.id.toString() === activeMatId)
    //     if (mat.id.toString() === overMatId) {
    //       // props.updateBracketMatNumber(activeItem?.bracketId as number, mat.id);
    //       if (overId === overMatId) {
    //         props.updateBracketMatNumber(
    //           activeItem?.bracketId as number,
    //           parseInt(overMatId)
    //         );
    //       }
    //     }

    //   // TODO: UPDATE THE ORDER OF THE BRACKETS BRACKETS NEED SEQUENCiNG
    //   const overItemIndex = props.brackets.findIndex(
    //     (item) => item.bracketId.toString() === overId
    //   );
    //   void overItemIndex;
    //   if (overItemIndex !== -1) {
    //     props.updateBracketSequence(
    //       activeItem?.bracketId as number,
    //       overItemIndex
    //     );
    //   }
    // });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("Active ID: ", active.id);
    console.log("Over ID: ", over?.id);
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeMatId = findContainerId(active.id);
    console.log("Active Mat ID: ", activeMatId);
    const overMatId = findContainerId(over.id);
    console.log("Over Mat ID: ", overMatId);

    if (!activeMatId || !overMatId) {
      setActiveId(null);
      return;
    }

    //Dragging in the same container and not the same item
    if (activeMatId === overMatId && active.id !== over.id) {
      // handle sorting within that same container
      const matIndex = mats.findIndex((m) => m.id.toString() === activeMatId);
      console.log("Mat Index: ", matIndex);

      if (matIndex === -1) {
        setActiveId(null);
        return;
      }

      // const mat = mats[matIndex];
      const activeIndex = matBracketsArr[matIndex].brackets.findIndex(
        (bracket) => bracket.bracketId.toString() === active.id
      );
      console.log("Active Index: ", activeIndex);
      const overIndex = matBracketsArr[matIndex].brackets.findIndex(
        (bracket) => bracket.bracketId.toString() === over.id
      );
      console.log("Over Index: ", overIndex);

      if (activeIndex !== -1 && overIndex !== -1) {
        try {
          console.log("MAT BRACKETS: ", matBracketsArr[matIndex].brackets);
          const newItems = arrayMove(
            matBracketsArr[matIndex].brackets,
            activeIndex,
            overIndex
          );
          console.log("NEW ITEMS: ", newItems);
          setMatBracketsArr((prev) =>
            prev.map((mat) =>
              mat.matId.toString() === activeMatId
                ? { ...mat, brackets: newItems }
                : mat
            )
          );
          props.updateBracketSequence(newItems);
        } catch (error) {
          console.error("Error moving items:", error);
        }
      }
      setActiveId(null);
    }
  };

  const getActiveItem = () => {
    for (const mat of mats) {
      const item = props.brackets.find(
        (item) => item.bracketId.toString() === activeId
      );
      if (item) return item;
    }
    return null;
  };

  return (
    <div className='mx-auto w-full'>
      <h2 className='mb-4 text-xl font-bold dark:text-white'>Kanban Board</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDrageStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>
        <div className='grid gap-4 md:grid-cols-4'>
          {matBracketsArr.map((mat) => (
            <DroppableContainer
              key={mat.matId.toString()}
              id={mat.matId.toString()}
              title={mat.matName}
              items={mat.brackets}
            />
          ))}
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 150,
            easing: "cubic-bezier(0.18, 0.67, 0.6,1.22)",
          }}>
          {activeId ? (
            <ItemOverly>{getActiveItem()?.bracketDivisionName}</ItemOverly>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(KanbanMats);
