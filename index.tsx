import { ServerWebSocket } from "bun";
import { State } from "./src/state";
import { Hono } from "hono";
import { Sim } from "./templates/sim";
import { serveStatic } from "hono/bun";
import { Layout } from "./templates/layout";

/**
 * Simulation setup.
 *
 * We need a valid state to start with.
 * It's possible a client connects before we have received an update
 * message from the worker, however unlikely.
 */
const state = State.empty();
const engine = new Worker(new URL("./src/engineWorker.ts", import.meta.url));

engine.addEventListener("message", (event: MessageEvent) => {
  // Ignore any messages that don't have a command property.
  if (!event.data?.cmd) {
    return;
  }

  // Message router
  switch (event.data.cmd) {
    case "update":
      // Any class instances are serialized when sent across postMessage.
      // This means we have to patch the State instance on this side of the worker.
      state.setCitizens(event.data.state.citizens);
      state.worldTimeState = event.data.state.worldTimeState;
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
    // Bun requires this method to be implemented
    // even though we aren't receiving any messages right now.
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
    ws.send(<Sim state={state} />);
  });
}, 1000);

/**
 * Web Server Setup
 */
const app = new Hono();

app.get("/", (c) =>
  c.html(
    <Layout title="Cyberpunk City Simulator">
      <Sim state={state} />
    </Layout>,
  ),
);
app.use("/public/*", serveStatic({ root: "./" }));

export default app;
