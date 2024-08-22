import { z } from "zod";
import { v4 as uuid } from "uuid";
import { useActions } from "../useActions";
import { Signer } from "../../types/Signer";
import { QuiverOptions } from "../../types/QuiverOptions";
import { QuiverClient } from "../../types/QuiverClient";
import { QuiverClientOptions } from "../../types/QuiverClientOptions";
import { QuiverRouterOptions } from "../../types/QuiverRouterOptions";
import { QuiverApiSpec } from "../../types/QuiverApiSpec";
import { QuiverApi } from "../../types/QuiverApi";
import { QuiverResult } from "../../types/QuiverResult";
import { QuiverResponse } from "../../types/QuiverResponse";
import { QuiverStart } from "../../types/QuiverStart.ts";
import { Message } from "../../types/Message";
import { QuiverSubscribe } from "../../types/QuiverSubscribe";
import { QuiverRequest } from "../../types/QuiverRequest";
import { QuiverPublish } from "../../types/QuiverPublish";
import { Quiver } from "../../types/Quiver";
import { quiverErrorSchema } from "../../lib/quiverErrorSchema";
import { quiverRequestSchema } from "../../lib/quiverRequestSchema";
import { quiverResponseSchema } from "../../lib/quiverResponseSchema";
import { quiverSuccessSchema } from "../../lib/quiverSuccessSchema";
import { QuiverError } from "../../types/QuiverError.ts";

// TODO This is a stub.

export const createClient = <Api extends QuiverApiSpec>(args: {
  api: Api;
  router: { address: string; namespace: string };
  publish: QuiverPublish;
  options?: QuiverClientOptions;
}): QuiverClient<Api> => {
  const createResponseHandler = <O>(
    request: QuiverRequest,
    outputSchema: z.ZodType<O>,
    resolver: (value: QuiverResult<O>) => void
  ) => {
    return async (response: QuiverResponse) => {
      const error = quiverErrorSchema.safeParse(response.data);

      if (error.success) {
        resolver({
          ok: error.data.ok,
          status: error.data.status,
          request: JSON.stringify(request, null, 2),
          response: JSON.stringify(response.data, null, 2),
        });
      }

      const success = quiverSuccessSchema.safeParse(response.data);

      if (!success.success) {
        resolver({
          ok: false,
          status: "INVALID_RESPONSE",
          request: JSON.stringify(request, null, 2),
          response: JSON.stringify(response.data, null, 2),
        });
      }

      const output = outputSchema.safeParse(success.data?.data);

      if (!output.success) {
        resolver({
          ok: false,
          status: "OUTPUT_TYPE_MISMATCH",
          request: JSON.stringify(request, null, 2),
          response: JSON.stringify(response.data, null, 2),
        });
      }

      resolver({
        ok: true,
        status: "SUCCESS",
        data: output.data,
      });
    };
  };

  const client = {};

  for (const [key, value] of Object.entries(args.api)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client as any)[key as keyof typeof args.api] = async (
      input: z.infer<typeof value.input>
    ) => {
      const handlers = new Map<string, (message: Message) => void>();

      const router = async (message: Message) => {
        let json;
        try {
          json = JSON.parse(String(message.content));
        } catch {
          args.options?.onReceivedInvalidJson?.({ message });
          return;
        }

        let response;
        try {
          response = quiverResponseSchema.parse(json);
        } catch {
          args.options?.onReceivedInvalidResponse?.({ message });
          return;
        }

        const id = response.id;

        const handler = handlers.get(id);

        if (handler === undefined) {
          // TODO This should be an error.
          return;
        }

        handler(message);
      };

      const request = {
        id: uuid(),
        function: key,
        arguments: input,
      };

      let str: string;
      try {
        str = JSON.stringify(request);
      } catch {
        args.options?.onInputSerializationError?.();

        return {
          ok: false,
          code: "INPUT_SERIALIZATION_FAILED",
          response: null,
        };
      }

      let resolver: (value: QuiverResult<any>) => void;

      const promise = new Promise<
        // TODO This type should be something that wraps these types
        // and includes the request and response (and maybe more).
        QuiverResult<z.infer<typeof value.output>>
      >((resolve) => {
        resolver = resolve;
      });

      const responseHandler = createResponseHandler(
        request,
        value.output,
        resolver
      );

      try {
        args.options?.onSendingRequest?.({
          topic: {
            peerAddress: args.router.address,
            context: {
              conversationId: args.router.namespace,
              metadata: {},
            },
          },
          content: str,
        });

        const sent = await args.publish({
          conversation: {
            peerAddress: args.router.address,
            context: {
              conversationId: args.router.namespace,
              metadata: {},
            },
          },
          content: str,
        });

        args.options?.onSentRequest?.({ message: sent.published });
      } catch (error) {
        args.options?.onSendRequestError?.({ error });

        return {
          ok: false,
          code: "XMTP_SEND_FAILED",
          response: null,
        };
      }

      return promise;
    };
  }

  return client as QuiverClient<typeof args.api>;
};
