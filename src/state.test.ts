import { expect, test } from "bun:test";
import { State } from "./state";
import { Citizen, Species, Status, generateCitizen } from "./citizens";
import seed from "../data/seed.json";

test("empty state returns 0 population", () => {
  const state = State.empty();

  expect(state.population()).toBe(0);
});

test("base state returns 20 population", () => {
  const state = State.seed();

  expect(state.population()).toBe(seed.base.citizens);
});

test("adds and retrieves citizens", () => {
  const state = State.empty();

  const citizen = generateCitizen();

  state.addCitizen(citizen);

  const citizens = state.getCitizens();
  const c123 = state.getCitizen(citizen.id);

  expect(citizens.length).toBe(1);
  expect(citizens[0].id).toBe(citizen.id);
  expect(citizen).toBeTruthy();
});

test("sets and retrieves citizens", () => {
  const state = State.empty();
  const citizens = new Map<string, Citizen>();

  const citizen = generateCitizen();

  citizens.set(citizen.id, citizen);
  state.setCitizens(citizens);

  expect(state.population()).toBe(1);
});
