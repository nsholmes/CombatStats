import { Outlet } from "react-router-dom";
import "./App.css";

// import { useState } from "react";

// import { Box, } from "@mui/material";
// // import TargetedStrikes from "./TargetedStrikes";
// import TotalStrikes from "./TotalStrikes";
// import TargetedStrikes from "./TargetedStrikes";
// import FighterTotalStrikes from "./FighterTotalStrikes";
// import StatsBox from "./components/StatsBox";
// import CreateEvent from "./Views/CreateEvent";
import HeaderNav from "./components/HeaderNav";
import ContextMenu from "./components/contextMenus/ContextMenu";
import { useEffect } from "react";
// import FighterTotalStrikes from "./FighterTotalStrikes";
// import StatsBox from "./components/StatsBox";

function App() {
  return (
    <>
      <HeaderNav />
      <ContextMenu />
      <Outlet />
    </>
    // <Box sx={{ height: '100%', padding: '0px 5px 5px 5px' }}>
    //   <HeaderNav />
    //   <CreateEvent />
    //   <StatsBox />
    //   {/* <FighterTotalStrikes /> */}
    //   <TotalStrikes />
    //   {/* <TargetedStrikes /> */}
    // </Box>
  );
}

export default App;
