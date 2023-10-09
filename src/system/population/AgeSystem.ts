import { System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { CitizenComponent, age } from "../population";
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
      .allOf(CitizenComponent)
      .results()) {
      if (components.has(CitizenComponent)) {
        const citizen = components.get(CitizenComponent);
        citizen.age = age(citizen.birthdate, time.datetime);
      }
    }
  }
}
