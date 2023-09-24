import { Layout } from "./layout";
import { CitizensCensus, CitizensDetail } from "./citizens";
import { State } from "../src/state";
import { deriveCensus } from "../src/citizens";

export const Sim = (props: { state: State }) => (
  <Layout title="Cyberpunk City Simulator">
    <div hx-ext="ws" ws-connect="ws://localhost:3001">
      <CitizensCensus census={deriveCensus(props.state.getCitizens())} />
      <CitizensDetail citizens={props.state.getCitizens()} />
    </div>
  </Layout>
);
