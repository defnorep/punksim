import { expect, test } from "bun:test";
import { Species, Status, generateCitizenName, killCitizen } from "./citizens";
import { State } from "./state";

test("can kill citizen", () => {
  const name = "Test Citizen";
  const state = State.empty();

  state.addCitizen({
    status: Status.Active,
    height: 0,
    id: name,
    name,
    species: Species.Android,
    weight: 0,
  });

  killCitizen(state, name);

  const citizen = state.getCitizen(name);

  expect(citizen).toBeTruthy();
  expect(citizen?.status).toBe(Status.Deceased);
});

test("can generate first and last names", () => {
  const humanName = generateCitizenName(Species.Human);
  const androidName = generateCitizenName(Species.Android);

  expect(humanName[0]).toBeString();
  expect(humanName[1]).toBeString();

  expect(androidName[0]).toBeString();
  expect(androidName[1]).toBeString();
});
