import { useMemo, useEffect } from "react";
import { Signer } from "../types/Signer";
import { useActions } from "./useActions";
import { XmtpMessage } from "../types/XmtpMessage";
import { AsyncState } from "../types/AsyncState";
import { Xmtp } from "../types/Xmtp";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { useXmtpStore } from "./useXmtpStore";
import { XmtpSubscribe } from "../types/XmtpSubscribe.ts";

export const useXmtp = ({
  wallet,
}: {
  wallet?: Signer;
  opts?: object;
}): Xmtp | null => {
  const {
    startClient,
    stopClient,
    fetchState,
    listenToGlobalMessageStream,
    ignoreGlobalMessageStream,
    startGlobalMessageStream,
    stopGlobalMessageStream,
    subscribeToState,
    unsubscribeToState,
  } = useActions();

  const { globalMessageStream, setGlobalMessageStream, client, setClient } =
    useXmtpStore();

  /*
   *
   * SYNC WITH REMOTE STATE
   *
   */
  useEffect(() => {
    (async () => {
      if (wallet === undefined) {
        return;
      }

      const result = await fetchState(wallet);

      if (!result.ok) {
        // TODO: handle error
        return;
      }

      setGlobalMessageStream(result.data.globalMessageStream);
    })();

    let unsub: (() => void) | undefined;

    (async () => {
      if (wallet === undefined) {
        return;
      }

      const result = await subscribeToState({
        wallet,
        onChange: (s) => {
          setGlobalMessageStream(s.globalMessageStream);
        },
      });

      if (!result.ok) {
        return;
      }

      unsub = () => {
        if (wallet === undefined) {
          return;
        }

        return unsubscribeToState({
          wallet,
          subscriptionId: result.data.subscriptionId,
        });
      };
    })();

    return () => {
      unsub?.();
    };
  }, [
    wallet,
    fetchState,
    subscribeToState,
    unsubscribeToState,
    setGlobalMessageStream,
  ]);

  const login = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useLogin :: wallet is undefined");
      }

      return startClient({ wallet, opts: {} });
    };
  }, [wallet, startClient]);

  const logout = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useLogin :: wallet is undefined");
      }

      return stopClient(wallet);
    };
  }, [wallet, stopClient]);

  const isLoggedIn = useMemo(() => {
    return client?.code === "success";
  }, [client]);

  const isLoggingIn = useMemo(() => {
    return client?.code === "pending";
  }, [client]);

  const isLoginError = useMemo(() => {
    return client?.code === "error";
  }, [client]);

  const stream = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useStream :: wallet is undefined");
      }

      return startGlobalMessageStream(wallet);
    };
  }, [wallet, startGlobalMessageStream]);

  const isStreaming = useMemo(() => {
    return globalMessageStream?.code === "success";
  }, [globalMessageStream]);

  const isStarting = useMemo(() => {
    return globalMessageStream?.code === "pending";
  }, [globalMessageStream]);

  const isStreamError = useMemo(() => {
    return globalMessageStream?.code === "error";
  }, [globalMessageStream]);

  const stop = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useStream :: wallet is undefined");
      }

      return stopGlobalMessageStream(wallet);
    };
  }, [wallet, stopGlobalMessageStream]);

  const subscribe: XmtpSubscribe = useMemo(() => {
    return (handler: (message: XmtpMessage) => void) => {
      if (wallet === undefined) {
        throw new Error("useStream :: subscribe :: wallet is undefined");
      }

      return listenToGlobalMessageStream({
        wallet: wallet,
        id: uuidv4(),
        handler,
      });
    };
  }, [wallet, listenToGlobalMessageStream]);

  const unsubscribe = useMemo(() => {
    return (id: string) => {
      if (wallet === undefined) {
        throw new Error("useStream :: unsubscribe :: wallet is undefined");
      }

      ignoreGlobalMessageStream({ wallet: wallet, id });
    };
  }, [wallet, ignoreGlobalMessageStream]);

  return {
    start,
    stop,
    subscribe,
    unsubscribe,
    isReady: stream?.code === "idle",
    isPending: stream?.code === "pending",
    isSuccess: stream?.code === "success",
    isError: stream?.code === "error",
  };
};
