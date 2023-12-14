import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Box, Typography } from '@mui/material';

import BracketSetupv2 from '../Components/BracketSetupv2';
import EventWeighIns from '../Components/EventWeighIns';
import BracketData from '../data/MarionBrackets_20231210.json';
import {
    SelectAllCSBrackets, setBracketEditState, setCBBrackets
} from '../Features/cbBracket.slice';
import {
    addNewBout, SelectAllBouts, SelectCombatEventName, setEventName
} from '../Features/combatEvent.slice';
import { Bout, BracketEditState, CSBracket, Fighter } from '../Models/event.model';
import { CreateEventProps } from '../Models/props.model';

function mapStateToProps(state: any) {
  return {
    getCombatEventName: SelectCombatEventName(state),
    getAllBouts: SelectAllBouts(state),
    getAllCSBrackets: SelectAllCSBrackets(state)
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setEventName: (eventName: string) => dispatch(setEventName(eventName)),
    addBout: (bout: Bout) => dispatch(addNewBout(bout)),
    setEditState: (editState: BracketEditState) => dispatch(setBracketEditState(editState)),
    setBrackets: (brackets: CSBracket[]) => dispatch(setCBBrackets(brackets))
  }
}

function CreateEvent(props: CreateEventProps) {
  const defaultFighter = { firstName: "", lastName: "" };
  const [eventName, setEventNameProp] = useState("");
  const [blueCorner, setBlueCorner] = useState<Fighter>(defaultFighter);
  const [redCorner, setRedCorner] = useState<Fighter>(defaultFighter);

  useEffect(() => {
    const brackets = BracketData.brackets.map((bracket: any) => {
      const newBracketData = {
        bracketId: bracket.id,
        divisionName: bracket.name,
        discipline: bracket.discipline.name,
        bracketClassName: bracket.name,
        ringName: bracket.ring_name,
        ringNumber: bracket.ring_number,
        bracketGender: bracket.sport.gender_name,
        competitors: bracket.seps
      }
      return newBracketData;
    })
    if (brackets) {
      props.setBrackets(brackets);
    } else {
      console.log("Error Loading Event File");
    }
  }, []);

  const eventNameChanged = (evtName: string) => {
    setEventNameProp(evtName);
    setEventName(evtName);
  }


  return (
    <>
      <Typography variant='h3' sx={{ marginBottom: "20px" }}>
        {BracketData.sporting_event.name}
      </Typography>
      {/* <BracketSetup /> */}
      <Box sx={{ display: "flex", gap: '20px' }}>
        <BracketSetupv2 />
        <EventWeighIns />
      </Box>
      {/* <BracketLayout />
      <EventBrackets /> */}
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);