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
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ width: "50%", display: "flex", gap: "20px" }}>
          <Box>
            <Typography variant='subtitle1' sx={{ marginTop: "10px" }}>
              Weight Class:
            </Typography>
          </Box>
          <Box>
            <FormControl sx={{ m: 1, minWidth: 150 }} size='small'>
              <InputLabel id='demo-select-small-label'>Gender</InputLabel>
              <Select
                labelId='Gender-select-label'
                id='gender-select'
                value={bracketGender}
                label='Gender'
                onChange={(e) => setBracketGender(e.target.value)}>
                <MenuItem value='Select Gender'>
                  <em>Select Gender</em>
                </MenuItem>
                <MenuItem value='Male'>Male</MenuItem>
                <MenuItem value='Female'>Female</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography variant='subtitle1' sx={{ marginTop: "10px" }}>
              <CheckBox /> Include Consolation Bracket:
            </Typography>
          </Box>
          <Box>
            <BracketParticipantList />
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginTop: "10px" }}>
        <Button
          onClick={() => {
            props.setModalIsVisible(false);
          }}>
          Cancel
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            props.setModalIsVisible(false);
          }}>
          Create Bracket
        </Button>
      </Box>
    </Box>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewBracketModal);
