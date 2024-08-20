import { FigTopic } from "../types/FigTopic";
import { FigMessage } from "../types/FigMessage";
import { FigNotice } from "../types/FigNotice";

type Fig = {
  login: () => void;
  logout: () => void;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  isLoginError: boolean;
  start: () => void;
  stop: () => void;
  isStarted: boolean;
  isStarting: boolean;
  isStartError: boolean;
  publish: (topic: FigTopic, content: string) => Promise<void>;
  subscribe: (
    topic: FigTopic,
    handler: (message: FigMessage | FigNotice) => void
  ) => void;
};

export const useFig = (): Fig => {
  return null as unknown as Fig;
};
