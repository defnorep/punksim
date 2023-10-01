import { HtmlEscapedString } from "hono/utils/html";
import { CitizensCensus, CitizensDetail } from "../../templates/citizens";
import { Time } from "../../templates/global";
import { Ecs, Entity, System } from "../ecs";
import { CitizenComponent, deriveCensus } from "./citizens";
import { SocketConnection } from "./net";
import { FlowingTime } from "./time";

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

export class TimeUi extends System {
  update(_delta: number, entities: string[]): void {
    const time = entities
      .map((entity) =>
        this.ecs
          .getComponents(entity)
          .find(
            (component): component is FlowingTime => component.kind === "time",
          ),
      )
      .filter((time): time is FlowingTime => time !== undefined)
      .at(0);

    if (time) {
      broadcast(this.ecs, <Time datetime={time.datetime} />);
    }
  }
}

export class CensusUi extends System {
  update(_delta: number, entities: Entity[]): void {
    const citizens = entities
      .map((entity) => {
        return this.ecs.getComponents(entity);
      })
      .filter((components): components is CitizenComponent[] =>
        components.some((component) => component.kind === "citizen"),
      )
      .flat();

    broadcast(this.ecs, <CitizensCensus census={deriveCensus(citizens)} />);
  }
}

export class CitizensUi extends System {
  update(_delta: number, entities: Entity[]): void {
    const citizens = entities
      .map((entity) => {
        return this.ecs.getComponents(entity);
      })
      .filter((components): components is CitizenComponent[] =>
        components.some((component) => component.kind === "citizen"),
      )
      .flat();

    broadcast(this.ecs, <CitizensDetail citizens={citizens} />);
  }
}
