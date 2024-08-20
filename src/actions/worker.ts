import * as Comlink from "comlink";
import { startClient } from "./startClient";
import { stopClient } from "./stopClient";
import { fetchState } from "./fetchState";
import { startGlobalMessageStream } from "./startGlobalMessageStream";
import { listenToGlobalMessageStream } from "./listenToGlobalMessageStream";
import { sendMessage } from "./sendMessage";
import { subscribeToState } from "./subscribeToState";
import { ignoreGlobalMessageStream } from "./ignoreGlobalMessageStream";
import { stopGlobalMessageStream } from "./stopGlobalMessageStream";

Comlink.expose({
  startClient,
  stopClient,
  fetchState,
  subscribeToState,
  startGlobalMessageStream,
  stopGlobalMessageStream,
  listenToGlobalMessageStream,
  ignoreGlobalMessageStream,
  sendMessage,
});
