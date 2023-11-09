import { createLogic } from "redux-logic";
import { uploadFile } from "./fileUploadAction";
// import { fetchIntercept } from "./utils/fetchIntercept.logic";
import { postFileOptions } from "../Models";
import { setCBBrackets } from "./cbBracket.slice";
const fileUpload = createLogic({
  type: uploadFile,
  async process({ action }, dispatch, done) {
    const options = postFileOptions(action.payload.type, action.payload.size)
    console.log("file: ", action.payload);

    await fetch(import.meta.env.VITE_UPLOAD_COMBAT_EVENT_FILE, {
      ...options,
      body: action.payload
    }).then(async (resp) => {
      if (resp) {
        const response = await resp.json()
        console.log("setCBBrackets", response.brackets);
        dispatch(setCBBrackets(response.brackets));
      } else {
        console.log("Error")
      }
    });
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