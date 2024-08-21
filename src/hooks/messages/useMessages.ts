import { Wallet } from "@ethersproject/wallet";
import { Message } from "../../types/Message";
import { store } from "./store";

export const useMessages = (
  wallet?: Wallet,
  opts?: {
    filter?: (message: Message) => boolean;
  }
) => {
  const filter = opts?.filter === undefined ? () => true : opts.filter;

  const messages = store.getState().messages.filter(filter);

  return messages;
};
