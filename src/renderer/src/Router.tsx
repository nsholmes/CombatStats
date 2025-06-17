import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App";
// import CreateEvent from "./Views/CreateEvent";
import EventBrackets from "./Views/EventBrackets";
import Events from "./Views/Events";
import JudgeEntry from "./Views/JudgesEntry";
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
      {/* <Route path="createevent" element={<CreateEvent />} /> */}
      <Route path='uploadEvent' element={<UploadEvent />} />
      <Route path='judges' element={<JudgeEntry />} />
    </Route>
  )
);
