import { Component } from "../ecs/ecs";

export class TimeComponent extends Component {
  constructor(
    public datetime: Date,
    public rate: number,
  ) {
    super();
  }
}
