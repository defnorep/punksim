import { CitizensCensus, CitizensDetail } from "../../templates/citizens";
import { Time } from "../../templates/global";
import { System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";
import { Citizen, deriveCensus } from "./citizens";
import { SocketConnection } from "./net";
import { FlowingTime } from "./time";

/**
 * Broadcasts the current time to all connected clients.
 */
export class TimeUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const time = this.ecs.getSingleton(FlowingTime);
    const connections = entities.allOf(SocketConnection).results();

    if (time) {
      for (const [_entity, components] of connections) {
        components
          .get(SocketConnection)
          .socket.send(<Time datetime={time.datetime} />);
      }
    }
  }
}

/**
 * Broadcasts the current census to all connected clients.
 */
export class CensusUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const citizens = entities
      .allOf(Citizen)
      .results()
      .map(([_, c]) => c.get(Citizen));

    const connections = entities.allOf(SocketConnection).results();

    for (const [_entity, components] of connections) {
      components
        .get(SocketConnection)
        .socket.send(<CitizensCensus census={deriveCensus(citizens)} />);
    }
  }
}

/**
 * Broadcasts the current citizen details to all connected clients.
 */
export class CitizensUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const citizens = entities
      .allOf(Citizen)
      .results()
      .map(([_, c]) => c.get(Citizen));

    const connections = entities.allOf(SocketConnection).results();

    for (const [_entity, components] of connections) {
      components
        .get(SocketConnection)
        .socket.send(<CitizensDetail citizens={citizens} />);
    }
  }
}
