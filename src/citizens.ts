import { State } from "./state";

export enum Species {
  Android = "Android",
  Human = "Human",
}

export interface Citizen {
  alive: boolean;
  height: number;
  id: string;
  name: string;
  species: Species;
  weight: number;
}

export const killCitizen = (state: State, id: string) => {
  const citizen = state.getCitizen(id);
  if (citizen) {
    citizen.alive = false;
  }
};
