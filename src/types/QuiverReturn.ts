import { QuiverSuccess } from "./QuiverSuccess";

export type QuiverReturn = (res: QuiverSuccess<unknown>) => Promise<void>;
