import { Box, Modal } from "@mui/material";
import { connect } from "react-redux";
import {
  SelectCurrentModal,
  SelectIsVisible,
} from "../../Features/modal.slice";
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

function Modals(props: ModalsProps) {
  const renderModalContent = () => {
    if (props.currentModal.indexOf("createBracket") > -1) {
      return (
        <Box>
          <CreateNewBracketModal />
        </Box>
      );
    } else {
      return <></>;
    }
  };
  return <Modal open={props.isVisible}>{renderModalContent()}</Modal>;
}

export default connect(mapStateToProps, null)(Modals);
