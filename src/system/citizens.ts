import { randomBytes, randomInt } from "crypto";
import names from "../../data/names.json";
import { Component, Ecs, System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";
import { FlowingTime } from "./time";
import { Location } from "./transport";

/**
 * The CitizensAgeSystem is responsible for aging citizens.
 */
export class CitizensAgeSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const time = this.ecs.getSingleton(FlowingTime);

    if (!time) {
      return;
    }

    for (const [_entity, components] of entities.allOf(Citizen).results()) {
      if (components.has(Citizen)) {
        const citizen = components.get(Citizen);
        citizen.age = age(citizen.birthdate, time.datetime);
      }
    }
  }
}

/**
 * The CitizensPopulator is responsible for creating the initial set of citizens.
 */
export class StartupCitizenPopulatorSystem extends System {
  constructor(
    ecs: Ecs,
    private citizens: [Citizen, Location][],
  ) {
    super(ecs);
  }

  update(_delta: number, _entities: EntityContainer): void {
    this.citizens.forEach((citizen) => {
      this.ecs.createEntity(...citizen);
    });
  }
}

export class Citizen extends Component {
  constructor(
    public age: number,
    public birthdate: Date,
    public height: number,
    public id: string,
    public name: string,
    public gender: Gender,
    public species: Species,
    public status: Status,
    public surname: string,
    public weight: number,
  ) {
    super();
  }
}

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

export const deriveCensus = (citizens: Citizen[]): Census => {
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
): [Citizen, Location] => {
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

  return [
    new Citizen(
      age(birthdate, referenceDate),
      birthdate,
      randomInt(150, 190),
      randomBytes(4).toString("hex"),
      names[0],
      gender,
      species,
      Status.Living,
      names[1],
      randomInt(60, 90),
    ),
    new Location("origin-1"),
  ];
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
