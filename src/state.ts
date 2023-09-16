import { randomBytes, randomInt } from "crypto";
import {
  Citizen,
  Gender,
  Species,
  Status,
  generateCitizenName,
} from "./citizens";
import seed from "../data/seed.json";

export class State {
  private citizens: Map<string, Citizen> = new Map();

  population(): number {
    return this.citizens.size;
  }

  getCitizen(id: string): Citizen | undefined {
    return this.citizens.get(id);
  }

  getCitizens(): Citizen[] {
    return Array.from(this.citizens.values(), (c) => c);
  }

  addCitizen(citizen: Citizen) {
    this.citizens.set(citizen.id, citizen);
  }

  setCitizens(citizens: Map<string, Citizen>) {
    this.citizens = citizens;
  }

  static empty(): State {
    return new State();
  }

  /**
   * This is getting very ugly.
   */
  static seed(): State {
    const state = new State();
    const ageJitter = 75; // years
    const now = new Date();

    for (const i of Array(seed.base.citizens).keys()) {
      const isAndroid = Math.random() > 0.7;
      const species = isAndroid ? Species.Android : Species.Human;
      const names = generateCitizenName(species);
      const birthdate = new Date().setFullYear(
        now.getFullYear() - Math.round(Math.random() * ageJitter),
      );

      const genderRoll = randomInt(0, 2);
      let gender = Gender.None;
      if (genderRoll > 0) {
        gender = Gender.Male;
        if (genderRoll > 1) {
          gender = Gender.Female;
        }
      }

      state.addCitizen({
        birthdate,
        height: randomInt(150, 190),
        id: randomBytes(4).toString("hex"),
        name: names[0],
        gender,
        species,
        status: Status.Active,
        surname: names[1],
        weight: randomInt(60, 90),
      });
    }

    return state;
  }
}
