import { FigTopic } from "./FigTopic";
import { XmtpMessage } from "./XmtpMessage";
import { FigPeer } from "./FigPeer";

export type FigMessage = {
  id: string;
  type: "MESSAGE";
  topic: FigTopic;
  peer: FigPeer;
  message: XmtpMessage;
};
