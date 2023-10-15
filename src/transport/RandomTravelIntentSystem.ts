import { EntityContainer } from "../ecs/EntityContainer";
import { System } from "../ecs/ecs";
import { CivicIdentityComponent } from "../population/population";
import {
  IntendsToTravelComponent,
  LocationComponent,
  TransportMode,
} from "./transport";

export class RandomTravelIntentSystem extends System {
  update(delta: number, entities: EntityContainer): void {
    const citizens = entities.allOf(CivicIdentityComponent, LocationComponent);

    for (const [entity, components] of citizens.results()) {
      const willTravel = Math.random() < 0.01;
      const location = components.get(LocationComponent);

      if (location.locationId === "Residence-1" && willTravel) {
        this.ecs.addComponents(entity, [
          new IntendsToTravelComponent("Work-1", TransportMode.Road),
        ]);
      }
    }
  }
}
