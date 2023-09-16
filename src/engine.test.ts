import { test } from "bun:test";
import { Engine } from "./engine";
import { State } from "./state";

test("engine ticks", (done) => {
  const tickInterval = 0;
  const tickCallback = () => {
    done();
  };

  new Engine(State.empty(), tickCallback, tickInterval);
});
