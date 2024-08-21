import { Message } from "./Message";

export type QuiverSubscribe = (args: {
  handler: (message: Message) => void;
}) => {
  unsubscribe: () => void;
};
