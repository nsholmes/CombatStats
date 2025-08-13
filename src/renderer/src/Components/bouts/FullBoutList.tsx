import { useContext } from "react";
import { EventContext } from "../../Views/SelectedEventView";

function FullBoutList() {
  const bouts = useContext(EventContext)?.bouts || [];
  return (
    <div className='w-fit flex gap-2 h-full min-h-40 flex-col rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'>
      {bouts.map((bout, idx) => (
        <div key={bout.boutId} className='border-b border-gray-200 py-2'>
          <h4 className='font-bold'>{`${idx + 1}. ${bout.boutId}`}</h4>
          <p>{`Red Competitor: ${bout.redCorner?.lastName || "TBD"}`}</p>
          <p>{`Blue Competitor: ${bout.blueCorner?.lastName || "TBD"}`}</p>
          <p>{`Status: ${bout.status.state}`}</p>
        </div>
      ))}
    </div>
  );
}
export default FullBoutList;
