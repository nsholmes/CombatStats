import {
  closestCorners,
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Typography } from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import {
  SelectParticipantsByIds,
  setSelectedParticipantIds,
} from "../../Features/combatEvent.slice";
import { IKFParticipant } from "../../Models/fighter.model";
import { getAgeFromDOB } from "../../utils/participants";

type BracketParticipantListProps = {
  // Define any props you need here
  getSelectedParticipants: IKFParticipant[];
  setSelectedParticipantIds: (participantIds: number[]) => void;
};
function mapStateToProps(state: any) {
  return {
    getSelectedParticipants: SelectParticipantsByIds(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setSelectedParticipantIds: (participantIds: number[]) =>
      dispatch(setSelectedParticipantIds(participantIds)),
  };
}

function SortableItem({
  id,
  text,
  content,
}: {
  id: UniqueIdentifier;
  text: string;
  content: IKFParticipant;
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
       }bg-white p-3 dark:border-gray-700 dark:bg-gray-800`}>
      <div>
        <div className='flex items-center gap-3 pb-1'>
          <span className='text-gray-500 dark:text-gray-400'>⋮</span>
          <span>
            {text} ({content.weight} lbs, {getAgeFromDOB(content.dob)} years
            old)
          </span>
        </div>
      </div>
    </li>
  );
}
function BracketParticipantList(props: BracketParticipantListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  void activeId;
  const [participantIds, setParticipantIds] = useState<number[]>(
    props.getSelectedParticipants.map(
      (participant) => participant.participantId
    )
  );
  void participantIds;
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(String(active.id));
  };
  const handleDragCancel = (event: DragCancelEvent) => {
    void event;
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over?.id) {
      setParticipantIds((prevIds) => {
        const oldIndex = prevIds.indexOf(parseInt(active.id.toString()));
        const newIndex = prevIds.indexOf(parseInt(over.id.toString()));
        const newIds = arrayMove(prevIds, oldIndex, newIndex);
        props.setSelectedParticipantIds(newIds);
        return newIds;
      });
    }
  };
  // const getActiveFighter = () => {
  //   if (activeId) {
  //     const part = props.getSelectedParticipants.find(
  //       (participant) =>
  //         participant.participantId.toString() === activeId.toString()
  //     );
  //     return `${part?.firstName} ${part?.lastName} (${part?.weight} lbs)`;
  //   }
  // };
  return (
    <div>
      <Typography variant='h4'>Fighters</Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={props.getSelectedParticipants.map(
            (participant) => participant.participantId
          )}
          strategy={verticalListSortingStrategy}>
          <ul className='list-none space-y-2'>
            {props.getSelectedParticipants.map((participant) => (
              <SortableItem
                key={participant.participantId}
                id={participant.participantId.toString()}
                text={`${participant.firstName} ${participant.lastName}`}
                content={participant}
              />
            ))}
          </ul>
        </SortableContext>
        {/* <DragOverlay
          modifiers={[restrictToParentElement]}
          dropAnimation={{
            duration: 150,
            easing: "cubic-bezier(0.18, 0.67, 0.6,1.22)",
          }}>
          {activeId ? (
            <div className='cursor-grabbing rounded-md border bg-blue-50 p-3 shadow-md dark:border-blue-800 dark:bg-blue-900/30'>
              <div className='flex items-center gap-3'>
                <span className='text-gray-500 dark:text-gray-400'>⋮⋮</span>
                <span className='dark:text-gray-200'>{`${getActiveFighter()}`}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay> */}
      </DndContext>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BracketParticipantList);
