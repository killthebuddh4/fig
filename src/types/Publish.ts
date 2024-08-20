import { Message } from "./Message.ts";
import { Conversation } from "./Conversation.ts";

export type Publish = (args: {
  conversation: Conversation;
  content: unknown;
  options?: {
    onCreatingTopic?: (args: { topic: Conversation }) => void;
    onCreatedTopic?: (args: { topic: Conversation }) => void;
    onCreateTopicError?: (args: {
      topic: Conversation;
      error: unknown;
    }) => void;
    onSendingMessage?: (args: {
      topic: Conversation;
      content: unknown;
    }) => void;
    onSentMessage?: (args: { message: Message }) => void;
    onSendError?: (args: { topic: Conversation; error: unknown }) => void;
  };
}) => Promise<{ published: Message }>;
