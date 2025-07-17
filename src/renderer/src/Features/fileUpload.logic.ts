import { createLogic } from "redux-logic";
import EventData from "../data/MarionBrackets_20231210.json";
import { setCBBrackets } from "./cbBracket.slice";
import { uploadFile } from "./fileUploadAction";

const fileUpload = createLogic({
  type: uploadFile,
  async process({ action }, dispatch, done) {
    console.log("file: ", action.payload);

    const brackets = EventData.brackets.map((bracket: any) => {
      const newBracketData = {
        bracketId: bracket.id,
        divisionName: bracket.name,
        discipline: bracket.discipline.name,
        bracketDivisionName: bracket.name,
        ringName: bracket.ring_name,
        ringNumber: bracket.ring_number,
        bracketGender: bracket.sport.gender_name,
        competitors: bracket.seps,
      };
      return newBracketData;
    });

    if (brackets) {
      dispatch(setCBBrackets(brackets));
    } else {
      console.log("Error loading file");
    }
    done();
  },
});

const fileUploadLogic = [fileUpload];

export default fileUploadLogic;
