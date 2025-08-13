import { CSBout } from "@nsholmes/combat-stats-types/event.model";
import { useEffect } from "react";

function EventMatDisplay(props: {
  matName: string;
  currentBout: CSBout | null;
  onDeckBout: CSBout | null;
  inHoleBout: CSBout | null;
  approveClickHandler: (boutId: string) => void;
}) {
  useEffect(() => {}, []);

  const boutApproveClicked = () => {
    // Logic to approve the bout can be added here
    if (props.currentBout?.status.state === "completed") {
      console.log("Bout approved", props.currentBout?.status.state);
      props.approveClickHandler(props.currentBout.boutId);

      // set Bout Approved state
    }
  };

  return (
    <div className='w-fit flex gap-2 h-full min-h-40 flex-col rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'>
      <h2>Mat {props.matName}</h2>
      <div className='bg-white dark:border-gray-700 dark:bg-gray-800 p-3'>
        <h2>Current Bout</h2>
        {props.currentBout?.roundWinner ? (
          <div className='flex gap-2 justify-between items-center'>
            <div className='flex gap-2'>
              <div
                className={`w-5 h-5 ${
                  props.currentBout?.roundWinner[0].corner === "red"
                    ? "bg-red-500"
                    : props.currentBout?.roundWinner[0].corner === "blue"
                    ? "bg-blue-500"
                    : "border-2 border-gray-300"
                }`}></div>
              <div
                className={`w-5 h-5 ${
                  props.currentBout?.roundWinner[1]?.corner === "red"
                    ? "bg-red-500"
                    : props.currentBout?.roundWinner[1]?.corner === "blue"
                    ? "bg-blue-500"
                    : "border-2 border-gray-300"
                }`}></div>
              <div
                className={`w-5 h-5 ${
                  props.currentBout?.roundWinner[2]?.corner === "red"
                    ? "bg-red-500"
                    : props.currentBout?.roundWinner[2]?.corner === "blue"
                    ? "bg-blue-500"
                    : "border-2 border-gray-300"
                }`}></div>
            </div>
            {props.currentBout.status.state === "completed" ? (
              <button
                onClick={() => {
                  boutApproveClicked();
                }}
                className='text-green-500 font-bold rounded-md bg-slate-800 py-1.5 px-3 border text-center text-sm hover:cursor-pointer transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'>
                Approve
              </button>
            ) : null}
          </div>
        ) : (
          <div className='flex gap-2'>
            <div className={`w-5 h-5 border-2 border-gray-300`} />
            <div className={`w-5 h-5 border-2 border-gray-300`} />
            <div className={`w-5 h-5 border-2 border-gray-300`} />
          </div>
        )}
        {props.currentBout?.boutId}
        {props.currentBout ? (
          <div className='flex flex-col gap-2'>
            <div className='text-red-700 text-4xl font-bold'>
              {`${props.currentBout.redCorner?.firstName} ${props.currentBout.redCorner?.lastName}`}
            </div>
            <hr />
            <div className='text-blue-700 text-4xl font-bold'>
              {`${props.currentBout.blueCorner?.firstName} ${props.currentBout.blueCorner?.lastName}`}
            </div>
          </div>
        ) : (
          <div className='text-gray-500'>
            {props.currentBout ? `${props.currentBout}` : "No Current Bouts"}
          </div>
        )}
      </div>

      <div className='bg-white dark:border-gray-700 dark:bg-gray-800 p-3'>
        <h2>On Deck</h2>
        {props.onDeckBout?.boutId}
        {props.onDeckBout ? (
          <div className='flex flex-col gap-2'>
            <div className='text-red-700 text-4xl font-bold'>
              {`${props.onDeckBout.redCorner?.firstName} ${props.onDeckBout.redCorner?.lastName}`}
            </div>
            <hr />
            <div className='text-blue-700 text-4xl font-bold'>
              {`${props.onDeckBout.blueCorner?.firstName} ${props.onDeckBout.blueCorner?.lastName}`}
            </div>
          </div>
        ) : (
          <div className='text-gray-500'>No On Deck Bouts</div>
        )}
      </div>
      <div className='bg-white dark:border-gray-700 dark:bg-gray-800 p-3'>
        <h2>In The Hole</h2>
        {props.inHoleBout?.boutId}
        {props.inHoleBout ? (
          <div className='flex flex-col gap-2'>
            <div className='text-red-700 text-4xl font-bold'>
              {`${props.inHoleBout.redCorner?.firstName} ${props.inHoleBout.redCorner?.lastName}`}
            </div>
            <hr />
            <div className='text-blue-700 text-4xl font-bold'>
              {`${props.inHoleBout.blueCorner?.firstName} ${props.inHoleBout.blueCorner?.lastName}`}
            </div>
          </div>
        ) : (
          <div className='text-gray-500'>No in the hole bout</div>
        )}
      </div>

      {/* Add your mat display logic here */}
    </div>
  );
}

export default EventMatDisplay;
