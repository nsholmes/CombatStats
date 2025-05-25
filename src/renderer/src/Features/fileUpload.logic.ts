import { createLogic } from 'redux-logic';

// import { fetchIntercept } from "./utils/fetchIntercept.logic";
// import { postFileOptions } from "../Models";
// import { setCBBrackets } from "./cbBracket.slice";
import EventData from '../data/MarionBrackets_20231210.json';
import { setCBBrackets } from './cbBracket.slice';
import { uploadFile } from './fileUploadAction';

const fileUpload = createLogic({
  type: uploadFile,
  async process({ action }, dispatch, done) {
    // const options = postFileOptions(action.payload.type, action.payload.size)
    console.log("file: ", action.payload);

    const brackets = EventData.brackets.map((bracket: any) => {
      const newBracketData = {
        bracketId: bracket.id,
        divisionName: bracket.name,
        discipline: bracket.discipline.name,
        bracketClassName: bracket.name,
        ringName: bracket.ring_name,
        ringNumber: bracket.ring_number,
        bracketGender: bracket.sport.gender_name,
        competitors: bracket.seps
      }
      return newBracketData;
    });

    if (brackets) {
      dispatch(setCBBrackets(brackets));
    } else {
      console.log("Error loading file")
    }


    // await fetch(import.meta.env.VITE_UPLOAD_COMBAT_EVENT_FILE, {
    //   ...options,
    //   body: action.payload
    // }).then(async (resp) => {
    //   if (resp) {
    //     const response = await resp.json()
    //     console.log("setCBBrackets", response.brackets);
    //     dispatch(setCBBrackets(response.brackets));
    //   } else {
    //     console.log("Error")
    //   }
    // });
    // await fetchIntercept(dispatch, done, import.meta.env.VITE_UPLOAD_COMBAT_EVENT_FILE,
    //   {
    //     ...options,
    //     body: action.payload
    //   }).then(async (resp) => {
    //     if (resp) {
    //       const response = await resp.json()
    //       console.log("setCBBrackets", response.brackets);
    //       dispatch(setCBBrackets(response.brackets));
    //     } else {
    //       console.log("Error")
    //     }
    //   });

    done();
  }
});

const fileUploadLogic = [fileUpload];

export default fileUploadLogic