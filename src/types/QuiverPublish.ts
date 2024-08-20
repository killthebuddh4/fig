import { XmtpMessage } from "./XmtpMessage";
import { XmtpConversation } from "./XmtpConversation";

export type QuiverPublish = (args: {
  conversation: XmtpConversation;
  content: unknown;
  options?: {
    onCreatingTopic?: (args: { topic: XmtpConversation }) => void;
    onCreatedTopic?: (args: { topic: XmtpConversation }) => void;
    onCreateTopicError?: (args: {
      topic: XmtpConversation;
      error: unknown;
    }) => void;
    onSendingMessage?: (args: {
      topic: XmtpConversation;
      content: unknown;
    }) => void;
    onSentMessage?: (args: { message: XmtpMessage }) => void;
    onSendError?: (args: { topic: XmtpConversation; error: unknown }) => void;
  };
}) => Promise<{ published: XmtpMessage }>;
