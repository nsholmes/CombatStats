import AppProvider from "@atlaskit/app-provider";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./Router.tsx";
import { store } from "./store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <StyledEngineProvider enableCssLayer> */}
    {/* <GlobalStyles styles=' base, mui, components, utilities;' /> */}
    <AppProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </AppProvider>
    {/* </StyledEngineProvider> */}
  </React.StrictMode>
);
