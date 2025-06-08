import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { setIsVisible } from "../../Features/contextMenu.slice";
import { connect } from "react-redux";

type MatchingContextMenuProps = {
  setMenuIsVisible: (isVisible: boolean) => void;
};

function mapStateToProps(state: any) {
  return {};
}

function mapDispatchToProps(dispatch: any) {
  return {
    setMenuIsVisible: (isVisible: boolean) =>
      dispatch(setIsVisible(isVisible)),
  };
}

function MatchingContextMenu(props: MatchingContextMenuProps) {
  // Event Handler
  const menuItemClicked = () => {
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
          <ListItemButton onClick={menuItemClicked}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary='Boxing Bracket' />
          </ListItemButton>
          <ListItemButton onClick={menuItemClicked}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary='Muay Thai Bracket' />
          </ListItemButton>
          <ListItemButton onClick={menuItemClicked}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary='Intl Bracket' />
          </ListItemButton>
          <ListItemButton onClick={menuItemClicked}>
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
