import { ActionResult } from "../types/ActionResult.ts";
import { AsyncState } from "../types/AsyncState.ts";
import { store } from "./store.ts";

type S = {
  client: AsyncState<undefined>;
  globalMessageStream: AsyncState<undefined>;
};

export const fetchState = async (): Promise<ActionResult<S>> => {
  console.log("ACTION :: fetchState :: CALLED");

  const state = store.getState();

  return {
    ok: true,
    code: "SUCCESS",
    data: {
      client: {
        ...state.client,
        data: undefined,
      },
      globalMessageStream: {
        ...state.globalMessageStream,
        data: undefined,
      },
    },
  };
};
