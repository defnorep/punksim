import { State } from "./state";
import names from "../data/names.json";

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

export const generateName = (): [string, string] => {
  return [
    names.human[Math.floor(Math.random() * names.human.length)],
    names.human[Math.floor(Math.random() * names.human.length)],
  ];
};
