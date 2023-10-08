import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import seed from "./data/seed.json";
import transportNetwork from "./data/transportNetwork.json";
import { Ecs } from "./src/ecs";
import { Engine } from "./src/engine";
import { NetSystem } from "./src/system/net";
import {
  AgeSystem as CitizenAgingSystem,
  PopulationStartupSystem as CitizenPopulatorSystem,
  generateCitizen,
} from "./src/system/population";
import { StartupTimeSystem, TimeSystem } from "./src/system/time";
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

/**
 * Simulation setup.
 */
const ecs = new Ecs();
ecs
  .addStartupSystem(new NetSystem(ecs))
  .addStartupSystem(new StartupTimeSystem(ecs, date, rateOfTime))
  .addStartupSystem(new CitizenPopulatorSystem(ecs, citizens))
  .addSystem(new TimeSystem(ecs))
  .addSystem(new TransportDispatchSystem(ecs, tpn))
  .addSystem(new TransportTravellingSystem(ecs))
  .addSystem(new RandomTravelIntentSystem(ecs))
  .addSystem(new CitizenAgingSystem(ecs))
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
