import { Component } from "./ecs/ecs";
import { LocationId } from "./transport/transport";

export type Meters = number;
export type Kilograms = number;
export type Years = number;

export class LocationComponent extends Component {
  constructor(public locationId: LocationId) {
    super();
  }
}
