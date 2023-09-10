import { randomBytes, randomInt } from "crypto";
import { Citizen, Species, generateName } from "./citizens";

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
      state.addCitizen({
        alive: true,
        height: randomInt(150, 190),
        id: randomBytes(4).toString("hex"),
        name: generateName().join(" "),
        species: Species.Human,
        weight: randomInt(60, 90),
      });
    }

    return state;
  }
}
