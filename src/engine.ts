import { Ecs, System } from "./ecs";

export class Engine {
  constructor(
    private ecs: Ecs,
    private tickInterval: number = 1000,
  ) {
    setInterval(
      this.ecs.update.bind(this.ecs, this.tickInterval),
      this.tickInterval,
    );
  }

  addSystem(system: System) {
    this.ecs.addSystem(system);

    return this;
  }
}
