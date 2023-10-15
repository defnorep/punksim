import { Component } from "../ecs/ecs";
import { Meters } from "../global";

export type LocationId = string;

export enum TransportMode {
  Road = "Road",
}

export class IntendsToTravelComponent extends Component {
  constructor(
    public destinationId: LocationId,
    public mode: TransportMode,
  ) {
    super();
  }
}

export class TravellingComponent extends Component {
  constructor(
    public originId: LocationId,
    public destinationId: LocationId,
    public distance: Meters,
    public distanceRemaining: Meters = 0,
    public mode: TransportMode,
  ) {
    super();
  }
}
export class LocationComponent extends Component {
  constructor(public locationId: LocationId) {
    super();
  }
}
