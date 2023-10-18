import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import App from "./App";
import CreateEvent from "./Views/CreateEvent";
import UploadEvent from "./Views/UploadEvent";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path="createevent" element={<CreateEvent />} />
      <Route path="uploadEvent" element={<UploadEvent />} />
    </Route>
  )
)