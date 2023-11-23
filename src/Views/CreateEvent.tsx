import { Box, Button, Container, TextField, Typography } from "@mui/material";

import { useState } from "react";
import { Fighter, Bout, CSBracket, BracketEditState } from "../Models/event.model";
import { connect } from "react-redux";
import { SelectAllBouts, SelectCombatEventName, addNewBout, setEventName } from "../Features/combatEvent.slice";
import { CreateEventProps } from "../Models/props.model";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import UploadEvent from "./UploadEvent";
import { SelectAllCSBrackets, setBracketEditState } from "../Features/cbBracket.slice";
import EventBrackets from "./EventBrackets";
import BracketLayout from "../components/BracketLayout";
import BracketList from "../components/BracketList";
import BracketSetup from "../components/BracketSetup";
import BracketSetupv2 from "../components/BracketSetupv2";


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
    setEditState: (editState: BracketEditState) => dispatch(setBracketEditState(editState))
  }
}

function CreateEvent(props: CreateEventProps) {
  const defaultFighter = { firstName: "", lastName: "" };
  const [eventName, setEventNameProp] = useState("");
  const [blueCorner, setBlueCorner] = useState<Fighter>(defaultFighter);
  const [redCorner, setRedCorner] = useState<Fighter>(defaultFighter);


  const eventNameChanged = (evtName: string) => {
    setEventNameProp(evtName);
    setEventName(evtName);
  }


  return (
    <>
      <div>
        <Typography variant="h2">Load Event</Typography>
        <UploadEvent />
      </div >
      {/* <BracketSetup /> */}
      <BracketSetupv2 />
      {/* <BracketLayout />
      <EventBrackets /> */}
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);