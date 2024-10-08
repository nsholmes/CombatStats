export type EventDoorTransactions = {
  doorCreditCardTotal: RevenueItem;
  doorCashTotal: RevenueItem;
};

export type EventPlatformTransactions = {
  fighterRegistration: RevenueItem;
  trainerRegistration: RevenueItem;
  spectatorPurchase: RevenueItem;
};

export type RevenueItem = {
  revenueType: "platform" | "door";
  name: string;
  amount: number;
};

export type ExpenseItem = {
  expenseType: "location" | "awards" | "ikf" | "fsi" | "travel" | "cash";
  name: string;
  amount: number;
  payee?: string;
};

//-- Exenpse Itmes --//
export const venueCost: ExpenseItem = {
  expenseType: "location",
  name: "venueCost",
  amount: 0,
};

export const trophiesCost: ExpenseItem = {
  expenseType: "awards",
  name: "Trophies Cost",
  amount: 0,
  payee: "Ak Promotions",
};

export const medalsCost: ExpenseItem = {
  expenseType: "awards",
  name: "Medals Cost",
  payee: "Ak Promotions",
  amount: 0,
};

export const sanctioningFee: ExpenseItem = {
  expenseType: "ikf",
  name: "Sanctioning Fee",
  amount: 0,
  payee: "Ak Promotions",
};

export const platformFee: ExpenseItem = {
  expenseType: "fsi",
  name: "Platform Fee",
  amount: 0,
  payee: "FSI",
};

export const fighterRegistrationFee: ExpenseItem = {
  expenseType: "ikf",
  name: "Johnny Tax",
  amount: 0,
  payee: "Johnny Davis",
};

export const ikfTravelCost: ExpenseItem = {
  expenseType: "ikf",
  name: "IKF Travel Cost",
  amount: 0,
  payee: "IKF Representative",
};

// export type Expense = {
//   expenseType: string;
//   upFrontResponsibility: "promoter" | "representative";
//   amount: number;
//   amountPaidUpfront: number;
// };
// export type Transaction = {
//   transactionType: "platform" | "doorCreditCard" | "doorCash";
//   payee: "promoter" | "representative" | "event";
//   hasFee: boolean;
//   amount: number;
//   transactionFees?: EventFee[];
//   transFeePayee?: string;
// };
// export type EventFee = {
//   payee: string;
//   amount: number;
//   payer: "promoter" | "representative" | "event";
// };

// export const doorCreditCardTransactionTotal: Transaction = {
//   transactionType: "doorCreditCard",
//   payee: "event",
//   hasFee: false,
//   amount: 0,
// };
// export const doorCashTransactionTotal: Transaction = {
//   transactionType: "doorCash",
//   payee: "event",
//   hasFee: false,
//   amount: 0,
// };
// export const sanctioningFee: EventFee = {
//   payee: "AKPromotions",
//   amount: 0,
//   payer: "event"
// };
// export const platformFee: EventFee = {
//   payee: "FSIPlatform",
//   amount: 0,
//   payee: "event"
// };
// export const fighterRegistration: Transaction = {
//   transactionType: "platform",
//   payee: "event",
//   hasFee: true,
//   amount: 0,
//   transactionFees: [sanctioningFee, platformFee],
// };
// export const trainerRegistration: Transaction = {
//   transactionType: "platform",
//   payee: "event",
//   hasFee: false,
//   amount: 0,
// };
// export const spectatorRegistration: Transaction = {
//   transactionType: "platform",
//   payee: "event",
//   hasFee: false,
//   amount: 0,
// };
