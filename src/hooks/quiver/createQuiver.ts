import { Message } from "../../types/Message";
import { Quiver } from "../../types/Quiver";
import { QuiverRouter } from "../../types/QuiverRouter";
import { Conversation } from "../../types/Conversation";
import { QuiverContext } from "../../types/QuiverContext";
import { QuiverError } from "../../types/QuiverError";
import { QuiverOptions } from "../../types/QuiverOptions";
import { getRequestId } from "../../lib/getRequestId";
import { QuiverSuccess } from "../../types/QuiverSuccess";

export const createQuiver = (args: {
  subscribe: (handler: (message: Message) => void) => void;
  publish: (conversation: Conversation, content: unknown) => Promise<Message>;
  options?: QuiverOptions;
}): Quiver => {
  const routers = new Map<string, QuiverRouter>();

  const createReturn = (message: Message) => {
    return async (res: QuiverSuccess<unknown>) => {
      args.options?.onReturn?.(message);
      args.options?.onSending?.(message);

      try {
        const id = getRequestId(message);

        if (id === null) {
          // this "should be impossible" if we call this function correctly
          throw new Error(
            `Failed to parse request id from message ${message.id}`
          );
        }

        let content;
        try {
          content = JSON.stringify({
            id,
            data: res,
          });
        } catch {
          throw new Error(
            `Failed to serialize return response for message ${message.id}`
          );
        }

        const sent = await args.publish(message.conversation, content);

        args.options?.onSent?.(message, sent);
      } catch (err) {
        args?.options?.onSendError?.(message, err);
      }
    };
  };

  const createThrow = (message: Message) => {
    return async (res: QuiverError) => {
      args.options?.onThrow?.(message);
      args.options?.onSending?.(message);

      try {
        const id = getRequestId(message);

        if (id === null) {
          // this "should be impossible" if we call this function correctly
          throw new Error(
            `Failed to parse request id from message ${message.id}`
          );
        }

        let content;
        try {
          content = JSON.stringify({
            id,
            data: res,
          });
        } catch {
          throw new Error(
            `Failed to serialize return response for message ${message.id}`
          );
        }

        const sent = await args.publish(message.conversation, content);

        args.options?.onSent?.(message, sent);
      } catch (err) {
        args?.options?.onSendError?.(message, err);
      }
    };
  };

  const attach = (namespace: string, router: QuiverRouter) => {
    const existing = routers.get(namespace);

    if (existing !== undefined) {
      throw new Error(`Router with namespace ${namespace} already exists`);
    }

    routers.set(namespace, router);

    return () => {
      routers.delete(namespace);
    };
  };

  // TODO, how do we handle startup and teardown
  args.subscribe((message: Message) => {
    const namespace = message.conversation.context?.conversationId;

    if (namespace === undefined) {
      return;
    }

    const router = routers.get(namespace);

    if (router === undefined) {
      return;
    }

    const context: QuiverContext = {
      message,
      throw: createThrow(message),
      return: createReturn(message),
    };

    router.handler(message, context);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = {} as unknown as any;

  return {
    client,
    router: attach,
  };
};
