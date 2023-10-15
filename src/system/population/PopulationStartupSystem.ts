import { randomBytes, randomInt } from "crypto";
import names from "../../../data/names.json";
import { Ecs, System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { LocationComponent } from "../global";
import {
  CivicIdentityComponent,
  EpochComponent,
  Gender,
  GenderComponent,
  Implant,
  ImplantsComponent,
  LifeformClassificationComponent,
  MedicalDisorder,
  PhysicalComponent,
  PsychologicalDisorder,
  Species,
  Status,
  age,
} from "../population";
import { TimeComponent } from "../time";

export type Modifiers = {
  disorders: {
    medical: { [key: string]: MedicalDisorder };
    psychological: { [key: string]: PsychologicalDisorder };
  };
  implants: { [ke: string]: Implant };
};

/**
 * The PopulationStartupSystem is responsible for creating the initial set of citizens.
 */
export class PopulationStartupSystem extends System {
  constructor(
    ecs: Ecs,
    private population: number,
    private modifiers: Modifiers,
  ) {
    super(ecs);
  }

  update(_delta: number, _entities: EntityContainer): void {
    const time = this.ecs.getSingleton(TimeComponent);
    Array(this.population)
      .fill(1)
      .forEach(() => {
        const isAndroid = Math.random() > 0.7;
        const species = isAndroid ? Species.Android : Species.Human;
        const names = generateCitizenName(species);
        const birthdate = new Date();
        birthdate.setFullYear(
          time.datetime.getFullYear() - Math.round(Math.random() * 80),
        );

        const genderRoll = randomInt(0, 3);
        let gender = Gender.None;
        if (genderRoll > 0) {
          gender = Gender.Male;
          if (genderRoll > 1) {
            gender = Gender.Female;
          }
        }

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

        const citizen = [
          new CivicIdentityComponent(
            randomBytes(4).toString("hex"),
            names[0],
            names[1],
            Status.Living,
          ),
          new EpochComponent(age(birthdate, time.datetime), birthdate),
          new PhysicalComponent(
            [randomInt(150, 190) / 10, 0.6, 0.3],
            randomInt(60, 90),
          ),
          new LifeformClassificationComponent(species),
          new GenderComponent(gender),
          new LocationComponent("Residence-1"),
          new ImplantsComponent(implants),
        ];
        this.ecs.createEntity(...citizen);
      });
  }
}

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
