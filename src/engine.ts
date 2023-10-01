import { Ecs } from "./ecs";

export class Engine {
  constructor(
    private ecs: Ecs,
    private tickInterval: number = 1000,
  ) {}

  start() {
    // run startup systems
    this.ecs.startup();

    // start ticking
    setInterval(
      this.ecs.update.bind(this.ecs, this.tickInterval),
      this.tickInterval,
    );
  }
}
