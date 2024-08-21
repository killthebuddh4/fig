import { AsyncState } from "../../types/AsyncState";
import { store } from "./store";

export const setStream = (stream: AsyncState<undefined> | null) => {
  store.setState({ stream });
};
