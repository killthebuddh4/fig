import { Message } from "./Message.ts";

export type Subscribe = (args: { handler: (message: Message) => void }) => {
  unsubscribe: () => void;
};
