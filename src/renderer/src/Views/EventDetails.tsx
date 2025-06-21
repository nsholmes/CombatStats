import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { FC, useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import { connect } from "react-redux";
import {
  SelectMats,
  setMats,
  updateMatRoles,
} from "../Features/combatEvent.slice";
import { CSMat, MatRoles, MatRolesUpdate } from "../Models";
import { BootstrapInput } from "./StyledComps/BootstrapInput";

type EventDetailsProps = {
  mats: CSMat[];
  setMats: (mats: CSMat[]) => void;
  updateMatRoles: (roleUpdate: MatRolesUpdate) => void;
};

function mapStateToProps(state: any) {
  return {
    mats: SelectMats(state),
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    setMats: (mats: CSMat[]) => dispatch(setMats(mats)),
    updateMatRoles: (roleUpdate: MatRolesUpdate) =>
      dispatch(updateMatRoles(roleUpdate)),
  };
}

const defaultMat = (): MatRoles => ({
  referee: "",
  judges: ["", "", ""],
  timekeeper: "",
});

const EventDetails: FC<EventDetailsProps> = (props) => {
  const [numMats, setNumMats] = useState(props.mats.length);
  const [roles, setRoles] = useState<MatRoles[]>([defaultMat()]);

  useEffect(() => {
    const newRoles: MatRoles[] = [];
    props.mats.map((mat) => {
      newRoles.push(mat.roles);
    });
    setRoles(newRoles);
  }, []);

  // Update mats array when numMats changes
  const handleNumMatsChange = (value: number) => {
    setNumMats(value);
    setRoles((prev) => {
      const newRoles = [...prev];
      const newMats = [...props.mats];
      if (value > prev.length) {
        for (let i = prev.length; i < value; i++) {
          const cbMat: CSMat = {
            id: i,
            name: "",
            brackets: [],
            roles: defaultMat(),
          };
          newMats.push(cbMat);
          newRoles.push(defaultMat());
        }
      } else {
        newRoles.length = value;
        newMats.length = value;
      }
      props.setMats(newMats);
      return newRoles;
    });
  };

  // Handlers for each role
  const handleRoleChange = (
    matIdx: number,
    role: "referee" | "timekeeper",
    value: string
  ) => {
    setRoles((prev) => {
      const newRoles = [...prev];
      const newMats = [...props.mats];
      newRoles[matIdx] = { ...newRoles[matIdx], [role]: value };
      props.updateMatRoles({
        idx: matIdx,
        roles: newRoles[matIdx],
      });
      return newRoles;
    });
  };

  const handleJudgeChange = (
    matIdx: number,
    judgeIdx: number,
    value: string
  ) => {
    setRoles((prev) => {
      const newMats = [...prev];
      const judges = [...newMats[matIdx].judges];
      judges[judgeIdx] = value;
      newMats[matIdx] = { ...newMats[matIdx], judges };
      return newMats;
    });
  };

  const handleAddJudge = (matIdx: number) => {
    setRoles((prev) => {
      const newMats = [...prev];
      const judges = [...newMats[matIdx].judges, ""];
      newMats[matIdx] = { ...newMats[matIdx], judges };
      return newMats;
    });
  };

  const handleRemoveJudge = (matIdx: number, judgeIdx: number) => {
    setRoles((prev) => {
      const newMats = [...prev];
      const judges = newMats[matIdx].judges.filter(
        (_, idx) => idx !== judgeIdx
      );
      newMats[matIdx] = { ...newMats[matIdx], judges };
      return newMats;
    });
  };

  return (
    <Box p={3}>
      <Typography variant='h3' gutterBottom>
        Event Details
      </Typography>
      <Box mb={2}>
        <Select
          value={numMats}
          label='Mat Count'
          input={<BootstrapInput />}
          onChange={(e) => handleNumMatsChange(Number(e.target.value))}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </Select>
        <Typography mt={1}>Current number of mats: {numMats}</Typography>
      </Box>
      <Grid container spacing={3}>
        {roles.map((mat, matIdx) => (
          <Grid container item xs={12} md={6} key={matIdx}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant='h6' gutterBottom>
                Mat {matIdx + 1}
              </Typography>
              <Box mb={2}>
                <Typography>Referee:</Typography>
                <TextField
                  value={mat.referee}
                  onChange={(e) =>
                    handleRoleChange(matIdx, "referee", e.target.value)
                  }
                  size='small'
                  placeholder='Referee Name'
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <Typography>Judges:</Typography>
                <List dense>
                  {mat.judges.map((judge, judgeIdx) => (
                    <ListItem key={judgeIdx} disableGutters>
                      <ListItemText
                        primary={
                          <TextField
                            value={judge}
                            onChange={(e) =>
                              handleJudgeChange(
                                matIdx,
                                judgeIdx,
                                e.target.value
                              )
                            }
                            size='small'
                            placeholder={`Judge ${judgeIdx + 1} Name`}
                            fullWidth
                          />
                        }
                      />
                      <ListItemSecondaryAction>
                        {mat.judges.length > 1 && (
                          <IconButton
                            edge='end'
                            aria-label='delete'
                            onClick={() =>
                              handleRemoveJudge(matIdx, judgeIdx)
                            }>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddJudge(matIdx)}
                  size='small'
                  variant='outlined'
                  sx={{ mt: 1 }}
                  disabled={mat.judges.length >= 10}>
                  Add Judge
                </Button>
              </Box>
              <Box mb={2}>
                <Typography>Timekeeper:</Typography>
                <TextField
                  value={mat.timekeeper}
                  onChange={(e) =>
                    handleRoleChange(matIdx, "timekeeper", e.target.value)
                  }
                  size='small'
                  placeholder='Timekeeper Name'
                  fullWidth
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
