import * as Comlink from "comlink";
import { startClient } from "./startClient.ts";
import { stopClient } from "./stopClient.ts";
import { fetchState } from "./fetchState.ts";
import { startGlobalMessageStream } from "./startGlobalMessageStream.ts";
import { listenToGlobalMessageStream } from "./listenToGlobalMessageStream.ts";
import { sendMessage } from "./sendMessage.ts";
import { subscribeToState } from "./subscribeToState.ts";
import { ignoreGlobalMessageStream } from "./ignoreGlobalMessageStream.ts";
import { stopGlobalMessageStream } from "./stopGlobalMessageStream.ts";

console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");
console.log("WORKER LOADED");

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
