import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import './totalStrikes.css';

function TotalStrikes() {

  type strikeTarget = "punchLanded" | "punchThrown" | "kickLanded" | "kickThrown" | "takeDownLanded" | "takeDownAttempted";
  const blueCornerStats = {
    punchLanded: 0,
    punchThrown: 0,
    kickLanded: 0,
    kickThrown: 0,
    takeDownLanded: 0,
    takeDownAttempted: 0
  }

  const redCornerStats = {
    punchLanded: 0,
    punchThrown: 0,
    kickLanded: 0,
    kickThrown: 0,
    takeDownLanded: 0,
    takeDownAttempted: 0
  }

  const [blueStats, setBlueStats] = useState(blueCornerStats);
  const [redStats, setRedStats] = useState(redCornerStats);

  useEffect(() => {
    console.log("HIT HERE!!!")
    // document.addEventListener("keyup", keyupHandler);
  }, [])

  useEffect(() => {
    console.log("redStats changed: ", redStats.kickLanded)
  }, [redStats])


  const updateStats = (corner: string, target: strikeTarget) => {
    console.log(target)
    const cornerStats = corner === "red" ? redStats : blueStats;
    const setStats = corner === "red" ? setRedStats : setBlueStats;
    switch (target) {
      case "kickLanded":
        setStats({ ...cornerStats, kickLanded: cornerStats.kickLanded + 1, kickThrown: cornerStats.kickLanded + 1 });
        break;
      case "kickThrown":
        setStats({ ...cornerStats, kickThrown: cornerStats.kickThrown + 1 });
        break;
      case "punchLanded":
        setStats({ ...cornerStats, punchLanded: cornerStats.punchLanded + 1, punchThrown: cornerStats.punchThrown + 1 });
        break;
      case "punchThrown":
        setStats({ ...cornerStats, punchThrown: cornerStats.punchThrown + 1 });
        break;
      case "takeDownAttempted":
        setStats({ ...cornerStats, takeDownAttempted: cornerStats.takeDownAttempted + 1, takeDownLanded: cornerStats.takeDownLanded + 1 });
        break;
      case "takeDownLanded":
        setStats({ ...cornerStats, takeDownLanded: cornerStats.takeDownLanded + 1 });
        break;
      default:
        break;
    }
  };

  const keyupHandler = (ev: any) => {
    console.log(ev.key)
    switch (ev.key) {
      case "1":
        updateStats("red", "takeDownAttempted");
        break;
      case "2":
        updateStats("red", "takeDownLanded");
        break;
      case "3":
        // Delete last Takedown
        break;
      case "4":
        updateStats("red", "kickThrown");
        break;
      case "5":
        updateStats("red", "kickLanded");
        break;
      case "6":
        // Delete last kick
        break;
      case "7":
        updateStats("red", "punchThrown")
        break;
      case "8":
        updateStats("red", "punchLanded")
        break;
      case "9":
        // delete last punch
        break;
      case "q":
        updateStats("blue", "punchThrown");
        break;
      case "w":
        updateStats("blue", "punchLanded");
        break;
      case "e":
        // delete last punch
        break;
      case "a":
        updateStats("blue", "kickThrown");
        break;
      case "s":
        updateStats("blue", "kickLanded");
        break;
      case "d":
        // delete last kick
        break;
      case "z":
        updateStats("blue", "takeDownAttempted");
        break;
      case "x":
        updateStats("blue", "takeDownLanded");
        break;
      case "c":
        // delete last Takedown
        break;
      default:
        break;
    }
  }

  return (
    <div>

      <Box sx={{ display: "flex", justifyContent: "space-around", gap: "10px", backgroundColor: "#ddd" }}>
        <Box sx={{ margin: "10px 0px" }}>
          <Box className="trackerRow trkRowLayout">
            <Typography variant="h6" color="steelblue">
              Blue Corner - John Jones
            </Typography>
          </Box>
        </Box>
        <Box sx={{ margin: "10px 0px" }}>
          <Box className="trackerRow trkRowLayout">
            <Typography variant="h6" color="red">
              Red Corner - John Jones
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="statsContainer">
        <Box>
          <Typography variant="h5" color="steelblue">Blue Corner</Typography>
          <Typography variant="h6">punch Landed: {blueStats.punchLanded}</Typography>
          <Typography variant="h6">Punch Thrown: {blueStats.punchThrown}</Typography>
          <Typography variant="h6">Kick Landed: {blueStats.kickLanded}</Typography>
          <Typography variant="h6">Kick Thrown: {blueStats.kickThrown}</Typography>
          <Typography variant="h6">Takedown Landed: {blueStats.takeDownLanded}</Typography>
          <Typography variant="h6">Takedown Attempted: {blueStats.takeDownAttempted}</Typography>
          <Typography variant="h6">Accuracy: {(((blueStats.punchLanded) / (blueStats.punchThrown) * 100)).toFixed(2)}%</Typography>
        </Box>
        <Box>
          <Typography variant="h5" color="red">Red Corner</Typography>
          <Typography variant="h6">Punch Landed: {redStats.punchLanded}</Typography>
          <Typography variant="h6">Punch Thrown: {redStats.punchThrown}</Typography>
          <Typography variant="h6">Kick Landed: {redStats.kickLanded}</Typography>
          <Typography variant="h6">Kick Thrown: {redStats.kickThrown}</Typography>
          <Typography variant="h6">Takedown Landed: {redStats.takeDownLanded}</Typography>
          <Typography variant="h6">Takedown Thrown: {redStats.takeDownAttempted}</Typography>
          <Typography variant="h6">Accuracy: {(((redStats.punchLanded) / (redStats.punchThrown) * 100)).toFixed(2)}%</Typography>
        </Box>
      </Box>
      <input type="text" onKeyUp={keyupHandler} />
    </div>
  );
}
export default TotalStrikes;