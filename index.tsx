import { ServerWebSocket } from "bun";
import { State } from "./src/state";
import { Hono } from "hono";
import { Sim } from "./templates/sim";
import { serveStatic } from "hono/bun";
import { Layout } from "./templates/layout";
import { Engine } from "./src/engine";
import { WorldTimeSystem } from "./src/system/worldTime";
import { CitizensSystem, generateCitizen } from "./src/system/citizens";
import seed from "./data/seed.json";

/**
 * Generate Seed Data
 */
const citizens = Array(seed.base.citizens)
  .fill(1)
  .map(() => generateCitizen(80));

/**
 * Simulation setup.
 *
 */
new Engine([], (states: State[]) => {
  sockets.forEach((ws) => {
    ws.send(<Sim states={states} />);
  });
})
  .addSystem(new WorldTimeSystem(new Date(seed.base.date)))
  .addSystem(new CitizensSystem(citizens));

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
 * Web Server Setup
 */
const app = new Hono();

app.get("/", (c) =>
  c.html(
    <Layout title="Cyberpunk City Simulator">
      <Sim states={[]} />
    </Layout>,
  ),
);
app.use("/public/*", serveStatic({ root: "./" }));

export default app;
