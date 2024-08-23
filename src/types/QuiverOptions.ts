import { QuiverMiddleware } from "./QuiverMiddleware";
import { Signer } from "./Signer";
import { Fig } from "./Fig";
import type { Client } from "@xmtp/xmtp-js";

export type QuiverOptions = {
  key?: string;
  signer?: Signer;
  xmtp?: Client;
  fig?: Fig;
  env?: "production" | "dev";
  middleware?: QuiverMiddleware[];
};
