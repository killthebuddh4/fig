import { ActionResult } from "../types/ActionResult";
import { store } from "./store";

export const stopClient = async (): Promise<ActionResult<undefined>> => {
  console.log("ACTION :: stopClient :: CALLED");

  const state = store.getState();

  if (state.client.code !== "success") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Client is not started.",
    };
  }

  store.setState({ client: { code: "idle" } });

  return {
    ok: true,
    code: "SUCCESS",
    data: undefined,
  };
};
