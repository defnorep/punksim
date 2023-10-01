import { Component, Ecs, Entity, System } from "../ecs";

export class FlowingTime extends Component {
  constructor(
    public datetime: Date,
    public rate: number,
  ) {
    super();
  }
}

export class StartupTimeSystem extends System {
  constructor(
    ecs: Ecs,
    private datetime: Date,
    private rate = 1.0,
  ) {
    super(ecs);
  }

  update(_delta: number, _entities: Entity[]): void {
    this.ecs.createEntity(new FlowingTime(this.datetime, this.rate));
  }
}

export class TimeSystem extends System {
  constructor(ecs: Ecs) {
    super(ecs);
  }

  update(delta: number, entities: Entity[]): void {
    entities
      .map((entity) => this.ecs.getComponents(entity))
      .filter((components) => components.has(FlowingTime))
      .map((components) => components.get(FlowingTime))
      .forEach((time) =>
        time.datetime.setTime(time.datetime.getTime() + delta * time.rate),
      );
  }
}
