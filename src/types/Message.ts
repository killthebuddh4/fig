import { Conversation } from "./Conversation";

export type Message = {
  id: string;
  conversation: Conversation;
  senderAddress: string;
  sent: Date;
  content: unknown;
};
