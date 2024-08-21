import { Message } from "./Message";

export type QuiverRouterOptions = {
  namespace?: string;
  onReceivedMessage?: (args: { received: Message }) => void;
  onReceivedInvalidJson?: (args: { received: Message }) => void;
  onReceivedInvalidRequest?: (args: { received: Message }) => void;
  onUnknownFunction?: (args: { received: Message }) => void;
  onAuthError?: (args: { received: Message; error: unknown }) => void;
  onUnauthorized?: (args: { received: Message }) => void;
  onInputTypeMismatch?: (args: { received: Message }) => void;
  onHandlingInput?: (args: { received: Message }) => void;
  onHandlerError?: (args: { received: Message; error: unknown }) => void;
  onOutputSerializationError?: (args: { received: Message }) => void;
  onSendingResponse?: (args: { received: Message; content: unknown }) => void;
  onSentResponse?: (args: { received: Message; sent: Message }) => void;
  onSendResponseError?: (args: { received: Message; error: unknown }) => void;
  onRouterError?: (args: { received: Message; error: unknown }) => void;
};
