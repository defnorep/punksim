import { Layout } from "./layout";
import { Citizens } from "./citizens";
import { State } from "../src/sim";

export const Sim = (props: { state: State }) => (
  <Layout title="Cyberpunk City Simulator">
   <div hx-ext="ws" ws-connect="ws://localhost:3001">
    <Citizens state={props.state} />
   </div>
  </Layout>
);