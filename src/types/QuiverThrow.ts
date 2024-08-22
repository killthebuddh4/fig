import { QuiverError } from "./QuiverError";

export type QuiverThrow = (res: QuiverError) => Promise<void>;
