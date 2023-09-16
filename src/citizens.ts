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

export interface Citizen {
  height: number;
  id: string;
  name: string;
  surname: string;
  species: Species;
  status: Status;
  weight: number;
}

export const killCitizen = (state: State, id: string) => {
  const citizen = state.getCitizen(id);
  if (citizen) {
    citizen.status = Status.Deceased;
  }
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
