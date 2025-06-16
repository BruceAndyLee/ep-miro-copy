
export async function enableHttpMocks() {
  if (import.meta.env.PROD) return;

  // this lets us ignore js-chunks with mocks when in prod 
  const { worker } = await import("@/shared/api/mocks/browser");
  worker.start();
}