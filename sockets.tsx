import { State, newState } from "./src/sim";
import { ServerWebSocket } from "bun";
import { Citizens } from "./templates/citizens";

/**
 * Simulation setup.
 *
 * We need a valid state to start with.
 * It's possible a client connects before we have received an update
 * message from the worker, however unlikely.
 */
let state: State = newState();

const sim = new Worker(new URL("./src/simWorker.ts", import.meta.url));

sim.addEventListener("message", (event: MessageEvent) => {
  // Ignore any messages that don't have a command property.
  if (!event.data?.cmd) {
    return;
  }

  // Message router
  switch (event.data.cmd) {
    case "update":
      // We just hold on to the state that the worker sends to us.
      state = event.data.state;
      break;
    default:
      break;
  }
});

/**
 * Websocket setup.
 */
let sockets: Set<ServerWebSocket<unknown>> = new Set();

export const server = Bun.serve({
  port: 3001,
  fetch(req, server) {
    console.log(`Client connecting`);
    if (server.upgrade(req)) {
      return;
    }

    return new Response("Upgrade failed.", { status: 250 });
  },
  websocket: {
    open(ws) {
      console.log(`Client connected: `, ws.remoteAddress);
      sockets.add(ws);
    },
    message() {},
    close(ws) {
      console.log(`Client disconnected: `, ws.remoteAddress);
      sockets.delete(ws);
    },
  },
});

/**
 * At some interval, update all connected clients
 * if there are any.
 */
setInterval(() => {
  sockets.forEach((ws) => {
    ws.send(<Citizens state={state} />);
  });
}, 1000);
