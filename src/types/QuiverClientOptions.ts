import { XmtpMessage } from "./XmtpMessage";
import { XmtpConversation } from "./XmtpConversation";

export type QuiverClientOptions = {
  timeoutMs?: number;
  onRequestTimeout?: () => void;
  onSelfSentMessage?: (args: { message: XmtpMessage }) => void;
  onUnknownSender?: (args: { message: XmtpMessage }) => void;
  onTopicMismatch?: (args: { message: XmtpMessage }) => void;
  onReceivedInvalidJson?: (args: { message: XmtpMessage }) => void;
  onReceivedInvalidResponse?: (args: { message: XmtpMessage }) => void;
  onOutputTypeMismatch?: (args: { message: XmtpMessage }) => void;
  onInvalidPayload?: (args: { message: XmtpMessage }) => void;
  onIdMismatch?: (args: { message: XmtpMessage }) => void;
  onResponseHandlerError?: (args: { error: unknown }) => void;
  onInputSerializationError?: () => void;
  onSendingRequest?: (args: {
    topic: XmtpConversation;
    content: string;
  }) => void;
  onSentRequest?: (args: { message: XmtpMessage }) => void;
  onSendRequestError?: (args: { error: unknown }) => void;
};
