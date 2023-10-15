import { Ecs, System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";
import { LocationComponent } from "../global";
import { IntendsToTravelComponent, TravellingComponent } from "../transport";
import { TransportNetwork } from "./TransportNetwork";

export class TransportDispatchSystem extends System {
  constructor(
    ecs: Ecs,
    private network: TransportNetwork,
  ) {
    super(ecs);
  }

  update(_delta: number, entities: EntityContainer): void {
    const travellers = entities.allOf(
      IntendsToTravelComponent,
      LocationComponent,
    );

    for (const [entity, components] of travellers.results()) {
      const intendsToTravel = components.get(IntendsToTravelComponent);
      const location = components.get(LocationComponent);

      if (intendsToTravel.destinationId === location.locationId) {
        return;
      }

      const path = this.network.findPath(
        location.locationId,
        intendsToTravel.destinationId,
      );

      const distance = path.reduce(
        (total, edge) => (total += edge.distance),
        0,
      );

      this.ecs.addComponents(entity, [
        new TravellingComponent(
          location.locationId,
          intendsToTravel.destinationId,
          distance,
          distance,
          intendsToTravel.mode,
        ),
      ]);

      this.ecs.removeComponents(entity, [IntendsToTravelComponent]);

      location.locationId = `Travelling by ${intendsToTravel.mode}`;
    }
  }
}
