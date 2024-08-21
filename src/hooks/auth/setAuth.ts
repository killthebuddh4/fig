import { AsyncState } from "../../types/AsyncState";
import { useStore } from "./useStore";

export const setAuth = (auth: AsyncState<undefined> | null) => {
  useStore.setState({ auth });
};
