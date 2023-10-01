import { Server, ServerWebSocket } from "bun";
import { Ecs, Entity, System } from "../ecs";

export interface SocketConnection {
  kind: "socket";
  socket: ServerWebSocket<unknown>;
}

interface WebSocketData {
  entity: Entity;
}

export class NetSystem extends System {
  server: Server;

  constructor(ecs: Ecs) {
    super(ecs);
    this.server = Bun.serve<WebSocketData>({
      port: 3001,
      fetch(req, server) {
        console.log(`Client connecting`);
        if (
          server.upgrade(req, {
            data: {
              entity: ecs.createEntity([]),
            },
          })
        ) {
          return;
        }

        return new Response("Upgrade failed.", { status: 250 });
      },
      websocket: {
        open(ws) {
          console.log(`Client connected: `, ws.remoteAddress);
          const conn = { kind: "socket", socket: ws };
          ecs.addComponents(ws.data.entity, [conn]);
        },
        // Bun requires this method to be implemented
        // even though we aren't receiving any messages right now.
        message() {},
        close(ws) {
          console.log(`Client disconnected: `, ws.remoteAddress);
          ecs.destroyEntity(ws.data.entity);
        },
      },
    });
  }

  update(_delta: number, entities: string[]): void {}
}
