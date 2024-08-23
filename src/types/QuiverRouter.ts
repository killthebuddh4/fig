import { QuiverContext } from "./QuiverContext";
import { QuiverApi } from "./QuiverApi";

export type QuiverRouter = {
  api: QuiverApi;
  handler: (context: QuiverContext) => Promise<unknown>;
  wrap: (context: QuiverContext) => Promise<QuiverContext>;
};
