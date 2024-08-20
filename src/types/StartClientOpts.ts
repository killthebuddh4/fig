import { Signer } from "./Signer.ts";

export type StartClientOpts = {
  wallet: Signer;
  env?: "dev" | "production";
  privateKeyOverride?: string;
};
