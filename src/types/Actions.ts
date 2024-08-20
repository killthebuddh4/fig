import { startClient } from "../actions/startClient.ts";
import { stopClient } from "../actions/stopClient.ts";
import { fetchState } from "../actions/fetchState.ts";
import { subscribeToState } from "../actions/subscribeToState.ts";
import { unsubscribeToState } from "../actions/unsubscribeToState.ts";
import { startGlobalMessageStream } from "../actions/startGlobalMessageStream.ts";
import { stopGlobalMessageStream } from "../actions/stopGlobalMessageStream.ts";
import { listenToGlobalMessageStream } from "../actions/listenToGlobalMessageStream.ts";
import { ignoreGlobalMessageStream } from "../actions/ignoreGlobalMessageStream.ts";
import { sendMessage } from "../actions/sendMessage.ts";

export type Actions = {
  startClient: typeof startClient;
  stopClient: typeof stopClient;
  startGlobalMessageStream: typeof startGlobalMessageStream;
  stopGlobalMessageStream: typeof stopGlobalMessageStream;
  listenToGlobalMessageStream: typeof listenToGlobalMessageStream;
  ignoreGlobalMessageStream: typeof ignoreGlobalMessageStream;
  sendMessage: typeof sendMessage;
  fetchState: typeof fetchState;
  subscribeToState: typeof subscribeToState;
  unsubscribeToState: typeof unsubscribeToState;
};
