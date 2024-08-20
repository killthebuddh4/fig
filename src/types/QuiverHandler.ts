import { QuiverContext } from "./QuiverContext.ts";

export type QuiverHandler<I, O> = (i: I, context: QuiverContext) => Promise<O>;
