import { Subscriber } from "./Subscriber";
import { Feedback } from "../../types/Feedback";
import { store } from "./store";

export const removeSubscriber = (id: string): Feedback<Subscriber> => {
  const existing = store
    .getState()
    .subscribers.find((subscriber) => subscriber.id === id);

  if (existing === undefined) {
    return {
      ok: false,
      code: "SUBSCRIBER_NOT_FOUND",
      reason: `A subscriber with id ${id} was not found`,
    };
  }

  store.setState((state) => ({
    subscribers: state.subscribers.filter((subscriber) => subscriber.id !== id),
  }));

  return {
    ok: true,
    data: existing,
  };
};
