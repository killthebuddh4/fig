import { XmtpMessage } from "./XmtpMessage";

export type QuiverSubscribe = (args: {
  handler: (message: XmtpMessage) => void;
}) => {
  unsubscribe: () => void;
};
