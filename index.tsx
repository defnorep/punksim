import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import seed from "./data/seed.json";
import transportNetwork from "./data/transportNetwork.json";
import { Ecs } from "./src/ecs";
import { Engine } from "./src/engine";
import { NetStartupSystem } from "./src/system/net/NetStartupSystem";
import { generateCitizen } from "./src/system/population";
import { AgeSystem } from "./src/system/population/AgeSystem";
import {
  CensusStartupSystem,
  CensusSystem,
} from "./src/system/population/CensusSystem";
import { PopulationStartupSystem } from "./src/system/population/PopulationStartupSystem";
import { TimeStartupSystem } from "./src/system/time/TimeStartupSystem";
import { TimeSystem } from "./src/system/time/TimeSystem";
import { RandomTravelIntentSystem } from "./src/system/transport/RandomTravelIntentSystem";
import { TransportDispatchSystem } from "./src/system/transport/TransportDispatchSystem";
import { TransportNetwork } from "./src/system/transport/TransportNetwork";
import { TransportTravellingSystem } from "./src/system/transport/TransportTravellingSystem";
import { CensusUiSystem } from "./src/system/ui/CensusUiSystem";
import { CitizensUiSystem } from "./src/system/ui/CitizensUiSystem";
import { TimeUiSystem } from "./src/system/ui/TimeUiSystem";
import { TravellerUiSystem } from "./src/system/ui/TravellerUiSystem";
import { Layout } from "./templates/layout";
import { Population, PopulationCensus } from "./templates/population";
import { Time } from "./templates/time";
import { Travellers } from "./templates/transport";
import { TransportNetworkGraph } from "./templates/transportGraph";

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
  .addStartupSystem(new CensusStartupSystem(ecs))
  .addSystem(new TimeSystem(ecs))
  .addSystem(new CensusSystem(ecs))
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
      <TransportNetworkGraph network={tpn} />
      <Travellers />
    </Layout>,
  ),
);
app.use("/public/*", serveStatic({ root: "./" }));

export default app;
