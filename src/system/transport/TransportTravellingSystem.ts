import { Ecs, System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { TimeComponent } from "../time";
import {
  LocationComponent,
  TransportMode,
  TravellingComponent,
} from "../transport";

export class TransportTravellingSystem extends System {
  constructor(
    ecs: Ecs,
    private speeds: Map<TransportMode, number>,
  ) {
    super(ecs);
  }

  update(delta: number, entities: EntityContainer): void {
    const travellers = entities.allOf(TravellingComponent);
    const time = this.ecs.getSingleton(TimeComponent);

    for (const [entity, components] of travellers.results()) {
      const travelling = components.get(TravellingComponent);
      const speed = this.speeds.get(travelling.mode);

      if (!speed) {
        return;
      }

      // the amount of time that has passed multiplied by the speed of the transportation mode.
      // distanceRemaining is in meters
      // delta * time.rate == milliseconds
      // speed = kilometers per hour by default, so get meters per millisecond
      travelling.distanceRemaining -=
        delta * time.rate * ((speed * 1000) / 60 / 60 / 1000);
      if (travelling.distanceRemaining <= 0) {
        this.ecs.addComponents(entity, [
          new LocationComponent(travelling.destinationId),
        ]);

        this.ecs.removeComponents(entity, [TravellingComponent]);
      }
    }
  }

  static deserializeModeSpeeds(object: any): Map<TransportMode, number> {
    const speeds = new Map();

    for (const mode in object) {
      speeds.set(mode as TransportMode, object[mode]);
    }

    return speeds;
  }
}
