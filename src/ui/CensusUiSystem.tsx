import { PopulationCensus } from "../../templates/population";
import { System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";
import { SocketConnectionComponent } from "../net";
import { CensusComponent } from "../population";

/**
 * Broadcasts the current census to all connected clients.
 */
export class CensusUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const census = this.ecs.getSingleton(CensusComponent);
    const connections = entities.allOf(SocketConnectionComponent).results();

    for (const [_entity, components] of connections) {
      components
        .get(SocketConnectionComponent)
        .socket.send(<PopulationCensus census={census} />);
    }
  }
}
