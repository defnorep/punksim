import { expect, test } from "bun:test";
import {
  Citizen,
  Gender,
  Species,
  Status,
  age,
  deriveCensus,
  generateCitizenName,
} from "./citizens";

test("can generate first and last names", () => {
  const humanName = generateCitizenName(Species.Human);
  const androidName = generateCitizenName(Species.Android);

  expect(humanName[0]).toBeString();
  expect(humanName[1]).toBeString();

  expect(androidName[0]).toBeString();
  expect(androidName[1]).toBeString();
});

test("can determine age", () => {
  const today = new Date();
  const birthdate = new Date().setFullYear(today.getFullYear() - 10);

  expect(age(birthdate)).toBe(10);
});

test("can derive census from list of citizens", () => {
  const citizens: Citizen[] = [];
  let census = deriveCensus(citizens);

  expect(census.population.total).toBe(0);

  citizens.push({
    birthdate: 0,
    height: 0,
    id: "",
    name: "",
    gender: Gender.Male,
    species: Species.Android,
    status: Status.Living,
    surname: "",
    weight: 0,
  });

  census = deriveCensus(citizens);

  expect(census.population.total).toBe(1);
  expect(census.population.android).toBe(1);
  expect(census.population.human).toBe(0);
  expect(census.population.male).toBe(1);
  expect(census.population.female).toBe(0);
  expect(census.population.noGender).toBe(0);
});
