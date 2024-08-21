import { Message } from "../../types/Message";
import { store } from "./store";
import { getMessage } from "./getMessage";
import { Feedback } from "../../types/Feedback";

export const addMessage = (message: Message): Feedback<Message> => {
  const existing = getMessage(message.id);

  if (existing !== undefined) {
    return {
      ok: false,
      code: "MESSAGE_ALREADY_ADDED",
      reason: `A message with id ${message.id} already exists`,
    };
  }

  store.setState((state) => ({
    messages: [...state.messages, message],
  }));

  return {
    ok: true,
    data: message,
  };
};
