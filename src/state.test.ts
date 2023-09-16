import { expect, test } from "bun:test";
import { State } from "./state";
import { Citizen, Species, Status } from "./citizens";
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

  state.addCitizen({
    birthdate: Date.now(),
    height: 1,
    id: "123",
    name: "456",
    status: Status.Active,
    species: Species.Human,
    surname: "789",
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
    birthdate: Date.now(),
    height: 0,
    id: "123",
    name: "",
    species: Species.Android,
    surname: "",
    status: Status.Active,
    weight: 0,
  });
  state.setCitizens(citizens);

  expect(state.population()).toBe(1);
});
