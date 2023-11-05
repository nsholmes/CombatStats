import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import App from "./App";
import CreateEvent from "./Views/CreateEvent";
import UploadEvent from "./Views/UploadEvent";
import JudgeEntry from "./Views/JudgesEntry";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path="createevent" element={<CreateEvent />} />
      <Route path="uploadEvent" element={<UploadEvent />} />
      <Route path="judges" element={<JudgeEntry />} />
    </Route>
  )
)