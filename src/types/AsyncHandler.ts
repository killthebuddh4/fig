import { AsyncState } from "./AsyncState.ts";

export type AsyncHandler<T> = (state: AsyncState<T>) => void;
