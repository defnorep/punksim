import { Ecs, System } from "../ecs/ecs";
import { EntityContainer } from "../ecs/EntityContainer";
import { TimeComponent } from "../time/time";
import { CitizenBuilder } from "./CitizenBuilder";
import { Modifiers } from "./population";

/**
 * The PopulationStartupSystem is responsible for creating the initial set of citizens.
 */
export class PopulationStartupSystem extends System {
  constructor(
    ecs: Ecs,
    private population: number,
    private modifiers: Modifiers,
  ) {
    super(ecs);
  }

  update(_delta: number, _entities: EntityContainer): void {
    const time = this.ecs.getSingleton(TimeComponent);
    Array(this.population)
      .fill(1)
      .forEach(() => {
        this.ecs.createEntity(
          ...CitizenBuilder.random(
            time.datetime,
            1.8,
            0.2,
            80,
            10,
            "Residence-1",
          ),
        );
      });
  }
}
