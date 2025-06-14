import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// servise workers can interject browser actions (namely - fetch-api calls)
// and redefine their behaviour

// msw uses that to send mock-responses to the request

export const worker = setupWorker(...handlers)