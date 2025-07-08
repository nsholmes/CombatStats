import { IKFParticipant } from "./fighter.model";

export type CombatEvent = {
  bouts: CSBout[];
  selectedEvent: IKFEvent;
  participants: IKFParticipant[];
  mats: CSMat[];
  brackets: CSBracket[];
  selectedParticipantIds: number[];
};

export type SelectedEvent = {
  eventID: number;
  eventUID: string;
  eventName: string;
};

export type Fighter = { firstName: string; lastName: string };
export type Bout = { blueCorner: Fighter; redCorner: Fighter };
export type BracketEditState =
  | "moveFighter"
  | "duplicateAndMoveFighter"
  | "removeFighter"
  | "addFighter"
  | "off";

export type CSMat = {
  id: number;
  name: string;
  roles: MatRoles;
  currentBout?: CSBout | null;
  onDeckBout?: CSBout | null;
  inHoleBout?: CSBout | null;
};

export type MatRoles = {
  referee: string;
  judges: string[];
  timekeeper: string;
};

export type MatRolesUpdate = {
  roles: MatRoles;
  idx: number;
};

export type CSBout = {
  boutId: string;
  bracketId: number;
  matId: number;
  roundNumber: number;
  redCorner: IKFParticipant | null;
  blueCorner: IKFParticipant | null;
};

export type CSBrackets = {
  brackets: CSBracket[];
  editState: BracketEditState;
  selectedCompetitor: string | null;
};
export type CSBracket = {
  bracketId: number | string;
  divisionName: string;
  discipline: string;
  bracketClassName: string;
  competitors: IKFParticipant[];
  matNumber: number;
  sequence: number;
};
export type BracketCompetitor = {
  bracket: competitorBracket;
  competitiveexperienceString: string | null;
  competitiveexperiences: string | null;
  competitor: {
    full_name: string;
    id: number;
    is_final_weight: number;
    weight: number;
  };
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
  };
  profile_name: string;
  seed: number;
  wlrString: string;
  wlr_string: string;
};

export type competitorBracket = {
  id: number;
};

export type IKFBracket = {
  bracketClassName: string;
  bracketGender: string;
  bracketId: 2915;
  discipline: string;
  ringNumber: number;
  ringName?: string;
};

export type fileUpload = {
  brackets: IKFBracket[];
  ringsNumbers: Number[];
};

export type IKFEvent = {
  eventDate: "";
  eventName: "";
  eventUid: "";
  id: -1;
  posterSmallUrl: "";
  posterUrl: "";
  promoterId: -1;
  registrationFee: "" | -1;
  trainerRegistrationFee: "" | -1;
  participants?: IKFParticipant[];
};

export type EventParticipantRequest = { eventID: number; eventUID: string };
export type EventBracketRequest = { eventID: number; eventUID: string };
