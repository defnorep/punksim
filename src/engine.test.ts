import { expect, test } from "bun:test";
import { Engine } from "./engine";
import { State } from "./state";

test("engine provides time delta to systems", (done) => {
  const tickInterval = 0;
  const tickCallback = () => {
    done();
  };

  const timeOptions = {
    initialTime: 0,
    rate: 500,
  };

  const timeTestingSystem = (delta: number, _state: State) => {
    expect(delta).toBe(500);
  };

  new Engine(
    State.empty(),
    [timeTestingSystem],
    tickCallback,
    tickInterval,
    timeOptions,
  );
});
