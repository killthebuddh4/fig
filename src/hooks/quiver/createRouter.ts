import { QuiverError } from "../../types/QuiverError";
import { QuiverRouterOptions } from "../../types/QuiverRouterOptions";
import { Message } from "../../types/Message";
import { quiverRequestSchema } from "../../lib/quiverRequestSchema";
import { QuiverPublish } from "../../types/QuiverPublish";
import { QuiverApi } from "../../types/QuiverApi";

export const createRouter = (args: {
  api: QuiverApi;
  publish: QuiverPublish;
  options?: QuiverRouterOptions;
}) => {
  return async (received: Message) => {
    args.options?.onReceivedMessage?.({ received });

    let json;
    try {
      json = JSON.parse(String(received.content));
    } catch {
      args.options?.onReceivedInvalidJson?.({ received });
      return;
    }

    let request;
    try {
      request = quiverRequestSchema.parse(json);
    } catch {
      args.options?.onReceivedInvalidRequest?.({ received });
      return;
    }

    const sendError = async (err: QuiverError) => {
      args.options?.onSendingResponse?.({
        received,
        content: err,
      });

      let content;
      try {
        content = JSON.stringify({
          id: request.id,
          data: err,
        });
      } catch {
        throw new Error(
          `Failed to serializer error: ${err}, this should be impossible`
        );
      }

      try {
        const result = await args.publish({
          conversation: received.conversation,
          content,
        });

        args.options?.onSentResponse?.({
          received,
          sent: result.published,
        });
      } catch (error) {
        args.options?.onSendResponseError?.({ received, error });
      }
    };

    const func = args.api[request.function];

    if (func === undefined) {
      args.options?.onUnknownFunction?.({ received });

      sendError({
        ok: false,
        status: "UNKNOWN_FUNCTION",
      });

      return;
    }

    let isAuthorized = false;

    const context = {
      id: request.id,
      message: received,
    };

    try {
      isAuthorized = await func.auth({ context });
    } catch (error) {
      args.options?.onAuthError?.({ received, error });
      isAuthorized = false;
    }

    if (!isAuthorized) {
      args.options?.onUnauthorized?.({ received });

      sendError({
        ok: false,
        status: "UNAUTHORIZED",
      });

      return;
    }

    let input;
    try {
      input = func.input.parse(json.arguments);
    } catch {
      args.options?.onInputTypeMismatch?.({ received });

      sendError({
        ok: false,
        status: "INPUT_TYPE_MISMATCH",
      });

      return;
    }

    args.options?.onHandlingInput?.({ received });

    let output;
    try {
      output = await func.handler(input, context);
    } catch (error) {
      args.options?.onHandlerError?.({ received, error });

      sendError({
        ok: false,
        status: "SERVER_ERROR",
      });

      return;
    }

    const res = {
      ok: true,
      status: "SUCCESS",
      data: output,
    };

    let content;
    try {
      content = JSON.stringify(res);
    } catch {
      args.options?.onOutputSerializationError?.({ received });

      sendError({
        ok: false,
        status: "OUTPUT_SERIALIZATION_FAILED",
      });

      return;
    }

    args.options?.onSendingResponse?.({
      received,
      content,
    });

    try {
      const result = await args.publish({
        conversation: received.conversation,
        content,
      });

      args.options?.onSentResponse?.({
        received,
        sent: result.published,
      });

      return;
    } catch (error) {
      args.options?.onSendResponseError?.({ received, error });

      return;
    }
  };
};
