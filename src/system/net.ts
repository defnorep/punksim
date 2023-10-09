import { ServerWebSocket } from "bun";
import { Component } from "../ecs";

export class SocketConnectionComponent extends Component {
  constructor(public socket: ServerWebSocket<unknown>) {
    super();
  }
}
