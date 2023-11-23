import { Box, Typography } from "@mui/material"
import { BracketCompetitor, BracketSetupProps, ContextMenuType, PositionCoords } from "../Models"
import { DragEvent, memo, MouseEvent, useEffect } from "react";
import { connect } from "react-redux";
import { SelectAllCSBrackets, SelectBracketEditState, setSelectedBracketCompetitor, } from "../Features/cbBracket.slice";
import "./BracketLayout.css";

import { setCurrentMenu, setIsVisible, setMenuCoords } from "../Features/contextMenu.slice";

function mapStateToProps(state: any) {
  return {
    getAllCSBrackets: SelectAllCSBrackets(state),
    bracketEditState: SelectBracketEditState(state)
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setCurrentContextMenu: (menuName: ContextMenuType) => dispatch(setCurrentMenu(menuName)),
    setMenuIsVisible: (isVisible: boolean) => dispatch(setIsVisible(isVisible)),
    setMenuPosition: (coords: PositionCoords) => dispatch(setMenuCoords(coords)),
    setSelectedCompetitor: (competitorId: string | null) => dispatch(setSelectedBracketCompetitor(competitorId))
  }
}


const BracketSetup = memo(function BracketSetup(props: BracketSetupProps) {

  useEffect(() => {
    props.setCurrentContextMenu("bracketSetup")
  }, [])


  const brackets = props.getAllCSBrackets;



  // Event Handlers
  const dragBracket = (ev: DragEvent<HTMLDivElement>) => {
    console.log(ev);
  }

  const showContextMenu = (ev: MouseEvent<HTMLDivElement>) => {
    ev.preventDefault();
    const selectedId = ev.currentTarget.getAttribute('id');
    props.setSelectedCompetitor(selectedId);
    props.setMenuIsVisible(false);
    const positionChange = {
      xpos: ev.clientX,
      ypos: ev.clientY
    };
    props.setMenuPosition(positionChange);
    props.setMenuIsVisible(true);
  }

  const hideContextMenu = () => {
    props.setMenuIsVisible(false)
  }

  const competitorClicked = (ev: MouseEvent<HTMLDivElement>, competitor: BracketCompetitor) => {
    const clickCount = ev.detail;
    switch (clickCount) {
      case 1:
        console.log('SINGLE CLICK: IF selectedCompetitor is set do nothing ELSE set SelectedCompetitor');
        break;
      case 2:
        console.log(`DOUBLE CLICK: If competitorId == selectedCompetitor.id set selectedCompetitor = null | {}`);
        break;
      case 3:
        console.log('TRIPLE CLICK: set selectedCompetitor = null | {}');
        break;
      default:

        break;
    }
    // console.log(`clicks: ${ev.detail} bracketId: ${competitor.bracket.id} competitor: ${competitor.person.full_name}`);
  }

  const emptyBracketClicked = (ev: MouseEvent<HTMLDivElement>, bracketId: number) => {
    const clickCount = ev.detail;
    switch (clickCount) {
      case 1:
        console.log('SINGLE CLICK: ');
        break;
      case 2:
        console.log('DOUBLE CLICK: Do Nothing');
        break;
      case 3:
        console.log('TRIPLE CLICK: ');
        break;
      default:

        break;
    }
    console.log(`clicks: ${ev.detail} bracketId: ${bracketId}`);
  }

  return (
    <>
      {
        brackets.map((bracket, index) => {
          return (
            <Box onClick={hideContextMenu}>
              <Typography variant="h6">{`Bracket: ${index + 1}`}</Typography>
              <Box>
                <Box key={index} className="bracket4">
                  <Box className="round round1">
                    {/* Round 1: 2 or more Fighters */}
                    {bracket.competitors.length > 2 ?
                      (<>
                        <Box className="bout">
                          <Box
                            id={`${bracket.bracketId}|${bracket.competitors[0].id.toString()}`}
                            className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat1'}`}
                            draggable={true}
                            onContextMenu={showContextMenu}
                            onClick={(ev) => { competitorClicked(ev, bracket.competitors[0]) }}
                            onDragStart={dragBracket}>
                            {bracket.competitors[0] ?
                              bracket.competitors[0].person.full_name : ". "}</Box>
                          <Box className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat2'}`}
                            draggable={true}
                            onContextMenu={showContextMenu}
                            onClick={(ev) => { competitorClicked(ev, bracket.competitors[1]) }}
                            onDragStart={dragBracket}>
                            {bracket.competitors[1] ?
                              bracket.competitors[1].person.full_name : ". "}</Box>
                        </Box>
                        <Box className="bout">
                          {bracket.competitors[2] && bracket.competitors[3] ?
                            (<><Box className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat3'}`}
                              draggable={true}
                              onContextMenu={showContextMenu}
                              onClick={(ev) => { competitorClicked(ev, bracket.competitors[3]) }}
                              onDragStart={dragBracket}>
                              {bracket.competitors[2].person.full_name}</Box>
                              <Box className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat2'}`}
                                draggable={true}
                                onContextMenu={showContextMenu}
                                onClick={(ev) => { competitorClicked(ev, bracket.competitors[3]) }}
                                onDragStart={dragBracket}>
                                {bracket.competitors[3].person.full_name}</Box></>) :
                            (<><Box className="seat seatSpace"
                              onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }}
                            >{" "}</Box>
                              <Box className="seat seatSpace"
                                onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }}
                              >{" "}</Box></>)
                          }
                        </Box>
                      </>) :
                      (<>
                        <Box className="bout">
                          <Box
                            onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }}
                            className="seat seatSpace">{" "}</Box>
                          <Box
                            onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }}
                            className="seat seatSpace">{" "}</Box>
                        </Box>
                        <Box className="bout">
                          <Box
                            onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }}
                            className="seat seatSpace">{" "}</Box>
                          <Box
                            onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }}
                            className="seat seatSpace">{" "}</Box>
                        </Box>
                      </>)
                    }
                  </Box>
                  <Box className="round round2">
                    {bracket.competitors.length > 2 ?
                      (<>
                        <Box className="bout">
                          {bracket.competitors[2] && !bracket.competitors[3] ?
                            <>
                              <Box className="seat seat5">{"*"}</Box>
                              <Box className="seat seat6">{bracket.competitors[2].person.full_name}</Box>
                            </> :
                            <>
                              <Box className="seat seat5">{"*"}</Box>
                              <Box className="seat seat6">{"*"}</Box>
                            </>
                          }
                        </Box>
                      </>) :
                      (<>
                        <Box className="bout">
                          <Box className="seat seat5" draggable={true} onDragStart={dragBracket}>{bracket.competitors[0] ? bracket.competitors[0].person.full_name : ". "}</Box>
                          <Box className="seat seat6" draggable={true} onDragStart={dragBracket}>{bracket.competitors[1] ? bracket.competitors[1].person.full_name : ". "}</Box>
                        </Box>
                      </>)
                    }
                  </Box>
                  <Box className="round round3">
                    <Box className="seat seat7">Bracket Winner</Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        })
      }
    </>
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(BracketSetup);