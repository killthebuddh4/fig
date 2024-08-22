import { z } from "zod";
import { QuiverApiSpec } from "./QuiverApiSpec";
import { QuiverResult } from "./QuiverResult";

export type QuiverClient<A extends QuiverApiSpec> = {
  [K in keyof A]: RemoveSingleUndefinedArgument<
    (
      i: z.infer<A[K]["input"]>
    ) => Promise<QuiverResult<z.infer<A[K]["output"]>>>
  >;
};

type RemoveSingleUndefinedArgument<F> = F extends (
  arg: infer First,
  ...args: infer Rest
) => infer R
  ? First extends undefined
    ? Rest extends []
      ? (...args: Rest) => R
      : F
    : F
  : never;
