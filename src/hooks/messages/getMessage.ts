import { store } from "./store";
import { Feedback } from "../../types/Feedback";
import { Message } from "../../types/Message";

export const getMessage = (id: string): Feedback<Message> => {
  const message = store
    .getState()
    .messages.find((message) => message.id === id);

  if (message === undefined) {
    return {
      ok: false,
      code: "MESSAGE_NOT_FOUND",
      reason: `A message with id ${id} was not found`,
    };
  }

  return {
    ok: true,
    data: message,
  };
};
