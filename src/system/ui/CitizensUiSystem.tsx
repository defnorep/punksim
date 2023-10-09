import { Population } from "../../../templates/population";
import { System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { SocketConnectionComponent } from "../net";
import { CitizenComponent } from "../population";
import { LocationComponent } from "../transport";

/**
 * Broadcasts the current citizen details to all connected clients.
 */

export class CitizensUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const citizens = entities
      .allOf(CitizenComponent, LocationComponent)
      .results()
      .map(([_, c]) => ({
        citizen: c.get(CitizenComponent),
        location: c.get(LocationComponent),
      }));

    const connections = entities.allOf(SocketConnectionComponent).results();

    for (const [_entity, components] of connections) {
      components
        .get(SocketConnectionComponent)
        .socket.send(<Population citizens={citizens} />);
    }
  }
}
