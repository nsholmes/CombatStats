import "./App.css";

// import { useState } from "react";

import { Box, } from "@mui/material";
// import TargetedStrikes from "./TargetedStrikes";
// import TotalStrikes from "./TotalStrikes";
import FighterTotalStrikes from "./FighterTotalStrikes";

function App() {


  return (
    <Box sx={{ height: '100%', padding: '5px', backgroundColor: 'azure' }}>
      <FighterTotalStrikes />
      {/* <TotalStrikes /> */}
      {/* <TargetedStrikes /> */}
    </Box>
  );
}

export default App;
