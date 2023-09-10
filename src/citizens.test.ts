import { expect, test } from "bun:test";
import { Species, killCitizen } from "./citizens";
import { State } from "./state";

test("can kill citizen", () => {
  const name = "Test Citizen";
  const state = State.empty();

  state.addCitizen({
    alive: false,
    height: 0,
    id: name,
    name,
    species: Species.Android,
    weight: 0,
  });

  killCitizen(state, name);

  const citizen = state.getCitizen(name);

  expect(citizen).toBeTruthy();
  expect(citizen?.alive).toBe(false);
});
