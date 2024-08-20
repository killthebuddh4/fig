import { XmtpConversation } from "./XmtpConversation";
import { XmtpMessage } from "./XmtpMessage";

export type XmtpPublish = (
  conversation: XmtpConversation,
  content: unknown,
  opts?: Record<string, unknown>
) => Promise<{ published: XmtpMessage }>;
