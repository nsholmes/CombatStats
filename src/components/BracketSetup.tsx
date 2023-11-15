import { Box } from "@mui/material"
import { BracketCompetitor, BracketListProps, BracketSetupProps } from "../Models"
import { DragEvent, memo } from "react";
import { connect } from "react-redux";
import { SelectBracketCompetitors } from "../Features/cbBracket.slice";

function mapStateToProps(state: any) {
  return {
    getBracketCompetitors: SelectBracketCompetitors(state)
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}


const BracketSetup = memo(function BracketSetup(props: BracketSetupProps) {
  const competitors = props.getBracketCompetitors;
  const compCount = props.getBracketCompetitors.length;

  // Event Handlers
  const dragCompetitor = (ev: DragEvent<HTMLDivElement>) => {
    console.log(ev);
  }

  return (
    <>
      {competitors.map((comp: BracketCompetitor) => {

        return (<Box className="bracket4" >
          <Box className="round round1">
            <Box className="bout">
              <Box className="seat seat1" draggable={true} onDragStart={dragCompetitor}>{competitors[0] ? competitors[0].person.full_name : ". "}</Box>
              <Box className="seat seat2" draggable={true} onDragStart={dragCompetitor}>{competitors[1] ? competitors[1].person.full_name : ". "}</Box>
            </Box>
            <Box className="bout">
              {
                competitors[2] && competitors[3] ?
                  (<><Box className="seat seat3" draggable={true} onDragStart={dragCompetitor}>{competitors[2].person.full_name}</Box>
                    <Box className="seat seat4" draggable={true} onDragStart={dragCompetitor}>{competitors[3].person.full_name}</Box></>) :
                  (<><Box className="seat seatSpace">{" "}</Box>
                    <Box className="seat seatSpace">{" "}</Box></>)
              }
            </Box>
          </Box>
          <Box className="round round2">
            <Box className="bout">
              {competitors[2] && !competitors[3] ?
                <>
                  <Box className="seat seat5">{"*"}</Box>
                  <Box className="seat seat6">{competitors[2].person.full_name}</Box>
                </> :
                <>
                  <Box className="seat seat5">{"*"}</Box>
                  <Box className="seat seat6">{"*"}</Box>
                </>
              }
            </Box>
          </Box>

          <Box className="round round3">
            <Box className="seat seat7">Bracket Winner</Box>
          </Box>
        </Box>)
      })
      }
    </>
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(BracketSetup);