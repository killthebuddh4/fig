import { Message } from "./Message";
import { QuiverReturn } from "./QuiverReturn";
import { QuiverThrow } from "./QuiverThrow";

export type QuiverContext = {
  return: QuiverReturn;
  throw: QuiverThrow;
  message: Message;
  // Added by middleware
  metadata?: Record<string, unknown>;
};
