import { Population } from "../../../templates/population";
import { System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { SocketConnectionComponent } from "../net";
import {
  CitizenArchetype,
  CivicIdentityComponent,
  EpochComponent,
  GenderComponent,
  LifeformClassificationComponent,
  PhysicalComponent,
} from "../population";
import { LocationComponent } from "../transport";

/**
 * Broadcasts the current citizen details to all connected clients.
 */

export class CitizensUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const citizens = entities
      // we could shorten this with an archetype selector that can reference components by name in an array,
      // e.g., export type CitizenArchetype = [ components ]
      .allOf(
        CivicIdentityComponent,
        PhysicalComponent,
        LifeformClassificationComponent,
        GenderComponent,
        LocationComponent,
        EpochComponent,
      )
      .results()
      .map(
        ([_, c]): CitizenArchetype => [
          c.get(CivicIdentityComponent),
          c.get(EpochComponent),
          c.get(PhysicalComponent),
          c.get(LifeformClassificationComponent),
          c.get(GenderComponent),
          c.get(LocationComponent),
        ],
      );

    const connections = entities.allOf(SocketConnectionComponent).results();

    for (const [_entity, components] of connections) {
      components
        .get(SocketConnectionComponent)
        .socket.send(<Population citizens={citizens} />);
    }
  }
}
