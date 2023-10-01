import { Component, Entity, System } from "../ecs";

/**
 * The TransportSystem is responsible for moving entities around.
 *
 * An entity (probably a Citizen) can signal their intent to travel, including the destination.
 * If the user is in the right place to begin travel, then the system will determine how long
 * it would take for them to travel and put them in travel status for that amount of time.
 * When the time is up, the system will move the entity to the destination and reset any travel markers.
 */
export class TransportSystem extends System {
  update(delta: number, entities: Entity[]): void {
    throw new Error("Method not implemented.");
  }
}

export type LocationId = string;

export class IntendsToTravel extends Component {
  constructor(public destination: LocationId) {
    super();
  }
}

export class Location extends Component {
  constructor(public id: LocationId) {
    super();
  }
}
