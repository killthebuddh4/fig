import { Message } from "../../types/Message";
import { store } from "./store";

export const setMessages = (messages: Message[]) => {
  store.setState({ messages });
};
