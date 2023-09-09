import { expect, test } from "bun:test";
import { Sim, baseStateSetup, newState } from "./sim";

test("new state", () => {
  const state = newState();
  expect(state.citizens.size).toBe(0);
});

test("base state setup", () => {
  const state = baseStateSetup();
  expect(state.citizens.size).toBe(3);
});

test("sim ticks", (done) => {
  const tickInterval = 0;
  const tickCallback = () => {
    done();
  };

  new Sim(newState, tickCallback, tickInterval);
});
