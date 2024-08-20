import { ZodType } from "zod";
import { QuiverAuth } from "./QuiverAuth";
import { QuiverHandler } from "./QuiverHandler";

export type QuiverFunction<I, O> = {
  input: ZodType<I>;
  output: ZodType<O>;
  auth: QuiverAuth;
  handler: QuiverHandler<I, O>;
};
