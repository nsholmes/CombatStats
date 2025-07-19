import { IKFParticipant } from "@nsholmes/combat-stats-types/fighter.model";

export type TStatus = "todo" | "in-progress" | "done";
export type TTask = { id: string; content: string; status: TStatus };

const listDataKey = Symbol("task");
export type ListData = { [listDataKey]: true; participant: IKFParticipant };

export function isListData(
  data: Record<string | symbol, unknown>
): data is ListData {
  return data[listDataKey] === true;
}
