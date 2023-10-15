import { Hono } from "hono";
import modifiers from "./data/modifiers.json";
import seed from "./data/seed.json";
import transportNetwork from "./data/transportNetwork.json";
import { Ecs } from "./src/ecs/ecs";
import { Engine } from "./src/engine";
import { NetStartupSystem as SocketStartupSystem } from "./src/net/NetStartupSystem";
import { AgeSystem } from "./src/population/AgeSystem";
import {
  CensusStartupSystem,
  CensusSystem,
} from "./src/population/CensusSystem";
import { PopulationStartupSystem } from "./src/population/PopulationStartupSystem";
import { Modifiers } from "./src/population/population";
import { TimeStartupSystem } from "./src/time/TimeStartupSystem";
import { TimeSystem } from "./src/time/TimeSystem";
import { RandomTravelIntentSystem } from "./src/transport/RandomTravelIntentSystem";
import { TransportDispatchSystem } from "./src/transport/TransportDispatchSystem";
import { TransportNetwork } from "./src/transport/TransportNetwork";
import { TransportTravellingSystem } from "./src/transport/TransportTravellingSystem";
import { CensusUiSystem } from "./src/ui/CensusUiSystem";
import { CitizensUiSystem } from "./src/ui/CitizensUiSystem";
import { TimeUiSystem } from "./src/ui/TimeUiSystem";
import { TravellerUiSystem } from "./src/ui/TravellerUiSystem";
import { WebStartupSystem } from "./src/ui/WebStartupSystem";

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
const tpn = TransportNetwork.fromObject(transportNetwork.graph);
const speeds = TransportTravellingSystem.deserializeModeSpeeds(
  config.transportSpeeds,
);
const { disorders, implants }: Modifiers = modifiers;

/**
 * Web Server Setup
 * Just serves the application shell.
 */
const app = new Hono();

/**
 * Simulation setup.
 */
const ecs = new Ecs();
ecs
  .addStartupSystem(new SocketStartupSystem(ecs))
  .addStartupSystem(new WebStartupSystem(ecs, app, tpn))
  .addStartupSystem(new TimeStartupSystem(ecs, date, rateOfTime))
  .addStartupSystem(
    new PopulationStartupSystem(ecs, config.citizens, { disorders, implants }),
  )
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

export default app;
