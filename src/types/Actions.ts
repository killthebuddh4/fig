import { startClient } from "../actions/startClient";
import { stopClient } from "../actions/stopClient";
import { fetchState } from "../actions/fetchState";
import { subscribeToState } from "../actions/subscribeToState";
import { unsubscribeToState } from "../actions/unsubscribeToState";
import { startGlobalMessageStream } from "../actions/startGlobalMessageStream";
import { stopGlobalMessageStream } from "../actions/stopGlobalMessageStream";
import { listenToGlobalMessageStream } from "../actions/listenToGlobalMessageStream";
import { ignoreGlobalMessageStream } from "../actions/ignoreGlobalMessageStream";
import { sendMessage } from "../actions/sendMessage";

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
