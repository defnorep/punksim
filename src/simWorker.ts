import { Sim, State, baseStateSetup } from "./sim";

new Sim(baseStateSetup, (state: State) => {
  postMessage({ cmd: "update", state });
});
