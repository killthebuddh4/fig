import { QuiverContext } from "./QuiverContext";

export type QuiverHandler<I, O> = (i: I, context: QuiverContext) => Promise<O>;
