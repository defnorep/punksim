import { State } from "../state";
import { System } from "../system";

export interface WorldTimeState {
  time: number;
}
export const worldTimeSystem: System = (delta: number, state: State) => {
  state.worldTimeState.time += delta;
};
