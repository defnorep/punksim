import { Ecs, System } from "../ecs/ecs";
import { EntityContainer } from "../ecs/EntityContainer";
import { TimeComponent } from "./time";

/**
 * This system is responsible for updating the time in the game world.
 */
export class TimeSystem extends System {
  constructor(ecs: Ecs) {
    super(ecs);
  }

  update(delta: number, _entities: EntityContainer): void {
    const time = this.ecs.getSingleton(TimeComponent);

    if (time) {
      time.datetime.setTime(time.datetime.getTime() + delta * time.rate);
    }
  }
}
