import { z } from "zod";
import { QuiverSuccess } from "./QuiverSuccess.ts";
import { QuiverError } from "./QuiverError.ts";
import { QuiverApiSpec } from "./QuiverApiSpec.ts";

export type QuiverClient<A extends QuiverApiSpec> = {
  [K in keyof A]: RemoveSingleUndefinedArgument<
    (
      i: z.infer<A[K]["input"]>
    ) => Promise<QuiverSuccess<z.infer<A[K]["output"]>> | QuiverError>
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
