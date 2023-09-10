import { expect, test } from "bun:test";
import { State } from "./state";
import { Citizen, Species } from "./citizens";

test("empty state returns 0 population", () => {
  const state = State.empty();

  expect(state.population()).toBe(0);
});

test("base state returns 20 population", () => {
  const state = State.seed();

  expect(state.population()).toBe(20);
});

test("adds and retrieves citizens", () => {
  const state = State.empty();

  state.addCitizen({
    alive: true,
    height: 1,
    id: "123",
    name: "456",
    species: Species.Human,
    weight: 1,
  });

  const citizens = state.getCitizens();
  const citizen = state.getCitizen("123");

  expect(citizens.length).toBe(1);
  expect(citizens[0].id).toBe("123");
  expect(citizen).toBeTruthy();
});

test("sets and retrieves citizens", () => {
  const state = State.empty();
  const citizens = new Map<string, Citizen>();

  citizens.set("123", {
    alive: false,
    height: 0,
    id: "123",
    name: "",
    species: Species.Android,
    weight: 0,
  });
  state.setCitizens(citizens);

  expect(state.population()).toBe(1);
});
