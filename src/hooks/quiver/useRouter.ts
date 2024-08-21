import { useActions } from "../useActions";
import { Signer } from "../../types/Signer";
import { QuiverRouterOptions } from "../../types/QuiverRouterOptions";
import { QuiverPublish } from "../../types/QuiverPublish";
import { Message } from "../../types/Message";
import { createRouter } from "./createRouter";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "./useStore";

export const useRouter = (args: {
  wallet?: Signer;
  namespace: string;
  opts?: QuiverRouterOptions;
}) => {
  const {
    sendMessage,
    listenToGlobalMessageStream,
    ignoreGlobalMessageStream,
  } = useActions();

  const publish: QuiverPublish = async ({ conversation, content }) => {
    // TODO Fix the String cast
    const message = await sendMessage({
      wallet: args.wallet,
      conversation,
      content: String(content),
    });

    if (!message.ok) {
      throw new Error("Failed to send message");
    }

    return { published: message.data };
  };

  const api = useStore((s) => s.api);

  const router = createRouter({ api, publish, options: args.opts });

  useEffect(() => {
    if (args.wallet === undefined) {
      return;
    }

    const id = uuidv4();

    const handler = (message: Message) => {
      if (message.conversation.context?.conversationId !== args.namespace) {
        return;
      }

      router(message);
    };

    listenToGlobalMessageStream({ wallet: args.wallet, id, handler });

    return () => {
      ignoreGlobalMessageStream({ wallet: args.wallet, id });
    };
  }, [
    args.wallet,
    listenToGlobalMessageStream,
    ignoreGlobalMessageStream,
    args.namespace,
    router,
  ]);
};
