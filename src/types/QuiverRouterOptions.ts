import { XmtpMessage } from "./XmtpMessage";

export type QuiverRouterOptions = {
  namespace?: string;
  onReceivedMessage?: (args: { message: XmtpMessage }) => void;
  onSelfSentMessage?: (args: { message: XmtpMessage }) => void;
  onTopicMismatch?: (args: { message: XmtpMessage }) => void;
  onReceivedInvalidJson?: (args: { message: XmtpMessage }) => void;
  onReceivedInvalidRequest?: (args: { message: XmtpMessage }) => void;
  onUnknownFunction?: () => void;
  onAuthError?: (args: { error: unknown }) => void;
  onUnauthorized?: () => void;
  onInputTypeMismatch?: () => void;
  onHandlingInput?: (args: { input: unknown }) => void;
  onHandlerError?: (args: { error: unknown }) => void;
  onOutputSerializationError?: () => void;
  onSendingResponse?: () => void;
  onSentResponse?: ({ sent }: { sent: XmtpMessage }) => void;
  onSendResponseError?: () => void;
};
