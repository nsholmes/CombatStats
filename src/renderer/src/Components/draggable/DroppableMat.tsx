import { useDroppable } from "@dnd-kit/core";

export default function DroppableMat(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const style = {
    color: isOver ? "green" : undefined,
    border: isOver ? "3px solid green" : "1px solid #ffffff",
    height: "300px",
  };
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
