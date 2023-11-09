export type CombatEvent = {
  eventName: string;
  bouts: Bout[];
}
export type Fighter = { firstName: string; lastName: string }
export type Bout = { blueCorner: Fighter, redCorner: Fighter }
export type CSBrackets = {
  brackets: CSBracket[];
}
export type CSBracket = {
  bracketId: number;
  divisionName: string;
  discipline: string;
  bracketClassName: string;
  ringName: string;
  ringNumber: number;
  bracketGender: string;
  competitors: any[];
}
export type IKFBracket = {
  bracketClassName: string;
  bracketGender: string;
  bracketId: 2915;
  discipline: string;
  ringNumber: number;
  ringName?: string;
}

export type fileUpload = {
  brackets: IKFBracket[];
  ringsNumbers: Number[];
}
