import { QuiverContext } from "./QuiverContext";

export type QuiverAuth = (args: { context: QuiverContext }) => Promise<boolean>;
