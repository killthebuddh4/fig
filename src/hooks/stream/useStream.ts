import { useMemo, useEffect } from "react";
import { Signer } from "../../types/Signer";
import { Message } from "../../types/Message";
import { useActions } from "../useActions";
import { store } from "./store";
import { setStream } from "./setStream";

export const useStream = ({ wallet }: { wallet?: Signer }) => {
  const stream = store((s) => s.stream);

  const {
    fetchState,
    subscribeToState,
    unsubscribeToState,
    startGlobalMessageStream,
    stopGlobalMessageStream,
    listenToGlobalMessageStream,
  } = useActions();

  useEffect(() => {
    if (wallet === undefined) {
      return;
    }

    (async () => {
      const result = await fetchState(wallet);

      if (!result.ok) {
        return;
      }

      setStream(result.data.globalMessageStream);
    })();

    let unsub: (() => void) | undefined;

    (async () => {
      const result = await subscribeToState({
        wallet,
        onChange: (s) => {
          setStream(s.globalMessageStream);
        },
      });

      if (!result.ok) {
        return;
      }

      unsub = () => {
        return unsubscribeToState({
          wallet,
          subscriptionId: result.data.subscriptionId,
        });
      };
    })();

    return () => {
      unsub?.();
    };
  }, [wallet, fetchState, subscribeToState, unsubscribeToState]);

  const start = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useStream :: wallet is undefined");
      }

      return startGlobalMessageStream(wallet);
    };
  }, [wallet, startGlobalMessageStream]);

  const stop = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useStream :: wallet is undefined");
      }

      return stopGlobalMessageStream(wallet);
    };
  }, [wallet, stopGlobalMessageStream]);

  const listen = useMemo(() => {
    return async (id: string, handler: (message: Message) => void) => {
      if (wallet === undefined) {
        throw new Error("useStream :: wallet is undefined");
      }

      return listenToGlobalMessageStream({ wallet, id, handler });
    };
  }, [wallet, listenToGlobalMessageStream]);

  return {
    start,
    stop,
    listen,
    isStreaming: stream?.code === "success",
    isStarting: stream?.code === "pending",
    isStreamError: stream?.code === "error",
  };
};
