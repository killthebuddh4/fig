// import { z } from "zod";
// import { Signer } from "../types/Signer.js";
// import { useActions } from "./useActions.js";
// import { v4 as uuid } from "uuid";
// import {
//   QuiverOptions,
//   QuiverClient,
//   QuiverClientOptions,
//   QuiverRouterOptions,
//   QuiverApiSpec,
//   QuiverResult,
//   QuiverResponse,
//   QuiverApi,
//   Start,
//   Message,
//   Subscribe,
//   Publish,
//   quiverErrorSchema,
//   quiverRequestSchema,
//   quiverResponseSchema,
//   quiverSuccessSchema,
//   Quiver,
// } from "@killthebuddha/quiver";

// // TODO This is a stub.
// const handlers = new Map<string, (message: Message) => void>();

// export const useQuiver = (args: {
//   wallet: Signer;
//   options?: QuiverOptions;
// }): Quiver => {
//   const {
//     sendMessage,
//     startGlobalMessageStream,
//     startClient,
//     listenToGlobalMessageStream,
//     stopGlobalMessageStream,
//   } = useActions();

//   const start: Start = async ({ options }) => {
//     const startClientResponse = await startClient({
//       wallet: args.wallet,
//       opts: { env: args.options?.env },
//     });

//     if (!startClientResponse.ok) {
//       throw new Error(startClientResponse.error);
//     }

//     const startStreamResponse = await startGlobalMessageStream(args.wallet);

//     if (!startStreamResponse.ok) {
//       throw new Error(startStreamResponse.error);
//     }

//     const listenerId = uuid();

//     listenToGlobalMessageStream({
//       wallet: args.wallet,
//       id: listenerId,
//       handler: (message) => {
//         try {
//           args.options?.onMessageReceived?.(message);
//         } catch {
//           console.warn("args.options.onMessageReceived threw an error");
//         }

//         if (handlers.size === 0) {
//           try {
//             args.options?.onMissedMessage?.(message);
//           } catch {
//             console.warn("onNoHandlersForMessage threw an error");
//           }
//         }

//         for (const handler of Array.from(handlers.values())) {
//           try {
//             handler(message);
//           } catch (error) {
//             try {
//               args.options?.onHandlerError?.(error);
//             } catch {
//               console.warn("onHandlerError threw an error");
//             }
//           }
//         }
//       },
//     });
//   };

//   const subscribe: Subscribe = ({ handler }) => {
//     const id = uuid();

//     handlers.set(id, handler);

//     return {
//       unsubscribe: () => {
//         handlers.delete(id);
//       },
//     };
//   };

//   const publish: Publish = async ({ conversation, content, options }) => {
//     const onSendingMessage =
//       options?.onSendingMessage || args.options?.onSendingMessage;
//     const onSentMessage = options?.onSentMessage || args.options?.onSentMessage;
//     const onSendError = options?.onSendError || args.options?.onSendError;

//     onSendingMessage?.({ topic: conversation, content });

//     let sent;
//     try {
//       sent = await sendMessage({
//         wallet: args.wallet,
//         conversation,
//         // TODO Make sure this doesn't cause a problem.
//         content: String(content),
//       });

//       if (!sent.ok) {
//         throw new Error(sent.error);
//       }
//     } catch (error) {
//       onSendError?.({ topic: conversation, error });
//       throw error;
//     }

//     onSentMessage?.({ message: sent.data });

//     return { published: sent.data };
//   };

//   const stop = async () => {
//     return stopGlobalMessageStream(args.wallet);
//   };

//   const client = <Api extends QuiverApiSpec>(
//     api: Api,
//     router: {
//       address: string;
//       namespace?: string;
//     },
//     options?: QuiverClientOptions
//   ) => {
//     const namespace = router.namespace ?? "quiver/0.0.1";

//     const client = {};

//     for (const [key, value] of Object.entries(api)) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (client as any)[key as keyof typeof api] = async (
//         input: z.infer<typeof value.input>
//       ) => {
//         const request = {
//           id: uuid(),
//           function: key,
//           arguments: input,
//         };

//         let str: string;
//         try {
//           str = JSON.stringify(request);
//         } catch {
//           options?.onInputSerializationError?.();

//           return {
//             ok: false,
//             code: "INPUT_SERIALIZATION_FAILED",
//             response: null,
//           };
//         }

//         const promise = new Promise<
//           // TODO This type should be something that wraps these types
//           // and includes the request and response (and maybe more).
//           QuiverResult<z.infer<typeof value.output>>
//         >((resolve) => {
//           const timeout = setTimeout(() => {
//             options?.onRequestTimeout?.();

//             resolve({
//               ok: false,
//               status: "REQUEST_TIMEOUT",
//             });
//           }, options?.timeoutMs ?? 10000);

//           /* TODO, when do we throw and when do we not throw????? */
//           const { unsubscribe } = subscribe({
//             handler: (message) => {
//               if (message.senderAddress === args.wallet.address) {
//                 options?.onSelfSentMessage?.({ message });
//                 return;
//               }

//               if (message.senderAddress !== router.address) {
//                 options?.onUnknownSender?.({ message });
//                 return;
//               }

//               if (message.conversation.context?.conversationId !== namespace) {
//                 options?.onTopicMismatch?.({ message });
//                 return;
//               }

//               let json;
//               try {
//                 json = JSON.parse(String(message.content));
//               } catch (error) {
//                 options?.onReceivedInvalidJson?.({ message });
//                 return;
//               }

//               let response;
//               try {
//                 response = quiverResponseSchema.parse(json);
//               } catch (error) {
//                 options?.onReceivedInvalidResponse?.({ message });
//                 return;
//               }

//               const id = response.id;

//               if (id !== request.id) {
//                 options?.onIdMismatch?.({ message });
//                 return;
//               }

//               unsubscribe();

//               clearTimeout(timeout);

//               const error = quiverErrorSchema.safeParse(response.data);

//               if (error.success) {
//                 resolve({
//                   ok: false,
//                   status: error.data.status,
//                 });
//               }

//               const success = quiverSuccessSchema.safeParse(response.data);

//               if (!success.success) {
//                 resolve({
//                   ok: false,
//                   status: "INVALID_RESPONSE",
//                   request: JSON.stringify(request, null, 2),
//                   response: JSON.stringify(response.data, null, 2),
//                 });
//               }

//               const output = value.output.safeParse(success.data?.data);

//               if (!output.success) {
//                 resolve({
//                   ok: false,
//                   status: "OUTPUT_TYPE_MISMATCH",
//                 });
//               }

//               resolve({
//                 ok: true,
//                 status: "SUCCESS",
//                 data: output.data,
//               });
//             },
//           });
//         });

//         try {
//           options?.onSendingRequest?.({
//             topic: {
//               peerAddress: router.address,
//               context: {
//                 conversationId: namespace,
//                 metadata: {},
//               },
//             },
//             content: str,
//           });

//           const sent = await publish({
//             conversation: {
//               peerAddress: router.address,
//               context: {
//                 conversationId: namespace,
//                 metadata: {},
//               },
//             },
//             content: str,
//           });

//           options?.onSentRequest?.({ message: sent.published });
//         } catch (error) {
//           options?.onSendRequestError?.({ error });

//           return {
//             ok: false,
//             code: "XMTP_SEND_FAILED",
//             response: null,
//           };
//         }

//         return promise;
//       };
//     }

//     return client as QuiverClient<typeof api>;
//   };

//   const router = (api: QuiverApi, options?: QuiverRouterOptions) => {
//     const namespace = options?.namespace ?? "quiver/0.0.1";

//     return subscribe({
//       handler: async (message) => {
//         if (message.senderAddress === args.wallet.address) {
//           options?.onSelfSentMessage?.({ message });
//           return;
//         }

//         if (message.conversation.context?.conversationId !== namespace) {
//           options?.onTopicMismatch?.({ message });
//           return;
//         }

//         options?.onReceivedMessage?.({ message });

//         let json;
//         try {
//           json = JSON.parse(String(message.content));
//         } catch (error) {
//           options?.onReceivedInvalidJson?.({ message });
//           return;
//         }

//         let request;
//         try {
//           request = quiverRequestSchema.parse(json);
//         } catch (error) {
//           options?.onReceivedInvalidRequest?.({ message });
//           return;
//         }

//         const respond = async (response: QuiverResponse) => {
//           options?.onSendingResponse?.();

//           let content;
//           try {
//             content = JSON.stringify(response);
//           } catch (error) {
//             options?.onOutputSerializationError?.();
//             return;
//           }

//           try {
//             const sent = await publish({
//               conversation: {
//                 peerAddress: message.senderAddress,
//                 context: {
//                   conversationId: namespace,
//                   metadata: {},
//                 },
//               },
//               content,
//             });

//             options?.onSentResponse?.({ sent: sent.published });
//           } catch (error) {
//             options?.onSendResponseError?.();
//           }
//         };

//         const func = api[request.function];

//         if (func === undefined) {
//           options?.onUnknownFunction?.();

//           respond({
//             id: request.id,
//             data: {
//               ok: false,
//               status: "UNKNOWN_FUNCTION",
//             },
//           });

//           return;
//         }

//         let isAuthorized = false;

//         const context = {
//           id: request.id,
//           message,
//         };

//         try {
//           isAuthorized = await func.auth({ context });
//         } catch (error) {
//           options?.onAuthError?.({ error });
//           isAuthorized = false;
//         }

//         if (!isAuthorized) {
//           options?.onUnauthorized?.();

//           respond({
//             id: request.id,
//             data: {
//               ok: false,
//               status: "UNAUTHORIZED",
//             },
//           });

//           return;
//         }

//         let input;
//         try {
//           input = func.input.parse(json.arguments);
//         } catch (error) {
//           options?.onInputTypeMismatch?.();

//           respond({
//             id: request.id,
//             data: {
//               ok: false,
//               status: "INPUT_TYPE_MISMATCH",
//             },
//           });

//           return;
//         }

//         options?.onHandlingInput?.({ input });

//         let output;
//         try {
//           output = await func.handler(input, context);
//         } catch (error) {
//           options?.onHandlerError?.({ error });

//           respond({
//             id: request.id,
//             data: {
//               ok: false,
//               status: "SERVER_ERROR",
//             },
//           });

//           return;
//         }

//         respond({
//           id: request.id,
//           data: {
//             ok: true,
//             status: "SUCCESS",
//             data: output,
//           },
//         });
//       },
//     });
//   };

//   return {
//     address: args.wallet.address,
//     start,
//     stop,
//     client,
//     router,
//     subscribe,
//     publish,
//   };
// };
