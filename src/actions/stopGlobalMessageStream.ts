import { store } from "./store";
import { ActionResult } from "../types/ActionResult";

export const stopGlobalMessageStream = async (): Promise<
  ActionResult<{ stopped: boolean }>
> => {
  console.log("ACTION :: stopGlobalMessageStream :: CALLED");

  const messageStream = store.getState().globalMessageStream;

  if (messageStream.code !== "success") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Message stream is not started",
    };
  }

  // TODO It's likely a good idea to also unsubscribe all subscribers and notify
  // them in some fashion.

  messageStream.data.stop();

  store.setState({ globalMessageStream: { code: "idle" } });

  return {
    ok: true,
    code: "SUCCESS",
    data: { stopped: true },
  };
};
