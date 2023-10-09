import { Travellers } from "../../../templates/transport";
import { System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { SocketConnectionComponent } from "../net";
import { CitizenComponent } from "../population";
import { TravellingComponent } from "../transport";

/**
 * Broadcasts the current traveller details to all connected clients.
 */

export class TravellerUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const travellers = entities
      .allOf(CitizenComponent, TravellingComponent)
      .results()
      .map(([_, c]) => ({
        ...c.get(CitizenComponent),
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