import { QuiverError } from "./QuiverError";
import { QuiverSuccess } from "./QuiverSuccess";
import { QuiverContext } from "./QuiverContext";

export type QuiverClientHandler = (
  response: QuiverSuccess<unknown> | QuiverError,
  context: QuiverContext
) => Promise<void>;
