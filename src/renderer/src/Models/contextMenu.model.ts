import { BracketEditState } from ".";

//Props
export type ContextMenuProps = {
  isVisible: boolean;
  currentMenu: ContextMenuType;
  menuPositionCoords: PositionCoords;
  setIsVisible: (isVisible: boolean) => void;
};
export type ContextMenuType = "bracketSetup" | "matching" | "";
export type PositionCoords = {
  xpos: number;
  ypos: number;
};

export type BracketSetupMenuProps = {
  setBracketEditState: (editState: BracketEditState) => void;
  bracketEditState: BracketEditState;
  setMenuIsVisible: (isVisible: boolean) => void;
};
