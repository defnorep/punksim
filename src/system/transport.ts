import { Component, System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";

/**
 * The TransportSystem is responsible for moving entities around.
 *
 * An entity (probably a Citizen) can signal their intent to travel, including the destination.
 * If the user is in the right place to begin travel, then the system will determine how long
 * it would take for them to travel and put them in travel status for that amount of time.
 * When the time is up, the system will move the entity to the destination and reset any travel markers.
 */
export class TransportSystem extends System {
  update(delta: number, entities: EntityContainer): void {
    /**
     * Here are the basic steps. We may split this up into multiple systems.
     *
     * 1. Select Entities that have both IntendsToTravel and Location components.
     * 2. Create a Travelling component on each Entity using data from IntendsToTravel, Location,
     *    and our own location graph knowledge such as distance. Remove the IntendsToTravel and Location components.
     * 3. On each update, Select Entities that are Travelling, and reduce the timeRemaining proeprty by the delta value.
     * 4. When the Entity has arrived, update the Location component to the new location and remove Travelling.
     */
    const travellers = entities.allOf(IntendsToTravel, Location);
    for (const [_entity, components] of travellers.results()) {
      const _intendsToTravel = components.get(IntendsToTravel);
      const _location = components.get(Location);
    }
  }
}

export type LocationId = string;

export class IntendsToTravel extends Component {
  constructor(public destination: LocationId) {
    super();
  }
}

export class Travelling extends Component {
  constructor(
    public origin: LocationId,
    public destination: LocationId,
    public timeRemaining: number,
  ) {
    super();
  }
}

export class Location extends Component {
  constructor(public id: LocationId) {
    super();
  }
}
