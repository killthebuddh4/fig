import { z } from "zod";
import { QuiverApiSpec } from "./QuiverApiSpec";
import { QuiverContext } from "./QuiverContext";
import { QuiverMiddleware } from "./QuiverMiddleware";
import { QuiverError } from "./QuiverError";
import { QuiverSuccess } from "./QuiverSuccess";

export type QuiverClient<A extends QuiverApiSpec> = {
  client: QuiverClientApi<A>;
  router: {
    address: string;
    namespace: string;
  };
  wrap: (mw: QuiverMiddleware) => void;
  handler: (context: QuiverContext) => Promise<void>;
};

export type QuiverClientApi<A extends QuiverApiSpec> = {
  [K in keyof A["functions"]]: RemoveSingleUndefinedArgument<
    (
      i: z.infer<A["functions"][K]["input"]>
    ) => Promise<
      QuiverSuccess<z.infer<A["functions"][K]["output"]>> | QuiverError
    >
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
