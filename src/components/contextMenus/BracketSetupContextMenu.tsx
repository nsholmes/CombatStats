import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import OpenWithIcon from '@mui/icons-material/OpenWithRounded';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import "./contextMenu.css"
import { connect } from "react-redux";
import { BracketEditState, BracketSetupMenuProps } from "../../Models";
import { SelectBracketEditState, setBracketEditState } from "../../Features/cbBracket.slice";
import { setIsVisible } from "../../Features/contextMenu.slice";

function mapStateToProps(state: any) {
  return {
    bracketEditState: SelectBracketEditState(state),
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setBracketEditState: (editState: BracketEditState) => dispatch(setBracketEditState(editState)),
    setMenuIsVisible: (isVisible: boolean) => dispatch(setIsVisible(isVisible))
  }
}

function BracketSetupContextMenu(props: BracketSetupMenuProps) {

  // Event Handler
  const menuItemClicked = (item: BracketEditState) => {
    props.setBracketEditState(item);
    props.setMenuIsVisible(false);
  }

  return (
    <>
      <Box>
        <List sx={{ width: '100%', maxWidth: 360 }}
          className="contextMenu"
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={(ev) => { menuItemClicked("moveFighter") }}>
            <ListItemIcon>
              <OpenWithIcon />
            </ListItemIcon>
            <ListItemText primary="Move Fighter" />
          </ListItemButton>
          <ListItemButton onClick={(ev) => { menuItemClicked("duplicateAndMoveFighter") }}>
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary="Duplicate and Move Fighter" />
          </ListItemButton>
          <ListItemButton onClick={(ev) => { menuItemClicked("removeFighter") }}>
            <ListItemIcon>
              <RemoveCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Remove Fighter" />
          </ListItemButton>
          <ListItemButton onClick={(ev) => { menuItemClicked("addFighter") }}>
            <ListItemIcon>
              <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Add Fighter" />
          </ListItemButton>
        </List>
      </Box>
    </>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(BracketSetupContextMenu);