import { Box, Typography } from "@mui/material";
import { CSBracket } from "@nsholmes/combat-stats-types/event.model";
import { IKFParticipant } from "@nsholmes/combat-stats-types/fighter.model";
import { ChangeEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import BracketParticipantList from "../../Components/brackets/BracketParticipantList";
import MainButton from "../../Components/MainButton";
import {
  DELETE_BRACKET,
  UPDATE_BRACKET,
} from "../../Features/combatEvent.actions";
import {
  SelectBracketBySelectedId,
  SelectParticipantsByIds,
  setSelectedParticipantIds,
} from "../../Features/combatEvent.slice";
import { setModalIsVisible } from "../../Features/modal.slice";
import { WeightClasses } from "../../utils/weightClasses";
import { CreateUpdateModalStyle } from "../StyledComps/ModalStyles";

type UpdateBracketModalProps = {
  selectedBracket: CSBracket | undefined;
  selectedParticipants: IKFParticipant[];
  setModalIsVisible: (isVisible: boolean) => void;
  updateBracket: (updatedBracket: CSBracket) => void;
  deleteBracket: (bracketId: string | number) => void;
  clearSelectedParticipants: () => void;
};
function mapStateToProps(state: any) {
  return {
    selectedBracket: SelectBracketBySelectedId(state),
    selectedParticipants: SelectParticipantsByIds(state),
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    deleteBracket: (bracketId: string | number) =>
      dispatch(DELETE_BRACKET(bracketId as string)),
    updateBracket: (updatedBracket: CSBracket) =>
      dispatch(UPDATE_BRACKET(updatedBracket)),
    setModalIsVisible: (isVisible: boolean) =>
      dispatch(setModalIsVisible(isVisible)),
    clearSelectedParticipants: () => dispatch(setSelectedParticipantIds([])),
  };
}

function UpdateBracketModal(props: UpdateBracketModalProps) {
  const [weightClass, setWeightClass] = useState<string>(
    props.selectedBracket?.divisionName ?? ""
  );
  const [matId, setMatId] = useState<number>(-1);
  void setMatId;
  const [isPrimaryBracket, setIsPrimaryBracket] = useState<boolean>(false);
  const [discipline, setDiscipline] = useState<string>("");

  useEffect(() => {
    if (props.selectedBracket) {
      setWeightClass(props.selectedBracket.divisionName);
      setMatId(props.selectedBracket.matNumber);
      setIsPrimaryBracket(props.selectedBracket.isPrimary);
      setDiscipline(props.selectedBracket.discipline);
    }
  }, [props.selectedBracket]);

  const handleWeightChange = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setWeightClass(event.target.value);
  };

  const handleCancelButtonClick = () => {
    props.setModalIsVisible(false);
    props.clearSelectedParticipants();
  };

  const handleDeleteBracketButtonClick = () => {
    if (!props.selectedBracket) return;
    props.deleteBracket(props.selectedBracket?.bracketId);
    props.setModalIsVisible(false);
    props.clearSelectedParticipants();
  };

  const handleUpdateBracketButtonClick = () => {
    if (!props.selectedBracket) return;
    const newBracket: CSBracket = {
      bracketId: props.selectedBracket?.bracketId ?? "",
      divisionName: weightClass,
      discipline: props.selectedBracket?.discipline ?? "",
      bracketDivisionName: weightClass,
      competitors: props.selectedParticipants,
      matNumber: matId,
      isPrimary: isPrimaryBracket,
      sequence: 0,
    };
    props.updateBracket(newBracket);
    props.setModalIsVisible(false);
    props.clearSelectedParticipants();
  };

  return (
    <Box sx={CreateUpdateModalStyle}>
      <Typography variant='h4'>{`${discipline} - ${props.selectedBracket?.bracketId}`}</Typography>

      <div>
        <div className='flex gap-4 mt-5'>
          <BracketParticipantList />
          <div className='flex flex-col gap-3 justify-between w-full max-w-sm min-w-[200px]'>
            <div>
              <label className='mb-4 block text-3xl text-white-800'>
                Weight Class
              </label>
              <div className='relative'>
                <select
                  className='w-full bg-transparent placeholder:text-slate-400 text-white-700 text-sm border border-slate-500 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer'
                  onChange={handleWeightChange}
                  value={weightClass}>
                  <option className='text-slate-700' value=''>
                    -- Select Weight Class
                  </option>
                  {WeightClasses.map((wClass) => (
                    <option
                      className='text-slate-700'
                      value={wClass.name}
                      key={wClass.name}>
                      {wClass.name}
                    </option>
                  ))}
                </select>
                {weightClass === "" && (
                  <span className='text-red-500 text-sm'>
                    Please select a weight class
                  </span>
                )}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.2'
                  stroke='currentColor'
                  className='h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-white-700'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
                  />
                </svg>
              </div>
              <div className='mt-2 w-100'>
                <div className='inline-flex items-center'>
                  <label
                    className='flex items-center cursor-pointer relative'
                    htmlFor='check-2'>
                    <input
                      onChange={() => {
                        console.log("Include Consolation Bracket");
                      }}
                      value={isPrimaryBracket ? "true" : "false"}
                      type='checkbox'
                      checked={isPrimaryBracket}
                      onClick={() => setIsPrimaryBracket(!isPrimaryBracket)}
                      className='peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800'
                      id='check-2'
                    />
                    <span className='absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-3.5 w-3.5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        stroke='currentColor'
                        strokeWidth='1'>
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'></path>
                      </svg>
                    </span>
                  </label>
                  <label
                    className='cursor-pointer ml-2 text-white-600 text-sm'
                    htmlFor='check-2'>
                    Include Consolation Bracket
                  </label>
                </div>
              </div>
            </div>
            <div className='mt-2 flex flex-row gap-2 justify-end'>
              <MainButton
                label='Cancel Update'
                onClickCb={handleCancelButtonClick}
                variant='primary'
              />
              <MainButton
                label='Delete Bracket'
                onClickCb={handleDeleteBracketButtonClick}
                variant='danger'
              />
              <MainButton
                label='Update Bracket'
                onClickCb={handleUpdateBracketButtonClick}
                variant='success'
                // disabled={weightClass === "" ? true : false}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateBracketModal);
