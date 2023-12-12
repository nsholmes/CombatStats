import { Box, Paper, Typography } from "@mui/material";
import { useState } from "react";
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const blueCornerStats = {
  landed: 0,
  thrown: 0
}
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '30vh',
  lineHeight: '60px',
}));


function FighterTotalStrikes() {
  const [blueStats, setBlueStats] = useState(blueCornerStats);
  const trackerClicked = (corner: string, target: string) => {
    console.log("Blue Clicked: ", corner);
    setBlueStats(target === "landed" ? { landed: blueStats.landed + 1, thrown: blueStats.thrown + 1 } : { ...blueStats, thrown: blueStats.thrown + 1 });
  }
  return (
    <>
      <Stack spacing={1}>
        <Box sx={{ height: '10vh' }}>
          <Typography variant="h5">Standup Fight Series</Typography>
          <Typography variant="h6" color="steelblue">
            Blue Corner - John Jones
          </Typography>
          <Typography variant="body2"> Bout: 2 - Round: 2</Typography>
        </Box>
        <Item elevation={10}
          onClick={() => {
            trackerClicked("blue", "thrown");
          }}>Thrown</Item>
        <Item elevation={10}
          onClick={() => {
            trackerClicked("blue", "landed");
          }}>Landed</Item>
        <Box>
          <Typography variant="body2">Landed: {blueStats.landed} - Thrown: {blueStats.thrown} - Percent: {(((blueStats.landed) / (blueStats.thrown) * 100)).toFixed(2)}%</Typography>
        </Box>
      </Stack>
    </>
  );
}
export default FighterTotalStrikes;