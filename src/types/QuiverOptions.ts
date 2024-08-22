import { Message } from "./Message";

export type QuiverOptions = {
  onReceivedMessage?: (message: Message) => void;
  onSkippedMessage?: (message: Message) => void;
  onRoutedMessage?: (message: Message) => void;
  onFoundRouter?: (message: Message) => void;
  onReturn?: (message: Message) => void;
  onThrow?: (message: Message) => void;
  onSending?: (message: Message) => void;
  onSent?: (message: Message, sent: Message) => void;
  onSendError?: (message: Message, error: unknown) => void;
};
