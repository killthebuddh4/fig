import { QuiverPublish } from "./QuiverPublish";
import { QuiverSubscribe } from "./QuiverSubscribe";
import { Start } from "./Start";
import { QuiverApiSpec } from "./QuiverApiSpec";
import { QuiverRouterOptions } from "./QuiverRouterOptions";
import { QuiverClient } from "./QuiverClient";
import { QuiverApi } from "./QuiverApi";

export type Quiver = {
  address: string;
  start: Start;
  stop: () => void;
  publish: QuiverPublish;
  subscribe: QuiverSubscribe;
  client: <Api extends QuiverApiSpec>(
    api: Api,
    router: { address: string; namespace?: string },
    options?: QuiverRouterOptions
  ) => QuiverClient<typeof api>;
  router: (api: QuiverApi, options?: QuiverRouterOptions) => void;
};
