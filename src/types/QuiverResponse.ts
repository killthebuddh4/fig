import { QuiverError } from "./QuiverError";
import { QuiverSuccess } from "./QuiverSuccess";

export type QuiverResponse = {
  id: string;
  data: QuiverSuccess<unknown> | QuiverError;
};
