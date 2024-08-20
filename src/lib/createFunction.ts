import { z } from "zod";
import { QuiverFunction } from "../types/QuiverFunction";
import { QuiverAuth } from "../types/QuiverAuth";
import { QuiverHandler } from "../types/QuiverHandler";

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
