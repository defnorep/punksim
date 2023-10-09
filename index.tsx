import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import seed from "./data/seed.json";
import transportNetwork from "./data/transportNetwork.json";
import { Ecs } from "./src/ecs";
import { Engine } from "./src/engine";
import { NetStartupSystem } from "./src/system/net";
import {
  AgeSystem,
  PopulationStartupSystem,
  generateCitizen,
} from "./src/system/population";
import { TimeStartupSystem, TimeSystem } from "./src/system/time";
import {
  RandomTravelIntentSystem,
  TransportDispatchSystem,
  TransportNetwork,
  TransportTravellingSystem,
} from "./src/system/transport";
import {
  CensusUiSystem,
  CitizensUiSystem,
  TimeUiSystem,
  TravellerUiSystem,
} from "./src/system/ui";
import { Layout } from "./templates/layout";
import { Population, PopulationCensus } from "./templates/population";
import { Time } from "./templates/time";
import { Travellers } from "./templates/transport";

/**
 * Generate/Collect Seed Data
 * Let's use the fast seed layer all the time for now.
 * Maybe we will slow things down in the future when there is more to watch.
 */
const config = process.env.FAST
  ? { ...seed.base, ...seed.fast }
  : { ...seed.base };
const date = new Date(config.date);
const rateOfTime = config.rateOfTime;
const citizens = Array(config.citizens)
  .fill(1)
  .map(() => generateCitizen(date, 80));
const tpn = TransportNetwork.fromObject(transportNetwork.graph);
const speeds = TransportTravellingSystem.deserializeModeSpeeds(
  config.transportSpeeds,
);

/**
 * Simulation setup.
 */
const ecs = new Ecs();
ecs
  .addStartupSystem(new NetStartupSystem(ecs))
  .addStartupSystem(new TimeStartupSystem(ecs, date, rateOfTime))
  .addStartupSystem(new PopulationStartupSystem(ecs, citizens))
  .addSystem(new TimeSystem(ecs))
  .addSystem(new TransportDispatchSystem(ecs, tpn))
  .addSystem(new TransportTravellingSystem(ecs, speeds))
  .addSystem(new RandomTravelIntentSystem(ecs))
  .addSystem(new AgeSystem(ecs))
  .addSystem(new CensusUiSystem(ecs))
  .addSystem(new CitizensUiSystem(ecs))
  .addSystem(new TravellerUiSystem(ecs))
  .addSystem(new TimeUiSystem(ecs));

new Engine(ecs).start();

/**
 * Web Server Setup
 * Just serves the application shell.
 */
const app = new Hono();

app.get("/", (c) =>
  c.html(
    <Layout title="Cyberpunk City Simulator">
      <Time />
      <PopulationCensus />
      <Population />
      <Travellers />
    </Layout>,
  ),
);
app.use("/public/*", serveStatic({ root: "./" }));

export default app;
