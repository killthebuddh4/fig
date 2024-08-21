import { useMemo, useEffect } from "react";
import { Signer } from "../../types/Signer";
import { useActions } from "../useActions";
import { useStore } from "./useStore";
import { setAuth } from "./setAuth";

export const useAuth = ({
  wallet,
  opts,
}: {
  wallet?: Signer;
  opts?: { env?: "production" | "dev" };
}) => {
  const auth = useStore((s) => s.auth);

  const {
    startClient,
    stopClient,
    fetchState,
    subscribeToState,
    unsubscribeToState,
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

      setAuth(result.data.client);
    })();

    let unsub: (() => void) | undefined;

    (async () => {
      const result = await subscribeToState({
        wallet,
        onChange: (s) => {
          setAuth(s.client);
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
  }, [wallet, fetchState, subscribeToState, unsubscribeToState, setAuth]);

  const signIn = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useLogin :: wallet is undefined");
      }

      return startClient({ wallet, opts });
    };
  }, [wallet, startClient, opts]);

  const signOut = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useLogin :: wallet is undefined");
      }

      return stopClient(wallet);
    };
  }, [wallet, stopClient]);

  return {
    signIn,
    signOut,
    isSignedIn: auth?.code === "success",
    isSigningIn: auth?.code === "pending",
    isSignInError: auth?.code === "error",
  };
};
