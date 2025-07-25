import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSBracket } from "@nsholmes/combat-stats-types/event.model";

export default function SortableItem({
  id,
  content,
  bracket,
  isPrimary,
}: {
  id: UniqueIdentifier;
  content: string;
  bracket: CSBracket;
  isPrimary: boolean;
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab touch-none rounded-md border p-3 active:cursor-grabbing ${
        isPrimary ? "bg-blue-500" : "bg-white"
      } ${
        isDragging
          ? "border-2 border-dashed border-gray-300 bg-gray-50 opacity-30 dark:border-gray-600 dark:bg-gray-800/30"
          : "bg-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
      }  bg-white p-3 dark:border-gray-700 dark:bg-gray-800`}>
      <div>
        <div className='flex items-center gap-3 pb-1'>
          <span className='text-gray-500 dark:text-gray-400'>⋮</span>
          <span
            className={`${
              isPrimary ? "dark:text-green-400" : "text-gray-200"
            }`}>
            {content}
          </span>
        </div>
        <hr />
        <div>
          {`Mat: ${bracket.matNumber} BracketId: ${bracket.bracketId}`}
          {bracket.competitors.map((competitor) => {
            return (
              <div
                key={`competitor-${bracket.bracketId}-competitor-${competitor.competitorId}`}>{`- ${competitor.firstName} ${competitor.lastName} (${competitor.weight} lbs)`}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
