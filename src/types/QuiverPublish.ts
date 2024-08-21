import { Message } from "./Message";
import { Conversation } from "./Conversation";

export type QuiverPublish = (args: {
  conversation: Conversation;
  content: unknown;
}) => Promise<{ published: Message }>;
