import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { SelectAllBrackets } from "../../Features/combatEvent.slice";
import { EventBracket } from "../../Models/bracket.model";
import DraggableList from "../draggable/DraggableList";

type BracketsListProps = {
  eventBrackets: EventBracket[];
};
function mapStateToProps(state: any) {
  return {
    eventBrackets: SelectAllBrackets(state),
  };
}
function BracketList(props: BracketsListProps) {
  return (
    <Box>
      <Typography variant='h6'>
        {`Bracket List: ${props.eventBrackets.length} barackets`}
      </Typography>
      <DraggableList itemList={props.eventBrackets} />
    </Box>
  );
}

export default connect(mapStateToProps, null)(BracketList);
