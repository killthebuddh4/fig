import { create } from "zustand";
import { Client } from "@xmtp/xmtp-js";
import { AsyncState } from "../types/AsyncState.ts";
import { MessageStream } from "../types/MessageStream.ts";

export const store = create<{
  client: AsyncState<Client>;
  globalMessageStream: AsyncState<MessageStream>;
  subscribers: Record<string, (() => void) | undefined>;
}>(() => ({
  client: { code: "idle" },
  globalMessageStream: { code: "idle" },
  subscribers: {},
}));
