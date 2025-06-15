import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { SelectParticipantsByIds } from "../../Features/combatEvent.slice";
import { IKFParticipant } from "../../Models/fighter.model";
import DraggableList from "../draggable/DraggableList";

type BracketParticipantListProps = {
  // Define any props you need here
  getSelectedParticipants: IKFParticipant[];
};
function mapStateToProps(state: any) {
  return {
    getSelectedParticipants: SelectParticipantsByIds(state),
  };
}

function BracketParticipantList(props: BracketParticipantListProps) {
  return (
    <Box>
      <Typography variant='body1'>Fighters</Typography>
      <DraggableList itemList={props.getSelectedParticipants} />
      {/* {props.getSelectedParticipants.map((participant) => (
        <Box
          draggable={true}
          key={participant.participantId}
          className='participant-item'>
          <span>{`${participant.firstName} ${participant.lastName}`}</span>
        </Box>
      ))} */}
    </Box>
  );
}

export default connect(mapStateToProps, null)(BracketParticipantList);
