import { ActionResult } from "../types/ActionResult.js";
import { store } from "./store.js";
import { Message } from "../types/Message.js";
import { add } from "./globalListeners.js";

export const listenToGlobalMessageStream = async (
  id: string,
  handler: (m: Message) => void
): Promise<ActionResult<{ listenerId: string }>> => {
  console.log("ACTION :: listenToGlobalMessageStream :: CALLED");

  const messageStream = store.getState().globalMessageStream;

  if (messageStream.code !== "success") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Message stream is not started",
    };
  }

  console.log(
    "ACTION :: listenToGlobalMessageStream :: LISTENING TO GLOBAL MESSAGE STREAM"
  );

  const ignore = messageStream.data.listen((message) => {
    return handler({
      id: message.id,
      content: message.content,
      senderAddress: message.senderAddress,
      sent: message.sent,
      conversation: {
        peerAddress: message.conversation.peerAddress,
        context: message.conversation.context,
      },
    });
  });

  add(id, ignore);

  return {
    ok: true,
    code: "SUCCESS",
    data: { listenerId: id },
  };
};
