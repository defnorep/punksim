import { ServerWebSocket } from "bun";
import { Entity, System } from "../ecs";

export interface SocketConnection {
  kind: "socket";
  socket: ServerWebSocket<unknown>;
}

interface WebSocketData {
  entity: Entity;
}

export class NetSystem extends System {
  update(_delta: number, _entities: Entity[]): void {
    Bun.serve<WebSocketData>({
      port: 3001,
      fetch: (req, server) => {
        console.log(`Client connecting`);
        if (
          server.upgrade(req, {
            data: {
              entity: this.ecs.createEntity([]),
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
          const conn = { kind: "socket", socket: ws };
          this.ecs.addComponents(ws.data.entity, [conn]);
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
