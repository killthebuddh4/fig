import { QuiverFunction } from "./QuiverFunction.ts";

export type QuiverApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: QuiverFunction<any, any>;
};
