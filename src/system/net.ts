import { ServerWebSocket } from "bun";
import { Component, Entity, System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";

/**
 * The NetSystem is responsible for managing the network connection.
 */
export class NetStartupSystem extends System {
  update(_delta: number, _entities: EntityContainer): void {
    Bun.serve<WebSocketData>({
      port: 3001,
      fetch: (req, server) => {
        console.log(`Client connecting`);
        if (
          server.upgrade(req, {
            data: {
              entity: this.ecs.createEntity(),
            },
          })
        ) {
          return;
        }

        return new Response("Upgrade failed.", { status: 250 });
      },
      websocket: {
        open: (ws) => {
          console.log(`Client connected: `, ws.remoteAddress);
          this.ecs.addComponents(ws.data.entity, [new SocketConnection(ws)]);
        },
        // Bun requires this method to be implemented
        // even though we aren't receiving any messages right now.
        message() {},
        close: (ws) => {
          console.log(`Client disconnected: `, ws.remoteAddress);
          this.ecs.destroyEntity(ws.data.entity);
        },
      },
    });
  }
}

export class SocketConnection extends Component {
  constructor(public socket: ServerWebSocket<unknown>) {
    super();
  }
}

interface WebSocketData {
  entity: Entity;
}
