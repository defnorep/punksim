import { Citizen, generateCitizen } from "./citizens";
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

  static seed(): State {
    const state = new State();
    const ageJitter = 75; // years

    for (const i of Array(seed.base.citizens).keys()) {
      state.addCitizen(generateCitizen(ageJitter));
    }

    return state;
  }
}
