import { Box, TextField, Typography } from "@mui/material";
import { Formatter } from "../utils/Formatter";
import { EventDoorTransactions } from "../../Models/settleUp.model";
import { useState } from "react";

const initDoorTransactions: EventDoorTransactions = {
  doorCreditCardTotal: {
    revenueType: "door",
    name: "doorCCTotal",
    amount: 0,
  },
  doorCashTotal: {
    revenueType: "door",
    name: "doorCashTotal",
    amount: 0,
  },
};

function DoorTransactions() {
  //   const [doorTransactions, setDoorTransactions] = useState<EventDoorTransactions>(initDoorTransactions);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<number>(0);

  const getDoorTotal = () => {
    return Formatter.format(creditAmount + cashAmount);
  };
  return (
    <Box>
      <Typography variant="h4">{`Door Transactions: ${getDoorTotal()}`}</Typography>
      <Box sx={{ display: "flex", gap: 4 }}>
        <TextField
          label="Credit Card Total"
          defaultValue="0"
          variant="filled"
          color="info"
          type="number"
          sx={{ backgroundColor: "#ffffff" }}
          onChange={(ev) => {
            setCreditAmount(parseFloat(ev.target.value));
          }}
        />
        <TextField
          label="Cash Total"
          defaultValue="0"
          variant="filled"
          color="info"
          type="number"
          sx={{ backgroundColor: "#ffffff" }}
          onChange={(ev) => {
            setCashAmount(parseFloat(ev.target.value));
          }}
        />
      </Box>
    </Box>
  );
}

export default DoorTransactions;
