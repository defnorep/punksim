import { Engine } from "./engine";
import { State } from "./state";

new Engine(State.seed(), (state: State) => {
  postMessage({ cmd: "update", state });
});
