import { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { Sim } from "./templates/sim";
import { serveStatic } from "hono/bun";
import { Layout } from "./templates/layout";
import { Engine } from "./src/engine";
import { TimeSystem } from "./src/system/time";
import { CitizensSystem, generateCitizen } from "./src/system/citizens";
import seed from "./data/seed.json";

/**
 * Generate/Collect Seed Data
 */
const citizens = Array(seed.base.citizens)
  .fill(1)
  .map(() => generateCitizen(80));

const date = new Date(seed.base.date);
const rateOfTime = seed.base.rateOfTime;

/**
 * Simulation setup.
 *
 */
const engine = new Engine()
  .addSystem(new TimeSystem(date, rateOfTime))
  .addSystem(new CitizensSystem(citizens));

setInterval(() => {
  sockets.forEach((ws) => {
    // This being in the callback WILL slow down the simulation
    // since all sockets must be updated before the tick finishes.
    // Let's try to profile this in order to fix it correctly.
    ws.send(<Sim states={engine.getStates()} />);
  });
}, 500);

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
