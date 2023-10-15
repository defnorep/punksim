import { EntityContainer } from "../ecs/EntityContainer";
import { System } from "../ecs/ecs";
import { SocketConnectionComponent } from "../net/net";
import { CensusComponent } from "../population/population";
import { PopulationCensus } from "./templates/population";

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
