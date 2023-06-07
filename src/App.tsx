import "./App.css";

import { useState } from "react";

import { Box, Button, Divider, Typography } from "@mui/material";
import TargetedStrikes from "./TargetedStrikes";
import TotalStrikes from "./TotalStrikes";
import FighterTotalStrikes from "./FighterTotalStrikes";

function App() {


  return (
    <>
      <Typography variant="h4">Standup Fight Series</Typography>
      <Typography variant="h5" color="steelblue">
        Blue Corner - John Jones
      </Typography>
      <Typography variant="body2"> Bout 2 </Typography>
      <Typography variant="body2"> Round 2 </Typography>
      <Divider />

      <FighterTotalStrikes />
      {/* <TotalStrikes /> */}
      {/* <TargetedStrikes /> */}

      <Button>Next Round</Button>
    </>
  );
}

export default App;
