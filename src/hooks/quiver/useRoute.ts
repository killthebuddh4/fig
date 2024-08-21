import { Signer } from "../../types/Signer";
import { useEffect } from "react";
import { useStore } from "./useStore";
import { QuiverFunction } from "../../types/QuiverFunction";

export const useRoute = (args: {
  wallet?: Signer;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: QuiverFunction<any, any>;
}) => {
  useEffect(() => {
    useStore.setState((prev) => {
      return {
        ...prev,
        [args.name]: args.handler,
      };
    });

    return () => {
      useStore.setState((prev) => {
        return {
          ...prev,
          [args.name]: undefined,
        };
      });
    };
  }, [args.name, args.handler]);
};
