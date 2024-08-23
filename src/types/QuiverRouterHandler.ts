import { QuiverRequest } from "./QuiverRequest";
import { QuiverContext } from "./QuiverContext";

export type QuiverRouterHandler = (
  request: QuiverRequest,
  context: QuiverContext
) => Promise<void>;
