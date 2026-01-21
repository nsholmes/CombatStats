import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App";
import EventBrackets from "./Views/EventBrackets";
import EventResults from "./Views/EventResults";
import Events from "./Views/Events";
import IKFManagement from "./Views/IKFManagement";
import JudgeEntry from "./Views/JudgesEntry";
import ParticipantDetailView from "./Views/ParticipantDetailView";
import SelectedEventView from "./Views/SelectedEventView";
import UploadEvent from "./Views/UploadEvent";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='events' element={<Events />} />
      <Route path='events/selectedEvent' element={<SelectedEventView />} />
      <Route
        path='events/selectedEvent/brackets'
        element={<EventBrackets />}
      />
      <Route path='uploadEvent' element={<UploadEvent />} />
      <Route path='judges' element={<JudgeEntry />} />
      <Route path='results' element={<EventResults />} />
      <Route path='ikf-management' element={<IKFManagement />} />
      <Route path='participant-detail/:competitorId' element={<ParticipantDetailView />} />
    </Route>
  )
);
