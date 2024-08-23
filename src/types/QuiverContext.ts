import { Message } from "./Message";
import { QuiverReturn } from "./QuiverReturn";
import { QuiverThrow } from "./QuiverThrow";

export type QuiverContext = {
  return: QuiverReturn;
  throw: QuiverThrow;
  message: Message;
  metadata?: Record<string, unknown>;
};
