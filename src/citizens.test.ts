import { expect, test } from "bun:test";
import { newState } from "./sim";
import { addressCitizen, birthCitizen, killCitizen } from "./citizens";

test("can birth and address citizen", () => {
  const name = "Test Citizen";
  const state = newState();

  birthCitizen(state, name);

  expect(addressCitizen(state, name)).toBeTruthy();
});

test("can kill citizen", () => {
  const name = "Test Citizen";
  const state = newState();

  birthCitizen(state, name);
  killCitizen(state, name);

  const citizen = addressCitizen(state, name);

  expect(citizen).toBeTruthy();
  expect(citizen?.alive).toBe(false);
});
