import { CitizensState } from "./system/citizens";
import { WorldTimeState } from "./system/worldTime";

export interface System {
  tick(delta: number, global: State[]): State;
}

// The maintenance of having to add State interfaces to this type is a little annoying,
// but not too bad in the grand scheme of things.
export type State = WorldTimeState | CitizensState;
