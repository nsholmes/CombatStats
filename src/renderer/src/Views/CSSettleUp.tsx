import { Box, Input, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type PlatformTransactions = {
  fighterCost: number;
  fighterCount: number;
  trainerCost: number;
  trainerCount: number;
  spectatorCost: number;
  spectatorCount: number;
  platformTotal: number;
};

type DoorTransactions = {
  creditCardTotal: number;
  cashTotal: number;
  doorTotal: number;
};

const intiPlatformTransactions: PlatformTransactions = {
  fighterCost: 0,
  fighterCount: 0,
  trainerCost: 0,
  trainerCount: 0,
  spectatorCost: 0,
  spectatorCount: 0,
  platformTotal: 0,
};

const initDoorTransactions: DoorTransactions = {
  creditCardTotal: 0,
  cashTotal: 0,
  doorTotal: 0,
};

function CSSettleUp() {
  //   const [platformRegistrationTotal, setPlatformRegistrationTotal] = useState(0);
  //   useEffect(() => {}, [platformRegistrationTotal]);

  const [platformTransactions, setPlatformTransactions] = useState<PlatformTransactions>(intiPlatformTransactions);
  //   useEffect(() => {
  //     const { fighterCost, fighterCount, trainerCost, trainerCount, spectatorCost, spectatorCount } = platformTransactions;
  //     const pTotal = fighterCost * fighterCount + trainerCost * trainerCount + spectatorCost * spectatorCount;
  //     console.log("Platform Total: ", pTotal);
  //     setPlatformTransactions({ ...platformTransactions, platformTotal: pTotal });
  //   }, [platformTransactions]);

  const [doorTransactions, setDoorTransactions] = useState<DoorTransactions>(initDoorTransactions);
  //   useEffect(() => {
  //     const dTotal = +doorTransactions.creditCardTotal + +doorTransactions.cashTotal;

  //     console.log("Cash Total: ", dTotal);
  //     setDoorTransactions({ ...doorTransactions, doorTotal: dTotal });
  //   }, [doorTransactions]);

  const updatePlatformTransactions = (paramName: string, paramVal: string) => {
    setPlatformTransactions({ ...platformTransactions, [paramName]: paramVal });
  };

  const updateEventDayTransactions = (paramName: string, paramVal: string) => {
    console.log(`paramName: ${paramName} paramVal: ${paramVal}`);
    setDoorTransactions({ ...doorTransactions, [paramName]: paramVal });
  };
  const getPlatformTotal = () => {
    const { fighterCost, fighterCount, trainerCost, trainerCount, spectatorCost, spectatorCount } = platformTransactions;
    const pTotal = fighterCost * fighterCount + trainerCost * trainerCount + spectatorCost * spectatorCount;
    return pTotal;
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
          <Box>{`Platform Total: ${getPlatformTotal()}`}</Box>
          <Box>{`Door Total: ${+doorTransactions.cashTotal + +doorTransactions.creditCardTotal}`}</Box>
          <Box>{`Total Revenue:  ${getPlatformTotal() + +doorTransactions.cashTotal + +doorTransactions.creditCardTotal}`}</Box>
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
