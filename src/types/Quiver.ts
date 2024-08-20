import { Publish } from "./Publish.ts";
import { Subscribe } from "./Subscribe.ts";
import { Start } from "./Start.ts";
import { QuiverApiSpec } from "./QuiverApiSpec.ts";
import { QuiverRouterOptions } from "./QuiverRouterOptions.ts";
import { QuiverClient } from "./QuiverClient.ts";
import { QuiverApi } from "./QuiverApi.ts";

export type Quiver = {
  address: string;
  start: Start;
  stop: () => void;
  publish: Publish;
  subscribe: Subscribe;
  client: <Api extends QuiverApiSpec>(
    api: Api,
    router: { address: string; namespace?: string },
    options?: QuiverRouterOptions
  ) => QuiverClient<typeof api>;
  router: (api: QuiverApi, options?: QuiverRouterOptions) => void;
};
