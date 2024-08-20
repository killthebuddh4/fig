import { create } from "zustand";
import { Client } from "@xmtp/xmtp-js";
import { AsyncState } from "../types/AsyncState";
import { MessageStream } from "../types/MessageStream";

export const store = create<{
  client: AsyncState<Client>;
  globalMessageStream: AsyncState<MessageStream>;
  subscribers: Record<string, (() => void) | undefined>;
}>(() => ({
  client: { code: "idle" },
  globalMessageStream: { code: "idle" },
  subscribers: {},
}));
