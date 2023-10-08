import { Component, Ecs, System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";

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

  update(_delta: number, _entities: EntityContainer): void {
    this.ecs.createSingleton(new FlowingTime(this.datetime, this.rate));
  }
}

/**
 * The TimeSystem is responsible for managing the flow of time.
 */
export class TimeSystem extends System {
  constructor(ecs: Ecs) {
    super(ecs);
  }

  update(delta: number, entities: EntityContainer): void {
    const time = this.ecs.getSingleton(FlowingTime);

    if (time) {
      time.datetime.setTime(time.datetime.getTime() + delta * time.rate);
    }
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
