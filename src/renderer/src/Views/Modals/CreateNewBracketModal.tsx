import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import {
  SelectCurrentModal,
  setModalIsVisible,
} from "../../Features/modal.slice";
import { CheckBox } from "@mui/icons-material";
import BracketParticipantList from "../../Components/brackets/BracketParticipantList";
import { WeightClasses } from "../../utils/weightClasses";

type CreateNewBracketModalProps = {
  currentBracketType: string;
  setModalIsVisible: (isVisible: boolean) => void;
};

function mapStateToProps(state: any) {
  return {
    currentBracketType: SelectCurrentModal(state),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    setModalIsVisible: (isVisible: boolean) =>
      dispatch(setModalIsVisible(isVisible)),
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
  const [bracketGender, setBracketGender] = useState<string>("");

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

  return (
    <Box sx={ModalStyle}>
      <Typography variant='h4'>{bracketTitle()}</Typography>
      <Box sx={{ width: "50%", display: "flex", gap: "20px" }}>
        {/*  */}
        <div>
          <div className='flex gap-4'>
            <div className='flex'>
              <label
                htmlFor='genderSelect'
                className='text-white font-bold w-30'>
                Weight Class:
              </label>
              <div className='border border-white text-white '>
                <select
                  id='genderSelect'
                  onChange={(e) => setBracketGender(e.target.value)}
                  className='p-1.5 w-70'>
                  <option selected className='text-black' value=''>
                    --
                  </option>
                  {WeightClasses.map((wClass) => (
                    <option className='text-black' value='F'>
                      {`${wClass.name}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* <div>
              <div className='flex'>
                <label
                  htmlFor='weightSelect'
                  className='text-white font-bold w-30'>
                  Select Gender:
                </label>
                <div className='border border-white text-white '>
                  <select
                    id='genderSelect'
                    onChange={(e) => setBracketGender(e.target.value)}
                    className='p-1.5 w-40'>
                    <option className='text-black' value='F'>
                      Female
                    </option>
                    <option selected className='text-black' value='M'>
                      Male
                    </option>
                  </select>
                </div>
              </div>
            </div> */}
          </div>
          <Box>
            <Typography variant='subtitle1' sx={{ marginTop: "10px" }}>
              <CheckBox /> Include Consolation Bracket:
            </Typography>
          </Box>
          <Box>
            <BracketParticipantList />
          </Box>
        </div>
      </Box>
      <div>
        <button
          onClick={() => {
            props.setModalIsVisible(false);
          }}>
          Cancel
        </button>
        <button
          color='primary'
          onClick={() => {
            props.setModalIsVisible(false);
          }}>
          Create Bracket
        </button>
      </div>
    </Box>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewBracketModal);
