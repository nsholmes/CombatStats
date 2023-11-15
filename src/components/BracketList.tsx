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
      {props.getAllCSBrackets.map((bracket, index) => (
        <BracketSetup />
        // <Box key={index} className="bracket4">
        //   <Box className="round round1">
        //     <Box className="bout">
        //       <Box className="seat seat1" draggable={true} onDragStart={dragBracket}>{bracket.competitors[0] ? bracket.competitors[0].person.full_name : ". "}</Box>
        //       <Box className="seat seat2" draggable={true} onDragStart={dragBracket}>{bracket.competitors[1] ? bracket.competitors[1].person.full_name : ". "}</Box>
        //     </Box>
        //     <Box className="bout">
        //       {
        //         bracket.competitors[2] && bracket.competitors[3] ?
        //           (<><Box className="seat seat3" draggable={true} onDragStart={dragBracket}>{bracket.competitors[2].person.full_name}</Box>
        //             <Box className="seat seat4" draggable={true} onDragStart={dragBracket}>{bracket.competitors[3].person.full_name}</Box></>) :
        //           (<><Box className="seat seatSpace">{" "}</Box>
        //             <Box className="seat seatSpace">{" "}</Box></>)
        //       }
        //     </Box>
        //   </Box>
        //   <Box className="round round2">
        //     <Box className="bout">
        //       {bracket.competitors[2] && !bracket.competitors[3] ?
        //         <>
        //           <Box className="seat seat5">{"*"}</Box>
        //           <Box className="seat seat6">{bracket.competitors[2].person.full_name}</Box>
        //         </> :
        //         <>
        //           <Box className="seat seat5">{"*"}</Box>
        //           <Box className="seat seat6">{"*"}</Box>
        //         </>
        //       }
        //     </Box>
        //   </Box>

        //   <Box className="round round3">
        //     <Box className="seat seat7">Bracket Winner</Box>
        //   </Box>
        // </Box>
      ))
      }
    </>
  );
})
export default connect(mapStateToProps, mapDispatchToProps)(BracketList);