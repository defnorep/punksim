import { randomBytes, randomInt } from "crypto";
import names from "../../data/names.json";
import { Component } from "../ecs";
import { LocationComponent } from "./transport";

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

type Meters = number;
type Kilograms = number;
type Years = number;

export type CitizenIntersection = CivicIdentityComponent &
  EpochComponent &
  PhysicalComponent &
  LifeformClassificationComponent &
  GenderComponent &
  LocationComponent;

export type CitizenArchetype = [
  CivicIdentityComponent,
  EpochComponent,
  PhysicalComponent,
  LifeformClassificationComponent,
  GenderComponent,
  LocationComponent,
];

export class GenderComponent extends Component {
  constructor(public gender: Gender) {
    super();
  }
}

export class LifeformClassificationComponent extends Component {
  constructor(public species: Species) {
    super();
  }
}

export class PhysicalComponent extends Component {
  constructor(
    public dimensions: [Meters, Meters, Meters],
    public mass: Kilograms,
  ) {
    super();
  }
}

export class CivicIdentityComponent extends Component {
  constructor(
    public id: string,
    public name: string,
    public surname: string,
    public status: Status,
  ) {
    super();
  }
}

export class EpochComponent extends Component {
  constructor(
    public age: Years,
    public epoch: Date,
  ) {
    super();
  }
}

export const generateCitizen = (
  referenceDate: Date,
  ageJitter: number = 0,
): CitizenArchetype => {
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
    new CivicIdentityComponent(
      randomBytes(4).toString("hex"),
      names[0],
      names[1],
      Status.Living,
    ),
    new EpochComponent(age(birthdate, referenceDate), birthdate),
    new PhysicalComponent(
      [randomInt(150, 190) / 10, 0.6, 0.3],
      randomInt(60, 90),
    ),
    new LifeformClassificationComponent(species),
    new GenderComponent(gender),
    new LocationComponent("Residence-1"),
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

export class CensusComponent extends Component {
  constructor(
    public total: number,
    public human: number,
    public android: number,
    public male: number,
    public female: number,
    public noGender: number,
  ) {
    super();
  }
}
