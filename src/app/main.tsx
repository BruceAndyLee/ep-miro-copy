import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import { router } from "./router";

async function enableHttpMocks() {
  if (import.meta.env.PROD) return;

  // this lets us ignore js-chunks with mocks when in prod 
  const { worker } = await import("@/shared/api/mocks/browser");
  worker.start();
}

enableHttpMocks().then(() => {
  createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* adding router-context provider outside of App so that it can have access to current location */}
    <RouterProvider router={router} />
  </StrictMode>,
);
})
