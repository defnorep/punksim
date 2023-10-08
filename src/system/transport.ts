import { Component, System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";
import { Citizen } from "./citizens";
import { FlowingTime } from "./time";

export class TransportDispatchSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const travellers = entities.allOf(IntendsToTravel, Location);

    for (const [entity, components] of travellers.results()) {
      const intendsToTravel = components.get(IntendsToTravel);
      const location = components.get(Location);

      if (intendsToTravel.destinationId === location.id) {
        return;
      }

      this.ecs.addComponents(entity, [
        // time in minutes
        new Travelling(location.id, intendsToTravel.destinationId, 0.2 * 60000),
      ]);

      this.ecs.removeComponents(entity, [IntendsToTravel, Location]);
    }
  }
}

export class TransportTravellingSystem extends System {
  update(delta: number, entities: EntityContainer): void {
    const travellers = entities.allOf(Travelling);
    const time = this.ecs.getSingleton(FlowingTime);

    for (const [entity, components] of travellers.results()) {
      const travelling = components.get(Travelling);

      travelling.timeRemaining -= delta * time.rate;

      if (travelling.timeRemaining <= 0) {
        this.ecs.addComponents(entity, [
          new Location(travelling.destinationId),
        ]);

        this.ecs.removeComponents(entity, [Travelling]);
      }
    }
  }
}

export class TransportRandomIntentSystem extends System {
  update(delta: number, entities: EntityContainer): void {
    const citizens = entities.allOf(Citizen, Location);
    const travellers = entities.allOf(Travelling);

    for (const [entity, components] of citizens.results()) {
      const willTravel = Math.random() < 0.005;
      const location = components.get(Location);

      if (
        travellers.results().length < 3 &&
        location.id === "origin-1" &&
        willTravel
      ) {
        this.ecs.addComponents(entity, [new IntendsToTravel("destination-1")]);
      }
    }
  }
}

export type LocationId = string;

export class IntendsToTravel extends Component {
  constructor(public destinationId: LocationId) {
    super();
  }
}

export class Travelling extends Component {
  constructor(
    public originId: LocationId,
    public destinationId: LocationId,
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
