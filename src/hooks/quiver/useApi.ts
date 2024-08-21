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
import { Start } from "../../types/Start";
import { Message } from "../../types/Message";
import { QuiverSubscribe } from "../../types/QuiverSubscribe";
import { QuiverPublish } from "../../types/QuiverPublish";
import { Quiver } from "../../types/Quiver";
import { quiverErrorSchema } from "../../lib/quiverErrorSchema";
import { quiverRequestSchema } from "../../lib/quiverRequestSchema";
import { quiverResponseSchema } from "../../lib/quiverResponseSchema";
import { quiverSuccessSchema } from "../../lib/quiverSuccessSchema";

// TODO This is a stub.
const handlers = new Map<string, (message: XmtpMessage) => void>();

export const useApi = <Api extends QuiverApiSpec>(args: {
  wallet: Signer;
  api: Api;
  router: { address: string; namespace: string };
  options?: QuiverClientOptions;
}): Quiver => {
  const {
    sendMessage,
    startGlobalMessageStream,
    startClient,
    listenToGlobalMessageStream,
    stopGlobalMessageStream,
  } = useActions();

    const client = {};

    for (const [key, value] of Object.entries(args.api)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (client as any)[key as keyof typeof args.api] = async (
        input: z.infer<typeof value.input>
      ) => {
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

        const resolvers = new Map<string, (value: QuiverResult<any>) => void>();

        const promise = new Promise<
          // TODO This type should be something that wraps these types
          // and includes the request and response (and maybe more).
          QuiverResult<z.infer<typeof value.output>>
        >((resolve) => {
          resolvers.set(request.id, resolve);
        });

        const handler = async (message: Message) => {
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
                options?.onReceivedInvalidResponse?.({ message });
                return;
              }

              const id = response.id;

              if (id !== request.id) {
                options?.onIdMismatch?.({ message });
                return;
              }

              unsubscribe();

              clearTimeout(timeout);

              const error = quiverErrorSchema.safeParse(response.data);

              if (error.success) {
                resolve({
                  ok: false,
                  status: error.data.status,
                });
              }

              const success = quiverSuccessSchema.safeParse(response.data);

              if (!success.success) {
                resolve({
                  ok: false,
                  status: "INVALID_RESPONSE",
                  request: JSON.stringify(request, null, 2),
                  response: JSON.stringify(response.data, null, 2),
                });
              }

              const output = value.output.safeParse(success.data?.data);

              if (!output.success) {
                resolve({
                  ok: false,
                  status: "OUTPUT_TYPE_MISMATCH",
                });
              }

              resolve({
                ok: true,
                status: "SUCCESS",
                data: output.data,
              });
            },
          });





          // const timeout = setTimeout(() => {
          //   args.options?.onRequestTimeout?.();

          //   resolve({
          //     ok: false,
          //     status: "REQUEST_TIMEOUT",
          //   });
          // }, options?.timeoutMs ?? 10000);

          /* TODO, when do we throw and when do we not throw????? */
          const { unsubscribe } = subscribe({
            handler: (message) => {

        try {
          options?.onSendingRequest?.({
            topic: {
              peerAddress: router.address,
              context: {
                conversationId: namespace,
                metadata: {},
              },
            },
            content: str,
          });

          const sent = await publish({
            conversation: {
              peerAddress: router.address,
              context: {
                conversationId: namespace,
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

    return client as QuiverClient<typeof api>;
  };

  const router = (api: QuiverApi, options?: QuiverRouterOptions) => {
    const namespace = options?.namespace ?? "quiver/0.0.1";

    return subscribe({
      handler: async (message) => {
        if (message.senderAddress === args.wallet.address) {
          options?.onSelfSentMessage?.({ message });
          return;
        }

        if (message.conversation.context?.conversationId !== namespace) {
          options?.onTopicMismatch?.({ message });
          return;
        }

        options?.onReceivedMessage?.({ message });

        let json;
        try {
          json = JSON.parse(String(message.content));
        } catch {
          options?.onReceivedInvalidJson?.({ message });
          return;
        }

        let request;
        try {
          request = quiverRequestSchema.parse(json);
        } catch {
          options?.onReceivedInvalidRequest?.({ message });
          return;
        }

        const respond = async (response: QuiverResponse) => {
          options?.onSendingResponse?.();

          let content;
          try {
            content = JSON.stringify(response);
          } catch {
            options?.onOutputSerializationError?.();
            return;
          }

          try {
            const sent = await publish({
              conversation: {
                peerAddress: message.senderAddress,
                context: {
                  conversationId: namespace,
                  metadata: {},
                },
              },
              content,
            });

            options?.onSentResponse?.({ sent: sent.published });
          } catch {
            options?.onSendResponseError?.();
          }
        };

        const func = api[request.function];

        if (func === undefined) {
          options?.onUnknownFunction?.();

          respond({
            id: request.id,
            data: {
              ok: false,
              status: "UNKNOWN_FUNCTION",
            },
          });

          return;
        }

        let isAuthorized = false;

        const context = {
          id: request.id,
          message,
        };

        try {
          isAuthorized = await func.auth({ context });
        } catch (error) {
          options?.onAuthError?.({ error });
          isAuthorized = false;
        }

        if (!isAuthorized) {
          options?.onUnauthorized?.();

          respond({
            id: request.id,
            data: {
              ok: false,
              status: "UNAUTHORIZED",
            },
          });

          return;
        }

        let input;
        try {
          input = func.input.parse(json.arguments);
        } catch {
          options?.onInputTypeMismatch?.();

          respond({
            id: request.id,
            data: {
              ok: false,
              status: "INPUT_TYPE_MISMATCH",
            },
          });

          return;
        }

        options?.onHandlingInput?.({ input });

        let output;
        try {
          output = await func.handler(input, context);
        } catch (error) {
          options?.onHandlerError?.({ error });

          respond({
            id: request.id,
            data: {
              ok: false,
              status: "SERVER_ERROR",
            },
          });

          return;
        }

        respond({
          id: request.id,
          data: {
            ok: true,
            status: "SUCCESS",
            data: output,
          },
        });
      },
    });
  };

  return {
    address: args.wallet.address,
    start,
    stop,
    client,
    router,
    subscribe,
    publish,
  };
};
