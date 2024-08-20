import { FigPeer } from "./FigPeer";

export type FigTopic = {
  owner: FigPeer;
  members: FigPeer[];
  pattern: string;
};
