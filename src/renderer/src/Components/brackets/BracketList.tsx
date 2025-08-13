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
    <div className='center flex flex-col justify-center w-1/2'>
      {brackets?.length > 0 ? (
        <h6 className=' center text-lg font-semibold'>{`${brackets?.length} brackets`}</h6>
      ) : (
        <h6
          className='center text-lg font-semibold flex items-center justify-center'
          style={{
            minHeight: "50vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          No brackets available
        </h6>
      )}
      <BracketsOrderView />
      <div className='flex justify-center gap-3'>
        {brackets?.length > 0 ? (
          <button
            className={
              "rounded-md bg-slate-800 py-1.5 px-3 border border-transparent text-center text-3xl hover:cursor-pointer text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            }
            onClick={() => {
              // Logic to generate bouts can be added here
              createBracketBouts(brackets);
            }}>
            Generate Bouts
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default BracketList;
