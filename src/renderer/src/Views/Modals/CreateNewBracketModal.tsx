import { CheckBox } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
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
  SelectParticipantBracketCount,
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
  bracketCount: Record<number, number>;
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
    bracketCount: SelectParticipantBracketCount(state),
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

  useEffect(() => {
    console.log(weightClass);
  }, []);

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

  const handleWeightChange = (event: SelectChangeEvent) => {
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

  const matSelected = (event: SelectChangeEvent) => {
    setMatId(parseInt(event.target.value));
  };
  return (
    <Box sx={ModalStyle}>
      <Typography variant='h4'>{bracketTitle()}</Typography>
      <Box sx={{ width: "50%", display: "flex", gap: "20px" }}>
        {/*  */}
        <div>
          <div className='flex gap-4'>
            <div className='flex'>
              <div className='border border-white text-white '>
                <FormControl>
                  <InputLabel id='weightClassSelectLabel'>
                    Weight Class
                  </InputLabel>
                  <Select
                    id='weightClassSelect'
                    label='Weight Class'
                    onChange={handleWeightChange}
                    className='p-1.5 w-70'>
                    {WeightClasses.map((wClass) => (
                      <MenuItem
                        className='text-black'
                        value={`${wClass.name}`}>
                        {`${wClass.name}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <BracketParticipantList />
          <Box sx={{ marginTop: "10px", width: "300px" }}>
            <Typography variant='subtitle1'>
              <CheckBox /> Include Consolation Bracket:
            </Typography>
          </Box>
        </div>
        <Box>
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
            <Box sx={{ width: "300px" }}>
              <Button
                onClick={() => {
                  props.setModalIsVisible(false);
                }}>
                Cancel
              </Button>
              <Button
                color='primary'
                onClick={() => {
                  createNewCSBracket();
                }}>
                Create Bracket
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewBracketModal);
