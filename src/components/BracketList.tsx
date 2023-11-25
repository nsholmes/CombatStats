import { Box, Paper, Typography, } from "@mui/material";
import BracketSetup from "./BracketSetup";
import { memo, DragEvent } from "react";
import { SelectAllCSBrackets } from "../Features/cbBracket.slice";
import { connect } from "react-redux";
import { BracketListProps } from "../Models";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";

function mapStateToProps(state: any) {
  return {
    getAllCSBrackets: SelectAllCSBrackets(state)
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

const BracketList = memo(function BracketList(props: BracketListProps) {
  /**
   * 
   * @param ev DragEvent
   */
  const dragBracket = (ev: DragEvent<HTMLDivElement>) => {
    console.log(ev);
  }

  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="h4">
        Bracket List
      </Typography>
      <BracketSetup />
    </>
  );
})
export default connect(mapStateToProps, mapDispatchToProps)(BracketList);