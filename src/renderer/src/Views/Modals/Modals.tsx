import { Box, Modal, Select } from "@mui/material";
import { current } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import {
  SelectCurrentModal,
  SelectIsVisible,
} from "../../Features/modal.slice";
import { setIsVisible } from "../../Features/contextMenu.slice";
import { Create } from "@mui/icons-material";
import CreateNewBracketModal from "./CreateNewBracketModal";

type ModalsProps = {
  // Define any props that you might need here
  currentModal: string;
  isVisible: boolean;
};
function mapStateToProps(state: any) {
  return {
    currentModal: SelectCurrentModal(state),
    isVisible: SelectIsVisible(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {};
}

function Modals(props: ModalsProps) {
  const renderModalContent = () => {
    switch (props.currentModal) {
      case "createMuayThaiBracket":
        return (
          <Box>
            <CreateNewBracketModal />
          </Box>
        );
      case "createBoxingBracket":
        return <div>Create New Boxing Bracket</div>;
      case "createIntlBracket":
        return <div>Create New International Bracket</div>;
      case "createUnifiedBracket":
        return <div>Create New Unified Bracket</div>;
      // Add more cases for other modals as needed
      default:
        return <></>;
    }
  };
  return <Modal open={props.isVisible}>{renderModalContent()}</Modal>;
}

export default connect(mapStateToProps, mapDispatchToProps)(Modals);
