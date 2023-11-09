import { Bout, CSBracket } from "./event.model";

export type CreateEventProps = {
  setEventName: (eventName: string) => void;
  addBout: (bout: Bout) => void;
  getAllCSBrackets: CSBracket[];
  getCombatEventName: string;
  getAllBouts: Bout[];
}

export type EventBracketsProps = {
  getAllCSBrackets: CSBracket[];
}

export type FileUploadProps = {
  uploadIKFEventFile: (file: File) => void;
}