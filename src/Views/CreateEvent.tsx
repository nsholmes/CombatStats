import { Box, Button, Container, TextField, Typography } from "@mui/material";

import { useState } from "react";
import { Fighter, Bout, CSBracket } from "../Models/event.model";
import { connect } from "react-redux";
import { SelectAllBouts, SelectCombatEventName, addNewBout, setEventName } from "../Features/combatEvent.slice";
import { CreateEventProps } from "../Models/props.model";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import UploadEvent from "./UploadEvent";
import { SelectAllCSBrackets } from "../Features/cbBracket.slice";
import EventBrackets from "./EventBrackets";
import EventBouts from "./EventBouts";


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
  }
}

function CreateEvent(props: CreateEventProps) {
  const defaultFighter = { firstName: "", lastName: "" };
  const [eventName, setEventNameProp] = useState("");
  const [blueCorner, setBlueCorner] = useState<Fighter>(defaultFighter);
  const [redCorner, setRedCorner] = useState<Fighter>(defaultFighter);
  // const [bouts, setBouts] = useState<Bout[]>([]);

  const getRingGroupings = () => {
    const rings: number[] = [];
    // const bracketGroupings: CSBracket[][] = [];
    // let tempBracketArr: CSBracket[] = [];

    props.getAllCSBrackets.map((bracket, idx) => {
      const tempRing = bracket.ringNumber;
      if (rings.length === 0) {
        rings.push(tempRing);
      } else {
        if (tempRing !== rings[rings.length - 1] && tempRing > rings[rings.length - 1]) {
          rings.push(tempRing);
        }
      }
    });
    // console.log("bracketGroupings: ", bracketGroupings);
    return rings;
  }



  /**
   * Event Handlers
   */
  const doneButtonClicked = async () => {
    console.log("doneButtonClicked: ", "Done Button Clicked");
    if (blueCorner.firstName.length > 0 && blueCorner.lastName.length > 0 && redCorner.firstName.length > 0 && redCorner.lastName.length > 0) {
      try {
        await addDoc(collection(db, 'CombatEvents'), {
          eventName: eventName,
          bouts: [{
            blueCorner: { firstName: blueCorner.firstName, lastName: blueCorner.lastName },
            redCorner: { firstName: redCorner.firstName, lastName: redCorner.lastName },
          }]
        });
        setBlueCorner(defaultFighter);
        setRedCorner(defaultFighter);
      } catch (err) {
        alert(err);
      }
    }
  }
  const saveBoutClicked = () => {
    console.log('button clicked:', blueCorner.firstName)
    if (blueCorner.firstName.length > 0 && blueCorner.lastName.length > 0 && redCorner.firstName.length > 0 && redCorner.lastName.length > 0) {

      setBlueCorner(defaultFighter);
      setRedCorner(defaultFighter);
      props.addBout({ blueCorner, redCorner });
    }
  }

  const eventNameChanged = (evtName: string) => {
    setEventNameProp(evtName);
    setEventName(evtName);
  }
  const eventDateChanged = (evtDate: string) => {

  }


  return (
    <>
      <div>
        <Typography variant="h2">Create Event</Typography>
        <TextField onChange={(ev) => {
          eventNameChanged(ev.target.value)
        }} sx={{ backgroundColor: "#fafafa", outlineColor: "#212121" }} label="Event Name" />
        <UploadEvent />
      </div >
      <EventBouts />
      <EventBrackets />
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);