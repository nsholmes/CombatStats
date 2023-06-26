import { Box, Typography } from "@mui/material";
import { useState } from "react";

function TargetedStrikes() {
  const stats = {
    headkick: 0,
    bodykick: 0,
    legkick: 0,
    headpunch: 0,
    bodypunch: 0,
    sweep: 0,
  };


  const [fighterStats, setFighterStats] = useState(stats);

  const trackerClicked = (target: string) => {

    console.log()
    console.log(`target: ${target}`);
    setFighterStats({
      headkick: 0,
      bodykick: 0,
      legkick: 0,
      headpunch: 0,
      bodypunch: 0,
      sweep: 0,
    });

  };

  return (
    <>
      <Box sx={{ margin: "10px 0px" }}>
        <Box className="trackerRow trkRowLayout">
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("headpunch");
            }}
          >
            <Typography variant="h6">Head Punch</Typography>
          </Box>
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("headkick");
            }}
          >
            <Typography variant="h6">Head Kick</Typography>
          </Box>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("bodypunch");
            }}
          >
            <Typography variant="h6">Body Punch</Typography>
          </Box>
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("bodykick");
            }}
          >
            <Typography variant="h6">Body Kick</Typography>
          </Box>
        </Box>
        <Box className="trackerRow trkRowLayout">
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("legkick");
            }}
          >
            <Typography variant="h6">Leg Kick</Typography>
          </Box>
          <Box
            className="trackerBtn"
            onClick={() => {
              trackerClicked("sweep");
            }}
          >
            <Typography variant="h6">Sweep / Takedown</Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h6">Head Punch: R1 - {fighterStats.headpunch}</Typography>
        <Typography variant="h6">Head Kick: R1 - {fighterStats.headkick}</Typography>
        <Typography variant="h6">Body Punch: R1 - {fighterStats.bodypunch}</Typography>
        <Typography variant="h6">Body Kick: R1 - {fighterStats.bodykick}</Typography>
        <Typography variant="h6">Leg Kick: R1 - {fighterStats.legkick}</Typography>
        <Typography variant="h6">Sweeps: R1 - {fighterStats.sweep}</Typography>
      </Box>
    </>
  );
}
export default TargetedStrikes;