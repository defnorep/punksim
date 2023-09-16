import { expect, test } from "bun:test";
import { Species, age, generateCitizenName } from "./citizens";

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
