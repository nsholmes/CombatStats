import { Box } from "@mui/material";
import { useEffect } from "react";
import { connect } from "react-redux";
import {
  SelectCurrentMenu,
  SelectIsVisible,
  SelectMenuCoords,
  setIsVisible,
} from "../../Features/contextMenu.slice";
import { ContextMenuProps } from "../../Models";
import BracketSetupContextMenu from "./BracketSetupContextMenu";
// import Matching from "../participants/Matching";
import MatchingContextMenu from "./MatchingContextMenu";

function mapStateToProps(state: any) {
  return {
    isVisible: SelectIsVisible(state),
    currentMenu: SelectCurrentMenu(state),
    menuPositionCoords: SelectMenuCoords(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setIsVisible: (isVisible: boolean) => dispatch(setIsVisible(isVisible)),
  };
}

function ContextMenu(props: ContextMenuProps) {
  useEffect(() => {
    const keyDownHandler = (ev: KeyboardEvent) => {
      if (ev.key == "Escape" && props.isVisible) {
        console.log("Key Press: ", ev.key);
        props.setIsVisible(false);
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  const getCurrentMenu = () => {
    switch (props.currentMenu) {
      case "bracketSetup":
        return <BracketSetupContextMenu />;
      case "matching":
        return <MatchingContextMenu />;
      default:
        break;
    }
  };

  return (
    <>
      {props.isVisible ? (
        <Box
          sx={{
            position: "fixed",
            top: `${props.menuPositionCoords.ypos}px`,
            left: `${props.menuPositionCoords.xpos}px`,
          }}>
          {getCurrentMenu()}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
