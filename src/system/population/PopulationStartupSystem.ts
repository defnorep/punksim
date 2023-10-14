import { Ecs, System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { CitizenArchetype } from "../population";

/**
 * The CitizensPopulator is responsible for creating the initial set of citizens.
 */

export class PopulationStartupSystem extends System {
  constructor(
    ecs: Ecs,
    private population: CitizenArchetype[],
  ) {
    super(ecs);
  }

  update(_delta: number, _entities: EntityContainer): void {
    this.population.forEach((citizen) => {
      this.ecs.createEntity(...citizen);
    });
  }
}
