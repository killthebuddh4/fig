import { XmtpMessage } from "./XmtpMessage";
import { XmtpEvent } from "./XmtpEvent";

export type XmtpSubscribe = (
  handler: (data: XmtpMessage | XmtpEvent) => Promise<void>
) => Promise<{
  unsubscribe: () => void;
}>;
