import { EntityContainer } from "../ecs/EntityContainer";
import { System } from "../ecs/ecs";
import { SocketConnectionComponent } from "../net/net";
import { CivicIdentityComponent } from "../population/population";
import { TravellingComponent } from "../transport/transport";
import { Travellers } from "./templates/transport";

/**
 * Broadcasts the current traveller details to all connected clients.
 */
export class TravellerUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const travellers = entities
      .allOf(CivicIdentityComponent, TravellingComponent)
      .results()
      .map(([_, c]) => ({
        ...c.get(CivicIdentityComponent),
        ...c.get(TravellingComponent),
      }));

    const connections = entities.allOf(SocketConnectionComponent).results();

    for (const [_entity, components] of connections) {
      components
        .get(SocketConnectionComponent)
        .socket.send(<Travellers travellers={travellers} />);
    }
  }
}
