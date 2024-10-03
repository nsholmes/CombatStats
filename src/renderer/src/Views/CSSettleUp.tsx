import { Box, Input, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type PlatformTransactions = {
  fighterCost: number;
  fighterCount: number;
  trainerCost: number;
  trainerCount: number;
  spectatorCost: number;
  spectatorCount: number;
};

type EventDayTransactions = {
  creditCardTotal: number;
  cashTotal: number;
};

const intiPlatformTransactions: PlatformTransactions = {
  fighterCost: 0,
  fighterCount: 0,
  trainerCost: 0,
  trainerCount: 0,
  spectatorCost: 0,
  spectatorCount: 0,
};

const initEventDayTransactions: EventDayTransactions = {
  creditCardTotal: 0,
  cashTotal: 0,
};

function CSSettleUp() {
  const [platformRegistrationTotal, setPlatformRegistrationTotal] = useState(0);
  useEffect(() => {}, [platformRegistrationTotal]);

  const [platformTransactions, setPlatformTransactions] = useState<PlatformTransactions>(intiPlatformTransactions);
  useEffect(() => {
    console.log("platformTransactions: ", platformTransactions);
  }, [platformTransactions]);

  const [eventDayTransactions, setEnventDayTransactions] = useState<EventDayTransactions>(initEventDayTransactions);
  useEffect(() => {
    console.log("enventDayTransactions: ", eventDayTransactions);
  }, [eventDayTransactions]);

  const updatePlatformTransactions = (paramName: string, paramVal: string) => {
    setPlatformTransactions({ ...platformTransactions, [paramName]: paramVal });
  };

  const updateEventDayTransactions = (paramName: string, paramVal: string) => {
    console.log(`paramName: ${paramName} paramVal: ${paramVal}`);
    setEnventDayTransactions({ ...eventDayTransactions, [paramName]: paramVal });
  };
  return (
    <Box>
      <Paper elevation={10}>
        <Typography variant="h2">Event Information</Typography>
        <Typography variant="h5">Platform Transactions</Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Fighter Cost"
              defaultValue="55.00"
              variant="filled"
              color="info"
              sx={{ backgroundColor: "#ffffff" }}
              onChange={(ev) => {
                updatePlatformTransactions("fighterCost", ev.target.value);
              }}
            />
            <TextField
              label="Fighter Count"
              defaultValue="0"
              variant="filled"
              color="info"
              sx={{ backgroundColor: "#ffffff" }}
              onChange={(ev) => {
                updatePlatformTransactions("fighterCount", ev.target.value);
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Trainer Cost"
              defaultValue="30.000"
              variant="filled"
              color="info"
              sx={{ backgroundColor: "#ffffff" }}
              onChange={(ev) => {
                updatePlatformTransactions("trainerCost", ev.target.value);
              }}
            />
            <TextField
              label="Trainer Count"
              defaultValue="0"
              variant="filled"
              color="info"
              sx={{ backgroundColor: "#ffffff" }}
              onChange={(ev) => {
                updatePlatformTransactions("trainerCount", ev.target.value);
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Spectator Cost"
              defaultValue="20.00"
              variant="filled"
              color="info"
              sx={{ backgroundColor: "#ffffff" }}
              onChange={(ev) => {
                updatePlatformTransactions("spectatorCost", ev.target.value);
              }}
            />
            <TextField
              label="Spectator Count"
              defaultValue="0"
              variant="filled"
              color="info"
              sx={{ backgroundColor: "#ffffff" }}
              onChange={(ev) => {
                updatePlatformTransactions("spectatorCount", ev.target.value);
              }}
            />
          </Box>
        </Box>
        <Typography variant="h5">Event Day Transactions</Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <TextField
            label="Credit Card Total"
            defaultValue="0"
            variant="filled"
            color="info"
            sx={{ backgroundColor: "#ffffff" }}
            onChange={(ev) => {
              updateEventDayTransactions("creditCardTotal", ev.target.value);
            }}
          />
          <TextField
            label="Cash Total"
            defaultValue="0"
            variant="filled"
            color="info"
            sx={{ backgroundColor: "#ffffff" }}
            onChange={(ev) => {
              updateEventDayTransactions("cashTotal", ev.target.value);
            }}
          />
        </Box>
      </Paper>
      <Paper elevation={10}>
        <Typography variant="h2">Revenue</Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box>{`Platform Registration Total: $0.00`}</Box>
          <Box>{`Event Day Credit Card Total: $0.00`}</Box>
          <Box>{`Platform Spectator Total: $0.00`}</Box>
        </Box>
      </Paper>
      <Paper elevation={10}>
        <Typography variant="h2">Expenses</Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <TextField label="Venue Cost" defaultValue="0" variant="filled" color="info" sx={{ backgroundColor: "#ffffff" }} />
          <TextField label="Cashbox Starter" defaultValue="0" variant="filled" color="info" sx={{ backgroundColor: "#ffffff" }} />
          <TextField label="Awards Cost" defaultValue="0" variant="filled" color="info" sx={{ backgroundColor: "#ffffff" }} />
          <TextField label="Travel Cost" defaultValue="0" variant="filled" color="info" sx={{ backgroundColor: "#ffffff" }} />
          <TextField label="Sanctioning Fee" defaultValue="$365.00" variant="filled" sx={{ backgroundColor: "#ffffff" }} />
          <TextField label="Johnny Tax (Fighter x 10)" defaultValue="0" variant="filled" color="info" sx={{ backgroundColor: "#ffffff" }} />
          <TextField label="Platform Fee (Fighter x 2)" defaultValue="0" variant="filled" color="info" sx={{ backgroundColor: "#ffffff" }} />
        </Box>
      </Paper>
    </Box>
  );
}

export default CSSettleUp;
