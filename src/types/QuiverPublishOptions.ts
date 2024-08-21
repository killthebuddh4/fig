import { Message } from "./Message";
import { Conversation } from "./Conversation";

export type QuiverPublishOptions = {
  onSendingMessage?: (args: {
    conversation: Conversation;
    content: unknown;
  }) => void;
  onSentMessage?: (args: {
    conversation: Conversation;
    message: Message;
  }) => void;
  onSendError?: (args: { conversation: Conversation; error: unknown }) => void;
};
