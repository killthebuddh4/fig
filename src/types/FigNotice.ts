import { FigTopic } from "./FigTopic";

export type FigNotice = {
  id: string;
  type: "NOTICE";
  topic: FigTopic;
  event: "stop";
};
