import { Component, Ecs, System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";

/**
 * This system is responsible for starting the time in the game world.
 */
export class TimeStartupSystem extends System {
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
 * This system is responsible for updating the time in the game world.
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
