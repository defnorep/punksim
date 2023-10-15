import { Component } from "../ecs";

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

export interface PsychologicalDisorder {
  id: string;
  label: string;
}

export interface MedicalDisorder {
  id: string;
  label: string;
}

export interface Implant {
  id: string;
  label: string;
}

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
