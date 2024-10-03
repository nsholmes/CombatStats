import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import App from "./App";
import AddNewEvent from "./Components/CSEvent/AddNewEvent";
import CSEvent from "./Views/CSEvent";
import CSTournament from "./Views/CSTournament";
import Events from "./Views/Events";
import JudgeEntry from "./Views/JudgesEntry";
import UploadEvent from "./Views/UploadEvent";
import CSSettleUp from "./Views/CSSettleUp";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="settleup" element={<CSSettleUp />} />
      <Route path="events" element={<Events />} />
      {/* <Route path='events/create' element={<AddNewEvent />} /> */}
      <Route path="events/:eventId" element={<CSEvent />} />
      {/* <Route path="new-tournament" element={<CSTournament />} /> */}
      <Route path="uploadEvent" element={<UploadEvent />} />
      <Route path="judges" element={<JudgeEntry />} />
    </Route>
  )
);
