import { Typography } from "@mui/material";
// import BracketSetup from "./BracketSetup";
import { memo } from "react";
import { SelectAllCSBrackets } from "../Features/cbBracket.slice";
import { connect } from "react-redux";
import { BracketListProps } from "../Models";
// import {
//   DragDropContext,
//   Draggable,
//   DropResult,
//   Droppable,
// } from "react-beautiful-dnd";

function mapStateToProps(state: any) {
  return {
    getAllCSBrackets: SelectAllCSBrackets(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  console.log("dispatch", dispatch);
  return {};
}

const BracketList = memo(function BracketList(props: BracketListProps) {
  console.log(props);

  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant='h4'>
        Bracket List
      </Typography>
    </>
  );
});
export default connect(mapStateToProps, mapDispatchToProps)(BracketList);
