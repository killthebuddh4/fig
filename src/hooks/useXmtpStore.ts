import { AsyncState } from "../types/AsyncState";
import { create } from "zustand";

export const useXmtpStore = create<{
  client: AsyncState<undefined> | null;
  setClient: (client: AsyncState<undefined> | null) => void;
  globalMessageStream: AsyncState<undefined> | null;
  setGlobalMessageStream: (stream: AsyncState<undefined> | null) => void;
}>((set) => ({
  client: null,
  setClient: (client) => {
    set((prev) => {
      if (prev.client?.code === client?.code) {
        return prev;
      }

      return {
        ...prev,
        client,
      };
    });
  },
  globalMessageStream: null,
  setGlobalMessageStream: (stream) => {
    set((prev) => {
      if (prev.globalMessageStream?.code === stream?.code) {
        return prev;
      }

      return {
        ...prev,
        globalMessageStream: stream,
      };
    });
  },
}));
