import { z } from "zod";
import { QuiverRouterOptions } from "../../types/QuiverRouterOptions";
import { quiverRequestSchema } from "./quiverRequestSchema";
import { QuiverContext } from "../../types/QuiverContext";
import { QuiverMiddleware } from "../../types/QuiverMiddleware";
import { QuiverApi } from "../../types/QuiverApi";
import { QuiverRequest } from "../../types/QuiverRequest";

export const createRouter = (
  api: QuiverApi,
  namespace: string,
  options?: QuiverRouterOptions
) => {
  const middleware: QuiverMiddleware[] = [];

  const handler = async (context: QuiverContext) => {
    let request: QuiverRequest;
    try {
      request = quiverRequestSchema.parse(context.metadata?.request);
    } catch {
      throw new Error(
        "Request is not a Quiver request, should have been supplied by the Quiver instance"
      );
    }

    let ctx: QuiverContext = context;
    for (const mw of middleware) {
      try {
        ctx = await mw(ctx);
      } catch {
        ctx.throw({
          id: request.id,
          ok: false,
          status: "SERVER_ERROR",
        });

        return;
      }
    }

    const received = context.message;

    const fn = api[request.function];

    if (fn === undefined) {
      options?.onUnknownFunction?.({ received });

      ctx.throw({
        id: request.id,
        ok: false,
        status: "UNKNOWN_FUNCTION",
      });

      return;
    }

    if (fn.options?.middleware !== undefined) {
      for (const mw of fn.options.middleware) {
        try {
          ctx = await mw(ctx);
        } catch {
          ctx.throw({
            id: request.id,
            ok: false,
            status: "SERVER_ERROR",
          });

          return;
        }
      }
    }

    let isAuthorized = false;

    try {
      isAuthorized = await fn.auth(ctx);
    } catch {
      options?.onAuthError?.({ received, error: "AUTH_ERROR" });

      ctx.throw({
        id: request.id,
        ok: false,
        status: "SERVER_ERROR",
      });

      return;
    }

    if (!isAuthorized) {
      options?.onUnauthorized?.({ received });

      ctx.throw({
        id: request.id,
        ok: false,
        status: "UNAUTHORIZED",
      });

      return;
    }

    let input: z.infer<typeof fn.input>;
    try {
      input = fn.input.parse(request.arguments);
    } catch {
      options?.onInputTypeMismatch?.({ received });

      ctx.throw({
        id: request.id,
        ok: false,
        status: "INPUT_TYPE_MISMATCH",
      });

      return;
    }

    let output: z.infer<typeof fn.output>;
    try {
      output = await fn.handler(input, ctx);
    } catch {
      options?.onHandlerError?.({ received, error: "HANDLER_ERROR" });

      ctx.throw({
        id: request.id,
        ok: false,
        status: "SERVER_ERROR",
      });

      return;
    }

    if (fn.options?.isNotification) {
      // TODO, should validate that we don't mix isNotification with return values
      return;
    }

    ctx.return({
      id: request.id,
      ok: true,
      status: "SUCCESS",
      data: output,
    });
  };

  const wrap = (mw: QuiverMiddleware) => {
    middleware.push(mw);
  };

  return {
    namespace,
    wrap,
    handler,
  };
};
