import './totalStrikes.css';

import { useEffect, useState } from 'react';

import { Box, Button, TextField, Typography, useTheme } from '@mui/material';

import StatsBox from './Components/StatsBox';
import { FighterStats } from './Models/csEvent.model';

function TotalStrikes() {

  type strikeTarget = "punchLanded" | "punchThrown" | "kickLanded" | "kickThrown" | "takeDownLanded" | "takeDownAttempted";
  const blueCornerStats: FighterStats = {
    punchLanded: 0,
    punchThrown: 0,
    kickLanded: 0,
    kickThrown: 0,
    takeDownLanded: 0,
    takeDownAttempted: 0
  }

  const redCornerStats: FighterStats = {
    punchLanded: 0,
    punchThrown: 0,
    kickLanded: 0,
    kickThrown: 0,
    takeDownLanded: 0,
    takeDownAttempted: 0
  }

  const [blueStats, setBlueStats] = useState(blueCornerStats);
  const [redStats, setRedStats] = useState(redCornerStats);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentBout, setCurrentBout] = useState(1);

  useEffect(() => {
    console.log("HIT HERE!!!")
    // document.addEventListener("keyup", keyupHandler);
  }, [])

  useEffect(() => {
    console.log("redStats changed: ", redStats.kickLanded)
  }, [redStats])

  const outerTheme = useTheme();

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

  const nextRoundClicked = () => {
    setCurrentRound(currentRound + 1);
  }
  const endBoutClicked = () => {
    setCurrentBout(currentBout + 1);
    setCurrentRound(1);
  }

  return (
    <Box sx={{ backgroundColor: "#0A0A0A" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ color: "#FAFAFA" }} variant="h5">Bout: {currentBout}</Typography>
        <Typography sx={{ color: "#FAFAFA" }} variant="h5">Round: {currentRound}</Typography>
        <Box>
          <Button onClick={nextRoundClicked}>Next Round</Button>
          <Button onClick={endBoutClicked}>End Bout</Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around", backgroundColor: "#212121", color: "#fafafa;" }}>
        <Box>
          <Box sx={{ color: "#00468b", textAlign: "left" }}>
            <TextField sx={{ fontSize: '20px' }} label='Blue Fighter' variant='standard'
              InputLabelProps={{ style: { color: '#00468b', fontSize: '30px' } }}
              InputProps={{ style: { fontSize: '30px', color: '#00468b', borderBottomColor: '#00468b' } }} />
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
            <TextField sx={{ fontSize: '20px' }}
              InputLabelProps={{ style: { color: '#be0000', fontSize: '30px' } }}
              InputProps={{ style: { fontSize: '30px', color: '#be0000' } }} label='Red Fighter' />
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
      <Box sx={{ backgroundColor: "#212121", height: "200px" }}>
        <textarea cols={150} rows={10} onKeyUp={keyupHandler} />
      </Box>
    </Box>
  );
}
export default TotalStrikes;