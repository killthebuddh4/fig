import { Message } from "./Message";

export type QuiverSubscribe = (handler: (message: Message) => void) => Promise<{
  unsubscribe: () => Promise<void>;
}>;
