import { z } from "zod";
import { QuiverRouterOptions } from "../../types/QuiverRouterOptions";
import { quiverRequestSchema } from "../../lib/quiverRequestSchema";
import { QuiverContext } from "../../types/QuiverContext";
import { QuiverMiddleware } from "../../types/QuiverMiddleware";
import { Message } from "../../types/Message";
import { QuiverApi } from "../../types/QuiverApi";

export const createRouter = (api: QuiverApi, options?: QuiverRouterOptions) => {
  const middleware: QuiverMiddleware[] = [];

  const handler = async (received: Message, context: QuiverContext) => {
    let ctx: QuiverContext = context;
    for (const mw of middleware) {
      try {
        ctx = await mw(ctx);
      } catch {
        ctx.throw({
          ok: false,
          status: "SERVER_ERROR",
        });

        return;
      }
    }

    options?.onReceivedMessage?.({ received });

    let json;
    try {
      json = JSON.parse(String(received.content));
    } catch {
      options?.onReceivedInvalidJson?.({ received });

      ctx.throw({
        ok: false,
        status: "INPUT_INVALID_JSON",
      });
      return;
    }

    let request: z.infer<typeof quiverRequestSchema>;
    try {
      request = quiverRequestSchema.parse(json);
    } catch {
      options?.onReceivedInvalidRequest?.({ received });

      ctx.throw({
        ok: false,
        status: "INVALID_REQUEST",
      });

      return;
    }

    const fn = api[request.function];

    if (fn === undefined) {
      options?.onUnknownFunction?.({ received });

      ctx.throw({
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
        ok: false,
        status: "SERVER_ERROR",
      });

      return;
    }

    if (!isAuthorized) {
      options?.onUnauthorized?.({ received });

      ctx.throw({
        ok: false,
        status: "UNAUTHORIZED",
      });

      return;
    }

    let input;
    try {
      input = fn.input.parse(json.arguments);
    } catch {
      options?.onInputTypeMismatch?.({ received });

      ctx.throw({
        ok: false,
        status: "INPUT_TYPE_MISMATCH",
      });

      return;
    }

    let output;
    try {
      output = await fn.handler(input, ctx);
    } catch {
      options?.onHandlerError?.({ received, error: "HANDLER_ERROR" });

      ctx.throw({
        ok: false,
        status: "SERVER_ERROR",
      });

      return;
    }

    if (fn.options?.isNotification) {
      return;
    }

    ctx.return({
      ok: true,
      status: "SUCCESS",
      data: output,
    });
  };

  const wrap = (mw: QuiverMiddleware) => {
    middleware.push(mw);
  };

  return {
    wrap,
    handler,
  };
};
