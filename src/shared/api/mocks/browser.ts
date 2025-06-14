import { setupWorker } from "msw/browser";
import { boardHandlers } from "./handlers/boards";
import { authHandlers } from "./handlers/auth";

// servise workers can interject browser actions (namely - fetch-api calls)
// and redefine their behaviour

// msw uses that to send mock-responses to the request

export const worker = setupWorker(...boardHandlers, ...authHandlers);