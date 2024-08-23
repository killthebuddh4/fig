import { QuiverFunction } from "./QuiverFunction";

export type QuiverApiSpec = {
  address: string;
  namespace: string;
  functions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: Omit<QuiverFunction<any, any>, "handler">;
  };
};
