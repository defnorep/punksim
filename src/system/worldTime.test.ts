import { expect, test } from "bun:test";
import { worldTimeSystem } from "./worldTime";
import { State } from "../state";

test("world time updates with each tick", () => {
  const state = State.empty();
  state.worldTimeState = {
    time: 0,
  };

  worldTimeSystem(1000, state);

  expect(state.worldTimeState.time).toBe(1000);
});
