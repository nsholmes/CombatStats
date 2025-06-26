import {
  closestCenter,
  DndContext,
  DragCancelEvent,
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Item {
  id: string;
  content: string;
}

function SortableItem({
  id,
  content,
}: {
  id: UniqueIdentifier;
  content: string;
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
      <div className='flex items-center gap-3'>
        <span className='text-gray-500 dark:text-gray-400'>⋮⋮</span>
        <span className='dark:text-gray-200'>{content}</span>
      </div>
    </li>
  );
}

function SortableBrackets() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100, // Small delay helps distinguish clicks from drags on mobile
        tolerance: 5, // Allow small movements before activating drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDrageStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null); // Reset actuiveIdwhen drag ends
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const hadleDragCancel = (event: DragCancelEvent) => {
    void event;
    setActiveId(null);
  };

  const [items, setItems] = useState<Item[]>([
    { id: "1", content: "Item 1" },
    { id: "2", content: "Item 2" },
    { id: "3", content: "Item 3" },
    { id: "4", content: "Item 4" },
    { id: "5", content: "Item 5" },
  ]);
  void setItems;
  // https://www.youtube.com/watch?v=ZALLXGVc_HU This is the yuoTube tutorial i was using

  const getActiveItem = () => {
    return items.find((item) => item.id === activeId)?.content;
  };
  return (
    <div className='mx-auto w-full max-w-md rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
      <h2 className='mb-4 text-xl font-bold dark:text-white'>Sortable List</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDrageStart}
        onDragEnd={handleDragEnd}
        onDragCancel={hadleDragCancel}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}>
          <ul className='space-y-2'>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                content={item.content}
              />
            ))}
          </ul>
        </SortableContext>
        <DragOverlay
          adjustScale={true}
          dropAnimation={{
            duration: 150,
            easing: "cubic-bezier(0.18, 0.67, 0.6,1.22)",
          }}>
          {activeId ? (
            <div className='cursor-grabbing rounded-md border bg-blue-50 p-3 shadow-md dark:border-blue-800 dark:bg-blue-900/30'>
              <div className='flex items-center gap-3'>
                <span className='text-gray-500 dark:text-gray-400'> ⋮⋮</span>
                <span className='dark:text-gray-200'>{getActiveItem()}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default SortableBrackets;
