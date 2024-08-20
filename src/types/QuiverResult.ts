import { QuiverSuccess } from "./QuiverSuccess";
import { QuiverError } from "./QuiverError";

export type QuiverResult<D> = {
  request?: string;
  response?: string;
} & (QuiverSuccess<D> | QuiverError);
