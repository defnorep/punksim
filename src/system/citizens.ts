import { randomBytes, randomInt } from "crypto";
import names from "../../data/names.json";
import { Ecs, System } from "../ecs";
import { FlowingTime } from "./time";

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
  kind: "citizen";
  age: number;
  birthdate: Date;
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

export class CensusSystem extends System {
  update(delta: number, entities: string[]): void {
    throw new Error("Method not implemented.");
  }
}

export class CitizensAgeSystem extends System {
  update(_delta: number, entities: string[]): void {
    const time = entities
      .map((entity) =>
        this.ecs
          .getComponents(entity)
          .find(
            (component): component is FlowingTime => component.kind === "time",
          ),
      )
      .filter((time): time is FlowingTime => time !== undefined)
      .at(0);

    const citizens = entities
      .map((entity) => this.ecs.getComponents(entity))
      .filter((components) =>
        components.some((component) => component.kind === "citizen"),
      );

    citizens.forEach((citizen) => {
      const citizenComponent = citizen.find(
        (component): component is Citizen => component.kind === "citizen",
      );

      if (citizenComponent && time) {
        citizenComponent.age = age(citizenComponent.birthdate, time.datetime);
      }
    });
  }
}

// @todo Candidate for Startup System
export class CitizensPopulator extends System {
  constructor(ecs: Ecs, date: Date, citizens: Citizen[]) {
    super(ecs);

    citizens.forEach((citizen) => {
      this.ecs.createEntity([citizen]);
    });
  }

  update(delta: number, entities: string[]): void {}
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

export const generateCitizen = (
  referenceDate: Date,
  ageJitter: number = 0,
): Citizen => {
  const isAndroid = Math.random() > 0.7;
  const species = isAndroid ? Species.Android : Species.Human;
  const names = generateCitizenName(species);
  const birthdate = new Date();
  birthdate.setFullYear(
    referenceDate.getFullYear() - Math.round(Math.random() * ageJitter),
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
    age: age(birthdate, referenceDate),
    birthdate,
    height: randomInt(150, 190),
    id: randomBytes(4).toString("hex"),
    kind: "citizen",
    name: names[0],
    gender,
    species,
    status: Status.Living,
    surname: names[1],
    weight: randomInt(60, 90),
  };
};

export const age = (birthdate: Date, reference: Date) => {
  return reference.getFullYear() - new Date(birthdate).getFullYear();
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
