import { randomInt, randomBytes } from "crypto";
import { State } from "../state";
import { System } from "../system";
import names from "../../data/names.json";

export enum Species {
  Android = "Android",
  Human = "Human",
}

export enum Status {
  Living = "Living",
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

export interface Census {
  population: {
    total: number;
    human: number;
    android: number;
    male: number;
    female: number;
    noGender: number;
  };
}

export interface CitizensState {
  kind: "citizens";
  census: Census;
  citizens: Citizen[];
}

export class CitizensSystem implements System {
  constructor(private local: Citizen[] = []) {}

  tick(_delta: number, _global: State[]): CitizensState {
    return {
      kind: "citizens",
      census: deriveCensus(this.local),
      citizens: this.local,
    };
  }
}

export const deriveCensus = (citizens: Citizen[]) => {
  return {
    population: citizens.reduce(
      (population, citizen) => {
        population.total++;

        switch (citizen.species) {
          case Species.Human:
            population.human++;
            break;
          case Species.Android:
            population.android++;
            break;
        }

        switch (citizen.gender) {
          case Gender.Male:
            population.male++;
            break;
          case Gender.Female:
            population.female++;
            break;
          case Gender.None:
            population.noGender++;
            break;
        }

        return population;
      },
      { total: 0, human: 0, android: 0, male: 0, female: 0, noGender: 0 },
    ),
  };
};

export const generateCitizen = (ageJitter: number = 0): Citizen => {
  const now = new Date();
  const isAndroid = Math.random() > 0.7;
  const species = isAndroid ? Species.Android : Species.Human;
  const names = generateCitizenName(species);
  const birthdate = new Date().setFullYear(
    now.getFullYear() - Math.round(Math.random() * ageJitter),
  );

  const genderRoll = randomInt(0, 3);
  let gender = Gender.None;
  if (genderRoll > 0) {
    gender = Gender.Male;
    if (genderRoll > 1) {
      gender = Gender.Female;
    }
  }

  return {
    birthdate,
    height: randomInt(150, 190),
    id: randomBytes(4).toString("hex"),
    name: names[0],
    gender,
    species,
    status: Status.Living,
    surname: names[1],
    weight: randomInt(60, 90),
  };
};

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
