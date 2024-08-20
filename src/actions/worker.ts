import * as Comlink from "comlink";
import { startClient } from "./startClient.js";
import { stopClient } from "./stopClient.js";
import { fetchState } from "./fetchState.js";
import { startGlobalMessageStream } from "./startGlobalMessageStream.js";
import { listenToGlobalMessageStream } from "./listenToGlobalMessageStream.js";
import { sendMessage } from "./sendMessage.js";
import { subscribeToState } from "./subscribeToState.js";
import { ignoreGlobalMessageStream } from "./ignoreGlobalMessageStream.js";
import { stopGlobalMessageStream } from "./stopGlobalMessageStream.js";

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
