import { IKFParticipant } from "@nsholmes/combat-stats-types/fighter.model";
import { ChangeEvent, useState } from "react";
import { getAgeFromDOB } from "../../utils/participants";

function CheckInParticipant(props: {
  participant: IKFParticipant;
  updateWeightFunc: (
    weight: number,
    participantId: number,
    isCheckedIn: boolean
  ) => void;
  isCheckedIn?: boolean;
}) {
  const { participant, updateWeightFunc } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [weight, setWeight] = useState(
    props.participant.weight ? props.participant.weight : 0
  );
  // const [isCheckedIn, setIsCheckedIn] = useState(false);

  const editWeight = () => {
    setIsEdit(!isEdit);
  };

  const weightChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    setWeight(parseInt(ev.target.value));
  };
  const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      setIsEdit(false);
      updateWeightFunc(
        parseInt(weight.toString()),
        participant.participantId,
        true
      );
    }
  };
  const handleOnBlur = () => {
    setIsEdit(false);
    updateWeightFunc(
      parseInt(weight.toString()),
      participant.participantId,
      true
    );
  };

  return (
    <div
      className='flex gap-3 p-2 w-70 hover:border-gray-400 dark:bg-gray-800 hover:bg-gray-700 hover:cursor-pointer'
      key={`checkIn-${participant.participantId}`}>
      <div>
        <div>{`${participant.firstName} ${participant.lastName}`}</div>
        <div>
          {!isEdit ? (
            <span>{`${weight === undefined ? 0 : weight} lbs `}</span>
          ) : (
            <span>
              <input
                type='text'
                inputMode='numeric'
                pattern='\d*'
                onChange={weightChanged}
                onKeyDown={handleKeyDown}
                onBlur={handleOnBlur}
                value={weight}
                className='w-15 bg-transparent placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-md px-3 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'
              />
            </span>
          )}
          <span>{`(${getAgeFromDOB(participant.dob)} yo)`}</span>{" "}
          <span>{`(${participant.gender})`}</span>
        </div>
      </div>
      <div>
        <div onClick={editWeight} className='text-blue-300 underline'>
          Check In
        </div>
        {props.isCheckedIn && (
          <span className='ml-2 text-green-500 text-2xl' title='Checked In'>
            &#10003;
          </span>
        )}
      </div>
    </div>
  );
}

export default CheckInParticipant;
