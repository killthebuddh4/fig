import { Wallet } from "@ethersproject/wallet";
import { XmtpMessage } from "./XmtpMessage";
import { XmtpConversation } from "./XmtpConversation";

export type QuiverOptions = {
  wallet?: Wallet;
  env?: "dev" | "production";
  onAlreadyCreated?: () => void;
  onCreateWalletError?: (error: unknown) => void;
  onCreatingXmtp?: () => void;
  onCreatedXmtp?: () => void;
  onCreateXmtpError?: (error: unknown) => void;
  onStartingStream?: () => void;
  onStartedStream?: () => void;
  onStartStreamError?: (error: unknown) => void;
  onMessageReceived?: (message: XmtpMessage) => void;
  onMissedMessage?: (message: XmtpMessage) => void;
  onHandlerError?: (error: unknown) => void;
  onCreatingTopic?: (args: { topic: XmtpConversation }) => void;
  onCreatedTopic?: (args: { topic: XmtpConversation }) => void;
  onCreateTopicError?: (args: {
    topic: XmtpConversation;
    error: unknown;
  }) => void;
  onSendingMessage?: (args: { topic: XmtpConversation }) => void;
  onSentMessage?: (args: { message: XmtpMessage }) => void;
  onSendError?: (args: { topic: XmtpConversation }) => void;
  onReceivedInvalidJson?: () => void;
};
