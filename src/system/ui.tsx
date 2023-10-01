import { HtmlEscapedString } from "hono/utils/html";
import { CitizensCensus, CitizensDetail } from "../../templates/citizens";
import { Time } from "../../templates/global";
import { Ecs, Entity, System } from "../ecs";
import { Citizen, deriveCensus } from "./citizens";
import { SocketConnection } from "./net";
import { FlowingTime } from "./time";

export class TimeUi extends System {
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

export class CensusUi extends System {
  update(_delta: number, entities: Entity[]): void {
    const citizens = entities
      .map((entity) => this.ecs.getComponents(entity))
      .filter((components) => components.has(Citizen))
      .map((components) => components.get(Citizen));

    broadcast(this.ecs, <CitizensCensus census={deriveCensus(citizens)} />);
  }
}

export class CitizensUi extends System {
  update(_delta: number, entities: Entity[]): void {
    const citizens = entities
      .map((entity) => this.ecs.getComponents(entity))
      .filter((components) => components.has(Citizen))
      .map((components) => components.get(Citizen));

    broadcast(this.ecs, <CitizensDetail citizens={citizens} />);
  }
}

const broadcast = (ecs: Ecs, message: HtmlEscapedString) => {
  const connections = ecs
    .getEntities()
    .map((entity) => ecs.getComponents(entity))
    .filter((components) => components.has(SocketConnection))
    .map((components) => components.get(SocketConnection));

  for (const connection of connections) {
    connection.socket.send(message);
  }
};
