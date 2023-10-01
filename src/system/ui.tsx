import { HtmlEscapedString } from "hono/utils/html";
import { CitizensCensus, CitizensDetail } from "../../templates/citizens";
import { Time } from "../../templates/global";
import { Ecs, Entity, System } from "../ecs";
import { Citizen, deriveCensus } from "./citizens";
import { SocketConnection } from "./net";
import { FlowingTime } from "./time";

/**
 * Broadcasts the current time to all connected clients.
 */
export class TimeUiSystem extends System {
  update(_delta: number, entities: Entity[]): void {
    const entity = entities.find((entity) =>
      this.ecs.getComponents(entity).has(FlowingTime),
    );

    if (entity) {
      const time = this.ecs.getComponents(entity).get(FlowingTime);

      if (time) {
        broadcast(this.ecs, <Time datetime={time.datetime} />);
      }
    }
  }
}

/**
 * Broadcasts the current census to all connected clients.
 */
export class CensusUiSystem extends System {
  update(_delta: number, entities: Entity[]): void {
    const citizens = this.ecs.reduceToComponent(Citizen);

    broadcast(this.ecs, <CitizensCensus census={deriveCensus(citizens)} />);
  }
}

/**
 * Broadcasts the current citizen details to all connected clients.
 */
export class CitizensUiSystem extends System {
  update(_delta: number, entities: Entity[]): void {
    const citizens = this.ecs.reduceToComponent(Citizen);

    broadcast(this.ecs, <CitizensDetail citizens={citizens} />);
  }
}

const broadcast = (ecs: Ecs, message: HtmlEscapedString) => {
  for (const connection of ecs.reduceToComponent(SocketConnection)) {
    connection.socket.send(message);
  }
};
