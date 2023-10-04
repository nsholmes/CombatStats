import { Box, Button, TextField, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useEffect, useState } from "react";
import { Fighter, Bout, CombatEvent } from "../Models/event.model";
import { connect } from "react-redux";
import { SelectAllBouts, SelectCombatEventName, addNewBout, setEventName } from "../Features/combatEvent.slice";
import { CreateEventProps } from "../Models/props.model";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../FirebaseConfig";


function mapStateToProps(state: any) {
  return {
    getCombatEventName: SelectCombatEventName(state),
    getAllBouts: SelectAllBouts(state)
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
  // const [eventName, setEventName] = useState("");
  const [blueCorner, setBlueCorner] = useState<Fighter>(defaultFighter);
  const [redCorner, setRedCorner] = useState<Fighter>(defaultFighter);
  // const [bouts, setBouts] = useState<Bout[]>([]);

  /**
   * Event Handlers
   */
  const doneButtonClicked = async () => {
    console.log("doneButtonClicked: ", "Done Button Clicked");
    try {
      await addDoc(collection(db, 'CombatEvents'), {
        eventName: 'Test Event 1',
        bouts: [{
          blueCorner: { firstName: "Blue corner1 First Name", lastName: "Blue corner1 Last Name" },
          redCorner: { firstName: "Red corner1 First Name", lastName: "Red corner1 Last Name" },
        }]
      })
    } catch (err) {
      alert(err);
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


  return (
    <>
      <div>
        <Typography variant="h2">Create Event</Typography>
        <TextField onChange={(ev) => { props.setEventName(ev.target.value) }} sx={{ backgroundColor: "#fafafa", outlineColor: "#212121" }} label="Event Name" />
        <Box>
          <Typography variant="h2">Add Bout</Typography>
          <Typography variant="h4">Blue Corner</Typography>
          <TextField value={blueCorner.firstName} onChange={(ev) => setBlueCorner({ ...blueCorner, firstName: ev.target.value })} sx={{ backgroundColor: "#fafafa", outlineColor: "#212121" }} label="First Name" />
          <TextField value={blueCorner.lastName} onChange={(ev) => setBlueCorner({ ...blueCorner, lastName: ev.target.value })} sx={{ backgroundColor: "#fafafa", outlineColor: "#212121" }} label="Last Name" />
        </Box>
        <Box>
          <Typography variant="h5" color="steelblue"> vs.</Typography>
          <Typography variant="h4">Red Corner</Typography>
          <TextField value={redCorner.firstName} onChange={(ev) => setRedCorner({ ...redCorner, firstName: ev.target.value })} sx={{ backgroundColor: "#fafafa", outlineColor: "#212121" }} label="Last Name" />
          <TextField value={redCorner.lastName} onChange={(ev) => setRedCorner({ ...redCorner, lastName: ev.target.value })} sx={{ backgroundColor: "#fafafa", outlineColor: "#212121" }} label="First Name" />
        </Box>
        <Button size="large" variant="outlined" onClick={saveBoutClicked}>Save Bout</Button>
        <Button size="large" variant="contained" onClick={doneButtonClicked}>Done</Button>
      </div >
      <Box>
        <Typography variant="h2">{props.getCombatEventName}</Typography>
        {
          props.getAllBouts.map((bout) => {
            console.log(`BOUT: ${bout.blueCorner.firstName} ${bout.blueCorner.lastName} vs. ${bout.redCorner.firstName} ${bout.redCorner.lastName}`)
            return (
              <Box>
                <Typography variant="body2">{`* ${bout.blueCorner.firstName} ${bout.blueCorner.lastName} vs. ${bout.redCorner.firstName} ${bout.redCorner.lastName}`} </Typography>
              </Box>
            )
          })
        }
      </Box>
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);