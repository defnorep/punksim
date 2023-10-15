import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { EntityContainer } from "../ecs/EntityContainer";
import { Ecs, System } from "../ecs/ecs";
import { TransportNetwork } from "../transport/TransportNetwork";
import { Layout } from "./templates/layout";
import { Population, PopulationCensus } from "./templates/population";
import { Time } from "./templates/time";
import { Travellers } from "./templates/transport";
import { TransportNetworkGraph } from "./templates/transportGraph";

export class WebStartupSystem extends System {
  constructor(
    protected ecs: Ecs,
    private hono: Hono,
    private tpn: TransportNetwork,
  ) {
    super(ecs);
  }
  update(_delta: number, _entities: EntityContainer): void {
    this.hono.get("/", (c) =>
      c.html(
        <Layout title="Cyberpunk City Simulator">
          <Time />
          <PopulationCensus />
          <Population />
          <TransportNetworkGraph network={this.tpn} />
          <Travellers />
        </Layout>,
      ),
    );

    this.hono.use("/public/*", serveStatic({ root: "./" }));
  }
}
