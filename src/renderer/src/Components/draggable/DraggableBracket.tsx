import { useDraggable } from "@dnd-kit/core";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { CSBracket } from "../../Models";

function DraggableBracket(props: { key: number; bracket: CSBracket }) {
  useEffect(() => {}, []);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Box ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Typography variant='h6'>{props.bracket.bracketClassName}</Typography>
      {props.bracket.competitors.map((competitor, idx) => {
        return <Box>{`${competitor.firstName} ${competitor.lastName}`}</Box>;
      })}
    </Box>
  );
}

export default DraggableBracket;
