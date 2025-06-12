import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { setIsVisible } from "../../Features/contextMenu.slice";
import { connect } from "react-redux";
import {
  setCurrentModal,
  setModalIsVisible,
} from "../../Features/modal.slice";
import { MouseEvent } from "react";
// import { ipcRenderer } from "electron";

type MatchingContextMenuProps = {
  setMenuIsVisible: (isVisible: boolean) => void;
  setCurrentModal: (modalName: string) => void;
  setModalIsVisible: (isVisible: boolean) => void;
};

function mapStateToProps(state: any) {
  return {};
}

function mapDispatchToProps(dispatch: any) {
  return {
    setMenuIsVisible: (isVisible: boolean) =>
      dispatch(setIsVisible(isVisible)),
    setCurrentModal: (modalName: string) =>
      dispatch(setCurrentModal(modalName)),
    setModalIsVisible: (isVisible: boolean) =>
      dispatch(setModalIsVisible(isVisible)),
  };
}

function MatchingContextMenu(props: MatchingContextMenuProps) {
  // Event Handler
  const menuItemClicked = (ev: MouseEvent<HTMLDivElement>) => {
    console.log(ev.currentTarget.id);
    props.setModalIsVisible(true);
    props.setCurrentModal(ev.currentTarget.id);
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
          <ListItemButton id='createBracket-Boxing' onClick={menuItemClicked}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary='Boxing Bracket' />
          </ListItemButton>
          <ListItemButton
            id='createBracket-MuayThai'
            onClick={menuItemClicked}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary='Muay Thai Bracket' />
          </ListItemButton>
          <ListItemButton id='createBracket-Intl' onClick={menuItemClicked}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary='Intl Bracket' />
          </ListItemButton>
          <ListItemButton id='createBracket-Unified' onClick={menuItemClicked}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary='Unified Bracket' />
          </ListItemButton>
        </List>
      </Box>
    </>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchingContextMenu);
