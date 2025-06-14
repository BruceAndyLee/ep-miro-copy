import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* adding router-context provider outside of App so that it can have access to current location */}
    <RouterProvider router={router} />
  </StrictMode>,
);
