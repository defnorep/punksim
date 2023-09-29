import { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import seed from "./data/seed.json";
import { Engine } from "./src/engine";
import { CitizensSystem, generateCitizen } from "./src/system/citizens";
import { TimeSystem } from "./src/system/time";
import { Layout } from "./templates/layout";
import { Sim } from "./templates/sim";

/**
 * Generate/Collect Seed Data
 * Let's use the fast seed layer all the time for now.
 * Maybe we will slow things down in the future when there is more to watch.
 */
const config = { ...seed.base, ...seed.fast };
const date = new Date(config.date);
const rateOfTime = config.rateOfTime;
const citizens = Array(config.citizens)
  .fill(1)
  .map(() => generateCitizen(date, 80));

/**
 * Simulation setup.
 *
 */
const engine = new Engine()
  .addSystem(new TimeSystem(date, rateOfTime))
  .addSystem(new CitizensSystem(citizens));

setInterval(() => {
  sockets.forEach((ws) => {
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
 * Just serves the application shell.
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
