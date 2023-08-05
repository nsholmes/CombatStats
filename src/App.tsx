import "./App.css";

// import { useState } from "react";

import { Box, } from "@mui/material";
// import TargetedStrikes from "./TargetedStrikes";
import TotalStrikes from "./TotalStrikes";
// import FighterTotalStrikes from "./FighterTotalStrikes";
// import StatsBox from "./components/StatsBox";

function App() {


  return (
    <Box sx={{ height: '100%', padding: '5px' }}>
      {/* <StatsBox /> */}
      {/* <FighterTotalStrikes /> */}
      <TotalStrikes />
      {/* <TargetedStrikes /> */}
    </Box>
  );
}

export default App;
