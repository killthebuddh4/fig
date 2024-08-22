import { QuiverRouter } from "./QuiverRouter";
import { QuiverClient } from "./QuiverClient";

export type Quiver = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: () => QuiverClient<any>;
  router: (namespace: string, router: QuiverRouter) => void;
};
