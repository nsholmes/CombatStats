export type CombatEvent = {
  eventName: string;
  bouts: Bout[];
}
export type Fighter = { firstName: string; lastName: string }
export type Bout = { blueCorner: Fighter, redCorner: Fighter }
export type BracketEditState = "moveFighter" | "duplicateAndMoveFighter" | "removeFighter" | "addFighter" | "off";

export type CSBrackets = {
  brackets: CSBracket[];
  editState: BracketEditState;
  selectedCompetitor: BracketCompetitor | null;
}
export type CSBracket = {
  bracketId: number;
  divisionName: string;
  discipline: string;
  bracketClassName: string;
  ringName: string;
  ringNumber: number;
  bracketGender: string;
  competitors: BracketCompetitor[];
}
export type BracketCompetitor = {
  bracket: competitorBracket;
  competitiveexperienceString: string | null;
  competitiveexperiences: string | null;
  competitor: {
    full_name: string;
    id: number;
    is_final_weight: number;
    weight: number;
  }
  fighterAffiliations: any[];
  gym_name: string;
  id: number;
  person: {
    ageAtEvent: number;
    calculated_age: number;
    first_name: string;
    full_name: string;
    id: number;
    last_name: string;
  }
  profile_name: string;
  seed: number;
  wlrString: string;
  wlr_string: string;
}

export type competitorBracket = {
  id: number;
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
