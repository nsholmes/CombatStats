import { createLogic } from "redux-logic";
import { uploadFile } from "./fileUploadAction";
import { fetchIntercept } from "./utils/fetchIntercept.logic";
import { postFileOptions } from "../Models";
const fileUpload = createLogic({
  type: uploadFile,
  async process({ action }, dispatch, done) {
    const options = postFileOptions(action.payload.type, action.payload.size)
    const response = await fetchIntercept(dispatch, done, import.meta.env.VITE_UPLOAD_COMBAT_EVENT_FILE,
      {
        ...options,
        body: action.payload
      });
    if (response) {
      console.log(response);
    }
    done();
  }
});

const fileUploadLogic = [fileUpload];

export default fileUploadLogic