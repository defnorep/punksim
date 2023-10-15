import { Component } from "../ecs";
import { LocationId } from "./transport";

export type Meters = number;
export type Kilograms = number;
export type Years = number;

export class LocationComponent extends Component {
  constructor(public locationId: LocationId) {
    super();
  }
}
