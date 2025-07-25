import { useContext } from "react";
import { createBracketBouts } from "../../Features/utils/EventBouts";
import { EventContext } from "../../Views/SelectedEventView";
import BracketsOrderView from "../draggable/BracketsOrderView";

// type BracketsListProps = {
//   eventBrackets: { [key: string]: CSBracket[] };
// };
// function mapStateToProps(state: any) {
//   return {
//     eventBrackets: SelectAllBrackets(state),
//   };
// }
function BracketList() {
  const eventData = useContext(EventContext);
  const { brackets } = eventData || { brackets: [] };
  return (
    <div className=''>
      <h6 className='text-lg font-semibold'>{`${brackets.length} brackets`}</h6>
      <BracketsOrderView />
      <button
        className='rounded-md bg-slate-800 py-1.5 px-3 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
        onClick={() => {
          // Logic to generate bouts can be added here
          console.log("Generate bouts clicked");
          createBracketBouts(brackets);
        }}>
        Generate Bouts
      </button>
    </div>
  );
}

export default BracketList;
