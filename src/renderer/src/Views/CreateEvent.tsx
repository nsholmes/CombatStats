import { useEffect, useState } from "react";
import { connect } from "react-redux";

import { Typography } from "@mui/material";

import {
  Bout,
  BracketEditState,
  CSBracket,
} from "@nsholmes/combat-stats-types/event.model";
import BracketSetupv2 from "../Components/BracketSetupv2";
import BracketData from "../data/MarionBrackets_20231210.json";
import {
  SelectAllCSBrackets,
  setBracketEditState,
  setCBBrackets,
} from "../Features/cbBracket.slice";
import { addNewBout, SelectAllBouts } from "../Features/combatEvent.slice";
import { CreateEventProps } from "../Models/props.model";

function mapStateToProps(state: any) {
  return {
    getAllBouts: SelectAllBouts(state),
    getAllCSBrackets: SelectAllCSBrackets(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    addBout: (bout: Bout) => dispatch(addNewBout(bout)),
    setEditState: (editState: BracketEditState) =>
      dispatch(setBracketEditState(editState)),
    setBrackets: (brackets: CSBracket[]) => dispatch(setCBBrackets(brackets)),
  };
}

function CreateEvent(props: CreateEventProps) {
  const defaultFighter = { firstName: "", lastName: "" };
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    console.log(eventName, defaultFighter);
    setEventName(BracketData.sporting_event.name);
    const brackets = BracketData.brackets.map((bracket: any) => {
      const newBracketData = {
        bracketId: bracket.id,
        divisionName: bracket.name,
        discipline: bracket.discipline.name,
        bracketDivisionName: bracket.name,
        ringName: bracket.ring_name,
        ringNumber: bracket.ring_number,
        bracketGender: bracket.sport.gender_name,
        competitors: bracket.seps,
      };
      return newBracketData;
    });
    if (brackets) {
      props.setBrackets(brackets);
    } else {
      console.log("Error Loading Event File");
    }
  }, []);

  // const eventNameChanged = (evtName: string) => {
  //   setEventNameProp(evtName);
  //   setEventName(evtName);
  // };

  return (
    <>
      <Typography variant='h3' sx={{ marginBottom: "20px" }}>
        {BracketData.sporting_event.name}
      </Typography>
      {/* <BracketSetup /> */}
      <BracketSetupv2 />
      {/* <BracketLayout />
      <EventBrackets /> */}
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);
