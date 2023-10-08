import { Component, Ecs, System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";
import { Citizen } from "./population";
import { FlowingTime } from "./time";

export class TransportDispatchSystem extends System {
  constructor(
    ecs: Ecs,
    private network: TransportNetwork,
  ) {
    super(ecs);
  }

  update(_delta: number, entities: EntityContainer): void {
    const travellers = entities.allOf(IntendsToTravel, Location);

    for (const [entity, components] of travellers.results()) {
      const intendsToTravel = components.get(IntendsToTravel);
      const location = components.get(Location);

      if (intendsToTravel.destinationId === location.id) {
        return;
      }

      const path = this.network.findPath(
        location.id,
        intendsToTravel.destinationId,
      );

      const distance = path.reduce(
        (total, edge) => (total += edge.distance),
        0,
      );

      this.ecs.addComponents(entity, [
        // time in minutes
        new Travelling(
          location.id,
          intendsToTravel.destinationId,
          distance,
          distance,
          intendsToTravel.mode,
        ),
      ]);

      this.ecs.removeComponents(entity, [IntendsToTravel, Location]);
    }
  }
}

export class TransportTravellingSystem extends System {
  speeds: Map<TransportMode, number>;
  constructor(ecs: Ecs) {
    super(ecs);
    this.speeds = new Map();
    this.speeds.set(TransportMode.Road, 50);
  }

  update(delta: number, entities: EntityContainer): void {
    const travellers = entities.allOf(Travelling);
    const time = this.ecs.getSingleton(FlowingTime);

    for (const [entity, components] of travellers.results()) {
      const travelling = components.get(Travelling);
      const speed = this.speeds.get(travelling.mode);

      if (!speed) {
        return;
      }

      // the amount of time that has passed multiplied by the speed of the transportation mode.
      // distanceRemaining is in meters
      // delta * time.rate == milliseconds
      // speed = kilometers per hour by default, so get meters per millisecond
      travelling.distanceRemaining -=
        delta * time.rate * ((speed * 1000) / 60 / 60 / 1000);
      if (travelling.distanceRemaining <= 0) {
        this.ecs.addComponents(entity, [
          new Location(travelling.destinationId),
        ]);

        this.ecs.removeComponents(entity, [Travelling]);
      }
    }
  }
}

export class RandomTravelIntentSystem extends System {
  update(delta: number, entities: EntityContainer): void {
    const citizens = entities.allOf(Citizen, Location);

    for (const [entity, components] of citizens.results()) {
      const willTravel = Math.random() < 0.01;
      const location = components.get(Location);

      if (location.id === "Residence-1" && willTravel) {
        this.ecs.addComponents(entity, [
          new IntendsToTravel("Work-1", TransportMode.Road),
        ]);
      }
    }
  }
}

export type LocationId = string;

export class IntendsToTravel extends Component {
  constructor(
    public destinationId: LocationId,
    public mode: TransportMode,
  ) {
    super();
  }
}

export class Travelling extends Component {
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

export class Location extends Component {
  constructor(public id: LocationId) {
    super();
  }
}

export type Meters = number;

export class TransportNetwork {
  private nodes: Map<string, TransportNode> = new Map();
  private edges: Set<TransportEdge> = new Set();

  static fromObject(object: any): TransportNetwork {
    const network = new TransportNetwork();

    for (const node in object.nodes) {
      network.addNode({
        label: node,
      });
    }

    for (const edge of object.edges) {
      network.addEdge({
        source: edge.source,
        target: edge.target,
        mode: edge.relation as TransportMode,
        directed: edge.directed,
        distance: edge.metadata.distance,
      });
    }

    return network;
  }

  public addNode(node: TransportNode): void {
    this.nodes.set(node.label, node);
  }

  public addEdge(edge: TransportEdge): void {
    this.edges.add(edge);
  }

  public findPath(
    origin: LocationId,
    destination: LocationId,
  ): TransportEdge[] {
    const edge = Array.from(this.edges.values()).find((edge) => {
      return edge.source === origin && edge.target === destination;
    });

    return edge ? [edge] : [];
  }
}

enum TransportMode {
  Road = "Road",
}

export interface TransportNode {
  label: string;
}
export interface TransportEdge {
  source: LocationId;
  target: LocationId;
  mode: TransportMode;
  directed: boolean;
  distance: Meters;
}
