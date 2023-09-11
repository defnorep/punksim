import { randomBytes, randomInt } from "crypto";
import { Citizen, Species, Status, generateCitizenName } from "./citizens";

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

  static seed(): State {
    const state = new State();

    for (const i of Array(20).keys()) {
      const isAndroid = Math.random() > 0.7;
      const species = isAndroid ? Species.Android : Species.Human;

      state.addCitizen({
        status: Status.Active,
        height: randomInt(150, 190),
        id: randomBytes(4).toString("hex"),
        name: generateCitizenName(species).join(" "),
        species,
        weight: randomInt(60, 90),
      });
    }

    return state;
  }
}
