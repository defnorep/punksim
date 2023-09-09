import { expect, test } from "bun:test";
import { newState } from "./sim";
import {
  addressCitizen,
  birthCitizen,
  citizenAgeSystem,
  killCitizen,
} from "./citizens";

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

test("citizen age system increases age by 1", () => {
  const name = "Test Citizen";
  const state = newState();

  birthCitizen(state, name);
  citizenAgeSystem(state);

  const citizen = addressCitizen(state, name);

  expect(citizen?.ageDays).toBe(1);
});

test("citizen age system does not age dead citizens", () => {
  const name = "Test Citizen";
  const state = newState();

  birthCitizen(state, name);
  killCitizen(state, name);
  citizenAgeSystem(state);

  const citizen = addressCitizen(state, name);

  expect(citizen?.ageDays).toBe(0);
});
