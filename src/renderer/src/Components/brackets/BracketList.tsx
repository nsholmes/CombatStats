import { CSBracket, CSMat } from "@nsholmes/combat-stats-types/event.model";
import { connect } from "react-redux";
import {
  SelectAllBrackets,
  SelectMats,
} from "../../Features/combatEvent.slice";
import BracketsOrderView from "../draggable/BracketsOrderView";

type BracketsListProps = {
  eventBrackets: { [key: string]: CSBracket[] };
  csMats: CSMat[];
};
function mapStateToProps(state: any) {
  return {
    eventBrackets: SelectAllBrackets(state),
    csMats: SelectMats(state),
  };
}
function BracketList(props: BracketsListProps) {
  return (
    <div>
      <h6>{`Bracket List: ${props.eventBrackets.length} barackets`}</h6>
      <BracketsOrderView />
    </div>
  );
}

export default connect(mapStateToProps, null)(BracketList);
