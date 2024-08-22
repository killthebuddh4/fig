import { QuiverContext } from "./QuiverContext";

export type QuiverAuth = (context: QuiverContext) => Promise<boolean>;
