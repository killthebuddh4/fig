import { QuiverContext } from "./QuiverContext";

export type QuiverMiddleware = (
  context: QuiverContext
) => Promise<QuiverContext>;
