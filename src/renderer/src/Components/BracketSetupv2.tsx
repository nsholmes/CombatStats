import './BracketLayout.css';

import { DragEvent, memo, MouseEvent, useEffect } from 'react';
import { connect } from 'react-redux';

import { Box, Button, TextField, Typography } from '@mui/material';

import {
    moveSelectedCompetitor, SelectAllCSBrackets, SelectBracketEditState, SelectedCompetitorSelector,
    setSelectedBracketCompetitor
} from '../Features/cbBracket.slice';
import { setCurrentMenu, setIsVisible, setMenuCoords } from '../Features/contextMenu.slice';
import {
    BracketCompetitor, BracketSetupProps, ContextMenuType, CSBracket, PositionCoords
} from '../Models';

function mapStateToProps(state: any) {
  return {
    getAllCSBrackets: SelectAllCSBrackets(state),
    bracketEditState: SelectBracketEditState(state),
    getSelectedCompetitor: SelectedCompetitorSelector(state)
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setCurrentContextMenu: (menuName: ContextMenuType) => dispatch(setCurrentMenu(menuName)),
    setMenuIsVisible: (isVisible: boolean) => dispatch(setIsVisible(isVisible)),
    setMenuPosition: (coords: PositionCoords) => dispatch(setMenuCoords(coords)),
    setSelectedCompetitor: (competitorId: string | null) => dispatch(setSelectedBracketCompetitor(competitorId)),
    moveSelectedCompetitor: (competitorId: string | null) => dispatch((moveSelectedCompetitor(competitorId)))
  }
}


const BracketSetup = memo(function BracketSetup(props: BracketSetupProps) {

  useEffect(() => {
    props.setCurrentContextMenu("bracketSetup")
  }, [])


  const brackets = props.getAllCSBrackets;

  const competitorCount = () => {
    let count = 0;
    props.getAllCSBrackets.map(bracket => {
      count += bracket.competitors.length;
    })
    return count;
  }
  const setupRound1 = (bracket: CSBracket) => {
    if (bracket.competitors.length === 1) {
      return (
        <>
          <Box className="bout">
            <Box
              id={`${bracket.bracketId}|${bracket.competitors[0].id.toString()}`}
              className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat1'}`}
              onClick={(ev) => { competitorClicked(ev, bracket.competitors[0]) }}
              title={bracket.competitors[0].person.full_name}>
              {bracket.competitors[0] ?
                `${bracket.competitors[0].person.first_name[0]}. ${bracket.competitors[0].person.last_name}: ${bracket.competitors[0].competitor.weight}lbs` : ". "}
            </Box>
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
        </>
      );
    } else if (bracket.competitors.length === 2) {
      return (
        <>
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
        </>
      );
    } else if (bracket.competitors.length === 3) {
      return (
        <Box className="bout">
          <Box id={`${bracket.bracketId}|${bracket.competitors[1].id.toString()}`} className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat3'}`}
            draggable={true}
            // onContextMenu={showContextMenu}
            onClick={(ev) => { competitorClicked(ev, bracket.competitors[1]) }}
            onDragStart={dragBracket}
            title={bracket.competitors[1].person.full_name}>
            {`${bracket.competitors[1].person.first_name[0]}. ${bracket.competitors[1].person.last_name}: ${bracket.competitors[1].competitor.weight}lbs`}
          </Box>
          <Box id={`${bracket.bracketId}|${bracket.competitors[2].id.toString()}`} className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat2'}`}
            draggable={true}
            // onContextMenu={showContextMenu}
            onClick={(ev) => { competitorClicked(ev, bracket.competitors[2]) }}
            onDragStart={dragBracket}
            title={bracket.competitors[2].person.full_name}>
            {`${bracket.competitors[2].person.first_name[0]}. ${bracket.competitors[2].person.last_name}: ${bracket.competitors[2].competitor.weight}lbs`}
          </Box>
          <Box className="bout">
            <Box
              onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }}
              className="seat seatSpace">{" "}</Box>
            <Box
              onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }}
              className="seat seatSpace">{" "}</Box>
          </Box>
        </Box>
      );
    } else if (bracket.competitors.length === 4) {
      return (
        <Box className="bout">
          <Box id={`${bracket.bracketId}|${bracket.competitors[0].id.toString()}`}
            className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat1'}`}
            draggable={true}
            // onContextMenu={showContextMenu}
            onClick={(ev) => { competitorClicked(ev, bracket.competitors[0]) }}
            onDragStart={dragBracket}
            title={bracket.competitors[0].person.full_name}>
            {`${bracket.competitors[0].person.first_name[0]}. ${bracket.competitors[0].person.last_name}: ${bracket.competitors[0].competitor.weight}lbs`}
          </Box>
          <Box id={`${bracket.bracketId}|${bracket.competitors[1].id.toString()}`}
            className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat2'}`}
            draggable={true}
            // onContextMenu={showContextMenu}
            onClick={(ev) => { competitorClicked(ev, bracket.competitors[1]) }}
            onDragStart={dragBracket}
            title={bracket.competitors[1].person.full_name}>
            {`${bracket.competitors[1].person.first_name[0]}. ${bracket.competitors[1].person.last_name}: ${bracket.competitors[1].competitor.weight}lbs`}
          </Box>
          <Box id={`${bracket.bracketId}|${bracket.competitors[2].id.toString()}`}
            className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat3'}`}
            draggable={true}
            // onContextMenu={showContextMenu}
            onClick={(ev) => { competitorClicked(ev, bracket.competitors[2]) }}
            onDragStart={dragBracket}
            title={bracket.competitors[2].person.full_name}>
            {`${bracket.competitors[2].person.first_name[0]}. ${bracket.competitors[2].person.last_name}: ${bracket.competitors[2].competitor.weight}lbs`}
          </Box>
          <Box id={`${bracket.bracketId}|${bracket.competitors[3].id.toString()}`}
            className={`seat ${props.bracketEditState != "off" ? 'editSeat' : 'seat2'}`}
            draggable={true}
            // onContextMenu={showContextMenu}
            onClick={(ev) => { competitorClicked(ev, bracket.competitors[3]) }}
            onDragStart={dragBracket}
            title={bracket.competitors[3].person.full_name}>
            {`${bracket.competitors[3].person.first_name[0]}. ${bracket.competitors[3].person.last_name}: ${bracket.competitors[3].competitor.weight}lbs`}
          </Box>
        </Box>
      )
    }
  }

  const setupRound2 = (bracket: CSBracket) => {
    if (bracket.competitors.length === 1) {
      return (
        <Box className="bout">
          <Box onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }} className="seat seat5">{"*"}</Box>
          <Box onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }} className="seat seat6">{"*"}</Box>
        </Box>
      );
    } else if (bracket.competitors.length === 2) {
      return (
        <Box className="bout">
          <Box
            id={`${bracket.bracketId}|${bracket.competitors[0].id.toString()}`}
            onClick={(ev) => { competitorClicked(ev, bracket.competitors[3]) }}
            className="seat seat5" draggable={true} onDragStart={dragBracket}
            title={bracket.competitors[1].person.full_name}>
            {bracket.competitors[0] ? `${bracket.competitors[0].person.first_name[0]}. ${bracket.competitors[0].person.last_name}: ${bracket.competitors[0].competitor.weight}lbs` : ". "}</Box>
          <Box
            id={`${bracket.bracketId}|${bracket.competitors[1].id.toString()}`}
            onClick={(ev) => { competitorClicked(ev, bracket.competitors[3]) }}
            className="seat seat6" draggable={true} onDragStart={dragBracket}
            title={bracket.competitors[1].person.full_name}>
            {bracket.competitors[1] ? `${bracket.competitors[1].person.first_name[0]}. ${bracket.competitors[1].person.last_name}: ${bracket.competitors[1].competitor.weight}lbs` : ". "}</Box>
        </Box>
      )
    } else if (bracket.competitors.length === 3) {
      return (
        <Box className="bout">
          <Box onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }} className="seat seat5">{"*"}</Box>
          <Box id={`${bracket.bracketId}|${bracket.competitors[2].id.toString()}`}
            onClick={(ev) => { competitorClicked(ev, bracket.competitors[2]) }}
            className="seat seat6"
            title={bracket.competitors[2].person.full_name}>
            {`${bracket.competitors[2].person.first_name[0]}. ${bracket.competitors[2].person.last_name}: ${bracket.competitors[2].competitor.weight}lbs`}
          </Box>
        </Box>
      );
    } else if (bracket.competitors.length === 4) {
      return (
        <Box className="bout">
          <Box onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }} className="seat seat5">{"*"}</Box>
          <Box onClick={(ev) => { emptyBracketClicked(ev, bracket.bracketId) }} className="seat seat6">{"*"}</Box>
        </Box>
      );
    }
  }

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
    const targetId = ev.currentTarget.getAttribute('id'); //bracketId|competitorId
    const selectedId = props.getSelectedCompetitor;

    switch (clickCount) {
      case 1:
        if (selectedId) {

          if (selectedId == targetId) {
            ev.currentTarget.classList.remove("selectedCompetitor");
            props.setSelectedCompetitor(null);
          }
        }
        break;
      case 2:
        if (selectedId) {
          document.getElementById(selectedId)?.classList.remove("selectedCompetitor");
        }
        ev.currentTarget.classList.add("selectedCompetitor");
        props.setSelectedCompetitor(targetId);
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
        console.log('SINGLE CLICK: If selectedCompetitor then MOVE competitor to the selected bracket seat');
        if (props.getSelectedCompetitor) {
          document.getElementById(props.getSelectedCompetitor)?.classList.remove("selectedCompetitor");
        }
        // Move selected compititor to this bracket.
        props.moveSelectedCompetitor(`${props.getSelectedCompetitor}|${bracketId}`);
        props.setSelectedCompetitor(null);
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
    <Box>
      <Box sx={{ border: "2px solid #666", borderRadius: "8px", marginBottom: "10px", backgroundColor: "#333", width: "660px", padding: '10px' }}>
        <Typography variant='body2'><strong>Bracket Count:</strong> {brackets.length} <strong>Competitor Count:</strong> {competitorCount()}</Typography>
        <TextField variant='standard'
          label="Find Competitor"
          sx={{ borderRadius: "4px", padding: "5px", backgroundColor: "#fff" }} />
        <Button>Find</Button>
        <Button>Add Bracket</Button>
        <Button>Start Brackets</Button>

      </Box>
      <Box className="bracketsWrapper">
        {
          brackets.map((bracket, index) => {
            return (
              <Box>
                <Typography variant="h6">{`${bracket.divisionName}`}</Typography>
                {bracket.competitors.length > 0 ?
                  <Box>
                    <Box key={index} className="bracket4">
                      <Box className="round round1">
                        {/* Round 1: 2 or more Fighters */}
                        {setupRound1(bracket)}
                      </Box>
                      <Box className="round round2">
                        {setupRound2(bracket)}
                      </Box>
                      <Box className="round round3">
                        <Box className="seat seat7">Bracket Winner</Box>
                      </Box>
                    </Box>
                  </Box> : <></>}
              </Box>
            )
          })
        }
      </Box>
    </Box>
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(BracketSetup);