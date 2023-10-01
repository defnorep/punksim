import { HtmlEscapedString } from "hono/utils/html";
import { CitizensCensus, CitizensDetail } from "../../templates/citizens";
import { Time } from "../../templates/global";
import { Ecs, Entity, System } from "../ecs";
import { Citizen, deriveCensus } from "./citizens";
import { SocketConnection } from "./net";
import { FlowingTime } from "./time";

export class TimeUi extends System {
  components = ["flowingtime"];
  update(_delta: number, entities: Entity[]): void {
    const entity = entities.at(0);

    if (entity) {
      const time = this.ecs
        .getComponents(entity)
        .find(
          (component): component is FlowingTime =>
            component.kind === "flowingtime",
        );

      if (time) {
        broadcast(this.ecs, <Time datetime={time.datetime} />);
      }
    }
  }
}

export class CensusUi extends System {
  components = ["citizen"];
  update(_delta: number, entities: Entity[]): void {
    const citizens = entities
      .map((entity) => this.ecs.getComponents(entity))
      .flat()
      .filter(
        (component): component is Citizen => component.kind === "citizen",
      );

    broadcast(this.ecs, <CitizensCensus census={deriveCensus(citizens)} />);
  }
}

export class CitizensUi extends System {
  components = ["citizen"];
  update(_delta: number, entities: Entity[]): void {
    const citizens = entities
      .map((entity) => this.ecs.getComponents(entity))
      .flat()
      .filter(
        (component): component is Citizen => component.kind === "citizen",
      );

    broadcast(this.ecs, <CitizensDetail citizens={citizens} />);
  }
}

const broadcast = (ecs: Ecs, message: HtmlEscapedString) => {
  const connections = ecs
    .getEntities()
    .map((entity) =>
      ecs
        .getComponents(entity)
        .find(
          (component): component is SocketConnection =>
            component.kind === "socket",
        ),
    )
    .filter(
      (connection): connection is SocketConnection => connection !== undefined,
    );

  for (const connection of connections) {
    connection.socket.send(message);
  }
};
