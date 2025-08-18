import { Modal } from "@mui/material";
import { connect } from "react-redux";
import {
  SelectCurrentModal,
  SelectIsVisible,
} from "../../Features/modal.slice";
import CreateNewBracketModal from "./CreateNewBracketModal";
import UpdateBracketModal from "./UpdateBracketModal";

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
        <div>
          <CreateNewBracketModal />
        </div>
      );
    } else if (props.currentModal.indexOf("updateBracket") > -1) {
      return (
        <div>
          <UpdateBracketModal />
        </div>
      );
    } else {
      return <></>;
    }
  };
  return <Modal open={props.isVisible}>{renderModalContent()}</Modal>;
}

export default connect(mapStateToProps, null)(Modals);
