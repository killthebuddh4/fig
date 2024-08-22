import { ZodType } from "zod";
import { QuiverAuth } from "./QuiverAuth";
import { QuiverHandler } from "./QuiverHandler";
import { QuiverFunctionOptions } from "./QuiverFunctionOptions";

export type QuiverFunction<I, O> = {
  input: ZodType<I>;
  output: ZodType<O>;
  auth: QuiverAuth;
  handler: QuiverHandler<I, O>;
  options?: QuiverFunctionOptions;
};
