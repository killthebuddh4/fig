import { Message } from "./Message";
import { QuiverContext } from "./QuiverContext";

export type QuiverRouter = {
  handler: (message: Message, context: QuiverContext) => Promise<unknown>;
  wrap: (message: Message, context: QuiverContext) => Promise<QuiverContext>;
};
