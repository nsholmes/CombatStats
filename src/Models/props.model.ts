import { ContextMenuType, PositionCoords } from ".";
import { Bout, BracketCompetitor, BracketEditState, CSBracket } from "./event.model";

export type CreateEventProps = {
  setEventName: (eventName: string) => void;
  addBout: (bout: Bout) => void;
  setBracketEditState: (editState: BracketEditState) => void;
  getAllCSBrackets: CSBracket[];
  getCombatEventName: string;
  getAllBouts: Bout[];
}

export type BracketSetupProps = {
  getAllCSBrackets: CSBracket[];
  bracketEditState: BracketEditState;
  getSelectedCompetitor: string | null;
  moveSelectedCompetitor: (competitorId: string | null) => void;
  setCurrentContextMenu: (menuName: ContextMenuType) => void;
  setMenuIsVisible: (isVisible: boolean) => void;
  setMenuPosition: (coords: PositionCoords) => void;
  setSelectedCompetitor: (competitorId: string | null) => void;
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

