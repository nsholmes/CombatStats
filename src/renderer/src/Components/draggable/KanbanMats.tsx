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
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { SelectMats, setMats } from "../../Features/combatEvent.slice";
import { CSBracket, CSMat } from "../../Models";

type KanbanMatsProps = {
  setEventMats: (mats: CSMat[]) => void;
  getEventMats: CSMat[];
};

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
          {bracket.bracketId}
          {bracket.competitors.map((competitor) => {
            return (
              <div>{`- ${competitor.firstName} ${competitor.lastName} (${competitor.weight} lbs)`}</div>
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
      className=' w-fit flex h-full min-h-40 flex-col rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'>
      <h3 className='mb-2 font-medium text-gray-700 dark:text-gray-200'>
        {title}
      </h3>
      <div className='flex-1'>
        <SortableContext
          items={items.map((item) => item.bracketId)}
          strategy={verticalListSortingStrategy}>
          <ul className='flex flex-col gap-2'>
            {items.map((item) => (
              <SortableItem
                key={`sortableItem-${item.bracketId}`}
                id={item.bracketId}
                content={item.bracketClassName}
                bracket={item}
              />
            ))}
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
  useEffect(() => {
    // console.log(csMats);
    props.setEventMats(mats);
  }, [mats]);
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
    return mats
      .find((mat) =>
        mat.brackets.some((item) => item.bracketId.toString() === itemId)
      )
      ?.id.toString();
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

    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const activeMatId = findContainerId(activeId);
    const overMatId = findContainerId(overId);

    if (!activeMatId || !overMatId) return;
    if (activeMatId === overMatId && activeId !== overId) return;
    if (activeMatId === overMatId) return;

    // Update State
    setMats((prev) => {
      // what is the active container
      const activeMat = prev.find((c) => c.id.toString() === activeMatId);

      console.log(`activeMat: ${activeMat?.id}`);
      if (!activeMat) return prev;

      const activeItem = activeMat.brackets.find(
        (item) => item.bracketId.toString() === activeId
      );

      console.log(`activeItem: ${activeItem?.bracketId}`);
      if (!activeItem) return prev;

      // Create new array with the item removed from the source container
      const newMat = prev.map((mat) => {
        // item is over the source container remove it
        if (mat.id.toString() === activeMatId) {
          console.log("item is over the source container - remove it");
          return {
            ...mat,
            brackets: mat.brackets.filter(
              (item) => item.bracketId.toString() !== activeId
            ),
          };
        }

        // Its the target container add the item
        if (mat.id.toString() === overMatId) {
          if (overId === overMatId) {
            console.log("item is over the target container - add it");
            return {
              ...mat,
              brackets: [...mat.brackets, activeItem],
            };
          }

          const overItemIndex = mat.brackets.findIndex(
            (item) => item.bracketId.toString() === overId
          );
          if (overItemIndex !== -1) {
            return {
              ...mat,
              brackets: [
                ...mat.brackets.slice(0, overItemIndex + 1),
                activeItem,
                ...mat.brackets.slice(overItemIndex + 1),
              ],
            };
          }
        }
        return mat;
      });
      return newMat;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

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

  const getActiveItem = () => {
    for (const mat of mats) {
      const item = mat.brackets.find(
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
          {mats.map((mat) => (
            <DroppableContainer
              key={mat.id.toString()}
              id={mat.id.toString()}
              title={mat.name === "" ? mat.id.toString() : mat.name}
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
            <ItemOverly>{getActiveItem()?.bracketClassName}</ItemOverly>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(KanbanMats);
