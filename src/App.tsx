import "./App.css";

import { useState } from "react";

import { Box, Button, Divider, Typography } from "@mui/material";

function App() {
  const red = {
    kick: {
      head: 0,
      body: 0,
      leg: 0,
    },
    punch: {
      head: 0,
      body: 0,
    },
    sweep: 0,
  };

  const blue = {
    kick: {
      head: 0,
      body: 0,
      leg: 0,
    },
    punch: {
      head: 0,
      body: 0,
    },
    sweep: 0,
  };

  const [count, setCount] = useState(0);

  const [blueStrikes, setBlueStrikes] = useState(blue);
  const [redStrikes, setRedStrikes] = useState(red);
  const trackerClicked = (target: string, corner: string, strike: string) => {
    if ((corner = "b")) {
      setBlueStrikes({ ...blueStrikes });
    }
    console.log(`target: ${target} strike: ${strike}  corner: ${corner}`);
  };
  return (
    <>
      <Typography variant="h4">Standup Fight Series</Typography>
      <Typography variant="body2"> Bout 2 </Typography>
      <Divider />
      <Box sx={{ margin: "10px 0px" }}>
        <Typography variant="h5" color="steelblue">
          Blue Corner
        </Typography>

        <Box className="trackerRow trkRowLayout">
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("head", "b", "kick");
            }}
          >
            <Typography variant="body1">Head Punch</Typography>
          </Box>
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("head", "b", "punch");
            }}
          >
            <Typography variant="body1">Head Kick</Typography>
          </Box>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("body", "b", "punch");
            }}
          >
            <Typography variant="body1">Body Punch</Typography>
          </Box>
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("body", "b", "kick");
            }}
          >
            <Typography variant="body1">Body Kick</Typography>
          </Box>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("Leg", "b", "kick");
            }}
          >
            Leg Kick
          </Box>
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("", "b", "sweep");
            }}
          >
            Sweep / Takedown
          </Box>
        </Box>
      </Box>
      {/* <Box>
        <Typography variant="h5" color="red">
          Red Corner
        </Typography>
        <Box className="trackerRow" sx={{ borderBottom: "1px solid #000" }}>
          <div className="targetName">&nbsp;</div>
          <div>Kick</div>
          <div>Punch</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className="targetName">HEAD</div>
          <div
            className="trackerBtn"
            onClick={() => {
              trackerClicked("head", "r", "kick");
            }}
          >
            &nbsp;
          </div>
          <div
            className="trackerBtn"
            onClick={() => {
              trackerClicked("head", "r", "punch");
            }}
          >
            &nbsp;
          </div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className="targetName">BODY</div>
          <div
            className="trackerBtn"
            onClick={() => {
              trackerClicked("body", "r", "kick");
            }}
          >
            &nbsp;
          </div>
          <div
            className="trackerBtn"
            onClick={() => {
              trackerClicked("body", "r", "punch");
            }}
          >
            &nbsp;
          </div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className="targetName">LEG</div>
          <div
            className="trackerBtn"
            onClick={() => {
              trackerClicked("Leg", "r", "kick");
            }}
          >
            &nbsp;
          </div>
          <div className="blankItem">&nbsp;</div>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <div className="targetName">SWEEP</div>
          <div
            className="trackerBtn"
            onClick={() => {
              trackerClicked("", "", "Sweep");
            }}
          >
            &nbsp;
          </div>
          <div className="blankItem">&nbsp;</div>
        </Box>
      </Box> */}
      <Button>Next Bout</Button>
    </>
  );
}

export default App;
