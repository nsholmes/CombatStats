import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import App from "./App";
import Home from "./Views/Home";
import CreateEvent from "./Views/CreateEvent";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path="createevent" element={<CreateEvent />} />
    </Route>
  )
)