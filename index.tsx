import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import seed from "./data/seed.json";
import { Ecs } from "./src/ecs";
import { Engine } from "./src/engine";
import {
  CitizensAgeSystem as CitizenAgingSystem,
  CitizensPopulator as CitizenPopulatorSystem,
  deriveCensus,
  generateCitizen,
} from "./src/system/citizens";
import { NetSystem } from "./src/system/net";
import { StartupTimeSystem, TimeSystem } from "./src/system/time";
import { CensusUi, CitizensUi, TimeUi } from "./src/system/ui";
import { CitizensCensus, CitizensDetail } from "./templates/citizens";
import { Time } from "./templates/global";
import { Layout } from "./templates/layout";

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
 */
const ecs = new Ecs();
ecs
  .addStartupSystem(new NetSystem(ecs))
  .addStartupSystem(new StartupTimeSystem(ecs, date, rateOfTime))
  .addStartupSystem(new CitizenPopulatorSystem(ecs, citizens))
  .addSystem(new TimeSystem(ecs))
  .addSystem(new CitizenAgingSystem(ecs))
  .addSystem(new CensusUi(ecs))
  .addSystem(new CitizensUi(ecs))
  .addSystem(new TimeUi(ecs));

new Engine(ecs).start();

/**
 * Web Server Setup
 * Just serves the application shell.
 */
const app = new Hono();

app.get("/", (c) =>
  c.html(
    <Layout title="Cyberpunk City Simulator">
      <Time datetime={date} />
      <CitizensCensus census={deriveCensus(citizens)} />
      <CitizensDetail citizens={citizens} />
    </Layout>,
  ),
);
app.use("/public/*", serveStatic({ root: "./" }));

export default app;
