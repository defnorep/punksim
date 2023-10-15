import { Component } from "./ecs";

export class TimeComponent extends Component {
  constructor(
    public datetime: Date,
    public rate: number,
  ) {
    super();
  }
}
