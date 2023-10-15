import { Component } from "../ecs/ecs";
import { Kilograms, Meters, Years } from "../global";

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

export interface PsychologicalDisorder {
  name: string;
  description: string;
  adjective: string;
}

export interface MedicalDisorder {
  name: string;
  description: string;
  adjective: string;
}

export interface Implant {
  name: string;
  description: string;
}

export type Modifiers = {
  disorders: {
    medical: { [key: string]: MedicalDisorder };
    psychological: { [key: string]: PsychologicalDisorder };
  };
  implants: { [key: string]: Implant };
};

export class PsychologicalAttributesComponent extends Component {
  constructor(
    public intelligence: number,
    public willpower: number,
    public charisma: number,
  ) {
    super();
  }
}

export class AthleticAttributesComponent extends Component {
  constructor(
    public strength: number,
    public agility: number,
    public endurance: number,
  ) {
    super();
  }
}

export class PsychologicalDisordersComponent extends Component {
  constructor(public disorders: PsychologicalDisorder[]) {
    super();
  }
}

export class MedicalDisordersComponent extends Component {
  constructor(public disorders: MedicalDisorder[]) {
    super();
  }
}

export class ImplantsComponent extends Component {
  constructor(public implants: Implant[]) {
    super();
  }
}

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
    public civicId: string,
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

export const age = (birthdate: Date, reference: Date) => {
  return reference.getFullYear() - new Date(birthdate).getFullYear();
};
