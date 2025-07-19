import { CSBout } from "@nsholmes/combat-stats-types/event.model";

function EventMatDisplay(props: {
  matName: string;
  currrentBout: CSBout | null;
  onDeckBout: CSBout | null;
  inHoleBout: CSBout | null;
}) {
  return (
    <div className='w-fit flex gap-2 h-full min-h-40 flex-col rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'>
      <h2>Mat {props.matName}</h2>
      <div className='bg-white dark:border-gray-700 dark:bg-gray-800 p-3'>
        <h2>Current Bout</h2>
        {props.currrentBout?.boutId}
        {props.currrentBout ? (
          <div className='flex flex-col gap-2'>
            <div className='text-red-700 text-4xl font-bold'>
              {`${props.currrentBout.redCorner?.firstName} ${props.currrentBout.redCorner?.lastName}`}
            </div>
            <hr />
            <div className='text-blue-700 text-4xl font-bold'>
              {`${props.currrentBout.blueCorner?.firstName} ${props.currrentBout.blueCorner?.lastName}`}
            </div>
          </div>
        ) : (
          <div className='text-gray-500'>
            {props.currrentBout ? `${props.currrentBout}` : "No Current Bouts"}
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
