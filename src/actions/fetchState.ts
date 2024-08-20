import { ActionResult } from "../types/ActionResult";
import { AsyncState } from "../types/AsyncState";
import { store } from "./store";

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
