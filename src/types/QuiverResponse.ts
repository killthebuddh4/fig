import { QuiverError } from "./QuiverError";
import { QuiverSuccess } from "./QuiverSuccess";

export type QuiverResponse<D> = QuiverSuccess<D> | QuiverError;
