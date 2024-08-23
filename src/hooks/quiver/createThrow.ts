import { Message } from "../../types/Message";
import { getRequestId } from "./getRequestId";
import { QuiverPublish } from "../../types/QuiverPublish";
import { QuiverError } from "../../types/QuiverError";
import { QuiverThrow } from "../../types/QuiverThrow";

export const createThrow = (
  message: Message,
  publish: QuiverPublish
): QuiverThrow => {
  return async (res: QuiverError) => {
    const id = getRequestId(message);

    if (id === null) {
      // this "should be impossible" if we call this function correctly
      throw new Error(`Failed to parse request id from message ${message.id}`);
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

    await publish({
      conversation: message.conversation,
      content,
    });
  };
};
