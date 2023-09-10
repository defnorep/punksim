import { Engine } from "./engine";
import { State } from "./state";

new Engine(State.base(), (state: State) => {
  postMessage({ cmd: "update", state });
});
