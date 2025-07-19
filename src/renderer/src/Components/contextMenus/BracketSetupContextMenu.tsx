import "./contextMenu.css";

import { connect } from "react-redux";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { BracketSetupMenuProps } from "@nsholmes/combat-stats-types/contextMenu.model";
import { BracketEditState } from "@nsholmes/combat-stats-types/event.model";
import {
  SelectBracketEditState,
  setBracketEditState,
} from "../../Features/cbBracket.slice";
import { setIsVisible } from "../../Features/contextMenu.slice";

function mapStateToProps(state: any) {
  return {
    bracketEditState: SelectBracketEditState(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setBracketEditState: (editState: BracketEditState) =>
      dispatch(setBracketEditState(editState)),
    setMenuIsVisible: (isVisible: boolean) =>
      dispatch(setIsVisible(isVisible)),
  };
}

function BracketSetupContextMenu(props: BracketSetupMenuProps) {
  // Event Handler
  const menuItemClicked = (item: BracketEditState) => {
    props.setBracketEditState(item);
    props.setMenuIsVisible(false);
  };

  return (
    <>
      <Box>
        <List
          sx={{ width: "100%", maxWidth: 360 }}
          className='contextMenu'
          component='nav'
          aria-labelledby='nested-list-subheader'>
          <ListItemButton
            onClick={() => {
              menuItemClicked("moveFighter");
            }}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary='Move Fighter' />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              menuItemClicked("duplicateAndMoveFighter");
            }}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary='Duplicate and Move Fighter' />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              menuItemClicked("removeFighter");
            }}>
            <ListItemIcon>
              <RemoveCircleIcon />
            </ListItemIcon>
            <ListItemText primary='Remove Fighter' />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              menuItemClicked("addFighter");
            }}>
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary='Add Fighter' />
          </ListItemButton>
        </List>
      </Box>
    </>
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BracketSetupContextMenu);
