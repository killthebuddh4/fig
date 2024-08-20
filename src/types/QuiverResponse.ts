import { QuiverError } from "./QuiverError.ts";
import { QuiverSuccess } from "./QuiverSuccess.ts";

export type QuiverResponse = {
  id: string;
  data: QuiverSuccess<unknown> | QuiverError;
};
