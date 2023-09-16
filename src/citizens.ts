import { State } from "./state";
import names from "../data/names.json";
import { randomInt } from "crypto";

export enum Species {
  Android = "Android",
  Human = "Human",
}

export enum Status {
  Active = "Active",
  Deceased = "Deceased",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  None = "None",
}

export interface Citizen {
  birthdate: number; // epoch milliseconds
  height: number; // cm
  id: string;
  name: string;
  gender: Gender;
  species: Species;
  status: Status;
  surname: string;
  weight: number; // kg
}

export const age = (birthdate: number) => {
  return new Date().getFullYear() - new Date(birthdate).getFullYear();
};

export const generateCitizenName = (species: Species = Species.Human) => {
  switch (species) {
    case Species.Android:
      return generateAndroidName();
    case Species.Human:
    default:
      return generateHumanName();
  }
};

const generateHumanName = (): [string, string] => {
  return [
    names.human[Math.floor(Math.random() * names.human.length)],
    names.human[Math.floor(Math.random() * names.human.length)],
  ];
};

const generateAndroidName = (): [string, string] => {
  return [
    names.elements[Math.floor(Math.random() * names.elements.length)],
    randomInt(100, 999).toString(),
  ];
};
