import { State } from "./sim";

export interface Citizen {
  name: string;
  ageDays: number;
  alive: boolean;
}

const maxAge = 100;

export const birthCitizen = (state: State, name: string) => {
  state.citizens.set(name, {
    ageDays: 0,
    name,
    alive: true,
  });
};

export const killCitizen = (state: State, name: string) => {
  const citizen = addressCitizen(state, name);
  if (citizen) {
    citizen.alive = false;
  }
};

export const addressCitizen = (
  state: State,
  name: string,
): Citizen | undefined => state.citizens.get(name);

export const citizenAgeSystem = (state: State) => {
  state.citizens.forEach((citizen) => {
    if (citizen.alive === false) {
      return;
    }

    if (citizen.ageDays >= maxAge) {
      killCitizen(state, citizen.name);

      return;
    }

    citizen.ageDays++;
  });
};
