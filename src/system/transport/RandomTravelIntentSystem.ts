import { System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { LocationComponent } from "../global";
import { IntendsToTravelComponent, TransportMode } from "../transport";
import { CivicIdentityComponent } from "./../population";

export class RandomTravelIntentSystem extends System {
  update(delta: number, entities: EntityContainer): void {
    const citizens = entities.allOf(CivicIdentityComponent, LocationComponent);

    for (const [entity, components] of citizens.results()) {
      const willTravel = Math.random() < 0.01;
      const location = components.get(LocationComponent);

      if (location.id === "Residence-1" && willTravel) {
        this.ecs.addComponents(entity, [
          new IntendsToTravelComponent("Work-1", TransportMode.Road),
        ]);
      }
    }
  }
}
