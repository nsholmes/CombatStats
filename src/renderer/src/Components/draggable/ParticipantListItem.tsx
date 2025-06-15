import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { GripVertical } from "lucide-react";
import { type HTMLAttributes, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";
import { DropIndicator } from "./drop-indicator";
import { isListData } from "./list-data";
// import { Status } from "./Status";
import { Box } from "@mui/material";
import { IKFParticipant } from "../../Models/fighter.model";

type ItemState =
  | {
      type: "idle";
    }
  | {
      type: "preview";
      container: HTMLElement;
    }
  | {
      type: "is-dragging";
    }
  | {
      type: "is-dragging-over";
      closestEdge: Edge | null;
    };

const stateStyles: {
  [Key in ItemState["type"]]?: HTMLAttributes<HTMLDivElement>["className"];
} = {
  "is-dragging": "opacity-40",
};

const idle: ItemState = { type: "idle" };

export function ParticipantListItem({ item }: { item: IKFParticipant }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<ItemState>(idle);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
            render({ container }) {
              setState({ type: "preview", container });
            },
          });
        },
        onDragStart() {
          setState({ type: "is-dragging" });
        },
        onDrop() {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          // not allowing dropping on yourself
          if (source.element === element) {
            return false;
          }
          // only allowing tasks to be dropped on me
          return isListData(source.data);
        },
        getData({ input }) {
          //   const data = getTaskData(task);
          return attachClosestEdge(item, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          // Only need to update react state if nothing has changed.
          // Prevents re-rendering.
          setState((current) => {
            if (
              current.type === "is-dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },
        onDragLeave() {
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      })
    );
  }, [item]);
  stateStyles[state.type] ?? "";
  return (
    <>
      <Box className='relative'>
        <Box
          // Adding data-attribute as a way to query for this for our post drop flash
          data-task-id={item.participantId}
          ref={ref}
          className={`flex text-sm bg-white flex-row items-center border border-solid rounded p-2 pl-0 hover:bg-slate-100 hover:cursor-grab ${
            stateStyles[state.type] ?? ""
          }`}>
          <div className='w-6 flex justify-center'>
            <GripVertical size={10} />
          </div>
          <span className='truncate flex-grow flex-shrink'>{`${item.firstName} ${item.lastName}`}</span>
          {/* <Status status={task.status} /> */}
        </Box>
        {state.type === "is-dragging-over" && state.closestEdge ? (
          <DropIndicator edge={state.closestEdge} gap={"8px"} />
        ) : null}
      </Box>
      {state.type === "preview"
        ? createPortal(<DragPreview item={item} />, state.container)
        : null}
    </>
  );
}

// A simplified version of our task for the user to drag around
function DragPreview({ item }: { item: IKFParticipant }) {
  return (
    <div className='border-solid rounded p-2 bg-white'>{`${item.firstName} ${item.lastName}`}</div>
  );
}
