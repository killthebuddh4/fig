import { XmtpSubscribe } from "./XmtpSubscribe";
import { XmtpPublish } from "./XmtpPublish";

export type Xmtp = {
  address: string;
  env: "dev" | "production";
  login: () => void;
  logout: () => void;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  isLoginError: boolean;
  stream: () => void;
  stop: () => void;
  isStreaming: boolean;
  isStarting: boolean;
  isStreamError: boolean;
  publish: XmtpPublish;
  subscribe: XmtpSubscribe;
};
