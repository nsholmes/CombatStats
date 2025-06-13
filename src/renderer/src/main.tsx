import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router.tsx";
import { StyledEngineProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import GlobalStyles from "@mui/material/GlobalStyles";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <StyledEngineProvider enableCssLayer> */}
    {/* <GlobalStyles styles=' base, mui, components, utilities;' /> */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    {/* </StyledEngineProvider> */}
  </React.StrictMode>
);
