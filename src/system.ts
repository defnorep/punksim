import { State } from "./state";

export interface System {
  tick(delta: number, global: State[]): State;
}
