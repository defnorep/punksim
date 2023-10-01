import { Component, Ecs, Entity, System } from "../ecs";

/**
 * The StartupTimeSystem is responsible for setting the initial time.
 */
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

/**
 * The TimeSystem is responsible for managing the flow of time.
 */
export class TimeSystem extends System {
  constructor(ecs: Ecs) {
    super(ecs);
  }

  update(delta: number, _entities: Entity[]): void {
    // @todo consider adding an EntityContainer to let us reduce sets of entities without needing to reach into the ECS.
    this.ecs
      .reduceToComponent(FlowingTime)
      .forEach((time) =>
        time.datetime.setTime(time.datetime.getTime() + delta * time.rate),
      );
  }
}

export class FlowingTime extends Component {
  constructor(
    public datetime: Date,
    public rate: number,
  ) {
    super();
  }
}
