import { Population, PopulationCensus } from "../../templates/population";
import { Time } from "../../templates/time";
import { Travellers } from "../../templates/transport";
import { System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";
import { SocketConnection } from "./net";
import { Citizen, deriveCensus } from "./population";
import { FlowingTime } from "./time";
import { Location, Travelling } from "./transport";

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
        .socket.send(<PopulationCensus census={deriveCensus(citizens)} />);
    }
  }
}

/**
 * Broadcasts the current citizen details to all connected clients.
 */
export class CitizensUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const citizens = entities
      .allOf(Citizen, Location)
      .results()
      .map(([_, c]) => ({
        citizen: c.get(Citizen),
        location: c.get(Location),
      }));

    const connections = entities.allOf(SocketConnection).results();

    for (const [_entity, components] of connections) {
      components
        .get(SocketConnection)
        .socket.send(<Population citizens={citizens} />);
    }
  }
}

/**
 * Broadcasts the current traveller details to all connected clients.
 */
export class TravellerUiSystem extends System {
  update(delta: number, entities: EntityContainer): void {
    const travellers = entities
      .allOf(Citizen, Travelling)
      .results()
      .map(([_, c]) => ({ ...c.get(Citizen), ...c.get(Travelling) }));

    const connections = entities.allOf(SocketConnection).results();

    for (const [_entity, components] of connections) {
      components
        .get(SocketConnection)
        .socket.send(<Travellers travellers={travellers} />);
    }
  }
}
