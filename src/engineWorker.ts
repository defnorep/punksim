import { Engine } from "./engine";
import { State } from "./state";
import { worldTimeSystem } from "./system/worldTime";

new Engine(State.seed(), [worldTimeSystem], (state: State) => {
  postMessage({ cmd: "update", state });
});
