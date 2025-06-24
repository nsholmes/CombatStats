import { CSBracket } from "../../Models";

export type ColumnType = {
  title: string;
  columnId: string;
  items: CSBracket[];
};

export type ColumnMap = { [columnId: string]: ColumnType };

export type Outcome =
  | {
      type: "column-reorder";
      columnId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "card-reorder";
      columnId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "card-move";
      finishColumnId: string;
      itemIndexInStartColumn: number;
      itemIndexInFinishColumn: number;
    };

export type Trigger = "pointer" | "keyboard";

export type Operation = {
  trigger: Trigger;
  outcome: Outcome;
};

export type BoardState = {
  columnMap: ColumnMap;
  orderedColumnIds: string[];
  lastOperation: Operation | null;
};
