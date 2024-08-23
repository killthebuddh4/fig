import { z } from "zod";
import { QuiverAuth } from "./QuiverAuth";
import { QuiverMiddleware } from "./QuiverMiddleware";

export type QuiverFunctionOptions<I, O> = {
  auth?: QuiverAuth;
  input?: z.ZodType<I>;
  output?: z.ZodType<O>;
  middleware?: QuiverMiddleware[];
  isNotification?: boolean;
};
