import { ZodType } from "zod";
import { QuiverAuth } from "./QuiverAuth";
import { QuiverFunctionOptions } from "./QuiverFunctionOptions";
import { QuiverContext } from "./QuiverContext";

export type QuiverFunction<I, O> = {
  input: ZodType<I>;
  output: ZodType<O>;
  auth: QuiverAuth;
  handler: (input: I, context: QuiverContext) => Promise<O>;
  options?: QuiverFunctionOptions<I, O>;
};
