import { Typography } from "@mui/material";

import { useState } from "react";
import { connect } from "react-redux";
import { SelectAllCSBrackets, setBracketEditState } from "../Features/cbBracket.slice";
import { SelectAllBouts, SelectCombatEventName, addNewBout, setEventName } from "../Features/combatEvent.slice";
import { Bout, BracketEditState, Fighter } from "../Models/event.model";
import { CreateEventProps } from "../Models/props.model";
import BracketSetupv2 from "../components/BracketSetupv2";
import UploadEvent from "./UploadEvent";


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