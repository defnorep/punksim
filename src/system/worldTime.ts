import { State } from "../state";
import { System } from "../system";

const worldStartTimestamp = new Date("2270/01/01").getTime();

export interface WorldTimeState {
  time: number;
}

export const defaultWorldTimeState = (): WorldTimeState => ({
  time: worldStartTimestamp,
});

export const worldTimeSystem: System = (delta: number, state: State) => {
  state.worldTimeState.time += delta;
};
