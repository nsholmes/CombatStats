import { Box, Typography } from "@mui/material";
import { useState } from "react";
import './totalStrikes.css';

function TotalStrikes() {

  const blueCornerStats = {
    landed: 0,
    thrown: 0
  }

  const redCornerStats = {
    landed: 0,
    thrown: 0
  }

  const [blueStats, setBlueStats] = useState(blueCornerStats);
  const [redStats, setRedStats] = useState(redCornerStats);

  const trackerClicked = (corner: string, target: string) => {
    console.log()
    console.log(`target: ${target}`);
    if (corner === "red") {
      console.log("Red Clicked");
      setRedStats(target === "landed" ? { landed: redStats.landed + 1, thrown: redStats.thrown + 1 } : { ...redStats, thrown: redStats.thrown + 1 });
    } else {
      console.log("Blue Clicked");
      setBlueStats(target === "landed" ? { landed: blueStats.landed + 1, thrown: blueStats.thrown + 1 } : { ...blueStats, thrown: blueStats.thrown + 1 });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-around", gap: "10px", backgroundColor: "#ddd" }}>
        <Box sx={{ margin: "10px 0px" }}>
          <Box className="trackerRow trkRowLayout">
            <Typography variant="h6" color="steelblue">
              Blue Corner - John Jones
            </Typography>
            <Box
              className="trackerBtn"
              onClick={() => {
                trackerClicked("blue", "thrown");
              }}
            >
              <Typography variant="h6">Thrown</Typography>
            </Box>
            <Box
              className="trackerBtn"
              onClick={() => {
                trackerClicked("blue", "landed");
              }}
            >
              <Typography variant="h6">Landed</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ margin: "10px 0px" }}>
          <Box className="trackerRow trkRowLayout">
            <Typography variant="h6" color="red">
              Red Corner - John Jones
            </Typography>
            <Box
              className="trackerBtn"
              onClick={() => {
                trackerClicked("red", "thrown");
              }}
            >
              <Typography variant="h6">Thrown</Typography>
            </Box>
            <Box
              className="trackerBtn"
              onClick={() => {
                trackerClicked("red", "landed");
              }}
            >
              <Typography variant="h6">Landed</Typography>
            </Box>
          </Box>
        </Box>

      </Box>
      <Box className="statsContainer">
        <Box>
          <Typography variant="h5" color="steelblue">Blue Corner</Typography>
          <Typography variant="h6">Landed: {blueStats.landed}</Typography>
          <Typography variant="h6">Thrown: {blueStats.thrown}</Typography>
          <Typography variant="h6">Percent: {(((blueStats.landed) / (blueStats.thrown) * 100)).toFixed(2)}%</Typography>
        </Box>
        <Box>
          <Typography variant="h5" color="red">Red Corner</Typography>
          <Typography variant="h6">Landed: {redStats.landed}</Typography>
          <Typography variant="h6">Thrown: {redStats.thrown}</Typography>
          <Typography variant="h6">Percent: {(((redStats.landed) / (redStats.thrown) * 100)).toFixed(2)}%</Typography>
        </Box>
      </Box>
    </>
  );
}
export default TotalStrikes;