import { XmtpConversation } from "./XmtpConversation";

export type XmtpMessage = {
  id: string;
  conversation: XmtpConversation;
  senderAddress: string;
  sent: Date;
  content: unknown;
};
