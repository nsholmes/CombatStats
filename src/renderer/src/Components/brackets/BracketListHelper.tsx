import { CSMat } from "../../Models";
import { ColumnMap } from "./BracketList.model";

export function getBasicData(mats: CSMat[]) {
  const columnMap: ColumnMap = {};
  const orderedColumnIds: string[] = [];

  mats.map((mat, idx) => {
    columnMap[mat.name.length > 0 ? mat.name : mat.id.toString()] = {
      title: mat.name.length > 0 ? mat.name : `Mat ${mat.id.toString()}`,
      columnId: `${idx}`,
      items: mat.brackets,
    };

    orderedColumnIds.push(mat.id.toString());
  });

  return {
    columnMap,
    orderedColumnIds,
  };
}
