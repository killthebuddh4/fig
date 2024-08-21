import { AsyncState } from "../../types/AsyncState";
import { create } from "zustand";

export const useStore = create<{
  auth: AsyncState<undefined> | null;
}>(() => ({
  auth: null,
}));
