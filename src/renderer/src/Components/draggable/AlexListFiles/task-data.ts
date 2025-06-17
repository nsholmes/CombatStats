import { EventBracket } from "../../../Models/bracket.model";
import { IKFParticipant } from "../../../Models/fighter.model";

export type TStatus = string;
export type TTask = { id: string; content: string; status: TStatus };

const taskDataKey = Symbol("task");

export type TTaskData = { [taskDataKey]: true; taskId: TTask["id"] };

export function getTaskData(task: TTask): TTaskData {
  return { [taskDataKey]: true, taskId: task.id };
}

export function isTaskData(
  data: Record<string | symbol, unknown>
): data is TTaskData {
  return data[taskDataKey] === true;
}
export function isIKFParticipant(obj: any): obj is IKFParticipant {
  console.log("isIKFParticipant", obj);
  const retVal = obj && typeof obj === "object" && "competitorId" in obj;
  console.log(retVal);
  return retVal;
  // Add other required properties of IKFParticipant
}

export function isEventBracket(obj: any): obj is EventBracket {
  console.log("isEventBracket", obj);
  const retVal = obj && typeof obj === "object" && "bracketrule" in obj;
  console.log(retVal);
  return retVal;
}

const tasks: TTask[] = [
  { id: "task-0", content: "Organize a team-building event", status: "todo" },
  {
    id: "task-1",
    content: "Create and maintain office inventory",
    status: "in-progress",
  },
  { id: "task-2", content: "Update company website content", status: "done" },
  {
    id: "task-3",
    content: "Plan and execute marketing campaigns",
    status: "todo",
  },
  {
    id: "task-4",
    content: "Coordinate employee training sessions",
    status: "done",
  },
  { id: "task-5", content: "Manage facility maintenance", status: "done" },
  {
    id: "task-6",
    content: "Organize customer feedback surveys",
    status: "todo",
  },
  {
    id: "task-7",
    content: "Coordinate travel arrangements",
    status: "in-progress",
  },
];

export function getTasks<Type>(data: Type): TTask[] {
  console.log("getTasks Called: ", data);
  // check if data is of Type IKFParticipant array
  if (Array.isArray(data) && data.length > 0 && isIKFParticipant(data[0])) {
    const newTask: TTask[] = [];
    data.map((participant: IKFParticipant) => {
      newTask.push({
        id: `${participant.competitorId}`,
        content: `${participant.firstName} ${participant.lastName} (${participant.weight}lbs)`,
        status: "todo",
      });
    });
    return newTask;
    // data is likely an IKFParticipant array
    // You can add your logic here if needed
  }

  if (Array.isArray(data) && data.length > 0) {
    const newTask: TTask[] = [];
    data.map((bracket: EventBracket) => {
      newTask.push({
        id: bracket.id.toString(),
        content: bracket.name,
        status: bracket.bracketstatus.friendly_name,
      });
    });
    return newTask;
  }

  return tasks;
}
