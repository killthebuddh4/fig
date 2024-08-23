import { z } from "zod";
import { QuiverRouter } from "../../types/QuiverRouter";
import { QuiverOptions } from "../../types/QuiverOptions";
import { QuiverApiSpec } from "../../types/QuiverApiSpec";
import { QuiverClient } from "../../types/QuiverClient";
import { Quiver } from "../../types/Quiver";
import { v4 as uuid } from "uuid";
import { QuiverContext } from "../../types/QuiverContext";
import { Message } from "../../types/Message";
import { createReturn } from "./createReturn";
import { quiverRequestSchema } from "./quiverRequestSchema";
import { quiverSuccessSchema } from "./quiverSuccessSchema";
import { quiverErrorSchema } from "./quiverErrorSchema";
import { createThrow } from "./createThrow";

const QUIVER = "quiver";
const VERSION = "0.0.1";
const ROUTER = "router";
const CLIENT = "client";
const ADDRESS = "TODO";

export const createQuiver = (options?: QuiverOptions): Quiver => {
  const fig = options?.fig;

  if (fig === undefined) {
    throw new Error("fig is required, others aren't implemented yet");
  }

  const start = () => {
    fig.start();
  };

  const stop = () => {
    fig.stop();
  };

  const routers = new Map<string, QuiverRouter>();
  const clients = new Map<string, QuiverClient<QuiverApiSpec>>();

  // 1. check if it's a quiver message
  // 2. check if it's from a client or a router
  // 3. if it's from a client, find the router and call the handler
  // 4. if it's from a router, find the client and call the handler
  // TODO HOW DO I MANAGE THE SUBSCRIPTIONS?
  fig.subscribe((message: Message) => {
    if (message.conversation.context === undefined) {
      return;
    }

    const cid = message.conversation.context.conversationId;

    if (!cid.startsWith(`${QUIVER}/${VERSION}`)) {
      return;
    }

    if (cid.startsWith(`${QUIVER}/${VERSION}/${CLIENT}`)) {
      const router = Array.from(routers.values()).find((router) => {
        return cid.startsWith(
          `${QUIVER}/${VERSION}/${CLIENT}/${ADDRESS}/${router.namespace}`
        );
      });

      if (router === undefined) {
        throw new Error("ERROR HANDLER NOT YET IMPLEMENTED");
      }

      let json;
      try {
        json = JSON.parse(String(message.content));
      } catch {
        // TODO How do we handle errors where we can't figure out the request ID?

        return;
      }

      let request: z.infer<typeof quiverRequestSchema>;
      try {
        request = quiverRequestSchema.parse(json);
      } catch {
        // TODO How do we handle errors where we can't figure out the request ID?

        return;
      }

      const context: QuiverContext = {
        return: createReturn(message, fig.publish),
        throw: createThrow(message, fig.publish),
        message,
        metadata: { request },
      };

      router.handler(context);

      return;
    }

    if (cid.startsWith(`${QUIVER}/${VERSION}/${ROUTER}`)) {
      const client = Array.from(clients.values()).find((client) => {
        return cid.startsWith(
          `${QUIVER}/${VERSION}/${ROUTER}/${client.router.address}/${client.router.namespace}`
        );
      });

      if (client === undefined) {
        throw new Error("ERROR HANDLER NOT YET IMPLEMENTED");
      }

      let json;
      try {
        json = JSON.parse(String(message.content));
      } catch {
        // TODO How do we handle errors where we can't figure out the request ID?

        return;
      }

      const s = z.union([quiverSuccessSchema, quiverErrorSchema]);

      let response: z.infer<typeof s>;
      try {
        response = s.parse(json);
      } catch {
        // TODO How do we handle errors where we can't figure out the request ID?
        return;
      }

      const context: QuiverContext = {
        return: createReturn(message, fig.publish),
        throw: createThrow(message, fig.publish),
        message,
        metadata: { response },
      };

      client.handler(context);

      return;
    }

    throw new Error("ERROR HANDLER NOT YET IMPLEMENTED");
  });

  const attach = {
    client: <Api extends QuiverApiSpec>(client: QuiverClient<Api>) => {
      const id = uuid();

      clients.set(id, client);

      return {
        detach: () => {
          clients.delete(id);
        },
      };
    },

    router: (router: QuiverRouter) => {
      const id = uuid();

      routers.set(id, router);

      return {
        detach: () => {
          routers.delete(id);
        },
      };
    },
  };

  return {
    start,
    stop,
    attach,
  };
};
