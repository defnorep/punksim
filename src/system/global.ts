import { Component } from "../ecs";
import { LocationId } from "./transport";

export class LocationComponent extends Component {
  constructor(public id: LocationId) {
    super();
  }
}
export type Meters = number;
export type Kilograms = number;
export type Years = number;
