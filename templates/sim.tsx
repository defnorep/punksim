import { Layout } from "./layout";
import { Citizens } from "./citizens";
import { State } from "../src/state";

export const Sim = (props: { state: State }) => (
  <Layout title="Cyberpunk City Simulator">
    <div hx-ext="ws" ws-connect="ws://localhost:3001">
      <Citizens citizens={props.state.getCitizens()} />
    </div>
  </Layout>
);
