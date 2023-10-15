import { EntityContainer } from "../ecs/EntityContainer";
import { System } from "../ecs/ecs";
import { SocketConnectionComponent } from "../net/net";
import {
  CivicIdentityComponent,
  EpochComponent,
  GenderComponent,
  ImplantsComponent,
  LifeformClassificationComponent,
  PhysicalComponent,
} from "../population/population";
import { LocationComponent } from "../transport/transport";
import { Population } from "./templates/population";

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
        EpochComponent,
        LifeformClassificationComponent,
        GenderComponent,
        LocationComponent,
        ImplantsComponent,
      )
      .results()
      .map(
        ([_, c]): [
          CivicIdentityComponent,
          EpochComponent,
          PhysicalComponent,
          LifeformClassificationComponent,
          GenderComponent,
          LocationComponent,
          ImplantsComponent,
        ] => [
          c.get(CivicIdentityComponent),
          c.get(EpochComponent),
          c.get(PhysicalComponent),
          c.get(LifeformClassificationComponent),
          c.get(GenderComponent),
          c.get(LocationComponent),
          c.get(ImplantsComponent),
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
