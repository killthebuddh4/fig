import { QuiverFunction } from "./QuiverFunction";

export type QuiverApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: QuiverFunction<any, any>;
};
