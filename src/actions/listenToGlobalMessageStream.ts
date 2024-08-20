import { ActionResult } from "../types/ActionResult";
import { store } from "./store";
import { XmtpMessage } from "../types/XmtpMessage";
import { add } from "./globalListeners";

export const listenToGlobalMessageStream = async (
  id: string,
  handler: (m: XmtpMessage) => void
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
