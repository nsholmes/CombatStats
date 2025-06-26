import { useEffect } from "react";
import { connect } from "react-redux";
import { SelectAllBrackets } from "../../Features/combatEvent.slice";
import { CSBracket } from "../../Models";

type BracketItemProps = {
  brackets: { [key: string]: CSBracket[] };
};

function mapStateToProps(state: any) {
  return {
    brackets: SelectAllBrackets(state),
  };
}

function BracketItem(props: BracketItemProps) {
  useEffect(() => {
    console.log(props.brackets);
  }, []);
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
      }}>
      Bracket Item
    </div>
  );
}

export default connect(mapStateToProps, null)(BracketItem);
