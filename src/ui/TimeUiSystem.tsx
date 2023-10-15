import { EntityContainer } from "../ecs/EntityContainer";
import { System } from "../ecs/ecs";
import { SocketConnectionComponent } from "../net/net";
import { TimeComponent } from "../time/time";
import { Time } from "./templates/time";

/**
 * Broadcasts the current time to all connected clients.
 */

export class TimeUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const time = this.ecs.getSingleton(TimeComponent);
    const connections = entities.allOf(SocketConnectionComponent).results();

    if (time) {
      for (const [_entity, components] of connections) {
        components
          .get(SocketConnectionComponent)
          .socket.send(<Time datetime={time.datetime} />);
      }
    }
  }
}
