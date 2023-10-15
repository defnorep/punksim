import { randomBytes } from "crypto";
import { TransportNetwork } from "../src/transport/TransportNetwork";

export const TransportNetworkGraph = (props: { network: TransportNetwork }) => {
  const networkJson = tpnToCyto(props.network);
  return (
    <div id="transport-network">
      <h1>Transport Network</h1>
      <div id="graph" style="display: none;">
        {networkJson}
      </div>
      <div
        id="render"
        style="width: 1200px; height: 400px; display: block"
      ></div>
      <script type="module" src="/public/transport-graph.js"></script>
    </div>
  );
};

const tpnToCyto = (tpn: TransportNetwork) => {
  const nodes = tpn.getNodes();
  const edges = tpn.getEdges();

  return JSON.stringify([
    ...nodes.map(([_string, node]) => ({
      data: { id: node.id, label: node.label },
    })),
    ...edges.map((e) => ({
      data: {
        id: randomBytes(8).toString("hex"),
        source: e.source,
        target: e.target,
        weight: e.distance,
      },
    })),
  ]);
};
