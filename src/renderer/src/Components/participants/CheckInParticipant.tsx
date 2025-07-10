import { ChangeEvent, useState } from "react";
import { IKFParticipant } from "../../Models/fighter.model";
import { getAgeFromDOB } from "../../utils/participants";

function CheckInParticipant(props: {
  participant: IKFParticipant;
  updateWeightFunc: (weight: number, participantId: number) => void;
}) {
  const { participant, updateWeightFunc } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [weight, setWeight] = useState(
    props.participant.weight ? props.participant.weight : 0
  );

  const editWeight = () => {
    setIsEdit(!isEdit);
  };

  const weightChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    updateWeightFunc(parseInt(ev.target.value), participant.participantId);
    setWeight(parseInt(ev.target.value));
  };
  const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      setIsEdit(false);
    }
  };

  return (
    <div
      className='p-2 w-60 hover:border-gray-400 dark:bg-gray-800 hover:bg-gray-700 hover:cursor-pointer'
      key={`checkIn-${participant.participantId}`}>
      <div
        onClick={
          editWeight
        }>{`${participant.firstName} ${participant.lastName}`}</div>
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
              value={weight}
              className='w-15 bg-transparent placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-md px-3 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'
            />
          </span>
        )}
        <span>{`(${getAgeFromDOB(participant.dob)} yo)`}</span>{" "}
        <span>{`(${participant.gender})`}</span>
      </div>
    </div>
  );
}

export default CheckInParticipant;
