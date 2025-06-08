import { Box } from "@mui/material";
import { connect } from "react-redux";
import { ContextMenuProps } from "../../Models";
import {
  SelectCurrentMenu,
  SelectIsVisible,
  SelectMenuCoords,
  setIsVisible,
} from "../../Features/contextMenu.slice";
import BracketSetupContextMenu from "./BracketSetupContextMenu";
import { useEffect } from "react";
import Matching from "../participants/Matching";
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
        break;
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
