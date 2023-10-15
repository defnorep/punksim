import { Meters } from "../global";
import { LocationId, TransportMode } from "./transport";

export class TransportNetwork {
  private nodes: Map<string, TransportNode> = new Map();
  private edges: Set<TransportEdge> = new Set();

  static fromObject(object: any): TransportNetwork {
    const network = new TransportNetwork();

    for (const node in object.nodes) {
      network.addNode({
        label: object.nodes[node].label,
        id: node,
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

  public getNodes() {
    return Array.from(this.nodes.entries());
  }

  public getEdges() {
    return Array.from(this.edges);
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
export interface TransportNode {
  label: string;
  id: string;
}
export interface TransportEdge {
  source: LocationId;
  target: LocationId;
  mode: TransportMode;
  directed: boolean;
  distance: Meters;
}
