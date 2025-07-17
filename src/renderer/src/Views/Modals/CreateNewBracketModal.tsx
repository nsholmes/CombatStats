import { Box, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { connect } from "react-redux";
import BracketParticipantList from "../../Components/brackets/BracketParticipantList";
import {
  ADD_BRACKET_TO_MAT,
  SYNC_COMBAT_EVENT,
} from "../../Features/combatEvent.actions";
import {
  SelectCombatEventState,
  SelectMatCount,
  SelectMats,
  SelectParticipantsByIds,
  setParticipantsBracketCount,
  setSelectedParticipantIds,
} from "../../Features/combatEvent.slice";
import {
  SelectCurrentModal,
  setModalIsVisible,
} from "../../Features/modal.slice";
import { CombatEvent, CSBracket, CSMat } from "../../Models";
import { IKFParticipant } from "../../Models/fighter.model";
import { WeightClasses } from "../../utils/weightClasses";

type CreateNewBracketModalProps = {
  currentBracketType: string;
  matCount: number;
  csMats: CSMat[];
  selectedParticipants: IKFParticipant[];
  selectedCombatEvent: CombatEvent;
  setModalIsVisible: (isVisible: boolean) => void;
  addNewBracketToMat: (bracket: CSBracket) => void;
  clearSelectedParticipants: () => void;
  syncDBWithCombatEventSlice: (event: CombatEvent) => void;
  setParticipantsBracketCount: (ids: number[]) => void;
};

function mapStateToProps(state: any) {
  return {
    currentBracketType: SelectCurrentModal(state),
    matCount: SelectMatCount(state),
    csMats: SelectMats(state),
    selectedParticipants: SelectParticipantsByIds(state),
    selectedCombatEvent: SelectCombatEventState(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setModalIsVisible: (isVisible: boolean) =>
      dispatch(setModalIsVisible(isVisible)),
    addNewBracketToMat: (bracket: CSBracket) =>
      dispatch(ADD_BRACKET_TO_MAT(bracket)),
    clearSelectedParticipants: () => dispatch(setSelectedParticipantIds([])),
    syncDBWithCombatEventSlice: (event: CombatEvent) =>
      dispatch(SYNC_COMBAT_EVENT(event)),
    setParticipantsBracketCount: (ids: number[]) =>
      dispatch(setParticipantsBracketCount(ids)),
  };
}

const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  bgcolor: "#2D3E40",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function CreateNewBracketModal(props: CreateNewBracketModalProps) {
  const [weightClass, setWeightClass] = useState<string>("");
  const [matId, setMatId] = useState<number>(-1);
  void setMatId;
  const bracketTitle = () => {
    switch (props.currentBracketType) {
      case "createBracket-MuayThai":
        return "Muay Thai";
      case "createBracket-Boxing":
        return "Boxing";
      case "createBracket-Intl":
        return "International";
      case "createBracket-Unified":
        return "Unified";
      default:
        return "Bracket";
    }
  };

  const handleWeightChange = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setWeightClass(event.target.value);
  };

  const createNewCSBracket = () => {
    const ids: number[] = [];
    const newBracket: CSBracket = {
      bracketId: 0,
      divisionName: weightClass,
      discipline: bracketTitle(),
      bracketDivisionName: weightClass,
      competitors: props.selectedParticipants,
      matNumber: matId,
      sequence: 0,
    };
    props.setModalIsVisible(false);
    props.addNewBracketToMat(newBracket);
    props.selectedParticipants.map((p) => {
      ids.push(p.participantId);
    });
    props.setParticipantsBracketCount(ids);
    props.clearSelectedParticipants();
  };

  return (
    <Box sx={ModalStyle}>
      <Typography variant='h4'>{bracketTitle()}</Typography>
      <div className='w-1/2, flex, gap-5'>
        <div>
          <div className='flex flex-row'>
            <div className='flex gap-4'>
              <BracketParticipantList />
              <div className='w-full max-w-sm min-w-[200px]'>
                <label className='block mb-1 text-sm text-white-800'>
                  Weight Class
                </label>
                <div className='relative'>
                  <select
                    className='w-full bg-transparent placeholder:text-slate-400 text-white-700 text-sm border border-slate-500 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer'
                    onChange={handleWeightChange}>
                    <option className='text-slate-700' value='Catch Weight'>
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
                <div className='mt-2 w-80'>
                  <div className='inline-flex items-center'>
                    <label
                      className='flex items-center cursor-pointer relative'
                      htmlFor='check-2'>
                      <input
                        onChange={() => {
                          console.log("Include Consolation Bracket");
                        }}
                        type='checkbox'
                        checked
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
                  {/* <div>
                    <FormControl>
                      <FormLabel>Select Mat</FormLabel>
                      <RadioGroup onChange={matSelected}>
                        {props.csMats.map((mat) => (
                          <FormControlLabel
                            value={`${mat.id}`}
                            control={<Radio />}
                            label={`mat-${mat.id}`}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </div> */}
                  <div className='mt-2 flex flex-row gap-2'>
                    <button
                      className='rounded-md bg-slate-800 py-1.5 px-3 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                      onClick={() => {
                        props.setModalIsVisible(false);
                      }}>
                      Cancel
                    </button>
                    <button
                      className='rounded-md bg-slate-800 py-1.5 px-3 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                      color='primary'
                      onClick={() => {
                        createNewCSBracket();
                      }}>
                      Create Bracket
                    </button>
                  </div>
                </div>
              </div>
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
)(CreateNewBracketModal);
