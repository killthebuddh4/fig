import { QuiverRouter } from "./QuiverRouter";
import { QuiverClient } from "./QuiverClient";
import { QuiverApiSpec } from "./QuiverApiSpec";

export type Quiver = {
  start: () => void;
  stop: () => void;
  attach: {
    client: <Api extends QuiverApiSpec>(
      client: QuiverClient<Api>
    ) => {
      detach: () => void;
    };
    router: (router: QuiverRouter) => {
      detach: () => void;
    };
  };
};
