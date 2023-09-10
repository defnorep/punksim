import { expect, test } from "bun:test";
import { Species, generateName, killCitizen } from "./citizens";
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

test("can generate first and last names", () => {
  const name = generateName();

  expect(name[0]).toBeString();
  expect(name[1]).toBeString();
});
