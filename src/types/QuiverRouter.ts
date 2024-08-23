import { QuiverContext } from "./QuiverContext";
import { QuiverApi } from "./QuiverApi";

export type QuiverRouter = {
  namespace: string;
  api: QuiverApi;
  handler: (context: QuiverContext) => Promise<unknown>;
  wrap: (context: QuiverContext) => Promise<QuiverContext>;
};
