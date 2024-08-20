import { QuiverContext } from "./QuiverContext.ts";

export type QuiverAuth = (args: { context: QuiverContext }) => Promise<boolean>;
