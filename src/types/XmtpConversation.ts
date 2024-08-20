export type XmtpConversation = {
  peerAddress: string;
  context?: {
    conversationId: string;
    metadata: Record<string, unknown>;
  };
};
