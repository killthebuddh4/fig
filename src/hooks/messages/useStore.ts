import { Message } from "../../types/Message";
import { create } from "zustand";

export const useStore = create<{
  messages: Message[];
}>(() => ({
  messages: [],
}));
