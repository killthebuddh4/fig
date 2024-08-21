import { Feedback } from "../../types/Feedback";
import { Subscriber } from "./Subscriber";
import { store } from "./store";

export const addSubscriber = (id: string): Feedback<Subscriber> => {
  const existing = store
    .getState()
    .subscribers.find((subscriber) => subscriber.id === id);

  if (existing !== undefined) {
    return {
      ok: false,
      code: "SUBSCRIBER_EXISTS",
      reason: `A subscriber with id ${id} already exists`,
    };
  }

  const subscriber = {
    id,
    unsubscribe: () => {
      store.setState((state) => ({
        subscribers: state.subscribers.filter(
          (subscriber) => subscriber.id !== id
        ),
      }));
    },
  };

  store.setState((state) => ({
    subscribers: [...state.subscribers, subscriber],
  }));

  return {
    ok: true,
    data: subscriber,
  };
};
