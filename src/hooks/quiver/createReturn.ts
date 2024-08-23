import { Message } from "../../types/Message";
import { QuiverSuccess } from "../../types/QuiverSuccess";
import { getRequestId } from "./getRequestId";
import { QuiverPublish } from "../../types/QuiverPublish";
import { QuiverReturn } from "../../types/QuiverReturn";

export const createReturn = (
  message: Message,
  publish: QuiverPublish
): QuiverReturn => {
  return async (res: QuiverSuccess<unknown>) => {
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
