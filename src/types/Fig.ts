import { Message } from "./Message";
import { Conversation } from "./Conversation";

export type Fig = {
  start: () => void;
  stop: () => void;
  publish: (args: {
    conversation: Conversation;
    content: unknown;
  }) => Promise<{ published: Message }>;
  subscribe: (handler: (message: Message) => void) => Promise<{
    unsubscribe: () => Promise<void>;
  }>;
};
