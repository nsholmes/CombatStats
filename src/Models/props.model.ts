import { Bout, BracketCompetitor, CSBracket } from "./event.model";

export type CreateEventProps = {
  setEventName: (eventName: string) => void;
  addBout: (bout: Bout) => void;
  getAllCSBrackets: CSBracket[];
  getCombatEventName: string;
  getAllBouts: Bout[];
}

export type BracketSetupProps = {
  getBracketCompetitors: BracketCompetitor[]
}
export type BracketListProps = {
  getAllCSBrackets: CSBracket[];
}
export type BracketLayoutProps = {
  getAllCSBrackets: CSBracket[];
}

export type EventBracketsProps = {
  getAllCSBrackets: CSBracket[];
}

export type FileUploadProps = {
  uploadIKFEventFile: (file: File) => void;
}