import { Box, Input, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PlatformTransactions from "../Components/settleUp/PlatformTransactions";
import { Formatter } from "../Components/utils/Formatter";
import DoorTransactions from "../Components/settleUp/DoorTransactions";

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

type EventExpenses = {
  venue: number;
  awards: { trophies: number; medals: number };
  travel: number;
  sanctioningFee: number;
  johnnyTax: number;
  platformFee: number;
};

type CashExpenses = {
  refCost: number;
  refCount: number;
  judgeCost: number;
  judgeCount: number;
  medicCost: number;
  cashboxStartup: number;
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

const initEventExpenses: EventExpenses = {
  venue: 0,
  awards: { trophies: 0, medals: 0 },
  travel: 0,
  sanctioningFee: 365,
  johnnyTax: 0,
  platformFee: 0,
};

const initCashExpenses: CashExpenses = {
  refCost: 0,
  refCount: 0,
  judgeCost: 0,
  judgeCount: 0,
  medicCost: 0,
  cashboxStartup: 0,
};

function CSSettleUp() {
  const [platformTransactions, setPlatformTransactions] = useState<PlatformTransactions>(intiPlatformTransactions);
  const [doorTransactions, setDoorTransactions] = useState<DoorTransactions>(initDoorTransactions);
  const [expenses, setExpenses] = useState<EventExpenses>(initEventExpenses);
  const [cashExpenses, setCashExpenses] = useState<CashExpenses>(initCashExpenses);

  const updateExpenses = (paramName: string, paramVal: string) => {
    console.log(`${paramName}: ${paramVal}`);
    setExpenses({ ...expenses, [paramName]: +paramVal });
  };
  const updateCashExpenses = (paramName: string, paramVal: string) => {
    // Make sure to check that judge cost and judge count are greater than 0 before
    // if (paramName === "judgeCost" && cashExpenses.judgeCount > 0) {
    //   setDoorTransactions({ ...doorTransactions, cashTotal: doorTransactions.cashTotal - cashExpenses.judgeCount * +paramVal });
    // } else {
    //   setDoorTransactions({ ...doorTransactions, cashTotal: doorTransactions.cashTotal + doorTransactions.creditCardTotal });
    // }
    // if (paramName === "judgeCount" && cashExpenses.judgeCost > 0) {
    //   setDoorTransactions({ ...doorTransactions, cashTotal: doorTransactions.cashTotal - cashExpenses.judgeCost * +paramVal });
    // }
    // if (paramName === "refCost" && cashExpenses.refCount > 0) {
    //   setDoorTransactions({ ...doorTransactions, cashTotal: doorTransactions.cashTotal - cashExpenses.refCount * +paramVal });
    // }
    // if (paramName === "refCount" && cashExpenses.refCost > 0) {
    //   setDoorTransactions({ ...doorTransactions, cashTotal: doorTransactions.cashTotal - cashExpenses.refCost * +paramVal });
    // }
    // if (paramName === "medicCost" || paramName === "cashboxStartup") {
    //   setDoorTransactions({ ...doorTransactions, cashTotal: doorTransactions.cashTotal - +paramVal });
    // }

    setCashExpenses({ ...cashExpenses, [paramName]: +paramVal });
  };
  const updateAwardExpenses = (paramName: string, paramVal: string) => {
    setExpenses({ ...expenses, awards: { ...expenses.awards, [paramName]: +paramVal } });
    console.log(expenses);
  };

  const getTotalRevenue = () => {
    return getPlatformTotal() + +doorTransactions.cashTotal + +doorTransactions.creditCardTotal;
  };
  const getTotalExpenses = () => {
    const { venue, awards, travel, sanctioningFee, johnnyTax, platformFee } = expenses;
    const { fighterCount } = platformTransactions;
    return venue + awards.trophies + awards.medals + travel + sanctioningFee + johnnyTax * fighterCount + platformFee * fighterCount;
  };
  const getPlatformTotal = () => {
    const { fighterCost, fighterCount, trainerCost, trainerCount, spectatorCost, spectatorCount } = platformTransactions;
    const pTotal = fighterCost * fighterCount + trainerCost * trainerCount + spectatorCost * spectatorCount;
    return pTotal;
  };
  const getCashExpenses = () => {
    const { refCost, refCount, judgeCost, judgeCount, medicCost, cashboxStartup } = cashExpenses;
    return refCost * refCount + judgeCost * judgeCount + medicCost + cashboxStartup;
  };
  const getDoorTransactionTotal = () => {
    return doorTransactions.cashTotal - getCashExpenses();
  };

  return (
    <Box>
      <Paper sx={{ margin: "5px", padding: "5px" }} elevation={10}>
        <Typography variant="h3">Transactions</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <PlatformTransactions />
          <DoorTransactions />
        </Box>
      </Paper>
      <Paper sx={{ margin: "5px", padding: "5px", display: "flex", gap: 3, alignItems: "center" }} elevation={10}>
        <Typography variant="h3">Revenue</Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ fontSize: "32px" }}>{`Platform Total: ${Formatter.format(getPlatformTotal())} +`}</Box>
          <Box sx={{ fontSize: "32px" }}>{`Door Total: ${Formatter.format(+doorTransactions.cashTotal + +doorTransactions.creditCardTotal)}=`}</Box>
          <Box sx={{ fontSize: "32px" }}>{`Total Revenue:  ${Formatter.format(getPlatformTotal() + +doorTransactions.cashTotal + +doorTransactions.creditCardTotal)}`}</Box>
        </Box>
      </Paper>
      <Paper sx={{ margin: "5px", padding: "5px" }} elevation={10}>
        <Typography variant="h3">{`Expenses`}</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h4">{`Event Expenses: ${Formatter.format(getTotalExpenses())}`}</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box>
                <Typography variant="h5">Location</Typography>
                <Box>
                  <TextField
                    label="Venue Cost"
                    defaultValue="0"
                    variant="filled"
                    color="info"
                    sx={{ backgroundColor: "#ffffff" }}
                    onChange={(ev) => {
                      updateExpenses("venue", ev.target.value);
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="h5">Awards</Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    label="Trophies Cost (count * 17)"
                    defaultValue="0"
                    variant="filled"
                    color="info"
                    sx={{ backgroundColor: "#ffffff" }}
                    onChange={(ev) => {
                      updateAwardExpenses("trophies", ev.target.value);
                    }}
                  />
                  <TextField
                    label="Medals Cost (count * 5)"
                    defaultValue="0"
                    variant="filled"
                    color="info"
                    sx={{ backgroundColor: "#ffffff" }}
                    onChange={(ev) => {
                      updateAwardExpenses("medals", ev.target.value);
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="h5">Travel</Typography>
                <Box>
                  <TextField
                    label="Travel Cost"
                    defaultValue="0"
                    variant="filled"
                    color="info"
                    sx={{ backgroundColor: "#ffffff" }}
                    onChange={(ev) => {
                      updateExpenses("travel", ev.target.value);
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="h5">IKF Fees</Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    label="Sanctioning Fee"
                    defaultValue="$365.00"
                    variant="filled"
                    sx={{ backgroundColor: "#ffffff" }}
                    onChange={(ev) => {
                      updateExpenses("sanctioningFee", ev.target.value);
                    }}
                  />
                  <TextField
                    label="Johnny Tax (Per Fighter)"
                    defaultValue="0"
                    variant="filled"
                    color="info"
                    sx={{ backgroundColor: "#ffffff" }}
                    onChange={(ev) => {
                      updateExpenses("johnnyTax", ev.target.value);
                    }}
                  />
                  <TextField
                    label="Platform Fee (Per Fighter)"
                    defaultValue="0"
                    variant="filled"
                    color="info"
                    sx={{ backgroundColor: "#ffffff" }}
                    onChange={(ev) => {
                      updateExpenses("platformFee", ev.target.value);
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ backgroundColor: "#eee", borderLeft: "2px solid #000", paddingLeft: "10px", marginLeft: "10px", maxWidth: "40vw" }}>
            <Typography variant="h4">{`Cash Expenses: ${Formatter.format(getCashExpenses())}`}</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box>
                <TextField
                  label="Referee Cost"
                  defaultValue="0"
                  variant="filled"
                  color="info"
                  sx={{ backgroundColor: "#ffffff" }}
                  onChange={(ev) => {
                    updateCashExpenses("refCost", ev.target.value);
                  }}
                />
                <TextField
                  label="Referee Count"
                  defaultValue="0"
                  variant="filled"
                  color="info"
                  sx={{ backgroundColor: "#ffffff" }}
                  onChange={(ev) => {
                    updateCashExpenses("refCount", ev.target.value);
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="Judges Cost"
                  defaultValue="0"
                  variant="filled"
                  color="info"
                  sx={{ backgroundColor: "#ffffff" }}
                  onChange={(ev) => {
                    updateCashExpenses("judgeCost", ev.target.value);
                  }}
                />
                <TextField
                  label="Judges Count"
                  defaultValue="0"
                  variant="filled"
                  color="info"
                  sx={{ backgroundColor: "#ffffff" }}
                  onChange={(ev) => {
                    updateCashExpenses("judgeCount", ev.target.value);
                  }}
                />
              </Box>
              <Box>
                <TextField
                  label="Medic Cost"
                  defaultValue="0"
                  variant="filled"
                  color="info"
                  sx={{ backgroundColor: "#ffffff" }}
                  onChange={(ev) => {
                    updateCashExpenses("medicCost", ev.target.value);
                  }}
                />
                <TextField
                  label="Cashbox Startup"
                  defaultValue="0"
                  variant="filled"
                  color="info"
                  sx={{ backgroundColor: "#ffffff" }}
                  onChange={(ev) => {
                    updateCashExpenses("cashboxStartup", ev.target.value);
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Paper sx={{ margin: "5px", padding: "5px", display: "flex", gap: 4, alignItems: "center" }}>
        <Typography variant="h2">Profit</Typography>
        <Box>
          <Box sx={{ fontSize: "32px" }}>(Revenue) - (Expense) = Profit</Box>
          <Box sx={{ fontSize: "32px" }}>
            {`${Formatter.format(getTotalRevenue())} - ${Formatter.format(getTotalExpenses())} = `} <Typography variant="body1" sx={{ display: "inline", fontSize: "32px", color: "green" }}>{`${Formatter.format(getTotalRevenue() - getTotalExpenses())}`}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CSSettleUp;
