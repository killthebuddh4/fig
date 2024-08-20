import { ActionResult } from "../types/ActionResult.ts";
import { store } from "./store.ts";

export const unsubscribeToState = async (args: {
  subscriptionId: string;
}): Promise<ActionResult<undefined>> => {
  const unsub = store.getState().subscribers[args.subscriptionId];

  if (unsub === undefined) {
    return {
      ok: false,
      code: "NO_OP",
      data: undefined,
      error: "No subscription found",
    };
  }

  unsub();

  return {
    ok: true,
    code: "SUCCESS",
    data: undefined,
  };
};
