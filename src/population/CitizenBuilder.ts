import { randomBytes, randomInt } from "crypto";
import modifiers from "../../data/modifiers.json";
import names from "../../data/names.json";
import { Component } from "../ecs/ecs";
import { Kilograms, Meters } from "../global";
import { LocationComponent, LocationId } from "../transport/transport";
import {
  CivicIdentityComponent,
  EpochComponent,
  Gender,
  GenderComponent,
  Implant,
  ImplantsComponent,
  LifeformClassificationComponent,
  Modifiers,
  PhysicalComponent,
  Species,
  Status,
  age,
} from "./population";

export class CitizenBuilder {
  private components = new Map<Function, Component>();
  private modifiers: Modifiers = modifiers;

  setGender(gender: Gender) {
    this.components.set(GenderComponent, new GenderComponent(gender));

    return this;
  }

  randomGender() {
    const index = Math.floor(Math.random() * Object.keys(Gender).length);
    const value = Object.values(Gender)[index];

    const gender = Gender[value];

    this.components.set(GenderComponent, new GenderComponent(gender));

    return this;
  }

  setSpecies(species: Species) {
    this.components.set(
      LifeformClassificationComponent,
      new LifeformClassificationComponent(species),
    );

    return this;
  }

  /**
   * Civic Identity depends on a Lifeform Classification.
   * Either it can be set explicitly before randomCivicIdentity,
   * or it can be called directly from randomCivicIdentity.
   *
   * TL;DR this is private to prevent illegal state.
   */
  private randomLifeform() {
    const index = Math.floor(Math.random() * Object.keys(Species).length);
    const value = Object.values(Species)[index];

    const species = Species[value];

    this.components.set(
      LifeformClassificationComponent,
      new LifeformClassificationComponent(species),
    );

    return this;
  }

  setCivicIdentity(civicId: string, name: string, surname: string) {
    this.components.set(
      CivicIdentityComponent,
      new CivicIdentityComponent(civicId, name, surname, Status.Living),
    );

    return this;
  }

  randomCivicIdentity() {
    if (!this.components.has(LifeformClassificationComponent)) {
      this.randomLifeform();
    }

    const lifeform = this.components.get(
      LifeformClassificationComponent,
    ) as LifeformClassificationComponent;

    const names = generateCitizenName(lifeform.species);
    this.components.set(
      CivicIdentityComponent,
      new CivicIdentityComponent(
        randomBytes(4).toString("hex"),
        names[0],
        names[1],
        Status.Living,
      ),
    );

    return this;
  }

  setAge(birthdate: Date, reference: Date) {
    this.components.set(
      EpochComponent,
      new EpochComponent(age(birthdate, reference), birthdate),
    );

    return this;
  }

  randomAge(reference: Date) {
    const birthdate = new Date();
    birthdate.setFullYear(
      reference.getFullYear() - Math.round(Math.random() * 80),
    );
    this.components.set(
      EpochComponent,
      new EpochComponent(age(birthdate, reference), birthdate),
    );

    return this;
  }

  setPhysicalCharacteristics(height: Meters, mass: Kilograms) {
    this.components.set(
      PhysicalComponent,
      new PhysicalComponent([height, 0.6, 0.3], mass),
    );

    return this;
  }

  randomPhysicalCharacteristics(
    averageHeight: number,
    heightJitter: number,
    averageMass: number,
    massJitter: number,
  ) {
    this.components.set(
      PhysicalComponent,
      new PhysicalComponent(
        [
          randomInt(averageHeight - heightJitter, averageHeight + heightJitter),
          0.6,
          0.3,
        ],
        randomInt(averageMass - massJitter, averageMass + massJitter),
      ),
    );

    return this;
  }

  setLocation(location: LocationId) {
    this.components.set(LocationComponent, new LocationComponent(location));

    return this;
  }

  setImplants(implants: Implant[]) {
    this.components.set(ImplantsComponent, new ImplantsComponent(implants));

    return this;
  }

  randomImplants() {
    const implants: Implant[] = [];
    const implantRoll = randomInt(0, 3);
    if (implantRoll > 2) {
      // 25% chance
      implants.push(
        this.modifiers.implants[
          Math.floor(
            Math.random() * Object.keys(this.modifiers.implants).length,
          )
        ],
      );
    }

    this.components.set(ImplantsComponent, new ImplantsComponent(implants));

    return this;
  }

  static random(
    reference: Date,
    averageHeight: number,
    heightJitter: number,
    averageMass: number,
    massJitter: number,
    location: LocationId,
  ) {
    return new CitizenBuilder()
      .randomCivicIdentity()
      .randomGender()
      .randomAge(reference)
      .randomPhysicalCharacteristics(
        averageHeight,
        heightJitter,
        averageMass,
        massJitter,
      )
      .randomImplants()
      .setLocation(location)
      .build();
  }

  build() {
    return [
      GenderComponent,
      CivicIdentityComponent,
      LifeformClassificationComponent,
      EpochComponent,
      PhysicalComponent,
      LocationComponent,
      ImplantsComponent,
    ].map((component) => {
      const c = this.components.get(component);
      if (c === undefined) {
        throw new Error(`Citizen Builder requires ${component.name}`);
      } else {
        return c;
      }
    });
  }
}

const generateCitizenName = (species: Species = Species.Human) => {
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
