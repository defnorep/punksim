import { State } from "./state";

export interface System<T extends State> {
  tick(delta: number, global: State[]): T;
}
