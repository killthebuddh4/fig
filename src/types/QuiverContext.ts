import { Message } from "./Message";
import { QuiverReturn } from "./QuiverReturn";
import { QuiverThrow } from "./QuiverThrow";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QuiverContext<M extends Record<string, any>> = {
  return: QuiverReturn;
  throw: QuiverThrow;
  message: Message;
  metadata?: M;
};
