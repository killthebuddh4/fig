import { QuiverSuccess } from "./QuiverSuccess.ts";
import { QuiverError } from "./QuiverError.ts";

export type QuiverResult<D> = {
  request?: string;
  response?: string;
} & (QuiverSuccess<D> | QuiverError);
