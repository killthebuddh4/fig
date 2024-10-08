import { Message } from "./Message";
import { Conversation } from "./Conversation";
import { Fig } from "./Fig";

export type QuiverClientOptions = {
  fig?: Fig;
  timeoutMs?: number;
  onRequestTimeout?: () => void;
  onSelfSentMessage?: (args: { message: Message }) => void;
  onUnknownSender?: (args: { message: Message }) => void;
  onTopicMismatch?: (args: { message: Message }) => void;
  onReceivedInvalidJson?: (args: { message: Message }) => void;
  onReceivedInvalidResponse?: (args: { message: Message }) => void;
  onOutputTypeMismatch?: (args: { message: Message }) => void;
  onInvalidPayload?: (args: { message: Message }) => void;
  onIdMismatch?: (args: { message: Message }) => void;
  onResponseHandlerError?: (args: { error: unknown }) => void;
  onInputSerializationError?: () => void;
  onSendingRequest?: (args: { topic: Conversation; content: string }) => void;
  onSentRequest?: (args: { message: Message }) => void;
  onSendRequestError?: (args: { error: unknown }) => void;
};
