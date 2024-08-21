import { store } from "./store";
import { Feedback } from "../../types/Feedback";
import { Subscriber } from "./Subscriber";

export const getSubscriber = (id: string): Feedback<Subscriber> => {
  const subscriber = store
    .getState()
    .subscribers.find((subscriber) => subscriber.id === id);

  if (subscriber === undefined) {
    return {
      ok: false,
      code: "SUBSCRIBER_NOT_FOUND",
      reason: `A subscriber with id ${id} was not found`,
    };
  }

  return {
    ok: true,
    data: subscriber,
  };
};
