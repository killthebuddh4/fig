import { ZodType } from "zod";
import { QuiverAuth } from "./QuiverAuth.ts";
import { QuiverHandler } from "./QuiverHandler.ts";

export type QuiverFunction<I, O> = {
  input: ZodType<I>;
  output: ZodType<O>;
  auth: QuiverAuth;
  handler: QuiverHandler<I, O>;
};
