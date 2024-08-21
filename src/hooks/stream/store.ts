import { AsyncState } from "../../types/AsyncState";
import { create } from "zustand";

export const store = create<{
  stream: AsyncState<undefined> | null;
  subscribers: Array<{ id: string; unsubscribe: () => void }>;
}>(() => ({
  stream: null,
  subscribers: [],
}));
