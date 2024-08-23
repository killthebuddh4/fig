import { z } from "zod";
import { QuiverFunction } from "../../types/QuiverFunction";
import { QuiverContext } from "../../types/QuiverContext";
import { QuiverFunctionOptions } from "../../types/QuiverFunctionOptions.js";

export const createFunction = <I = undefined, O = undefined>(
  handler: (i: I, context: QuiverContext) => Promise<O>,
  options?: QuiverFunctionOptions<I, O>
): QuiverFunction<I, O> => {
  return {
    input: options?.input ?? z.any(),
    output: options?.output ?? z.any(),
    auth: options?.auth ?? (async () => true),
    handler,
  };
};
