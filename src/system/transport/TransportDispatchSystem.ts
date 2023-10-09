import { Ecs, System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import {
  IntendsToTravelComponent,
  LocationComponent,
  TravellingComponent,
} from "../transport";
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

      if (intendsToTravel.destinationId === location.id) {
        return;
      }

      const path = this.network.findPath(
        location.id,
        intendsToTravel.destinationId,
      );

      const distance = path.reduce(
        (total, edge) => (total += edge.distance),
        0,
      );

      this.ecs.addComponents(entity, [
        new TravellingComponent(
          location.id,
          intendsToTravel.destinationId,
          distance,
          distance,
          intendsToTravel.mode,
        ),
      ]);

      this.ecs.removeComponents(entity, [IntendsToTravelComponent]);

      location.id = `Travelling by ${intendsToTravel.mode}`;
    }
  }
}
