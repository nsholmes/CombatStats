import { TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { EventPlatformTransactions } from "../../Models/settleUp.model";
import { Formatter } from "../utils/Formatter";

const intiPlatformTransactions: EventPlatformTransactions = {
  fighterRegistration: {
    revenueType: "platform",
    name: "fighterReg",
    amount: 0,
  },
  trainerRegistration: {
    revenueType: "platform",
    name: "trainerReg",
    amount: 0,
  },
  spectatorPurchase: {
    revenueType: "platform",
    name: "specPurchase",
    amount: 0,
  },
};

type amountItem = {
  cost: number;
  count: number;
};
//     fighterRegistration:
//   fighterCost: 0,
//   fighterCount: 0,
//   trainerCost: 0,
//   trainerCount: 0,
//   spectatorCost: 0,
//   spectatorCount: 0,
//   platformTotal: 0,

function PlatformTransactions() {
  const [platformTransactions, setPlatformTransactions] = useState<EventPlatformTransactions>(intiPlatformTransactions);
  const [fighterItem, setFighterItem] = useState<amountItem>({ cost: 0, count: 0 });
  const [trainerItem, setTrainerItem] = useState<amountItem>({ cost: 0, count: 0 });
  const [spectatorItem, setSpectatorItem] = useState<amountItem>({ cost: 0, count: 0 });

  const updateFighterRegAmount = (field: string, strValue: string) => {
    const val = parseFloat(strValue);
    setFighterItem({ ...fighterItem, [field]: val });
  };
  const updateTrainerRegAmount = (field: string, strValue: string) => {
    const val = parseFloat(strValue);
    setTrainerItem({ ...trainerItem, [field]: val });
  };
  const updateSpectatorAmount = (field: string, strValue: string) => {
    const val = parseFloat(strValue);
    setSpectatorItem({ ...spectatorItem, [field]: val });
  };

  const getItemTotal = (item: amountItem): number => {
    return item.cost * item.count;
  };

  const getPlatformTotal = (): string => {
    const pTotal = Formatter.format(getItemTotal(fighterItem) + getItemTotal(trainerItem) + getItemTotal(spectatorItem));
    return pTotal;
  };

  return (
    <Box>
      <Typography variant="h4">{`Platform Transactions: ${getPlatformTotal()}`}</Typography>
      <Box sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Fighter Cost"
            defaultValue="55.00"
            variant="filled"
            color="info"
            type="number"
            sx={{ backgroundColor: "#ffffff" }}
            onChange={(ev) => {
              updateFighterRegAmount("cost", ev.target.value);
            }}
          />
          <TextField
            label="Fighter Count"
            defaultValue="0"
            variant="filled"
            color="info"
            type="number"
            sx={{ backgroundColor: "#ffffff" }}
            onChange={(ev) => {
              updateFighterRegAmount("count", ev.target.value);
            }}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Trainer Cost"
            defaultValue="30.000"
            variant="filled"
            color="info"
            type="number"
            sx={{ backgroundColor: "#ffffff" }}
            onChange={(ev) => {
              updateTrainerRegAmount("cost", ev.target.value);
            }}
          />
          <TextField
            label="Trainer Count"
            defaultValue="0"
            variant="filled"
            color="info"
            type="number"
            sx={{ backgroundColor: "#ffffff" }}
            onChange={(ev) => {
              updateTrainerRegAmount("count", ev.target.value);
            }}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Spectator Cost"
            defaultValue="20.00"
            variant="filled"
            color="info"
            type="number"
            sx={{ backgroundColor: "#ffffff" }}
            onChange={(ev) => {
              updateSpectatorAmount("cost", ev.target.value);
            }}
          />
          <TextField
            label="Spectator Count"
            defaultValue="0"
            variant="filled"
            color="info"
            type="number"
            sx={{ backgroundColor: "#ffffff" }}
            onChange={(ev) => {
              updateSpectatorAmount("count", ev.target.value);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PlatformTransactions;
