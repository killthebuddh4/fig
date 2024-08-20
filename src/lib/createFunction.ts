import { z } from "zod";
import { QuiverFunction } from "../types/QuiverFunction.ts";
import { QuiverAuth } from "../types/QuiverAuth.ts";
import { QuiverHandler } from "../types/QuiverHandler.ts";

export const createFunction = <I = undefined, O = undefined>(args: {
  input?: z.ZodType<I>;
  output?: z.ZodType<O>;
  auth: QuiverAuth;
  handler: QuiverHandler<I, O>;
}): QuiverFunction<I, O> => {
  return {
    input: args.input ?? z.any(),
    output: args.output ?? z.any(),
    auth: args.auth,
    handler: args.handler,
  };
};
