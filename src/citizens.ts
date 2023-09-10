import { State } from "./sim";

export interface Citizen {
  name: string;
  alive: boolean;
}

const maxAge = 100;

export const birthCitizen = (state: State, name: string) => {
  state.citizens.set(name, {
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
