import { Population, PopulationCensus } from "../../templates/population";
import { Time } from "../../templates/time";
import { Travellers } from "../../templates/transport";
import { System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";
import { SocketConnectionComponent } from "./net";
import { CitizenComponent, deriveCensus } from "./population";
import { TimeComponent } from "./time";
import { LocationComponent, TravellingComponent } from "./transport";

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

/**
 * Broadcasts the current census to all connected clients.
 */
export class CensusUiSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const citizens = entities
      .allOf(CitizenComponent)
      .results()
      .map(([_, c]) => c.get(CitizenComponent));

    const connections = entities.allOf(SocketConnectionComponent).results();

    for (const [_entity, components] of connections) {
      components
        .get(SocketConnectionComponent)
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
