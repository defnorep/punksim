import { CitizensState } from "./system/citizens";
import { WorldTimeState } from "./system/worldTime";

export interface System {
  tick(delta: number, global: State[]): State;
}
export type State = WorldTimeState | CitizensState;
