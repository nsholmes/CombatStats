import "./App.css";

import { Outlet } from "react-router-dom";

import ContextMenu from "./Components/contextMenus/ContextMenu";
import HeaderNav from "./Components/HeaderNav";
import Modals from "./Views/Modals/Modals";

function App() {
  return (
    <div>
      <ContextMenu />
      <Modals />
      <HeaderNav />
      <div className='outletContainer'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
