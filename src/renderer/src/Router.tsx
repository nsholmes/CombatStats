import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import App from './App';
import CreateEvent from './Views/CreateEvent';
import Events from './Views/Events';
import JudgeEntry from './Views/JudgesEntry';
import UploadEvent from './Views/UploadEvent';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path="events" element={<Events />} />
      <Route path="new-tournament" element={<CreateEvent />} />
      <Route path="uploadEvent" element={<UploadEvent />} />
      <Route path="judges" element={<JudgeEntry />} />
    </Route>
  )
)