import { Ecs, System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { TimeComponent } from "../time";

/**
 * This system is responsible for starting the time in the game world.
 */

export class TimeStartupSystem extends System {
  constructor(
    ecs: Ecs,
    private datetime: Date,
    private rate = 1,
  ) {
    super(ecs);
  }

  update(_delta: number, _entities: EntityContainer): void {
    this.ecs.createSingleton(new TimeComponent(this.datetime, this.rate));
  }
}
