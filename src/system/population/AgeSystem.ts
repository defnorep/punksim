import { System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { CivicIdentityComponent, EpochComponent, age } from "../population";
import { TimeComponent } from "../time";

/**
 * The CitizensAgeSystem is responsible for aging citizens.
 */

export class AgeSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const time = this.ecs.getSingleton(TimeComponent);

    if (!time) {
      return;
    }

    for (const [_entity, components] of entities
      .allOf(CivicIdentityComponent, EpochComponent)
      .results()) {
      if (components.has(EpochComponent)) {
        const citizen = components.get(EpochComponent);
        citizen.age = age(citizen.epoch, time.datetime);
      }
    }
  }
}
