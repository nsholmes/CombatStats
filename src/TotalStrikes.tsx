import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import './totalStrikes.css';
import StatsBox from "./components/StatsBox";

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
        setStats({ ...cornerStats, kickLanded: cornerStats.kickLanded + 1, kickThrown: cornerStats.kickThrown + 1 });
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
    console.log(ev.target.value)
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
    <Box sx={{ backgroundColor: "#0A0A0A" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ color: "#FAFAFA" }} variant="h3">Event Name</Typography>
        <Typography sx={{ color: "#FAFAFA" }} variant="h5">Fight: 1</Typography>
        <Typography sx={{ color: "#FAFAFA" }} variant="h5">Round: 1</Typography>
        <Box>
          <input type="text" onKeyUp={keyupHandler} />
          <Box>
            <Button>End Bout</Button>
            <Button>Next Round</Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around", backgroundColor: "#212121", color: "#fafafa;" }}>
        <Box>
          <Box sx={{ color: "#00468b", textAlign: "left" }}>
            <Typography variant="h2">John Jones</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Punch Thrown: </Typography>
            <Typography>{blueStats.punchThrown}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">punch Landed: </Typography>
            <Typography>{blueStats.punchLanded}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Kick Thrown: </Typography>
            <Typography>{blueStats.kickThrown}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Kick Landed: </Typography>
            <Typography>{blueStats.kickLanded}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Takedown Attempted: </Typography>
            <Typography>{blueStats.takeDownAttempted}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Takedown Landed: </Typography>
            <Typography>{blueStats.takeDownLanded}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Accuracy: </Typography>
            <Typography>{(((blueStats.punchLanded) / (blueStats.punchThrown) * 100)).toFixed(2)}%</Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ color: "#be0000", textAlign: "left" }}>
            <Typography variant="h2">Stipe Miocic</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Punch Thrown: </Typography>
            <Typography>{redStats.punchThrown}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Punch Landed: </Typography>
            <Typography>{redStats.punchLanded}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Kick Thrown: </Typography>
            <Typography>{redStats.kickThrown}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Kick Landed: </Typography>
            <Typography>{redStats.kickLanded}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Takedown Thrown: </Typography>
            <Typography>{redStats.takeDownAttempted}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Takedown Landed: </Typography>
            <Typography>{redStats.takeDownLanded}</Typography>
          </Box>
          <Box sx={{ fontSize: "1em", display: "flex" }}>
            <Typography sx={{ width: "200px", textAlign: "right", marginRight: "10px" }} variant="body1">Accuracy: </Typography>
            <Typography>{(((redStats.punchLanded) / (redStats.punchThrown) * 100)).toFixed(2)}%</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
        <StatsBox />
        <StatsBox />
      </Box>
    </Box>
  );
}
export default TotalStrikes;