import { z } from "zod";
import { v4 as uuid } from "uuid";
import { QuiverClient } from "../../types/QuiverClient";
import { QuiverClientOptions } from "../../types/QuiverClientOptions";
import { QuiverApiSpec } from "../../types/QuiverApiSpec";
import { QuiverRequest } from "../../types/QuiverRequest";
import { QuiverContext } from "../../types/QuiverContext";
import { QuiverResponse } from "../../types/QuiverResponse";
import { QuiverMiddleware } from "../../types/QuiverMiddleware";

export const createClient = <Api extends QuiverApiSpec>(
  api: Api,
  router: {
    address: string;
    namespace: string;
  },
  options?: QuiverClientOptions
): QuiverClient<Api> => {
  const fig = options?.fig;

  if (fig === undefined) {
    throw new Error("fig is required, others aren't implemented yet");
  }

  const middleware: QuiverMiddleware[] = [];

  const requests = new Map<
    string,
    {
      request: QuiverRequest;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (value: QuiverResponse<any>) => void;
    }
  >();

  const handler = async (context: QuiverContext) => {
    let ctx: QuiverContext = context;
    for (const mw of middleware) {
      try {
        ctx = await mw(ctx);
      } catch {
        throw new Error("ERROR HANDLER NOT YET IMPLEMENTED");
      }
    }

    const response = context.metadata?.response as QuiverResponse<unknown>;

    if (response === undefined) {
      throw new Error("ERROR HANDLER NOT YET IMPLEMENTED");
    }

    const request = requests.get(response.id);

    if (request === undefined) {
      throw new Error("ERROR HANDLER NOT YET IMPLEMENTED");
    }

    if (!response.ok) {
      request.resolve(response);

      return;
    }

    if (request === undefined) {
      throw new Error("ERROR HANDLER NOT YET IMPLEMENTED");
    }

    const func = api.functions[request.request.function];

    if (func === undefined) {
      throw new Error("ERROR HANDLER NOT YET IMPLEMENTED");
    }

    const result = func.output.safeParse(response.data);

    if (!result.success) {
      throw new Error("ERROR HANDLER NOT YET IMPLEMENTED");
    }

    request.resolve(response as QuiverResponse<z.infer<typeof func.output>>);

    return;
  };

  const client = {} as QuiverClient<typeof api>["client"];

  for (const name of Object.keys(api.functions)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client as any)[name] = async (
      input: z.infer<(typeof api.functions)[typeof name]["input"]>
    ) => {
      const request = {
        id: uuid(),
        function: name,
        arguments: input,
      };

      let str: string;
      try {
        str = JSON.stringify(request);
      } catch {
        options?.onInputSerializationError?.();

        return {
          ok: false,
          code: "INPUT_SERIALIZATION_FAILED",
          response: null,
        };
      }

      const promise = new Promise<
        // TODO This type should be something that wraps these types
        // and includes the request and response (and maybe more).
        QuiverResponse<z.infer<(typeof api.functions)[typeof name]["output"]>>
      >((resolve) => {
        requests.set(request.id, { request, resolve });
      });

      try {
        options?.onSendingRequest?.({
          topic: {
            peerAddress: api.address,
            context: {
              conversationId: api.namespace,
              metadata: {},
            },
          },
          content: str,
        });

        const sent = await fig.publish({
          conversation: {
            peerAddress: api.address,
            context: {
              conversationId: api.namespace,
              metadata: {},
            },
          },
          content: str,
        });

        options?.onSentRequest?.({ message: sent.published });
      } catch (error) {
        options?.onSendRequestError?.({ error });

        return {
          ok: false,
          code: "XMTP_SEND_FAILED",
          response: null,
        };
      }

      return promise;
    };
  }

  const wrap = (mw: QuiverMiddleware) => {
    middleware.push(mw);
  };

  return {
    client,
    router,
    wrap,
    handler,
  };
};
